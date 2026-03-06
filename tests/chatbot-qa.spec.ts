import { test, expect } from '@playwright/test';
import { LoginPage }    from '../src/pages/login.page';
import { ChatbotPage }  from '../src/pages/chatbot.page';
import { readQuestionsCsv, CsvResultWriter } from '../src/utils/csv.utils';
import { appConfig }    from '../src/config/app.config';
import { logger }       from '../src/utils/logger';
import { ResultRow }    from '../src/types';

// ── Module-level state (shared across the single-test run) ────────────────────
let csvWriter: CsvResultWriter;

test.beforeAll(() => {
  logger.separator();
  logger.info('Chatbot QA Automation — starting run');
  logger.separator();
  csvWriter = new CsvResultWriter(appConfig.outputCsvDir);
});

test.afterAll(() => {
  const count = csvWriter.getCount();
  logger.separator();
  logger.info(`Run complete — ${count} result(s) written to ${csvWriter.getFilePath()}`);
  logger.separator();
});

// ── Main test ─────────────────────────────────────────────────────────────────
test('Chatbot QA — login, open chatbot, ask all questions, save answers to CSV', async ({ page }) => {

  // ── 1. Load questions from CSV ────────────────────────────────────────────
  const questions = readQuestionsCsv(appConfig.inputCsvPath);
  expect(questions.length, 'Input CSV must contain at least one question').toBeGreaterThan(0);

  // ── 2. Login ──────────────────────────────────────────────────────────────
  const loginPage = new LoginPage(page);
  await loginPage.navigateAndLogin();

  // ── 3. Open chatbot ───────────────────────────────────────────────────────
  const chatbot = new ChatbotPage(page);
  await chatbot.openChatbot();

  // ── 4. Ask each question sequentially ────────────────────────────────────
  for (const { id, question, category } of questions) {
    logger.separator();
    logger.info(`[${id}]  Q: "${question}"`);

    let result: ResultRow;

    try {
      const { answer, responseTimeMs } = await chatbot.ask(question);

      // Assert we received a non-empty reply
      expect(
        answer.length,
        `[${id}] Chatbot returned an empty answer`,
      ).toBeGreaterThan(0);

      result = {
        id,
        question,
        category,
        answer,
        status: 'success',
        responseTimeMs,
        timestamp: new Date().toISOString(),
      };

    } catch (err) {
      const isTimeout = err instanceof Error && err.message.toLowerCase().includes('timeout');
      const status    = isTimeout ? 'timeout' : 'error';
      const errorMsg  = err instanceof Error ? err.message : String(err);

      logger.error(`[${id}] ${status.toUpperCase()} — ${errorMsg}`);

      result = {
        id,
        question,
        category,
        answer: '',
        status,
        responseTimeMs: 0,
        timestamp: new Date().toISOString(),
        errorMessage: errorMsg,
      };
    }

    // Write every row immediately so partial results are never lost
    csvWriter.write(result);

    // Pause between questions (rate-limit protection, lets chat state settle)
    if (appConfig.interQuestionDelayMs > 0) {
      await page.waitForTimeout(appConfig.interQuestionDelayMs);
    }
  }
});
