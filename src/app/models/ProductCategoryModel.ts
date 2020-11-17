import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class ProductCategoryModel {
  CrmId: Guid = null;
  MainCategoryId: Guid = null;
  MainCategoryName: string = null;
  Name: string = null
}
