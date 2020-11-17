import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable()
export class CountryModel {
  CrmId: Guid = null;
  Name: string = null;
  Code: string = null;
}
