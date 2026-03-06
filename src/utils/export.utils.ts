import * as fs from 'fs';
import * as path from 'path';
import { EvaluationResult } from './deepeval-evaluator';

/**
 * Export evaluation results to various formats
 */

export function exportToCSV(results: EvaluationResult[], outputPath: string): void {
  const headers = [
    'Question ID',
    'Question',
    'Answer',
    'Category',
    'Status',
    'Is Correct',
    'Relevance Score',
    'Correctness Score',
    'Explanation',
    'Response Time (ms)',
    'Timestamp',
    'Evaluated At',
  ];

  const rows = results.map((r) => [
    escapeCsvField(r.questionId),
    escapeCsvField(r.question),
    escapeCsvField(r.answer),
    escapeCsvField(r.category),
    escapeCsvField(r.status),
    r.isCorrect ? 'Yes' : 'No',
    r.relevanceScore.toFixed(2),
    r.correctnessScore.toFixed(2),
    escapeCsvField(r.explanation),
    r.responseTimeMs,
    escapeCsvField(r.timestamp),
    escapeCsvField(r.evaluatedAt),
  ]);

  const csvContent = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  fs.writeFileSync(outputPath, csvContent, 'utf-8');
  console.log(`✅ CSV exported to: ${outputPath}`);
}

export function exportToJSON(results: EvaluationResult[], outputPath: string): void {
  const jsonContent = JSON.stringify(results, null, 2);
  fs.writeFileSync(outputPath, jsonContent, 'utf-8');
  console.log(`✅ JSON exported to: ${outputPath}`);
}

export function exportToMarkdown(
  results: EvaluationResult[],
  metrics: any,
  outputPath: string
): void {
  const md: string[] = [];

  md.push('# Chatbot QA Evaluation Report\n');
  md.push(`**Generated:** ${new Date().toLocaleString()}\n`);

  // Metrics section
  md.push('## Summary Metrics\n');
  md.push('| Metric | Value |');
  md.push('|--------|-------|');
  md.push(`| Total Questions | ${metrics.totalQuestions} |`);
  md.push(`| Correct Answers | ${metrics.correctAnswers} |`);
  md.push(`| Accuracy | ${metrics.accuracy.toFixed(1)}% |`);
  md.push(`| Avg Relevance | ${metrics.avgRelevance}% |`);
  md.push(`| Avg Correctness | ${metrics.avgCorrectness}% |`);
  md.push('');

  // Results section
  md.push('## Detailed Results\n');

  results.forEach((result, index) => {
    md.push(`### ${index + 1}. ${result.questionId} - ${result.question}\n`);
    md.push(`**Status:** ${result.isCorrect ? '✅ Correct' : '❌ Incorrect'}\n`);
    md.push(`**Category:** ${result.category}\n`);
    md.push(`**Answer:** ${result.answer}\n`);
    md.push(`**Evaluation:** ${result.explanation}\n`);
    md.push(`- **Relevance Score:** ${(result.relevanceScore * 100).toFixed(1)}%`);
    md.push(`- **Correctness Score:** ${(result.correctnessScore * 100).toFixed(1)}%`);
    md.push(`- **Response Time:** ${result.responseTimeMs}ms`);
    md.push(`- **Timestamp:** ${new Date(result.timestamp).toLocaleString()}\n`);
  });

  const markdownContent = md.join('\n');
  fs.writeFileSync(outputPath, markdownContent, 'utf-8');
  console.log(`✅ Markdown exported to: ${outputPath}`);
}

function escapeCsvField(field: string | number): string {
  const fieldStr = String(field || '');
  if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
    return `"${fieldStr.replace(/"/g, '""')}"`;
  }
  return fieldStr;
}

export function generateExportFilename(prefix: string = 'evaluation'): string {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  return `${prefix}-${timestamp}`;
}
