import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export function assertValidMongoId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('Invalid ID format');
  }
}