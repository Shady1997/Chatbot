import * as fs from 'fs';
import * as path from 'path';

/**
 * Knowledge Base Loader
 * Extracts content from PDF, Markdown, and DOCX files
 */

export interface KnowledgeBase {
  content: string;
  sources: Map<string, string>;
}

export async function loadKnowledgeBase(knowledgeDir: string): Promise<KnowledgeBase> {
  const sources = new Map<string, string>();
  let combinedContent = '';

  if (!fs.existsSync(knowledgeDir)) {
    console.warn(`Knowledge base directory not found: ${knowledgeDir}`);
    return { content: '', sources };
  }

  const files = fs.readdirSync(knowledgeDir);

  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);
    const fileExt = path.extname(file).toLowerCase();

    try {
      let content = '';

      if (fileExt === '.md') {
        // Markdown files can be read directly
        content = fs.readFileSync(filePath, 'utf-8');
      } else if (fileExt === '.pdf') {
        // For PDF files, extract text (basic extraction)
        content = extractTextFromPDF(filePath);
      } else if (fileExt === '.docx') {
        // For DOCX files, extract text
        content = extractTextFromDOCX(filePath);
      }

      if (content) {
        sources.set(file, content);
        combinedContent += `\n\n--- Source: ${file} ---\n${content}`;
      }
    } catch (error) {
      console.warn(`Failed to load knowledge file ${file}:`, error);
    }
  }

  return { content: combinedContent, sources };
}

/**
 * Basic PDF text extraction (placeholder)
 * In production, use 'pdf-parse' or similar library
 */
function extractTextFromPDF(filePath: string): string {
  try {
    // For now, return a placeholder
    // Install 'pdf-parse' for production: npm install pdf-parse
    const pdfParse = require('pdf-parse');
    const pdfBuffer = fs.readFileSync(filePath);
    
    return pdfParse(pdfBuffer).then((data: any) => data.text);
  } catch {
    console.warn(`PDF parsing not available. Please install 'pdf-parse': npm install pdf-parse`);
    return '';
  }
}

/**
 * Basic DOCX text extraction (placeholder)
 * In production, use 'docx-parser' or similar library
 */
function extractTextFromDOCX(filePath: string): string {
  try {
    // For now, return a placeholder
    // Install 'docx-parser' for production: npm install docx-parser
    const docxParse = require('docx-parser');
    const parser = new docxParse.DocxParser({
      filePath: filePath,
    });

    return parser.parseSync().documentContent;
  } catch {
    console.warn(`DOCX parsing not available. Please install 'docx-parser': npm install docx-parser`);
    return '';
  }
}

export function splitIntoChunks(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const lines = text.split('\n');
  let currentChunk = '';

  for (const line of lines) {
    if ((currentChunk + line).length > chunkSize) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}
