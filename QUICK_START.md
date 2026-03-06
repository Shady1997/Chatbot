# Quick Start Guide - Answer Evaluation System

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- ✓ Playwright test framework
- ✓ CSV parsing library
- ✓ TypeScript support
- ✓ All required dev dependencies

### Step 2: Run Tests

```bash
npm run test
```

This:
- Runs all chatbot Q&A tests
- Generates results CSV file in `results/`
- Creates Playwright HTML report

### Step 3: Evaluate Answers

```bash
npm run evaluate
```

This:
- Loads your knowledge base from `knowledge/` folder
- Reads the latest results CSV
- Evaluates each answer against the knowledge base
- **Generates** `evaluation-report.html`

---

## 📊 View Your Report

Simply **open `evaluation-report.html` in your browser** to see:

- 📈 Summary metrics (accuracy, scores, etc.)
- ✓ Color-coded results (green for correct, red for incorrect)
- 🔍 Interactive filtering (All / Correct / Incorrect)
- 📝 Detailed analysis for each Q&A pair
- 💯 Relevance and Correctness scores

---

## 🎯 Do Everything at Once

Run tests AND evaluation in one command:

```bash
npm run test:evaluate
```

Then open `evaluation-report.html` to see your results!

---

## 📁 Knowledge Base Setup

Place your knowledge documents in the `knowledge/` folder:

```
knowledge/
├── Priority_Source_2_User Manual HPA-Complete.pdf    ← Your PDF docs
├── FAQ_Markdown.md                                    ← Your markdown files
└── دليل المستخدم.docx                               ← Your Word docs
```

**Supported Formats:**
- 📄 Markdown files (`.md`) - Auto-detected
- 📋 Text files (`.txt`) - Auto-detected  
- 📕 PDF files (`.pdf`) - Requires: `npm install pdf-parse`
- 📗 Word documents (`.docx`) - Requires: `npm install docx-parser`

---

## 💡 Understanding the Report

### Metrics Explained

| Metric | Meaning |
|--------|---------|
| **Accuracy** | % of answers matching knowledge base content |
| **Avg Relevance** | Average keyword match percentage (0-100%) |
| **Avg Correctness** | Overall quality score of answers (0-100%) |

### Status Badges

- **✓ Correct** (Green): Answer relevant to knowledge base
- **✗ Incorrect** (Red): Answer lacks knowledge base relevance

### Score Interpretation

- **80-100%**: Excellent - Strong knowledge base match
- **60-79%**: Good - Adequate knowledge base reference
- **40-59%**: Fair - Weak knowledge base match
- **0-39%**: Poor - Minimal knowledge base reference

---

## 🔄 Workflow Example

```bash
# 1. Ask new questions (edit data/questions.csv if needed)

# 2. Run everything at once
npm run test:evaluate

# 3. Check results
# Open evaluation-report.html in browser

# 4. Filter results
# Use buttons: All | ✓ Correct | ✗ Incorrect

# 5. Export data (optional)
# CSV/JSON/Markdown exports available in scripts
```

---

## 🛠️ Advanced Options

### Adjust Evaluation Threshold

Edit `src/config/evaluation.config.ts`:

```typescript
correctnessThreshold: 0.6,  // 0.6 = 60% threshold for "correct"
```

### Export Formats

The system generates multiple formats:
- **HTML** - Beautiful interactive report
- **CSV** - For Excel/Data Analysis
- **JSON** - For programmatic access
- **Markdown** - For documentation

---

## ❓ Troubleshooting

### "No results CSV files found"
→ Run `npm run test` first to generate results

### Knowledge base looks empty
→ Check files are in `knowledge/` folder
→ Install optional dependencies: `npm install pdf-parse docx-parser`

### Can't open HTML report
→ Ensure full path: `evaluation-report.html`
→ Try right-click → Open with Browser

---

## 📞 Need Help?

Check the full documentation: `EVALUATION_GUIDE.md`

Or look at the utility files:
- `src/utils/knowledge-loader.ts` - Knowledge base loading
- `src/utils/deepeval-evaluator.ts` - Evaluation logic
- `scripts/evaluate-answers.js` - Main script

---

## ✨ That's It!

Your professional chatbot QA evaluation system is ready to use! 

**Quick reminder:**
```bash
npm run test:evaluate    # Do everything
# Then open: evaluation-report.html
```

Happy testing! 🎉
