# Evaluation System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Chatbot QA Automation Pipeline                   │
└─────────────────────────────────────────────────────────────────────┘

1. PLAYWRIGHT TESTS
   ├── Login to Portal
   ├── Open Chatbot Widget
   ├── Send Questions from CSV
   └── Collect Answers
        ↓
        OUTPUT: results/chatbot-qa-2026-03-06T10-17-06.csv
        
2. KNOWLEDGE BASE LOADER
   ├── Scan knowledge/ folder
   ├── Extract from PDF files (optional)
   ├── Extract from DOCX files (optional)
   ├── Read Markdown files
   └── Index all keywords
        ↓
        COMBINES: FAQ_Markdown.md + PDFs + DOCX files

3. EVALUATION ENGINE
   ├── Read Questions & Answers from CSV
   ├── Extract Keywords from Each Answer
   ├── Match Keywords to Knowledge Base
   ├── Calculate Relevance Score (0-100%)
   ├── Calculate Correctness Score (0-100%)
   └── Classify: Correct (≥60%) or Incorrect (<60%)
        ↓
        OUTPUT: EvaluationResult[]

4. REPORT GENERATOR
   ├── Calculate Aggregate Metrics
   ├── Create Summary Cards
   ├── Build Result Cards with Scores
   ├── Add Interactive Filters
   └── Generate HTML Report
        ↓
        OUTPUT: evaluation-report.html
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    EVALUATION SYSTEM                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  Knowledge Base │  │  Results CSV     │  │  Configuration  │ │
│  │  Loader         │  │  Parser          │  │  Engine         │ │
│  │                 │  │                  │  │                 │ │
│  │ • Read PDF      │  │ • Parse CSV      │  │ • Thresholds    │ │
│  │ • Read DOCX     │  │ • Normalize data │  │ • Weights       │ │
│  │ • Read Markdown │  │ • Validate rows  │  │ • Parameters    │ │
│  └────────┬────────┘  └────────┬─────────┘  └─────────┬───────┘ │
│           │                    │                       │         │
│           └────────────────────┼───────────────────────┘         │
│                                │                                 │
│                        ┌───────▼──────────┐                      │
│                        │ Answer Evaluator │                      │
│                        │                  │                      │
│                        │ • Keyword        │                      │
│                        │   Extraction     │                      │
│                        │ • KB Matching    │                      │
│                        │ • Scoring        │                      │
│                        │ • Classification │                      │
│                        └───────┬──────────┘                      │
│                                │                                 │
│                        ┌───────▼──────────────┐                 │
│                        │ Report Generator     │                 │
│                        │                      │                 │
│                        │ • HTML Dashboard     │                 │
│                        │ • Metrics Summary    │                 │
│                        │ • Result Cards       │                 │
│                        │ • Interactive UI     │                 │
│                        │ • Export (CSV/JSON)  │                 │
│                        └───────┬──────────────┘                 │
│                                │                                 │
└────────────────────────────────┼─────────────────────────────────┘
                                 │
                        ┌────────▼──────────┐
                        │ Output Files      │
                        │                   │
                        │ • HTML Report     │
                        │ • CSV Export      │
                        │ • JSON Export     │
                        │ • Markdown Export │
                        └───────────────────┘
```

---

## Data Flow

```
Input Data
    │
    ├─► Chatbot Q&A Results CSV
    │   (ID, Question, Answer, Category, Status, ResponseTime)
    │
    └─► Knowledge Base Documents
        (PDFs, Markdown, DOCX files)
        
        ↓

Processing Pipeline
    │
    ├─► Text Extraction
    │   • PDF → Text
    │   • DOCX → Text
    │   • Markdown → Text
    │
    ├─► Keyword Indexing
    │   • Remove stopwords
    │   • Normalize terms
    │   • Build knowledge base index
    │
    ├─► Answer Analysis
    │   • Extract answer keywords
    │   • Match against KB index
    │   • Calculate relevance score
    │
    ├─► Scoring
    │   • Relevance (keyword match %)
    │   • Correctness (quality + relevance)
    │   • Classification (correct/incorrect)
    │
    └─► Metrics Calculation
        • Total questions
        • Correct count
        • Accuracy %
        • Average scores
        
        ↓

Output Data
    │
    ├─► evaluation-report.html (Primary)
    │   • Interactive dashboard
    │   • Visual metrics
    │   • Detailed results
    │   • Filtering & searching
    │
    ├─► evaluation-[timestamp].csv
    │   • Detailed result rows
    │   • All scores and metrics
    │   • Sortable/filterable data
    │
    ├─► evaluation-[timestamp].json
    │   • Structured data
    │   • Programmatic access
    │   • API-ready format
    │
    └─► evaluation-[timestamp].md
        • Markdown documentation
        • Human-readable report
        • Shareable format
```

---

## Evaluation Algorithm Detail

```
For Each Question-Answer Pair:

1. KEYWORD EXTRACTION
   ┌──────────────────────────┐
   │ Question: "What services │
   │ does the portal provide?"│
   │ Answer: "The portal      │
   │ provides these main      │
   │ services: View employee  │
   │ information, submit      │
   │ requests..."             │
   └──────────────────────────┘
              ↓
   ┌──────────────────────────┐
   │ Extracted Keywords:      │
   │ • services               │
   │ • portal                 │
   │ • provide (x2)           │
   │ • employee               │
   │ • information            │
   │ • submit                 │
   │ • requests               │
   └──────────────────────────┘

2. KNOWLEDGE BASE MATCHING
   ┌──────────────────────────┐
   │ Knowledge Base Includes: │
   │ • services ✓ MATCH       │
   │ • portal ✓ MATCH         │
   │ • employee ✓ MATCH       │
   │ • payroll ✗ NO MATCH     │
   │ • requests ✓ MATCH       │
   │ (5 out of 7 match)       │
   └──────────────────────────┘
              ↓
   Relevance Score = 5/7 = 0.71 (71%)

