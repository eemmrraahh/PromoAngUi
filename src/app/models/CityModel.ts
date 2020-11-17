import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class CityModel {
  CrmId: Guid = null;
  CountryId: Guid = null;
  Name: string = null;
  Code: string = null;
}
