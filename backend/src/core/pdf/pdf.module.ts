import { Module } from '@nestjs/common';
import { PdfParserService } from './pdf-parser.service';

@Module({
  providers: [PdfParserService],
  exports: [PdfParserService],
})
export class PdfModule {}
