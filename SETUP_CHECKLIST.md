# Setup Checklist ✅

## Pre-Installation

- [ ] Verify Node.js version 20+ is installed: `node --version`
- [ ] Verify npm is available: `npm --version`
- [ ] Git repository is initialized
- [ ] All code changes are committed

---

## Installation Phase

- [ ] Navigate to project root: `cd chatbot-qa2`
- [ ] Run: `npm install`
- [ ] Verify dependencies installed: Check `node_modules/` folder exists
- [ ] Verify no errors in console output

### Optional: PDF/DOCX Support

If you want to parse PDF and Word documents automatically:

```bash
npm install pdf-parse docx-parser
```

- [ ] Optional PDF parsing installed (pdf-parse)
- [ ] Optional DOCX parsing installed (docx-parser)

---

## Configuration Phase

### 1. Environment Variables

- [ ] Copy `.env.example` to `.env` (or set env vars in CI)
- [ ] Set `BASE_URL` (e.g., `http://hasibcore.hasib.com.sa:8090`)
- [ ] Set `APP_USERNAME` 
- [ ] Set `APP_PASSWORD`
- [ ] Set other config values as needed

### 2. Test Data

- [ ] Verify `data/questions.csv` exists and has questions
- [ ] Format: `id,question,category`
- [ ] Example: `Q01,What services does the portal provide?,general`

### 3. Knowledge Base

- [ ] Create `knowledge/` folder if not exists
- [ ] Add knowledge base documents:
  - [ ] `.md` files (auto-detected)
  - [ ] `.txt` files (auto-detected)
  - [ ] `.pdf` files (if pdf-parse installed)
  - [ ] `.docx` files (if docx-parser installed)
- [ ] Verify at least one document is present

---

## Testing Phase

### Run Tests

```bash
npm run test
```

- [ ] Tests execute without errors
- [ ] All browser interactions successful
- [ ] Results CSV created in `results/` folder
- [ ] Playwright HTML report generated

### Check Results

- [ ] `results/chatbot-qa-*.csv` file exists
- [ ] CSV contains questions, answers, and metadata
- [ ] All rows have data in required columns

---

## Evaluation Phase

### Run Evaluation

```bash
npm run evaluate
```

- [ ] Knowledge base loaded successfully (check console)
- [ ] CSV results parsed without errors
- [ ] Evaluation completes without errors
- [ ] Metrics printed to console

### Verify Report

- [ ] `evaluation-report.html` created in root folder
- [ ] File size > 100KB (contains all data + styling)
- [ ] No errors in console

### View Report

- [ ] Open `evaluation-report.html` in browser
- [ ] Header visible with title
- [ ] Metrics cards display correctly
- [ ] Result cards show with data
- [ ] Filter buttons work (All / Correct / Incorrect)
- [ ] Scores display with progress bars
- [ ] Mobile-responsive view works

---

## All-In-One Testing

```bash
npm run test:evaluate
```

- [ ] Tests run successfully
- [ ] Evaluation runs without errors
- [ ] Report generated
- [ ] Browser can open report

---

## Troubleshooting Checklist

### If tests fail:
- [ ] Verify BASE_URL is correct
- [ ] Verify credentials are correct
- [ ] Check network connectivity
- [ ] Run single test: `npm run test`
- [ ] Run with debug: `npm run test:debug`

### If evaluation fails:
- [ ] Verify results CSV exists: `ls results/`
- [ ] Check knowledge base folder: `ls knowledge/`
- [ ] Verify at least one knowledge file exists
- [ ] Run with debug: `node --inspect scripts/evaluate-answers.js`

### If report won't open:
- [ ] Check file exists: `ls evaluation-report.html`
- [ ] Check file size: `ls -lh evaluation-report.html`
- [ ] Try different browser
- [ ] Check browser console for errors (F12)

### If HTML report is blank:
- [ ] Check results CSV has data
- [ ] Verify evaluation completed successfully
- [ ] Check browser console for JavaScript errors
- [ ] Try clearing browser cache (Ctrl+Shift+Delete)

---

## Post-Verification

- [ ] Create backup of first successful report
- [ ] Document any custom configuration changes
- [ ] Test CI/CD pipeline (push to branch)
- [ ] Verify GitHub Actions runs successfully
- [ ] Check artifact upload in Actions

---

## Documentation Review

- [ ] Read: `QUICK_START.md` (3-step guide)
- [ ] Read: `EVALUATION_GUIDE.md` (complete reference)
- [ ] Read: `IMPLEMENTATION_SUMMARY.md` (system overview)
- [ ] Read: `ARCHITECTURE.md` (technical details)

---

## CI/CD Setup (Optional)

### GitHub Actions

- [ ] Update `.github/workflows/chatbot-qa.yml` if needed
- [ ] Set required secrets in GitHub Settings:
  - [ ] `BASE_URL`
  - [ ] `APP_USERNAME`
  - [ ] `APP_PASSWORD`
  - [ ] `LOGIN_PATH`
- [ ] Push to trigger workflow
- [ ] Verify workflow runs successfully
- [ ] Check artifacts are uploaded

### GitHub Pages (Optional)

- [ ] Go to Repo Settings → Pages
- [ ] Select branch and folder for Pages
- [ ] Reports accessible at GitHub Pages URL

---

## Maintenance Checklist

### Regular Tasks

- [ ] Keep dependencies updated: `npm update`
- [ ] Run tests regularly: `npm run test`
- [ ] Review evaluation reports monthly
- [ ] Archive old reports: `mv evaluation-report.html old-reports/`
- [ ] Monitor knowledge base accuracy

### Quarterly

- [ ] Update knowledge base documents
- [ ] Review and adjust evaluation thresholds
- [ ] Check for npm security vulnerabilities: `npm audit`
- [ ] Review test coverage

### Annually

- [ ] Major dependency updates
- [ ] Performance optimization review
- [ ] Architecture review
- [ ] Documentation updates

---

## Success Indicators ✨

You're done when you can:

✅ Run `npm run test:evaluate` without errors  
✅ Open `evaluation-report.html` in browser  
✅ See metrics: Total, Correct, Accuracy %  
✅ See result cards with colors (green/red)  
✅ Filter results (All / Correct / Incorrect)  
✅ See scores as progress bars  
✅ View detailed Q&A for each result  
✅ See timestamps and response times  
✅ Open report on another device/browser  
✅ Share report with team members  

---

## Quick Reference Commands

```bash
# Install everything
npm install

# Run tests only
npm run test

# Evaluate only
npm run evaluate

# Run both (recommended)
npm run test:evaluate

# View Playwright report
npm run report

# Check syntax
npm run lint

# View test results
ls results/

# Check evaluation report
ls evaluation-report.html
```

---

## Support Resources

| Resource | Purpose |
|----------|---------|
| `QUICK_START.md` | Get started in 3 steps |
| `EVALUATION_GUIDE.md` | Complete technical guide |
| `IMPLEMENTATION_SUMMARY.md` | System overview |
| `ARCHITECTURE.md` | Technical architecture details |
| `README.md` | Project overview |

---

## Notes

- Keep `.env` file secure (add to `.gitignore`)
- Don't commit `node_modules/` to git
- Artifacts in GitHub can be downloaded for archival
- Knowledge base files can be updated anytime
- Evaluation thresholds can be adjusted in `src/config/evaluation.config.ts`
- Reports are self-contained HTML (safe to share)

---

**You're ready to go! 🚀**

Start with: `npm run test:evaluate`
