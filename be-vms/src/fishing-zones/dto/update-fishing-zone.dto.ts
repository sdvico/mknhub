import { PartialType } from '@nestjs/mapped-types';
import { CreateFishingZoneDto } from './create-fishing-zone.dto';

export class UpdateFishingZoneDto extends PartialType(CreateFishingZoneDto) {}
