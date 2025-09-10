import { ApiProperty } from '@nestjs/swagger';
import { FeedbackStatus } from '../entities/feedback.entity';

export class CreateFeedbackResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Feedback created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Created feedback data',
    example: {
      id: '57B49DE2-4C82-47F7-9D47-9F28349661C9',
      content: 'The app is working great! I really like the new features.',
      reporter_id: '57B49DE2-4C82-47F7-9D47-9F28349661C7',
      status: FeedbackStatus.NEW,
      created_at: '2024-01-01T10:30:00.000Z',
      updated_at: '2024-01-01T10:30:00.000Z',
    },
  })
  data: {
    id: string;
    content: string;
    reporter_id: string;
    status: FeedbackStatus;
    created_at: Date;
    updated_at: Date;
  };
}
