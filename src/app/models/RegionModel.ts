import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class RegionModel {
  CrmId: Guid = null;
  CityId: Guid = null;
  Name: string = null;
  PostalCode: string = null;
}
