export interface Strategy {
  domain: string;
  copiesTypes: Array<'click' | 'conversion' | 'test' | 'warmup'>;
}
