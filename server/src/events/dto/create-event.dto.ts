import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELED = 'CANCELED',
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsNotEmpty()
  capacity: number;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
