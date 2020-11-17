import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class PromoResponseMessage {
  IsSuccess: boolean = false;
  ResultMessage: string = null;
  Result: any = null
}
