# 🎯 Quick Reference Card

## One-Liner to Get Started
```bash
npm install && npm run test:evaluate && open evaluation-report.html
```

---

## 📊 Report Looks Like This

```
┌─────────────────────────────────────────────────────────┐
│  🤖 Chatbot QA Evaluation Report                        │
│  Professional Answer Evaluation Against Knowledge Base  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📈 METRICS                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │   Total      │ │  Correct     │ │  Accuracy    │    │
│  │  Questions   │ │   Answers    │ │   Score      │    │
│  │      10      │ │      7       │ │    70%       │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│  ┌──────────────┐ ┌──────────────┐                      │
│  │ Avg Relevance│ │ Avg Correct  │                      │
│  │              │ │              │                      │
│  │    78.5%     │ │    75.2%     │                      │
│  └──────────────┘ └──────────────┘                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ 📋 DETAILED RESULTS                                     │
│                                                         │
│ Filters: [All] [✓ Correct] [✗ Incorrect]              │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✓ CORRECT   Q01   What services...?                 │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Answer: The portal provides main services...        │ │
│ │ Evaluation: Answer relevant with 85% keyword match  │ │
│ │ Relevance: █████████░░ 85%                          │ │
│ │ Correctness: ██████████ 95%                         │ │
│ │ 📁 general  ⏱ 2500ms  🕒 2026-03-06T11:08:56Z      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✗ INCORRECT Q02   How to request...?               │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Answer: Not sure about this...                      │ │
│ │ Evaluation: Weak KB match (42%), lacks detail       │ │
│ │ Relevance: ███░░░░░░░░ 42%                          │ │
│ │ Correctness: ██░░░░░░░░░ 45%                        │ │
│ │ 📁 requests ⏱ 1800ms  🕒 2026-03-06T11:09:02Z       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎮 Main Commands

| Command | What It Does | Time |
|---------|-------------|------|
| `npm install` | Install all dependencies | 2-5 min |
| `npm run test` | Run Playwright tests | 5-10 min |
| `npm run evaluate` | Evaluate latest results | 10-30 sec |
| `npm run test:evaluate` | Run both (recommended) | 5-15 min |
| `npm run report` | View Playwright report | instant |

---

## 📂 Key Folders

```
knowledge/                    ← Put your knowledge files here
├── FAQ.md                    ← Auto-loaded
├── Manual.pdf               ← Auto-loaded (if pdf-parse installed)
└── Guide.docx               ← Auto-loaded (if docx-parser installed)

data/
└── questions.csv            ← Your test questions

results/
└── chatbot-qa-*.csv         ← Generated after tests

evaluation-report.html       ← Your main report (view in browser!)
```

---

## 🔧 Evaluation Settings

Edit: `src/config/evaluation.config.ts`

```typescript
// Threshold for "correct" badge (default 60%)
correctnessThreshold: 0.6

// How much relevance matters (default 70%)
relevanceWeighting: 0.7

// Minimum answer length (default 50 chars)
minAnswerLength: 50
```

---

## 🎯 Scores Interpretation

| Score Range | Interpretation | Badge Color |
|-------------|-----------------|------------|
| 80-100% | Excellent | 🟢 Green |
| 60-79% | Good | 🟢 Green |
| 40-59% | Fair | 🔴 Red |
| 0-39% | Poor | 🔴 Red |

---

## 📖 Reading the Report

### Metrics Section
- **Total Questions**: Count of all Q&A pairs tested
- **Correct Answers**: Count of answers scoring ≥60%
- **Accuracy**: Percentage of correct answers
- **Avg Relevance**: Average keyword match score
- **Avg Correctness**: Average overall quality score

### Result Cards
Each card shows:
1. **Status Badge** - ✓ Correct (green) or ✗ Incorrect (red)
2. **Question ID** - Reference identifier
3. **Question** - Full question text
4. **Answer** - Chatbot's response
5. **Relevance Score** - Keyword match percentage
6. **Correctness Score** - Overall quality score
7. **Explanation** - Why it was scored this way
8. **Metadata** - Category, response time, timestamp

### Filter Buttons
- **All** - Show all results
- **✓ Correct** - Show only correct answers
- **✗ Incorrect** - Show only incorrect answers

---

## ✅ 5-Minute Setup

```
Step 1: Install
$ npm install
(wait for packages to download)

