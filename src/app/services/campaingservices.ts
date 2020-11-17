import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of, forkJoin } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators'
import { PromoResponseMessage } from '../models/PromoResponseModel';
import { identifierModuleUrl } from '@angular/compiler';
import { CampaignModel } from '../models/CampaingModel';

@Injectable()
export class CampaignService {
  url: string = "http://localhost:6060/api/";

  constructor(private http: HttpClient) {
  }

  multipleApiCallFunction(): Observable<any[]> {
    const _getCampaigns = this.getCampaigns();
    const _getCities = this.getCities();
    const _getRegion = this.getRegion();
    const _getStores = this.getStores();

    return forkJoin([_getCampaigns, _getCities, _getRegion, _getStores]);
  }

  async getCampaigns(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCampaignList", { headers: hea }).toPromise();
  }

  async getCities(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "City/Get", { headers: hea }).toPromise();
  }

  async getRegion(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "City/Get", { headers: hea }).toPromise();
  }

  async getCountries(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Country/Get", { headers: hea }).toPromise();
  }

  async getCompanyMacroSegments(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCompanyMacroSegment", { headers: hea }).toPromise();
  }

  async getCompanyCardTypes(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCompanyCardType", { headers: hea }).toPromise();
  }

  async getPromoClusters(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetPromoCluster", { headers: hea }).toPromise();
  }

  async getPromoGroups(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetPromoGroup", { headers: hea }).toPromise();
  }

  async getPriceStrategies(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetPriceStrategy", { headers: hea }).toPromise();
  }

  async getPromoTypes(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetPromoType", { headers: hea }).toPromise();
  }

  async getInvRfmSegments(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetRfmSegment", { headers: hea }).toPromise();
  }

  async getInvMacroSegments(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetMacroSegment", { headers: hea }).toPromise();
  }

  async getInvMicroSegments(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetMicroSegment", { headers: hea }).toPromise();
  }

  async getCardTypes(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCardType", { headers: hea }).toPromise();
  }

  async getApprovals(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetApproval", { headers: hea }).toPromise();
  }

  async  getSmsParticipations(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetSmsParticipation", { headers: hea }).toPromise();
  }

  async getCampaignChannels(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCampaignChannel", { headers: hea }).toPromise();
  }

  async  getStores(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Store/GetAllActiveStore", { headers: hea }).toPromise();
  }

  async getStoresV2(): Promise<any> {

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Store/GetAllActiveStore", { headers: hea }).toPromise();
  }

  async getStoreSegments(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Store/GetStoreSegment", {headers: hea }).toPromise();
  }

  async getStoreTypes(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Store/GetStoreType", {headers: hea}).toPromise();
  }

  async getStoreGroups(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Store/GetStoreGroup", { headers: hea}).toPromise();
  }

  async getCampaignStatus(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetStatus", {headers: hea}).toPromise();
  }

  async getCompanies(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCompany", { headers: hea}).toPromise();
  }

  async getEndpointValue(variable): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'GET');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/" + variable, { headers: hea }).toPromise();
  }

  async getProducts(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Product/GetProducts", { headers: hea }).toPromise();
  }

  async  getProductCategories(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Product/GetProductCategory", { headers: hea}).toPromise();
  }

  async getPurchaseHistories(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetPurchaseHistory", { headers: hea}).toPromise();
  }

  async getAmountEqualTypes(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetAmountEqualType", { headers: hea}).toPromise();
  }

  async getBonusActivations(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetBonusActivation", {headers: hea }).toPromise();
  }

  async getBonusEveryAfterAccrualMonths(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return this.http.get(this.url + "Campaign/GetBonusEveryAfterAccrualMonth", { headers: hea}).toPromise();
  }

  async getBonusEveryAfterAccuralDays(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetBonusEveryAfterAccuralDay", { headers: hea}).toPromise();
  }

  async getBonusEveryAfterAccuralWeeks(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetBonusEveryAfterAccuralWeek", { headers: hea}).toPromise();
  }

  async getBonusExpirations(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetBonusExpiration", { headers: hea}).toPromise();
  }

  async getBonusExpirationTypes(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetBonusExpirationType", { headers: hea}).toPromise();
  }


  async getCashBackActivations(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCashBackActivation", { headers: hea }).toPromise();
  }

  async getCashBackEveryAfterAccrualMonths(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCashBackEveryAfterAccuralMonth", {
      headers: hea
    }).toPromise();
  }

  async getCashBackEveryAfterAccuralDays(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCashBackEveryAfterAccrualDay", {headers: hea }).toPromise();
  }

  async getCashBackEveryAfterAccuralWeeks(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetCashBackEveryAfterAccrualWeek", {headers: hea }).toPromise();
  }

  async getDiscountDistributaions(): Promise<any> {
    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get(this.url + "Campaign/GetDiscountDistributaion", {headers: hea}).toPromise();
  }

  async getPeriodTypes() {
    debugger;
    let retVal = new PromoResponseMessage();

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Get');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.get<PromoResponseMessage>(this.url + "Campaign/GetPeriodType", { headers: hea }).toPromise();
  }

  async createOrUpdateCampaign(campaign : CampaignModel ) {

    debugger;

    const hea = new HttpHeaders();
    hea.append('Access-Control-Allow-Headers', 'Content-Type');
    hea.append('Access-Control-Allow-Methods', 'Post');
    hea.append('Access-Control-Allow-Origin', '*');
    hea.append('Content-Type', 'application/xml');

    return await this.http.post<PromoResponseMessage>(this.url + "Campaign/CreateOrUpdateCampaign", campaign, { headers: hea }).toPromise().then(

      data => {
        debugger;
        if (data.IsSuccess) {
          alert("Ok!");
        } else {
          alert(data.ResultMessage);
        }
      });
  }


  handleError(error) {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;

    } else {

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
