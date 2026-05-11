import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class PdfParserService {
  async parse(buffer: Buffer) {
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    const rawText = parsed.text ?? '';
    const cleanedText = rawText
      .replace(/\r/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    return {
      pageCount: parsed.total ?? 0,
      rawText,
      cleanedText,
    };
  }
}
