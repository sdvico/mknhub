import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWeatherReportDto {
  @ApiProperty({
    description: 'Region name for the weather report',
    example: 'Vùng biển Phú Quốc - Cà Mau',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  region: string;

  @ApiProperty({
    description: 'Weather summary',
    example:
      'Gió Đông Bắc cấp 6-7, giật cấp 8-9. Biển động mạnh. Sóng biển cao từ 2.0-4.0m.',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  summary: string;

  @ApiPropertyOptional({
    description: 'Weather advice for mariners',
    example:
      'Tàu thuyền nhỏ không nên ra khơi. Tàu thuyền đang hoạt động trên biển cần thường xuyên theo dõi thông tin thời tiết và có biện pháp đảm bảo an toàn.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  advice?: string;

  @ApiPropertyOptional({
    description: 'Link to detailed weather information',
    example: 'https://nchmf.gov.vn/Kttvs/vung-bien-phu-quoc-ca-mau',
  })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiPropertyOptional({
    description: 'Cloud and rain conditions',
    example: 'Có mây, không mưa',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cloud?: string;

  @ApiPropertyOptional({
    description: 'Rain conditions',
    example: 'Không mưa',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  rain?: string;

  @ApiPropertyOptional({
    description: 'Wind conditions',
    example: 'Gió Đông Bắc cấp 3-4',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  wind?: string;

  @ApiPropertyOptional({
    description: 'Wave conditions',
    example: 'Sóng cao 1-2m',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  wave?: string;

  @ApiPropertyOptional({
    description: 'Visibility conditions',
    example: 'Tầm nhìn xa 8-12km',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  visibility?: string;

  @ApiPropertyOptional({
    description: 'Detailed recommendations for mariners',
    example:
      'Thời tiết thuận lợi cho hoạt động đánh cá. Tàu thuyền có thể ra khơi an toàn.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  recommendation?: string;

  @ApiPropertyOptional({
    description: 'Whether the weather report is enabled',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enable?: boolean;

  @ApiPropertyOptional({
    description: 'Publication date and time',
    example: '2024-01-01T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  published_at?: string;
}
