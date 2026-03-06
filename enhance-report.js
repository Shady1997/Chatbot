#!/usr/bin/env node

/**
 * Enhance Playwright HTML Report
 * - Add logo from images folder
 * - Include questions and answers from CSV results
 */

const fs = require('fs');
const path = require('path');

const REPORT_DIR = 'playwright-report';
const HTML_FILE = path.join(REPORT_DIR, 'index.html');
const LOGO_PATH = 'images/logo.png';
const RESULTS_DIR = 'results';

// Find the latest CSV results file
function findLatestCsvResults() {
  if (!fs.existsSync(RESULTS_DIR)) {
    return null;
  }

  const files = fs.readdirSync(RESULTS_DIR)
    .filter(file => file.endsWith('.csv'))
    .map(file => ({
      file,
      path: path.join(RESULTS_DIR, file),
      stats: fs.statSync(path.join(RESULTS_DIR, file))
    }))
    .sort((a, b) => b.stats.mtime - a.stats.mtime);

  return files.length > 0 ? files[0].path : null;
}

// Parse CSV results
function parseCsvResults(csvPath) {
  if (!fs.existsSync(csvPath)) {
    return [];
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',');
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= headers.length) {
      const result = {};
      headers.forEach((header, index) => {
        result[header.trim()] = values[index]?.trim() || '';
      });
      results.push(result);
    }
  }

  return results;
}

// Enhance HTML report
function enhanceHtmlReport() {
  if (!fs.existsSync(HTML_FILE)) {
    console.log('❌ HTML report not found');
    return;
  }

  console.log('📊 Enhancing HTML report...');

  let html = fs.readFileSync(HTML_FILE, 'utf8');

  // Add logo and custom styles
  const logoHtml = fs.existsSync(LOGO_PATH) ?
    `<div style="text-align: center; margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
      <img src="../${LOGO_PATH}" alt="Logo" style="max-height: 80px; max-width: 200px; margin-bottom: 10px;">
      <h1 style="margin: 0; font-size: 2em;">Chatbot QA Automation Report</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Automated testing results for chatbot functionality</p>
    </div>` :
    `<div style="text-align: center; margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
      <h1 style="margin: 0; font-size: 2em;">Chatbot QA Automation Report</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Automated testing results for chatbot functionality</p>
    </div>`;

  // Find CSV results
  const csvPath = findLatestCsvResults();
  let qaResultsHtml = '';

  if (csvPath) {
    console.log(`📄 Found CSV results: ${csvPath}`);
    const results = parseCsvResults(csvPath);

    if (results.length > 0) {
      qaResultsHtml = `
        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
          <h2 style="margin-top: 0; color: #333;">📋 Test Questions & Answers</h2>
          <p style="margin-bottom: 20px; color: #666;">Complete list of questions asked and chatbot responses:</p>
          <div style="max-height: 600px; overflow-y: auto;">
            ${results.map((result, index) => `
              <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <strong style="color: #007bff;">Q${result.id || (index + 1)}</strong>
                  <span style="font-size: 0.85em; color: ${result.status === 'success' ? '#28a745' : '#dc3545'}; font-weight: bold;">
                    ${result.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div style="margin-bottom: 10px;">
                  <strong>Question:</strong> ${result.question || 'N/A'}
                </div>
                <div style="margin-bottom: 10px;">
                  <strong>Category:</strong> ${result.category || 'N/A'}
                </div>
                <div style="margin-bottom: 10px;">
                  <strong>Answer:</strong>
                  <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap; font-family: monospace; font-size: 0.9em;">
                    ${result.answer || 'No answer received'}
                  </div>
                </div>
                ${result.responseTimeMs ? `<div style="font-size: 0.85em; color: #666;">
                  <strong>Response Time:</strong> ${result.responseTimeMs}ms
                </div>` : ''}
                ${result.errorMessage ? `<div style="margin-top: 8px; padding: 8px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;">
                  <strong>Error:</strong> ${result.errorMessage}
                </div>` : ''}
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 15px; padding: 10px; background: #e7f3ff; border-radius: 4px;">
            <strong>Summary:</strong> ${results.length} questions tested,
            ${results.filter(r => r.status === 'success').length} successful,
            ${results.filter(r => r.status === 'timeout' || r.status === 'error').length} failed
          </div>
        </div>
      `;
    }
  }

  // Insert the enhancements into the HTML
  // Find the body tag and insert our content after it opens
  const bodyTagMatch = html.match(/<body[^>]*>/i);
  if (bodyTagMatch) {
    const bodyTag = bodyTagMatch[0];
    const insertPoint = html.indexOf(bodyTag) + bodyTag.length;

    html = html.slice(0, insertPoint) +
           logoHtml +
           qaResultsHtml +
           html.slice(insertPoint);

    fs.writeFileSync(HTML_FILE, html);
    console.log('✅ HTML report enhanced successfully!');
  } else {
    console.log('❌ Could not find body tag in HTML');
  }
}

// Run the enhancement
try {
  enhanceHtmlReport();
} catch (error) {
  console.error('❌ Error enhancing HTML report:', error.message);
  process.exit(1);
}