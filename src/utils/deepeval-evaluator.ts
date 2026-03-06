import * as fs from 'fs';
import * as path from 'path';

/**
 * DeepEval-based Answer Evaluator
 * Evaluates chatbot answers against knowledge base using DeepEval
 */

export interface EvaluationResult {
  questionId: string;
  question: string;
  answer: string;
  category: string;
  status: string;
  responseTimeMs: number;
  timestamp: string;
  isCorrect: boolean;
  relevanceScore: number;
  correctnessScore: number;
  explanation: string;
  evaluatedAt: string;
}

/**
 * Simulated evaluation function
 * In production, this would use DeepEval library
 * 
 * To use actual DeepEval:
 * npm install deepeval
 * import { evaluate, Answer, Context, AnswerRelevancyMetric } from 'deepeval'
 */
export async function evaluateAnswers(
  questions: Array<{ id: string; question: string; answer: string; category: string; status: string; responseTimeMs: number; timestamp: string }>,
  knowledgeBaseContent: string
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];

  for (const q of questions) {
    try {
      const evaluation = await evaluateSingleAnswer(
        q.question,
        q.answer,
        knowledgeBaseContent
      );

      results.push({
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
      });
    } catch (error) {
      console.error(`Error evaluating question ${q.id}:`, error);
      results.push({
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
      });
    }
  }

  return results;
}

/**
 * Evaluate a single answer against knowledge base
 */
async function evaluateSingleAnswer(
  question: string,
  answer: string,
  knowledgeBaseContent: string
): Promise<{
  isCorrect: boolean;
  relevanceScore: number;
  correctnessScore: number;
  explanation: string;
}> {
  // Basic keyword matching and similarity scoring
  const questionKeywords = extractKeywords(question);
  const answerKeywords = extractKeywords(answer);
  const kbKeywords = extractKeywords(knowledgeBaseContent);

  // Calculate relevance score (0-1)
  const relevantKeywords = answerKeywords.filter((kw) =>
    kbKeywords.includes(kw)
  );
  const relevanceScore = Math.min(
    1,
    relevantKeywords.length / Math.max(answerKeywords.length, 1)
  );

  // Calculate correctness based on length and content
  const answerLength = answer.trim().length;
  const hasContent = answerLength > 50 && !answer.toLowerCase().includes('error');
  const correctnessScore = hasContent ? Math.min(1, relevanceScore + 0.3) : 0.3;

  const isCorrect = correctnessScore >= 0.6;

  let explanation = '';
  if (isCorrect) {
    explanation = `Answer is relevant to knowledge base with ${(relevanceScore * 100).toFixed(1)}% keyword match.`;
  } else {
    explanation = `Answer may lack sufficient relevance (${(relevanceScore * 100).toFixed(1)}% keyword match). Verify against knowledge base.`;
  }

  return {
    isCorrect,
    relevanceScore,
    correctnessScore,
    explanation,
  };
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  ]);

  return text
    .toLowerCase()
    .match(/\b[a-z]+\b/g)
    ?.filter((word) => word.length > 3 && !stopWords.has(word)) || [];
}

/**
 * Calculate accuracy metrics
 */
export function calculateMetrics(results: EvaluationResult[]) {
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const avgRelevance =
    results.reduce((sum, r) => sum + r.relevanceScore, 0) / totalQuestions;
  const avgCorrectness =
    results.reduce((sum, r) => sum + r.correctnessScore, 0) / totalQuestions;

  return {
    totalQuestions,
    correctAnswers,
    accuracy: (correctAnswers / totalQuestions) * 100,
    avgRelevance: (avgRelevance * 100).toFixed(1),
    avgCorrectness: (avgCorrectness * 100).toFixed(1),
    evaluatedAt: new Date().toISOString(),
  };
}
