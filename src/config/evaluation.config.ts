/**
 * Evaluation System Configuration
 * Customize evaluation behavior and thresholds
 */

export const EVALUATION_CONFIG = {
  // Knowledge base
  knowledgeDir: 'knowledge',
  resultsDir: 'results',
  outputFile: 'evaluation-report.html',

  // Evaluation thresholds
  correctnessThreshold: 0.6, // Answers with score >= 0.6 are marked as "correct"
  relevanceWeighting: 0.7, // How much relevance score matters vs other factors
  minAnswerLength: 50, // Minimum answer length for consideration (characters)

  // Scoring
  maxRelevanceScore: 1.0,
  maxCorretnessScore: 1.0,
  defaultScoreIfError: 0.3,

  // Knowledge base processing
  chunkSize: 1000, // Characters per chunk for processing
  minChunkSize: 100,

  // Report generation
  reportTitle: 'Chatbot QA Evaluation Report',
  reportDescription: 'Professional Answer Evaluation Against Knowledge Base',
  itemsPerPage: 50, // For pagination if implemented

  // Scoring adjustments
  lengthBonus: 0.1, // Bonus for longer answers
  errorPenalty: 0.3, // Penalty for error messages
  confidenceMultiplier: 1.2, // Multiplier for high-confidence answers

  // Export formats
  includeCSVExport: true,
  includeJSONExport: true,
};

export const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
  'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'as', 'from', 'by',
  'just', 'only', 'very', 'then', 'so', 'if', 'no', 'not', 'too',
]);

export const RELEVANCE_KEYWORDS = {
  highConfidence: [
    'portal', 'employee', 'service', 'request', 'leave', 'salary',
    'information', 'document', 'payroll', 'approval', 'track',
  ],
  mediumConfidence: [
    'provide', 'access', 'manage', 'submit', 'view', 'add', 'edit',
    'information', 'records', 'details', 'data', 'features',
  ],
};
