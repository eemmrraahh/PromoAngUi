import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class ClusterItemModel {
  CrmId?: Guid = null;
  ItemId?: Guid = null;
  MinQuantity?: Number = null;
  MaxQuantity?: Number = null;
  ItemQuantity?: Number = null
  Products?: string = null;
  ProductCategories?: string = null;
  Value?: Number = null;
  MinSpending?: Number = null;
  MaxSpending?: Number = null;
  AmountOff?: Number = null;
  PercentOff?: Number = null;
  Quantity?: Number = null;
  FreeQuantity?: Number = null;
}
