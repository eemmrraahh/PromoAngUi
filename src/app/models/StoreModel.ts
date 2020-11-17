import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class StoreModel {
  CrmId: Guid = null;
  StoreId: string = null;
  Name: string = null;
  ExCode: string = null;
  RegionId: Guid = null;
  RegionName: string = null;
  CityId: Guid = null;
  CityName: string = null;
  CountryId: Guid = null;
  CountryName: string = null;
  StoreSegmentId: Guid = null;
  StoreSegmentName: string = null;
  StoreTypeId: Guid = null;
  StoreTypeName: string = null;
  StoreGroupId: Guid = null;
  StoreGroupName: string = null;
  CompanyId: Guid = null;
  CompanyName: string = null;
}