Step 2: Configure
$ cp .env.example .env
(edit .env with your credentials)

Step 3: Run Everything
$ npm run test:evaluate
(wait for tests + evaluation)

Step 4: View
$ open evaluation-report.html
(open in your browser)

Done! ✨
```

---

## 🐛 Common Issues & Fixes

### "Cannot find module 'csv-parse'"
```bash
npm install csv-parse @types/csv-parse
```

### "No results found"
```bash
npm run test    # Generate results first
npm run evaluate
```

### "Knowledge base is empty"
```bash
# Add files to knowledge/ folder
mkdir -p knowledge
cp your-manual.md knowledge/
npm run evaluate
```

### "Permission denied"
```bash
chmod +x scripts/evaluate-answers.js
npm run evaluate
```

---

## 🎓 Learning Path

```
0-5 min    ← You are here
│
├─ Read: QUICK_START.md (5 min)
│ └─ Run: npm run test:evaluate (5-15 min)
│    └─ View: evaluation-report.html (2 min)
│
├─ Read: IMPLEMENTATION_SUMMARY.md (15 min)
│ └─ Understand: How system works
│
├─ Read: EVALUATION_GUIDE.md (30 min)
│ └─ Deep dive: All technical details
│
├─ Read: ARCHITECTURE.md (20 min)
│ └─ Expert: System design & algorithms
│
└─ Done! You're now an expert 🚀
```

---

## 💾 Exporting Results

The system generates multiple formats automatically:

```
evaluation-report.html          ← Primary (open in browser)
evaluation-2026-03-06T11.csv   ← Excel/spreadsheet ready
evaluation-2026-03-06T11.json  ← Programmatic access
evaluation-2026-03-06T11.md    ← Documentation format
```

### Using CSV in Excel
1. Open Excel
2. File → Open → Select .csv file
3. Data is automatically formatted in columns
4. Can sort, filter, create charts

---

## 🌐 Browser Support

Works in:
- ✅ Chrome / Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (responsive design)

### To View Report
1. Open `evaluation-report.html` in browser
2. Or: Right-click file → Open with → Browser
3. Or: `open evaluation-report.html` (Mac)
4. Or: `start evaluation-report.html` (Windows)

---

## 📞 Quick Help

| Question | Answer |
|----------|--------|
| Where's my report? | `evaluation-report.html` in root folder |
| How to share? | Email the HTML file (self-contained) |
| Can I customize? | Edit `src/config/evaluation.config.ts` |
| What's the threshold? | Default 60% for "correct", adjust in config |
| How often to run? | Whenever you want (each run is independent) |
| Can I re-run? | Yes! Each run generates new timestamp |
| Export to Excel? | Use the .csv file generated |
| Print the report? | Use browser Print (Ctrl+P / Cmd+P) |

---

## 🎯 Success Checklist

- [ ] `npm install` completed
- [ ] `npm run test:evaluate` succeeded
- [ ] `evaluation-report.html` exists
- [ ] Can open report in browser
- [ ] Metrics display correctly
- [ ] Results cards show Q&A
- [ ] Filter buttons work
- [ ] Scores display as bars
- [ ] Can see status badges
- [ ] Report looks professional

**If all checked: You're done!** ✨

---

## 🚀 Now What?

1. **Share**: Email report to team
2. **Analyze**: Use CSV export for analysis
3. **Improve**: Update knowledge base based on low scores
4. **Repeat**: Run tests again to verify improvements
5. **Automate**: Set up GitHub Actions for continuous evaluation

---

## 💡 Pro Tips

- 📱 Reports are mobile-responsive
- 🔒 HTML is self-contained (no internet needed)
- ⏱️ Evaluations are fast (~100ms per answer)
- 📊 Export to CSV for data analysis
- 🔄 Run evaluation multiple times (timestamps track changes)
- 🎨 Report styling is professional and print-friendly
- 🔍 Use browser search (Ctrl+F) to find specific Q&A

---

**TL;DR:**
```bash
npm install
npm run test:evaluate
open evaluation-report.html
```

**That's it!** 🎉
