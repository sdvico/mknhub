import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedbackStatus } from '../entities/feedback.entity';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Feedback content',
    example: 'The app is working great! I really like the new features.',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'ID of the user who submitted the feedback',
    example: '57B49DE2-4C82-47F7-9D47-9F28349661C7',
  })
  @IsNotEmpty()
  @IsUUID()
  reporter_id: string;

  @ApiPropertyOptional({
    description: 'Status of the feedback',
    enum: FeedbackStatus,
    example: FeedbackStatus.NEW,
  })
  @IsOptional()
  @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;
}
