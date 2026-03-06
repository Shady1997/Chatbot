# 📚 Documentation Index

Welcome! This directory contains a complete chatbot QA automation and evaluation system. Here's your roadmap.

---

## 🚀 Getting Started (Start Here!)

### For Complete Beginners
👉 Start with: **[QUICK_START.md](QUICK_START.md)**
- 3-step setup guide
- Minimal technical details
- Get running in minutes

### For Impatient Users
```bash
npm install && npm run test:evaluate
```
Then open: `evaluation-report.html`

---

## 📖 Documentation by Purpose

### I want to...

#### **...get up and running quickly**
→ [QUICK_START.md](QUICK_START.md) (5 minutes)

#### **...understand the complete system**
→ [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) (15 minutes)

#### **...verify everything is installed correctly**
→ [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) (10 minutes checklist)

#### **...learn all technical details**
→ [EVALUATION_GUIDE.md](EVALUATION_GUIDE.md) (30 minutes deep dive)

#### **...understand the architecture**
→ [ARCHITECTURE.md](ARCHITECTURE.md) (20 minutes)

#### **...understand the project structure**
→ [README.md](README.md) (Project overview)

---

## 📁 Project Structure

```
chatbot-qa2/
├── 📄 README.md                    ← Project overview
├── 📄 QUICK_START.md               ← ⭐ Start here!
├── 📄 SETUP_CHECKLIST.md           ← Setup verification
├── 📄 IMPLEMENTATION_SUMMARY.md     ← System overview
├── 📄 EVALUATION_GUIDE.md           ← Technical guide
├── 📄 ARCHITECTURE.md               ← System architecture
├── 📄 DOC_INDEX.md                 ← This file
│
├── scripts/
│   ├── evaluate-answers.js         ← Main evaluator (use this!)
│   └── evaluate-answers.ts         ← TypeScript version (optional)
│
├── src/
│   ├── config/
│   │   ├── evaluation.config.ts    ← Evaluation settings
│   │   └── selectors.ts             ← UI selectors
│   ├── utils/
│   │   ├── knowledge-loader.ts      ← Load PDF/MD/DOCX
│   │   ├── deepeval-evaluator.ts    ← Answer scoring
│   │   ├── export.utils.ts          ← Export formats
│   │   ├── csv.utils.ts             ← CSV handling
│   │   └── logger.ts                ← Logging
│   ├── pages/
│   │   ├── login.page.ts            ← Login automation
│   │   └── chatbot.page.ts          ← Chatbot interaction
│   └── types/
│       └── index.ts                 ← TypeScript types
│
├── tests/
│   ├── chatbot-qa.spec.ts           ← Main test suite
│   └── seed.spec.ts                 ← Seed tests
│
├── knowledge/                       ← Your knowledge base
│   ├── FAQ_Markdown.md              ← Knowledge file
│   ├── Priority_Source_2_User Manual HPA-Complete.pdf
│   └── دليل المستخدم.docx
│
├── data/
│   └── questions.csv                ← Test questions
│
├── results/                         ← Test results (auto-generated)
│   └── chatbot-qa-*.csv
│
├── playwright-report/               ← Playwright HTML (auto-generated)
│   └── index.html
│
├── evaluation-report.html           ← ⭐ Main report (auto-generated)
│
└── Configuration Files
    ├── package.json                 ← Dependencies & scripts
    ├── tsconfig.json                ← TypeScript config
    ├── playwright.config.ts         ← Playwright config
    ├── .ts-noderc.json              ← ts-node config
    ├── .env.example                 ← Environment template
    └── .gitignore                   ← Git ignore rules
```

---

## 🎯 Common Tasks

### Task: Set up and run tests

**Time:** 10 minutes

1. Read: [QUICK_START.md](QUICK_START.md)
2. Run: `npm install`
3. Run: `npm run test:evaluate`
4. Open: `evaluation-report.html`

### Task: Understand how evaluation works

**Time:** 30 minutes

1. Read: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) (15 min)
2. Read: [ARCHITECTURE.md](ARCHITECTURE.md) (15 min)
3. Look at: `scripts/evaluate-answers.js` (code)

### Task: Adjust evaluation thresholds

**Time:** 5 minutes

1. Open: `src/config/evaluation.config.ts`
2. Edit: `correctnessThreshold: 0.6` (default 60%)
3. Save and re-run: `npm run evaluate`

### Task: Add more knowledge base files

**Time:** 2 minutes

