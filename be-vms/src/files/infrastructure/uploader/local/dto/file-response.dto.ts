import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../../../../domain/file';

export class FileResponseDto {
  @ApiProperty({
    description: 'Thông tin file đã upload',
    example: {
      id: 'uuid-file-1234-5678-9012',
      path: '/uploads/files/document_2024_12_01.pdf',
      originalName: 'my_document.pdf',
      mimeType: 'application/pdf',
      size: 1024000,
    },
    type: () => FileType,
  })
  file: FileType;
}
