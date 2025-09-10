import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFishingZoneDto {
  @ApiProperty({
    description: 'Title of the fishing zone',
    example: 'Vùng đánh cá Phú Quốc',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the fishing zone',
    example:
      'Vùng đánh cá phía Nam đảo Phú Quốc, thích hợp cho đánh bắt cá ngừ và cá thu.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL to more information or map',
    example: 'https://example.com/fishing-zones/phu-quoc',
  })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiPropertyOptional({
    description: 'Whether the fishing zone is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enable?: boolean;

  @ApiPropertyOptional({
    description: 'When this fishing zone information was published',
    example: '2024-03-20T08:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  published_at?: string;
}