3. CORRECTNESS SCORING
   ┌──────────────────────────┐
   │ Check:                   │
   │ • Answer length: 145 ch  │
   │   → Valid (≥50 chars)    │
   │ • Has errors? No         │
   │ • Relevance: 71%         │
   │ • Content quality: Good  │
   │                          │
   │ Correctness = 0.71 + 0.3 │
   │             = 1.0 (capped)
   │             ≈ 0.95       │
   └──────────────────────────┘

4. CLASSIFICATION
   ┌──────────────────────────┐
   │ Correctness: 0.95        │
   │ Threshold: 0.6           │
   │                          │
   │ 0.95 ≥ 0.6? YES          │
   │ ┌─────────────────────────┐ │
   │ │ Status: ✓ CORRECT       │ │
   │ └─────────────────────────┘ │
   └──────────────────────────────┘

5. OUTPUT
   ┌──────────────────────────────┐
   │ QuestionID: Q01              │
   │ Question: What services...?  │
   │ Answer: The portal provides..│
   │ IsCorrect: true              │
   │ RelevanceScore: 0.71 (71%)   │
   │ CorrectnessScore: 0.95 (95%) │
   │ Explanation: "Answer is      │
   │ relevant to knowledge base    │
   │ with 71% keyword match."     │
   │ EvaluatedAt: 2026-03-06...   │
   └──────────────────────────────┘
```

---

## Scoring Algorithm Details

### Relevance Score (0-100%)

**Formula:** (Keywords in KB / Total Keywords) × 100

```
Example:
- Answer keywords: [portal, services, employee, manage, request]
- KB keywords: [portal, services, employee, payroll, leave, request]
- Matching: 4 out of 5
- Relevance: (4/5) × 100 = 80%
```

**Interpretation:**
- **80-100%**: Very relevant to knowledge base
- **60-79%**: Moderately relevant
- **40-59%**: Somewhat relevant
- **0-39%**: Minimally relevant

### Correctness Score (0-100%)

**Formula:** min(Relevance × Weight + Content Quality, 1.0)

```
Where:
- Relevance Weight = 0.7 (default)
- Content Quality includes:
  - Answer length (min 50 chars)
  - No error messages
  - Non-empty content
  - Formatting check
```

**Default Calculation:**
```
Correctness = min(0.71 × 0.7 + 0.3, 1.0)
            = min(0.497 + 0.3, 1.0)
            = min(0.797, 1.0)
            = 0.797 (≈80%)
```

### Classification

```
if Correctness ≥ 0.6 (60%):
    Status = "✓ CORRECT"
    Badge Color = Green (#d4edda)
else:
    Status = "✗ INCORRECT"
    Badge Color = Red (#f8d7da)
```

---

## Configuration Parameters

Located in: `src/config/evaluation.config.ts`

```typescript
EVALUATION_CONFIG = {
  // Thresholds
  correctnessThreshold: 0.6,        // 60% to mark as "correct"
  relevanceWeighting: 0.7,           // How much relevance matters
  minAnswerLength: 50,               // Minimum answer length

  // Scoring
  maxRelevanceScore: 1.0,
  maxCorretnessScore: 1.0,
  defaultScoreIfError: 0.3,          // Default score on error

  // Processing
  chunkSize: 1000,                   // Characters per KB chunk
  minChunkSize: 100,                 // Min chunk size

  // Report
  reportTitle: 'Chatbot QA Evaluation Report',
  itemsPerPage: 50,                  // Pagination

  // Adjustments
  lengthBonus: 0.1,                  // Bonus for long answers
  errorPenalty: 0.3,                 // Penalty for errors
  confidenceMultiplier: 1.2,         // High-confidence multiplier
}
```

---

## File Organization

```
Core Components:
├── scripts/evaluate-answers.js
│   └── Main entry point (Node.js, no TypeScript needed)
│
├── src/utils/knowledge-loader.ts
│   └── Loads PDF, DOCX, Markdown files
│
├── src/utils/deepeval-evaluator.ts
│   └── Answer evaluation & scoring
│
├── src/utils/export.utils.ts
│   └── Export to CSV/JSON/Markdown
│
└── src/config/evaluation.config.ts
    └── Evaluation parameters

Supporting:
├── .ts-noderc.json
│   └── TypeScript configuration
│
├── tsconfig.json
│   └── Updated to include scripts/
│
└── package.json
    └── Scripts & dependencies
```

---

## Performance Characteristics

| Operation | Typical Time |
|-----------|-------------|
| Load knowledge base | 100-500ms |
| Parse results CSV | 50-200ms |
| Evaluate 1 answer | 10-50ms |
| Evaluate 10 answers | 100-500ms |
| Generate HTML report | 200-500ms |
| Total (10 Qs) | 500-2000ms |

---

## Error Handling

```
Level 1: Knowledge Base Loading
├─ Missing folder → Log warning, continue with empty KB
├─ Unreadable file → Log, skip file, continue
└─ Parsing error → Log, use fallback parsing

Level 2: CSV Parsing
├─ Missing column → Use default values
├─ Invalid data → Sanitize and continue
└─ Parse error → Exit with error message

Level 3: Evaluation
├─ Empty answer → Score = 0.3 (default error score)
├─ Timeout → Retry, then use default score
└─ Exception → Log and continue with next item

Level 4: Report Generation
├─ No results → Show empty state
├─ Export error → Continue with HTML (critical format)
└─ Write error → Exit with error message
```

---

This architecture ensures reliable, professional answer evaluation with beautiful reporting!
