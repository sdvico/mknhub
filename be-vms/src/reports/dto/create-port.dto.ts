import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePortDto {
  @ApiProperty({ description: 'Port code (primary key)', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  code!: string;

  @ApiProperty({ description: 'Port name', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: 'LoCode', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  loCode!: string;

  @ApiPropertyOptional({ description: 'Latitude' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  lat?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  lng?: number;

  @ApiPropertyOptional({ description: 'TCTS code', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  TCTS_Code?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Phone', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  phone?: string;

  @ApiPropertyOptional({ description: 'Fax', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fax?: string;

  @ApiPropertyOptional({ description: 'Email', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Contact person', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contact?: string;

  @ApiPropertyOptional({ description: 'Contact phone', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Description', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  description?: string;
}
