
export enum PromoCluster {
  Discount = 1,
  Bonus = 2,
  CashBack = 3
}

export enum PromoType {

  Monetary = 1,
  Quantitative = 2,
  Basic = 3,
  Plus = 4,
}

export enum PromoGroup {

  BundleSetDiscount = 1,
  BuyXGetY = 2,
  BulkTieredDiscounts = 3,
  StoreWideDiscount = 4,
  ProductDiscount = 5,
  DiscountBasedOnPreviousPurchases = 6,
  BogoSameProduct = 7,
  BuyOneGetOne = 8,
  ProductDependent = 9,
  BogoCategoryDiscount = 10,
  CategorySpecificDiscount = 11,
  FixPricePerUnit = 12,
  Group = 13,
  Conditional = 14,
  Basic = 15,
  Plus = 16,
  SubtotalWOProduct = 17,
  MultipleBOGO = 18,
}

export enum PriceStrategy {

  PercentageDiscount = 1,
  FixPricePerUnit = 2,
  PriceDiscount = 3,
  BundleSetDiscount = 4,
  BuyXGetXSameProduct = 5,
  BuyXGetYCheapestAmongAllItemsInBasket = 6,
  BuyXGetYCheapestAmongAllCategoryInBasket = 7,
  BuyXGetYSelectedCategoriesCheapestinBasket = 8,
  Basic = 9,
  Plus = 10,
  AmountOffPercentOff = 11
}

export enum BonusActivation {
  RealTime = 1,
  Deferred = 2,
  EveryAfterAccrual = 3
}

export enum BonusExpiration {
  Yes = 1,
  No = 2
}

export enum CashBackActivation {
  RealTime = 1,
  Deferred = 2,
  EveryAfterAccrual = 3
}

export enum SmsParticipation {
  Yes = 1,
  No = 2
}

export enum Approval {
  Yes = 1,
  No = 2
}
