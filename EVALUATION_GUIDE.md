# Answer Evaluation System with DeepEval

This system evaluates chatbot answers against your knowledge base using advanced semantic analysis and generates professional HTML reports.

## Features

✅ **Knowledge Base Integration**
- Supports multiple file formats: PDF, Markdown (`.md`), and Word documents (`.docx`)
- Automatic text extraction from all document types
- Intelligent keyword matching and semantic analysis

✅ **Answer Evaluation**
- Relevance scoring based on knowledge base content
- Correctness assessment with confidence scores
- Detailed explanations for each evaluation result
- Support for batch processing of multiple Q&A pairs

✅ **Professional HTML Report**
- Beautiful, responsive dashboard with metrics
- Visual score representations with progress bars
- Filtering options (All, Correct, Incorrect)
- Mobile-friendly design
- Detailed metadata for each evaluation

## Setup

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `csv-parse`: For reading CSV result files
- `ts-node`: For running TypeScript scripts
- `@types/csv-parse`: TypeScript definitions

Optional dependencies for enhanced document parsing:
```bash
npm install pdf-parse docx-parser
```

### 2. Knowledge Base Files

Place your knowledge base documents in the `knowledge/` folder:

```
knowledge/
├── Priority_Source_2_User Manual HPA-Complete.pdf
├── FAQ_Markdown.md
└── دليل المستخدم لبوابة المستودعات والمشتريات - جامعة الحدود الشمالية.docx
```

Supported formats:
- **PDF**: `.pdf` files (requires `pdf-parse` package)
- **Markdown**: `.md` files (plain text extraction)
- **Word**: `.docx` files (requires `docx-parser` package)

### 3. Test Results

Ensure your test results are saved in the `results/` folder. The evaluation script automatically:
- Detects the latest `chatbot-qa-*.csv` file
- Parses questions, answers, and metadata
- Evaluates answers against your knowledge base

## Usage

### Quick Start

Run tests and evaluate in one command:

```bash
npm run test:evaluate
```

### Individual Commands

1. **Run tests only**:
   ```bash
   npm run test
   ```

2. **Evaluate only** (uses latest results):
   ```bash
   npm run evaluate
   ```

3. **View the generated report**:
   Open `evaluation-report.html` in your browser

### Example Workflow

```bash
# 1. Install dependencies
npm install

# 2. Run tests to generate results
npm run test

# 3. Evaluate answers against knowledge base
npm run evaluate

# 4. Open the HTML report
# Double-click evaluation-report.html or open it in a browser
```

## Evaluation Metrics

The HTML report displays:

| Metric | Description |
|--------|-------------|
| **Total Questions** | Number of questions tested |
| **Correct Answers** | Count of answers matching knowledge base |
| **Accuracy** | Percentage of correct answers |
| **Avg Relevance** | Average keyword match percentage |
| **Avg Correctness** | Average correctness confidence score |

## Detailed Results

Each answer is evaluated with:

- **Status Badge**: Visual indicator (✓ Correct / ✗ Incorrect)
- **Question ID**: Reference identifier
- **Question Text**: Full question asked
- **Answer**: Complete chatbot response
- **Evaluation Details**: Explanation of correctness assessment
- **Relevance Score**: How relevant to knowledge base (0-100%)
- **Correctness Score**: Overall correctness confidence (0-100%)
- **Category**: Question category from CSV
- **Response Time**: Time taken to generate answer
- **Timestamp**: When the question was asked

## Evaluation Algorithm

The system uses:

1. **Keyword Extraction**: Extracts significant keywords from questions and answers
2. **Knowledge Base Matching**: Compares extracted keywords against knowledge base content
3. **Relevance Scoring**: Calculates percentage of answer keywords found in knowledge base
4. **Correctness Assessment**: Combines relevance with content quality checks
5. **Threshold-based Classification**: Answers with correctness ≥ 0.6 are marked as correct

## Advanced: Using with Real DeepEval

To use the actual DeepEval library for more sophisticated evaluation:

```bash
npm install deepeval python -m pip install deepeval
```

Then modify `src/utils/deepeval-evaluator.ts` to use DeepEval's API:

```typescript
import { evaluate, Answer, Context, AnswerRelevancyMetric } from 'deepeval'

// Use DeepEval for advanced metrics
```

## Output Files

The evaluation system generates:

- **`evaluation-report.html`**: Professional evaluation report
- Console output with summary metrics
- Detailed evaluation data for each Q&A pair

## Troubleshooting

### Q: "No results CSV files found"
**A**: Run tests first with `npm run test` to generate result files

### Q: "Knowledge base is empty"
**A**: 
- Check files exist in `knowledge/` folder
- Install optional dependencies: `npm install pdf-parse docx-parser`
- Ensure file formats are supported

### Q: PDF parsing not working
**A**: Install the optional pdf-parse package:
```bash
npm install pdf-parse
```

### Q: DOCX parsing not working
**A**: Install the optional docx-parser package:
```bash
npm install docx-parser
```

## Architecture

```
scripts/
└── evaluate-answers.ts          # Main entry point

src/utils/
├── knowledge-loader.ts           # Knowledge base loader (PDF, MD, DOCX)
└── deepeval-evaluator.ts         # Evaluation engine & metrics
```

### Knowledge Loader
- Reads multiple document formats
- Extracts and combines text from all sources
- Creates searchable knowledge base index

### DeepEval Evaluator
- Evaluates individual answers
- Calculates relevance and correctness scores
- Generates explanation for each evaluation
- Computes aggregate metrics

### Report Generator
- Creates professional HTML dashboard
- Includes interactive filtering
- Responsive design for all devices
- Beautiful visual representations of scores

## Integration with CI/CD

Add to your GitHub Actions workflow:

```yaml
- name: Evaluate Answers
  if: always()
  run: npm run evaluate

- name: Upload Evaluation Report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: evaluation-report
    path: evaluation-report.html
```

## License

MIT License - See LICENSE file for details
