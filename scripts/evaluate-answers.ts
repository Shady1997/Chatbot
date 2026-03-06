import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse/sync';
import { loadKnowledgeBase } from '../src/utils/knowledge-loader';
import {
  evaluateAnswers,
  calculateMetrics,
  EvaluationResult,
} from '../src/utils/deepeval-evaluator';
import { exportToCSV, exportToJSON, exportToMarkdown, generateExportFilename } from '../src/utils/export.utils';

interface ResultRow {
  ID?: string;
  id?: string;
  Category?: string;
  category?: string;
  Question?: string;
  question?: string;
  Answer?: string;
  answer?: string;
  Status?: string;
  status?: string;
  ResponseTimeMs?: string;
  responseTimeMs?: string;
  Timestamp?: string;
  timestamp?: string;
  ErrorMessage?: string;
  errorMessage?: string;
}

async function main() {
  console.log('🚀 Starting Answer Evaluation...\n');

  // Configuration
  const projectRoot = process.cwd();
  const knowledgeDir = path.join(projectRoot, 'knowledge');
  const resultsDir = path.join(projectRoot, 'results');
  const outputFile = path.join(projectRoot, 'evaluation-report.html');

  // Get latest results CSV
  const resultFiles = fs
    .readdirSync(resultsDir)
    .filter((f) => f.startsWith('chatbot-qa-') && f.endsWith('.csv'))
    .sort()
    .reverse();

  if (resultFiles.length === 0) {
    console.error('❌ No results CSV files found in results/ directory');
    process.exit(1);
  }

  const latestResultFile = path.join(resultsDir, resultFiles[0]);
  console.log(`📁 Loading results from: ${resultFiles[0]}`);

  // Load knowledge base
  console.log('📚 Loading knowledge base...');
  const { content: knowledgeContent } = await loadKnowledgeBase(knowledgeDir);

  if (!knowledgeContent) {
    console.warn('⚠️  Warning: Knowledge base is empty or not found');
  }

  // Read results CSV
  const csvContent = fs.readFileSync(latestResultFile, 'utf-8');
  const records: ResultRow[] = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`📊 Found ${records.length} test results\n`);

  // Normalize field names (handle different CSV formats)
  const normalizedRecords = records.map((r) => ({
    id: r.ID || r.id || '',
    question: r.Question || r.question || '',
    answer: r.Answer || r.answer || '',
    category: r.Category || r.category || '',
    status: r.Status || r.status || '',
    responseTimeMs: parseInt(r.ResponseTimeMs || r.responseTimeMs || '0', 10),
    timestamp: r.Timestamp || r.timestamp || new Date().toISOString(),
  }));

  // Evaluate answers
  console.log('🔍 Evaluating answers against knowledge base...');
  const evaluationResults = await evaluateAnswers(
    normalizedRecords,
    knowledgeContent
  );

  // Calculate metrics
  const metrics = calculateMetrics(evaluationResults);
  console.log('\n✅ Evaluation Complete!\n');
  console.log(`   Total Questions: ${metrics.totalQuestions}`);
  console.log(`   Correct Answers: ${metrics.correctAnswers}`);
  console.log(`   Accuracy: ${metrics.accuracy.toFixed(1)}%`);
  console.log(`   Avg Relevance: ${metrics.avgRelevance}%`);
  console.log(`   Avg Correctness: ${metrics.avgCorrectness}%\n`);

  // Generate HTML report
  console.log('📝 Generating HTML report...');
  const htmlContent = generateHTMLReport(evaluationResults, metrics);
  fs.writeFileSync(outputFile, htmlContent);

  console.log(`✨ Report saved to: ${path.relative(projectRoot, outputFile)}\n`);

  // Generate additional export formats
  console.log('📊 Generating additional reports...');
  const exportBaseName = generateExportFilename('evaluation');
  
  try {
    exportToCSV(evaluationResults, path.join(projectRoot, `${exportBaseName}.csv`));
    exportToJSON(evaluationResults, path.join(projectRoot, `${exportBaseName}.json`));
    exportToMarkdown(evaluationResults, metrics, path.join(projectRoot, `${exportBaseName}.md`));
    
    console.log('\n✅ All reports generated successfully!');
    console.log(`   📄 HTML: ${outputFile}`);
    console.log(`   📊 CSV: ${exportBaseName}.csv`);
    console.log(`   📋 JSON: ${exportBaseName}.json`);
    console.log(`   📝 Markdown: ${exportBaseName}.md\n`);
  } catch (exportError) {
    console.warn('⚠️  Warning: Some export formats failed, but HTML report was generated');
  }
}

function generateHTMLReport(
  results: EvaluationResult[],
  metrics: any
): string {
  const correctCount = results.filter((r) => r.isCorrect).length;

  return `<!DOCTYPE html>
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
                        <span class="question-id">${result.questionId}</span>
                        <span class="question-title">${escapeHtml(result.question)}</span>
                    </div>
                    <div class="question-content">
                        <div class="content-section">
                            <div class="content-label">Answer</div>
                            <div class="content-text">${escapeHtml(result.answer)}</div>
                        </div>

                        <div class="content-section">
                            <div class="content-label">Evaluation Details</div>
                            <div class="content-text">${escapeHtml(result.explanation)}</div>
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
            <p>Chatbot QA Evaluation System | Powered by DeepEval</p>
        </footer>
    </div>

    <script>
        function filterResults(status) {
            const cards = document.querySelectorAll('.question-card');
            const buttons = document.querySelectorAll('.filter-btn');

            // Update button states
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            // Filter cards
            cards.forEach(card => {
                if (status === 'all') {
                    card.style.display = 'block';
                } else {
                    card.style.display = card.dataset.status === status ? 'block' : 'none';
                }
            });
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
