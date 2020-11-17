import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class StoreTypeModel {
  public CrmId?: Guid = null;
  public Name?: string = null;
  public ExCode?: string = null;
}
