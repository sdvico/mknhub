import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    description: 'Tên file cần upload',
    example: 'document_report.pdf',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'Kích thước file (bytes)',
    example: 1024000,
  })
  @IsNumber()
  fileSize: number;
}
