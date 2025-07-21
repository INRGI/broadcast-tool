import { Injectable } from '@nestjs/common';
import { GetClickableCopiesPayload } from './get-clickable-copies.payload';
import { GetCopiesWithClicksService } from '../../../bigQuery/services/get-copies-with-clicks/get-copies-with-clicks.service';

@Injectable()
export class GetClickableCopiesService {
  constructor(
    private readonly getCopiesWithClicksService: GetCopiesWithClicksService
  ) {}

  public async execute(payload: GetClickableCopiesPayload): Promise<string[]> {
    const { daysBeforeInterval } = payload;

    const clickableCopies = await this.getCopiesWithClicksService.execute({
      daysBefore: daysBeforeInterval,
    });

    const filteredClickableCopies = clickableCopies.data.filter((copy) => {
      return (
        !copy.Copy.includes('_SA') &&
        !isNaN(Number(this.extractLift(copy.Copy))) &&
        this.extractLift(copy.Copy) !== '00'
      );
    });

    return filteredClickableCopies.map((copy) => copy.Copy);
  }

  private extractLift(copyName: string): string {
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : '';
    return productLift;
  }
}