1. Copy files to: `knowledge/` folder
2. Supported formats: `.pdf`, `.md`, `.txt`, `.docx`
3. Run: `npm run evaluate`
4. System auto-detects new files

### Task: Run tests with debugging

**Time:** 10 minutes

1. Run: `npm run test:debug`
2. This opens Playwright Inspector
3. Step through test execution
4. See DOM, selectors, etc.

### Task: View test results

**Time:** 2 minutes

1. Run: `npm run report`
2. Opens Playwright HTML report
3. Shows test execution details

### Task: Check my first report

**Time:** 5 minutes

1. Open: `evaluation-report.html` in browser
2. Review metrics at top
3. Scroll through Q&A results
4. Try filter buttons (All / Correct / Incorrect)

---

## 📚 Documentation Map

### Quick References
- **[QUICK_START.md](QUICK_START.md)** - 3-step setup ⭐
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Verify installation

### Deep Dives
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - System overview
- **[EVALUATION_GUIDE.md](EVALUATION_GUIDE.md)** - Complete technical guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & algorithms

### Project Info
- **[README.md](README.md)** - Project description & features
- **[DOC_INDEX.md](DOC_INDEX.md)** - This file!

---

## 🔑 Key Concepts

### Evaluation Process

1. **Load Knowledge Base** - Read PDF/DOCX/Markdown files
2. **Parse Results** - Load CSV from test execution
3. **Score Answers** - Compare against knowledge base
4. **Generate Report** - Create professional HTML dashboard

### Key Metrics

- **Accuracy** - % of correct answers (≥60% score)
- **Relevance** - Keyword match % (0-100%)
- **Correctness** - Overall quality score (0-100%)

### Report Features

- 📊 Summary metrics & statistics
- ✓ Color-coded results (green/red)
- 🔍 Interactive filtering
- 📈 Visual score representations
- 📱 Mobile-responsive design
- 💾 Export to CSV/JSON/Markdown

---

## 🛠️ Available Commands

```bash
# Installation
npm install                    # Install all dependencies

# Testing
npm run test                   # Run Playwright tests only
npm run test:headed            # Run tests in visible browser
npm run test:debug             # Debug tests interactively
npm run test:ui                # Run in UI mode
npm run report                 # View Playwright report

# Evaluation
npm run evaluate               # Evaluate latest test results
npm run evaluate:ts            # Use TypeScript version
npm run test:evaluate          # Run tests + evaluation ⭐

# Maintenance
npm run lint                   # Check TypeScript syntax
npm update                     # Update dependencies
```

---

## 🆘 Troubleshooting

### "npm: command not found"
- Install Node.js 20+: https://nodejs.org/

### "No results CSV files found"
- Run: `npm run test` first to generate results

### "Knowledge base is empty"
- Add files to: `knowledge/` folder
- Supported: `.md`, `.txt`, `.pdf`, `.docx`
- Install optional: `npm install pdf-parse docx-parser`

### "Can't open evaluation-report.html"
- Ensure file exists in root folder
- Try right-click → Open with → Browser
- Try full path: `file:///path/to/evaluation-report.html`

### "Tests are failing"
- Check `.env` file has correct credentials
- Verify BASE_URL is accessible
- Run: `npm run test:debug` for debugging

---

## 📈 Metrics Interpretation

| Score | Meaning |
|-------|---------|
| 80-100% | Excellent - Strong KB match |
| 60-79% | Good - Adequate KB reference |
| 40-59% | Fair - Weak KB match |
| 0-39% | Poor - Minimal KB reference |

---

## 🚀 Next Steps

1. **Right Now**: Open [QUICK_START.md](QUICK_START.md)
2. **In 5 minutes**: Run `npm run test:evaluate`
3. **In 10 minutes**: View `evaluation-report.html`
4. **In 30 minutes**: Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
5. **In 1 hour**: Customize evaluation settings & re-run

---

## 📞 Support

| Question | Resource |
|----------|----------|
| How do I start? | [QUICK_START.md](QUICK_START.md) |
| Is setup correct? | [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) |
| How does it work? | [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) |
| What are all the details? | [EVALUATION_GUIDE.md](EVALUATION_GUIDE.md) |
| How is it designed? | [ARCHITECTURE.md](ARCHITECTURE.md) |
| General info? | [README.md](README.md) |

---

## ✨ Quick Start (TL;DR)

```bash
# 1. Install
npm install

# 2. Run everything
npm run test:evaluate

# 3. Open report
open evaluation-report.html
```

That's it! Your professional chatbot QA evaluation system is ready. 🎉

---

**Happy Testing!** 🚀
