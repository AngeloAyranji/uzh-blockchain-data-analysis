import { Injectable } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class ArithmeticService {
  add(x: string, y: string): string {
    return new BigNumber(x).plus(new BigNumber(y)).toString();
  }

  sub(x: string, y: string): string {
    return new BigNumber(x).minus(new BigNumber(y)).toString();
  }

  mul(x: string, y: string): string {
    return new BigNumber(x).times(new BigNumber(y)).toString();
  }

  div(x: string, y: string): string {
    return new BigNumber(x).div(new BigNumber(y)).toString();
  }

  gt(x: string, y: string): boolean {
    return new BigNumber(x).gt(new BigNumber(y));
  }

  gte(x: string, y: string): boolean {
    return new BigNumber(x).gte(new BigNumber(y));
  }

  lt(x: string, y: string): boolean {
    return new BigNumber(x).lt(new BigNumber(y));
  }

  lte(x: string, y: string): boolean {
    return new BigNumber(x).lte(new BigNumber(y));
  }

  pow(x: string, y: number): string {
    return new BigNumber(x).pow(y).toString();
  }
}