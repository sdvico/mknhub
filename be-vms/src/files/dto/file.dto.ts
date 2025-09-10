import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileDto {
  @ApiProperty({
    description: 'ID của file',
    example: 'uuid-file-1234-5678-9012',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Đường dẫn đến file',
    example: '/uploads/files/document_2024_12_01.pdf',
    type: String,
  })
  path: string;
}
