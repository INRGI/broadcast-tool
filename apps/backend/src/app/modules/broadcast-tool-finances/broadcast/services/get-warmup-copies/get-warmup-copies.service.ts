import { Injectable } from '@nestjs/common';
import { GetWarmupCopiesPayload } from './get-warmup-copies.payload';
import { GetCopiesWarmupService } from '../../../bigQuery/services/get-copies-warmup/get-copies-warmup.service';

@Injectable()
export class GetWarmupCopiesService {
  constructor(
    private readonly getCopiesWarmupService: GetCopiesWarmupService
  ) {}

  public async execute(payload: GetWarmupCopiesPayload): Promise<string[]> {
    const { daysBeforeInterval } = payload;

    const { data } = await this.getCopiesWarmupService.execute({
      daysBefore: daysBeforeInterval,
    });

    const filteredCopies = data.filter((copy) => {
      return (
        !isNaN(Number(this.extractLift(copy.Copy))) &&
        this.extractLift(copy.Copy) !== '00'
      );
    });

    return filteredCopies.map((copy) => copy.Copy);
  }

  private extractLift(copyName: string): string {
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : '';
    return productLift;
  }
}
