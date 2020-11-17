import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { StoreModel } from './StoreModel';
import { OptionsModel } from './OptionsModel';
import { ClusterItemModel } from './ClusterItemModel';
import { ProductModel } from './ProductModel';

@Injectable()
export class CampaignModel {
  CampaignId: Guid = null;
  CampaingId2: string = null;
  CampaignName: string = null;
  CampaignStartDate: string = null;
  CampaignEndDate: string = null;
  CampaignStartTime: string = null;
  CampaignEndTime: string = null;
  Channel: OptionsModel[] = null;
  Statu: OptionsModel = null;
  AllDays: boolean = false;
  Monday: boolean = false;
  Tuesday: boolean = false;
  Wednesday: boolean = false;
  Thursday: boolean = false;
  Friday: boolean = false;
  Saturday: boolean = false;
  Sunday: boolean = false;
  AllHour: boolean = false;
  ToleranceTime: Number = null;
  SmsParticipation: OptionsModel = null;
  ParticipationCode: string = null;
  ParticipationNumber: string = null;
  Approval: OptionsModel = null;
  ApprovedBy: string = null;
  InvMicroSegment: OptionsModel[] = null;
  InvMacroSegment: OptionsModel[] = null;
  InvCardType: OptionsModel[] = null;
  InvRfmSegment: OptionsModel[] = null;
  CompanyCardType: OptionsModel[] = null;
  CompanyMacroSegment: OptionsModel[] = null;
  Stores: StoreModel[] = [];
  Products: ProductModel[] = [];

  ExcludedStores: StoreModel[] = [];
  ExcludedProducts: ProductModel[] = [];

  PromoCluster: OptionsModel = null;
  PromoType: OptionsModel = null;
  PromoGroup: OptionsModel = null;
  PriceStrategy: OptionsModel = null;

  ClusterItems: ClusterItemModel[] = [];
  AllowRepeatAction: boolean = false;
  PurchaseHistoryType: OptionsModel = null;
  PurchaseHistoryValue: Number = null;
  AmountEqualType: OptionsModel = null;
  AmountEqualValue: Number = null;

  ExcludeMembers: string = null;
  BonusAccrualPercentage: Number = null;
  BonusFixedValue: Number = null;
  BonusRedemptionValue: Number = null;
  BonusActivation: OptionsModel = null;
  BonusExpiration: OptionsModel = null;
  BonusExpirationType: OptionsModel = null;
  BonusExpirationValue: Number = null;
  
  BonusEveryAfterAccrualMonth: OptionsModel[] = null;
  BonusEveryAfterAccrualWeek: OptionsModel[] = null;
  BonusEveryAfterAccrualDay: OptionsModel[] = null;
  BonusDeferredTime: string = null;
  BonusEveryAfterAccrualTime: string = null;

  CashBackAccrualPercentage: Number = null;
  CashBackFixedValue: Number = null;
  CashBackActivation: OptionsModel = null;
 
  CashBackEveryAfterAccrualMonth: OptionsModel[] = null;
  CashBackEveryAfterAccrualWeek: OptionsModel[] = null;
  CashBackEveryAfterAccrualDay: OptionsModel[] = null;
  CashBackDeferredTime: string = null;
  CashBackEveryAfterAccrualTime: string = null;

  Sub: Number = null;
  Order: Number = null;
  Super: Number = null;
  DiscountDistribution: OptionsModel = null;
  MaxDiscountAmount: Number = null;
  AmountLimit: Number = null;
  CountLimit: Number = null;
  MemberParticipationLimit: Number = null;
  PeriodType: OptionsModel = null;
  Period: Number = null;
  MinOfDailyTRX : Number = null;
  MaxOfDailyTRX: Number = null;
  OfBenefit: Number = null;
  MaxOfBenefitAllowedPerDay: Number = null;
  MaxOfBenefitAllowedPerTRX: Number = null;
  MaxOfTRXAllowed: Number = null;
  StandardBonusAccumulation: boolean = false;

  MinAmountValue: Number = null;
  MaxAmountValue: Number = null;

}

