import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class StoreCriteriaModel {
  CompanyId: Guid[] =[];
  CountryId: Guid[] =[];
  CityId: Guid[] =[];
  RegionId: Guid[] =[];
  StoreSegmentId: Guid[] =[];
  StoreGroupId: Guid[] =[];
  StoreTypeId: Guid[] =[];
}
