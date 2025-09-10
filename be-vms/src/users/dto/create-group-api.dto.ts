import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupApiDto {
  @ApiProperty({
    description: 'Name of the group',
    example: 'Nhóm tàu cá Phú Quốc',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
