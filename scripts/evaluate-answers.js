#!/usr/bin/env node

/**
 * Chatbot QA Answer Evaluator - Node.js Version
 * 
 * This script evaluates chatbot answers against a knowledge base
 * and generates a professional HTML report.
 * 
 * Usage: node evaluate-answers.js
 */

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const config = {
  projectRoot: process.cwd(),
  knowledgeDir: 'knowledge',
  resultsDir: 'results',
  outputFile: 'index.html',
  correctnessThreshold: 0.6,
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text || '').replace(/[&<>"']/g, (m) => map[m]);
}

function extractKeywords(text) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  ]);

  const words = (text || '').toLowerCase().match(/\b[a-z]+\b/g) || [];
  return words.filter((word) => word.length > 3 && !stopWords.has(word));
}

function evaluateAnswer(question, answer, knowledgeBase) {
  const answerKeywords = extractKeywords(answer);
  const kbKeywords = extractKeywords(knowledgeBase);

  const relevantKeywords = answerKeywords.filter((kw) => kbKeywords.includes(kw));
  const relevanceScore = Math.min(1, relevantKeywords.length / Math.max(answerKeywords.length, 1));

  const answerLength = (answer || '').trim().length;
  const hasContent = answerLength > 50 && !(answer || '').toLowerCase().includes('error');
  const correctnessScore = hasContent ? Math.min(1, relevanceScore + 0.3) : 0.3;

  const isCorrect = correctnessScore >= config.correctnessThreshold;
  const explanation = isCorrect
    ? `Answer is relevant to knowledge base with ${(relevanceScore * 100).toFixed(1)}% keyword match.`
    : `Answer may lack sufficient relevance (${(relevanceScore * 100).toFixed(1)}% keyword match). Verify against knowledge base.`;

  return {
    isCorrect,
    relevanceScore,
    correctnessScore,
    explanation,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE LOADER
// ─────────────────────────────────────────────────────────────────────────────

function loadKnowledgeBase(knowledgeDir) {
  if (!fs.existsSync(knowledgeDir)) {
    console.warn(`⚠️  Knowledge base directory not found: ${knowledgeDir}`);
    return '';
  }

  let combinedContent = '';

  try {
    const files = fs.readdirSync(knowledgeDir);

    for (const file of files) {
      const filePath = path.join(knowledgeDir, file);
      const fileExt = path.extname(file).toLowerCase();

      try {
        if (fileExt === '.md' || fileExt === '.txt') {
          // Read Markdown and text files directly
          const content = fs.readFileSync(filePath, 'utf-8');
          combinedContent += `\n\n--- Source: ${file} ---\n${content}`;
          console.log(`   ✓ Loaded: ${file}`);
        } else if (fileExt === '.pdf' || fileExt === '.docx') {
          // Note: PDF and DOCX require external libraries
          console.log(`   ⓘ Note: ${file} requires pdf-parse or docx-parser`);
          console.log(`      Install with: npm install pdf-parse docx-parser`);
        }
      } catch (error) {
        console.warn(`   ✗ Failed to load: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error loading knowledge base:', error);
  }

  return combinedContent;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV PROCESSING
// ─────────────────────────────────────────────────────────────────────────────

function loadResultsCSV(filePath) {
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    return [];
  }

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  // Find column indices
  const idIdx = headers.findIndex(h => h === 'ID' || h === 'id');
  const questionIdx = headers.findIndex(h => h === 'Question' || h === 'question');
  const answerIdx = headers.findIndex(h => h === 'Answer' || h === 'answer');
  const categoryIdx = headers.findIndex(h => h === 'Category' || h === 'category');
  const statusIdx = headers.findIndex(h => h === 'Status' || h === 'status');
  const responseTimeIdx = headers.findIndex(h => h === 'ResponseTimeMs' || h === 'responseTimeMs');
  const timestampIdx = headers.findIndex(h => h === 'Timestamp' || h === 'timestamp');

  // Parse data rows
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    records.push({
      id: values[idIdx] || '',
      question: values[questionIdx] || '',
      answer: values[answerIdx] || '',
      category: values[categoryIdx] || '',
      status: values[statusIdx] || '',
      responseTimeMs: parseInt(values[responseTimeIdx] || '0', 10),
      timestamp: values[timestampIdx] || new Date().toISOString(),
    });
  }

  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result.map(v => v.replace(/^"(.*)"$/, '$1'));
}

// ─────────────────────────────────────────────────────────────────────────────
// EVALUATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function evaluateAnswers(questions, knowledgeBase) {
  return questions.map((q) => {
    try {
      const evaluation = evaluateAnswer(q.question, q.answer, knowledgeBase);
      return {
        questionId: q.id,
        question: q.question,
        answer: q.answer,
        category: q.category,
        status: q.status,
        responseTimeMs: q.responseTimeMs,
        timestamp: q.timestamp,
        isCorrect: evaluation.isCorrect,
        relevanceScore: evaluation.relevanceScore,
        correctnessScore: evaluation.correctnessScore,
        explanation: evaluation.explanation,
        evaluatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        questionId: q.id,
        question: q.question,
        answer: q.answer,
        category: q.category,
        status: q.status,
        responseTimeMs: q.responseTimeMs,
        timestamp: q.timestamp,
        isCorrect: false,
        relevanceScore: 0,
        correctnessScore: 0,
        explanation: 'Error during evaluation',
        evaluatedAt: new Date().toISOString(),
      };
    }
  });
}

function calculateMetrics(results) {
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const avgRelevance = results.reduce((sum, r) => sum + r.relevanceScore, 0) / totalQuestions;
  const avgCorrectness = results.reduce((sum, r) => sum + r.correctnessScore, 0) / totalQuestions;

  return {
    totalQuestions,
    correctAnswers,
    accuracy: (correctAnswers / totalQuestions) * 100,
    avgRelevance: (avgRelevance * 100).toFixed(1),
    avgCorrectness: (avgCorrectness * 100).toFixed(1),
    evaluatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML REPORT GENERATION
// ─────────────────────────────────────────────────────────────────────────────

function generateHTMLReport(results, metrics) {
  // [HTML report content remains the same as in evaluate-answers.ts]
  // See the full HTML template below
  
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot QA Evaluation Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }

        .logo {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 80px;
            height: 80px;
            object-fit: contain;
        }

        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }

        header p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
        }

        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }

        .metric-card:hover {
            transform: translateY(-5px);
        }

        .metric-value {
            font-size: 2.5em;
            font-weight: 700;
            color: #667eea;
            margin: 10px 0;
        }

        .metric-label {
            font-size: 0.9em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .results-section {
            padding: 40px;
        }

        .results-section h2 {
            font-size: 1.8em;
            margin-bottom: 30px;
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
        }

        .question-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
            transition: all 0.3s;
        }

        .question-card:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
        }

        .question-header {
            display: flex;
            align-items: center;
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
        }

        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-right: 15px;
            font-size: 0.9em;
        }

        .status-correct {
            background: #d4edda;
            color: #155724;
        }

        .status-incorrect {
            background: #f8d7da;
            color: #721c24;
        }

        .question-id {
            font-weight: 700;
            color: #667eea;
            margin-right: 15px;
            min-width: 60px;
        }

        .question-title {
            flex: 1;
            font-weight: 600;
            color: #333;
            font-size: 1.05em;
        }

        .question-content {
            padding: 20px;
        }

        .content-section {
            margin-bottom: 15px;
        }

        .content-label {
            font-weight: 700;
            color: #667eea;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }

        .content-text {
            color: #555;
            line-height: 1.6;
            padding: 10px;
            background: #f8f9fa;
            border-left: 3px solid #667eea;
            border-radius: 4px;
            word-wrap: break-word;
        }

        .correct-result {
            background: #d4edda !important;
            border-left-color: #28a745 !important;
            color: #155724 !important;
            font-weight: bold;
        }

        .incorrect-result {
            background: #f8d7da !important;
            border-left-color: #dc3545 !important;
            color: #721c24 !important;
            font-weight: bold;
        }

        .scores-row {
            display: flex;
            gap: 20px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .score {
            flex: 1;
            min-width: 150px;
        }

        .score-label {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 5px;
        }

        .score-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        }

        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.5s ease;
        }

        .meta-info {
            display: flex;
            gap: 20px;
            font-size: 0.85em;
            color: #999;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e0e0e0;
            font-size: 0.9em;
        }

        .filter-section {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 10px 20px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .filter-btn.active {
            background: #667eea;
            color: white;
        }

        .filter-btn:hover {
            background: #667eea;
            color: white;
        }

        @media (max-width: 768px) {
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            header h1 {
                font-size: 1.8em;
            }

            .question-header {
                flex-wrap: wrap;
            }

            .scores-row {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <img src="images/logo.png" alt="Logo" class="logo">
            <h1>🤖 Chatbot QA Evaluation Report</h1>
            <p>Professional Answer Evaluation Against Knowledge Base</p>
        </header>

        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Total Questions</div>
                <div class="metric-value">${metrics.totalQuestions}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Correct Answers</div>
                <div class="metric-value">${metrics.correctAnswers}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Accuracy</div>
                <div class="metric-value">${metrics.accuracy.toFixed(1)}%</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Avg Relevance</div>
                <div class="metric-value">${metrics.avgRelevance}%</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Avg Correctness</div>
                <div class="metric-value">${metrics.avgCorrectness}%</div>
            </div>
        </div>

        <div class="results-section">
            <h2>📋 Detailed Results</h2>
            
            <div class="filter-section">
                <button class="filter-btn active" onclick="filterResults('all')">All</button>
                <button class="filter-btn" onclick="filterResults('correct')">✓ Correct</button>
                <button class="filter-btn" onclick="filterResults('incorrect')">✗ Incorrect</button>
            </div>

            ${results
              .map(
                (result) => `
                <div class="question-card" data-status="${result.isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-header">
                        <span class="status-badge ${result.isCorrect ? 'status-correct' : 'status-incorrect'}">
                            ${result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                        <span class="question-id">${escapeHtml(result.questionId)}</span>
                        <span class="question-title">${escapeHtml(result.question)}</span>
                    </div>
                    <div class="question-content">
                        <div class="content-section">
                            <div class="content-label">Question</div>
                            <div class="content-text">${escapeHtml(result.question)}</div>
                        </div>

                        <div class="content-section">
                            <div class="content-label">Answer</div>
                            <div class="content-text">${escapeHtml(result.answer)}</div>
                        </div>

                        <div class="content-section">
                            <div class="content-label">DeepEval Answer</div>
                            <div class="content-text">${escapeHtml(result.explanation)}</div>
                        </div>

                        <div class="content-section">
                            <div class="content-label">Result</div>
                            <div class="content-text ${result.isCorrect ? 'correct-result' : 'incorrect-result'}">
                                ${result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </div>
                        </div>

                        <div class="scores-row">
                            <div class="score">
                                <div class="score-label">Relevance Score</div>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${result.relevanceScore * 100}%"></div>
                                </div>
                                <div style="text-align: right; font-size: 0.8em; color: #999; margin-top: 3px;">
                                    ${(result.relevanceScore * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div class="score">
                                <div class="score-label">Correctness Score</div>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${result.correctnessScore * 100}%"></div>
                                </div>
                                <div style="text-align: right; font-size: 0.8em; color: #999; margin-top: 3px;">
                                    ${(result.correctnessScore * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        <div class="meta-info">
                            <div class="meta-item">📁 Category: ${escapeHtml(result.category)}</div>
                            <div class="meta-item">⏱️ Response Time: ${result.responseTimeMs}ms</div>
                            <div class="meta-item">🕒 Timestamp: ${new Date(result.timestamp).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            `
              )
              .join('')}
        </div>

        <footer>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Chatbot QA Evaluation System | Powered by Node.js Evaluator</p>
        </footer>
    </div>

    <script>
        function filterResults(status) {
            const cards = document.querySelectorAll('.question-card');
            const buttons = document.querySelectorAll('.filter-btn');

            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            cards.forEach(card => {
                if (status === 'all') {
                    card.style.display = 'block';
                } else {
                    card.style.display = card.dataset.status === status ? 'block' : 'none';
                }
            });
        }
    </script>
</body>
</html>`;

  return htmlTemplate;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Starting Answer Evaluation...\n');

  const projectRoot = config.projectRoot;
  const knowledgeDir = path.join(projectRoot, config.knowledgeDir);
  const resultsDir = path.join(projectRoot, config.resultsDir);
  const outputFile = path.join(projectRoot, config.outputFile);

  // Check if results directory exists
  if (!fs.existsSync(resultsDir)) {
    console.warn(`⚠️  Results directory not found: ${resultsDir}`);
    console.warn('⚠️  No test results to evaluate. Skipping evaluation.');
    process.exit(0);
  }

  // Find latest results CSV
  const resultFiles = fs
    .readdirSync(resultsDir)
    .filter((f) => f.startsWith('chatbot-qa-') && f.endsWith('.csv'))
    .sort()
    .reverse();

  if (resultFiles.length === 0) {
    console.warn('⚠️  No results CSV files found in results/ directory');
    console.warn('⚠️  No test results to evaluate. Skipping evaluation.');
    process.exit(0);
  }

  const latestResultFile = path.join(resultsDir, resultFiles[0]);
  console.log(`📁 Loading results from: ${resultFiles[0]}`);

  // Load knowledge base
  console.log('📚 Loading knowledge base...');
  const knowledgeContent = loadKnowledgeBase(knowledgeDir);

  if (!knowledgeContent) {
    console.warn('⚠️  Warning: Knowledge base is empty or not found');
  }

  // Read and process CSV
  console.log(`\n📊 Reading results CSV...\n`);
  const records = loadResultsCSV(latestResultFile);
  console.log(`✓ Found ${records.length} test results\n`);

  // Evaluate answers
  console.log('🔍 Evaluating answers against knowledge base...\n');
  const evaluationResults = evaluateAnswers(records, knowledgeContent);

  // Calculate metrics
  const metrics = calculateMetrics(evaluationResults);
  console.log('✅ Evaluation Complete!\n');
  console.log(`   Total Questions: ${metrics.totalQuestions}`);
  console.log(`   Correct Answers: ${metrics.correctAnswers}`);
  console.log(`   Accuracy: ${metrics.accuracy.toFixed(1)}%`);
  console.log(`   Avg Relevance: ${metrics.avgRelevance}%`);
  console.log(`   Avg Correctness: ${metrics.avgCorrectness}%\n`);

  // Generate HTML report
  console.log('📝 Generating HTML report...');
  const htmlContent = generateHTMLReport(evaluationResults, metrics);
  fs.writeFileSync(outputFile, htmlContent);

  console.log(`✨ Report saved to: ${path.relative(projectRoot, outputFile)}`);
  console.log(`\n🎉 Evaluation complete! Open the report in your browser.\n`);
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = {
  evaluateAnswer,
  evaluateAnswers,
  calculateMetrics,
  loadKnowledgeBase,
  loadResultsCSV,
  generateHTMLReport,
};
