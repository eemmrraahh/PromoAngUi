import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class ProductModel {
  CrmId: Guid = null;
  ProductCategoryId: Guid = null;
  ProductCategoryName: string = null;
  Name: string = null;
  ProductCode: string = null;
}
