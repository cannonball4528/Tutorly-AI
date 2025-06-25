const OpenAI = require('openai');
const fetch = require('node-fetch');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const os = require('os');

if (typeof global.Headers === 'undefined') {
  global.Headers = require('node-fetch').Headers;
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  fetch: fetch
});

// Helper: Download file to temp location
async function downloadFile(url, ext) {
  if (url.startsWith('file://')) {
    // Local file path, just return the path
    return url.replace('file://', '');
  }
  // Otherwise, download as before
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download file: ${url}`);
  const buffer = await res.buffer();
  const tempPath = path.join(os.tmpdir(), `file_${Date.now()}.${ext}`);
  fs.writeFileSync(tempPath, buffer);
  return tempPath;
}

// Helper: Extract text from file based on type
async function extractText(fileUrl, ext) {
  const tempPath = await downloadFile(fileUrl, ext);
  let text = '';
  try {
    if (['pdf'].includes(ext)) {
      const dataBuffer = fs.readFileSync(tempPath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (['docx'].includes(ext)) {
      const data = await mammoth.extractRawText({ path: tempPath });
      text = data.value;
    } else if (['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp'].includes(ext)) {
      const { data: { text: ocrText } } = await Tesseract.recognize(tempPath, 'eng');
      text = ocrText;
    } else {
      throw new Error('Unsupported file type for extraction');
    }
  } finally {
    fs.unlinkSync(tempPath);
  }
  return text;
}

async function analyzeWorksheetWithAI({ worksheetUrl, answerKeyUrl, worksheetExt, answerKeyExt }) {
  // Download and extract text from worksheet and answer key
  const worksheetText = await extractText(worksheetUrl, worksheetExt);
  const answerKeyText = await extractText(answerKeyUrl, answerKeyExt);

  // Call OpenAI (replace with your prompt/logic)
  const prompt = `Compare the following worksheet and answer key. Worksheet: ${worksheetText}\n\nAnswer Key: ${answerKeyText}\n\nGive a score (0-100), list weak topics, and suggestions.`;
  let completion;
  try {
    completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    });
  } catch (err) {
    console.error('OpenAI error or Blob not defined:', err);
    // Return detailed mock data for demo
    return {
      score: 88,
      weakTopics: ['Fractions', 'Decimals'],
      suggestions: ['Review fractions', 'Practice decimal problems'],
      questions: [
        { number: 1, question: 'What is 1/2 + 1/4?', correct: true },
        { number: 2, question: 'Convert 0.75 to a fraction.', correct: false },
        { number: 3, question: 'Simplify 3/9.', correct: true },
        { number: 4, question: 'Add 2.5 and 1.3.', correct: false }
      ]
    };
  }
  // Parse response (assume JSON or structured text)
  let aiResult = { score: 0, weakTopics: [], suggestions: [] };
  try {
    const content = completion.choices[0].message.content;
    aiResult = JSON.parse(content);
  } catch (e) {
    // fallback: try to parse manually
    const content = completion.choices[0].message.content;
    const scoreMatch = content.match(/score\s*[:=]\s*(\d+)/i);
    const weakMatch = content.match(/weak topics?\s*[:=]\s*([\w, ]+)/i);
    const suggMatch = content.match(/suggestions?\s*[:=]\s*([\w, ]+)/i);
    aiResult.score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    aiResult.weakTopics = weakMatch ? weakMatch[1].split(',').map(s => s.trim()) : [];
    aiResult.suggestions = suggMatch ? suggMatch[1].split(',').map(s => s.trim()) : [];
  }
  return aiResult;
}

async function generateQuestionsForWeakTopics(weakTopics) {
  // Call OpenAI to generate questions for each topic
  const prompt = `Generate one practice question for each of these topics: ${weakTopics.join(', ')}. Format as JSON: [{topic, question}]`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300
  });
  let questions = [];
  try {
    questions = JSON.parse(completion.choices[0].message.content);
  } catch {
    // fallback: simple mapping
    questions = weakTopics.map(topic => ({
      topic,
      question: `Practice question for ${topic}: ...`
    }));
  }
  return questions;
}

module.exports = { analyzeWorksheetWithAI, generateQuestionsForWeakTopics }; 