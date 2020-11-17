import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, DebugElement } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct, NgbTimeStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import KTWizard from '../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../assets/js/components/util';
import { CampaignService } from '../../../services/campaingservices';
import { OptionsModel } from '../../../models/OptionsModel';
import { CampaignModel } from '../../../models/CampaingModel';
import { Guid } from 'guid-typescript';
import { StoreCriteriaModel } from '../../../models/StoreCriteriaModel';
import { CompanyModel } from '../../../models/CompanyModel';
import { CityModel } from '../../../models/CityModel';
import { CountryModel } from '../../../models/CountryModel';
import { RegionModel } from '../../../models/RegionModel';
import { StoreSegmentModel } from '../../../models/StoreSegmentModel';
import { StoreGroupModel } from '../../../models/StoreGroupModel';
import { StoreTypeModel } from '../../../models/StoreTypeModel';
import { MatTableDataSource, MatTable } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { ChangeDetectorRef } from '@angular/core';
import { StoreModel } from '../../../models/StoreModel';
import { NgxSpinnerService } from "ngx-spinner";
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TodoItemFlatNode, TodoItemNode, ChecklistDatabase } from '../../../models/StoreHierarchyModel';
import { from } from 'rxjs';
import { filter, distinct, map, last } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import { PromoCluster, PriceStrategy, PromoGroup, PromoType, BonusActivation, BonusExpiration, CashBackActivation, SmsParticipation, Approval } from '../../../models/Enums';
import { MatDialog } from '@angular/material/dialog';
import { ClusterItemModel } from '../../../models/ClusterItemModel';
import { ProductModel } from '../../../models/ProductModel';
import { ProductCategoryModel } from '../../../models/ProductCategoryModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})

export class WizardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('currentCrmIdPassWizard') camp: CampaignModel;
  @ViewChild(MatSort) sort: MatSort;
  storeCriteria = new StoreCriteriaModel();
  public clusterItemDefination = new ClusterItemModel();
  clusterItems: ClusterItemModel[] = [];

  uploader: FileUploader = new FileUploader({ url: "api/your_upload", removeAfterUpload: false, autoUpload: true });
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;
  /** The new item's name */
  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  productTreeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  productTreeDataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  productChecklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  clusterItemColumns: string[] = ['MinSpending', 'MaxSpending', 'AmountOff', 'PercentOff', 'action'];
  displayedColumns: string[] = ['select', 'StoreId', 'Name', 'CountryName', 'CityName', 'StoreSegmentName', 'StoreTypeName', 'StoreGroupName'];
  displayedColumnsById: string[] = ['select', 'StoreId', 'Name', 'CountryName', 'CityName', 'StoreSegmentName', 'StoreTypeName', 'StoreGroupName'];
  displayedColumnsByIdExclude: string[] = ['select', 'StoreId', 'Name', 'CountryName', 'CityName', 'StoreSegmentName', 'StoreTypeName', 'StoreGroupName'];

  productDisplayedColumnsById: string[] = ['select', 'ProductCode', 'Name'];
  productDisplayedColumnsByIdExclude: string[] = ['select', 'ProductCode', 'Name'];

  storeDataSource;
  storeDataSourceById;
  storeDataSourceByIdExclude;
  productDataSourceById;
  productDataSourceByIdExclude;

  selection = new SelectionModel<Element>(true, []);
  selectionById = new SelectionModel<Element>(true, []);
  selectionByIdExclude = new SelectionModel<Element>(true, []);
  productSelectionById = new SelectionModel<Element>(true, []);
  productSelectionByIdExclude = new SelectionModel<Element>(true, []);

  submitted = false;
  wizard: any;
  SmsParticipationDivShow: boolean = false;
  IsApprovalDivShow: boolean = false;
  allDayChecked: boolean = false;
  disablePromoGroup: boolean = false;
  disablePriceStrategy: boolean = false;
  hideClusterItem: boolean = true;
  hideProductSelection: boolean = true;
  hideQuantityDefination: boolean = true;
  hideAllowRepeatAction: boolean = true;
  hideProductItemDefination: boolean = true;
  hidePurchaseHistory: boolean = true;
  hideAmountEqualType: boolean = true;
  hideDiscountItems: boolean = true;
  hideValuePercentage: boolean = true;
  hideBogoSameProduct: boolean = true;
  hideBogoCategoryDiscount: boolean = true;
  hideBonusActivation: boolean = true;
  hideBonusDeferredTime: boolean = true;
  hideBonusExpiration: boolean = true;
  hideBonusExpirationType: boolean = true;
  hideBnsAccuralPercentageFixedValue: boolean = true;
  hideBonusRedemptionValue: boolean = true;
  hideBonusEveryAfterAccrualProperties: boolean = true;
  hideCashBackActivation: boolean = true;
  hideCashBackDeferredTime: boolean = true;
  hideCashBackAccrualProperties: boolean = true;
  hideCashBackEveryAfterAccrualProperties: boolean = true;
  hideAmountEqualValue: boolean = true;
  hidePurchaseHistoryValue: boolean = true;

  campaignStartDate: NgbDateStruct;
  campaignEndDate: NgbDateStruct;
  campaignStartTime: NgbTimeStruct;
  campaignEndTime: NgbTimeStruct;
  bonusDeferredTime: NgbTimeStruct;
  bonusEveryAfterAccrualTime: NgbTimeStruct;
  cashBackDeferredTime: NgbTimeStruct;
  cashBackEveryAfterAccrualTime: NgbTimeStruct;

  campaignReviewStr: string = "";
  storeIdfilter: string = "";
  storeExcludeIdfilter: string = "";
  productIdfilter: string = "";
  productExcludeIdfilter: string = "";

  //OptionSetViewModels
  campaignChannelList: OptionsModel[] = [];
  campaignStatuList: OptionsModel[] = [];
  smsParticipationList: OptionsModel[] = [];
  invCardTypeList: OptionsModel[] = [];
  invMacroSegmentList: OptionsModel[] = [];
  invMicroSegmentList: OptionsModel[] = [];
  invRfmSegmentList: OptionsModel[] = [];
  promoClusterList: OptionsModel[] = [];
  promoTypeList: OptionsModel[] = [];
  filteredPromoTypeList: OptionsModel[] = [];
  promoGroupList: OptionsModel[] = [];
  filteredPromoGroupList: OptionsModel[] = [];
  priceStrategyList: OptionsModel[] = [];
  filteredPriceStrategyList: OptionsModel[] = [];
  filterPromoClusterList: OptionsModel[] = [];
  approvalList: OptionsModel[] = [];
  companyCardTypeList: OptionsModel[] = [];
  companyMacroSegmentList: OptionsModel[] = [];
  amountEqualTypeList: OptionsModel[] = [];
  purchaseHistoryList: OptionsModel[] = [];
  discountDistributionList: OptionsModel[] = [];
  periodTypeList: OptionsModel[] = [];

  //Bonus
  bonusActivationList: OptionsModel[] = [];
  bonusEveryAfterAccrualMonthList: OptionsModel[] = [];
  bonusEveryAfterAccuralDayList: OptionsModel[] = [];
  bonusEveryAfterAccuralWeekList: OptionsModel[] = [];
  bonusExpirationList: OptionsModel[] = [];
  bonusExpirationTypeList: OptionsModel[] = [];
  //CashBack
  cashBackActivationList: OptionsModel[] = [];
  cashBackEveryAfterAccrualMonthList: OptionsModel[] = [];
  cashBackEveryAfterAccuralDayList: OptionsModel[] = [];
  cashBackEveryAfterAccuralWeekList: OptionsModel[] = [];

  //Custom View Models
  productList: ProductModel[] = [];
  productCategoryList: ProductCategoryModel[] = [];
  storeList: StoreModel[] = null;
  storeListTree: StoreModel[] = null;
  companyList: CompanyModel[] = [];
  countryList: CountryModel[] = [];
  cityList: CityModel[] = [];
  regionList: RegionModel[] = [];
  storeSegmentList: StoreSegmentModel[] = [];
  storeGroupList: StoreGroupModel[] = [];
  storeTypeList: StoreTypeModel[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('Paginator2', { static: false }) paginator2: MatPaginator;
  @ViewChild('Paginator3', { static: false }) paginator3: MatPaginator;
  @ViewChild('Paginator4', { static: false }) paginator4: MatPaginator;
  @ViewChild('Paginator5', { static: false }) paginator5: MatPaginator;
  @ViewChild('wizard', { static: true }) el: ElementRef;
  @ViewChild('mytable', { static: true }) table: MatTable<ClusterItemModel[]>;

  constructor(private database: ChecklistDatabase, public dialog: MatDialog, private ngbDateParserFormatter: NgbDateParserFormatter, public snackBar: MatSnackBar,
    public _campaignService: CampaignService, private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService) {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.productTreeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.productTreeDataSource = new MatTreeFlatDataSource(this.productTreeControl, this.treeFlattener);

    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    this.database.productDataChange.subscribe(data => {
      this.productTreeDataSource.data = data;
    });
  }

  dateTimeToString(date: NgbDateStruct): string {

    return date.day.toString() + "/" + date.month.toString() + "/" + date.year.toString();
  }

  workingReviewsDaysToString(): string {
    var retVal = "";
    var days = [];

    if (this.camp.Monday == true) {
      days.push("Monday");
    }

    if (this.camp.Tuesday == true) {
      days.push("Tuesday");
    }

    if (this.camp.Wednesday == true) {
      days.push("Wednesday");
    }

    if (this.camp.Thursday == true) {
      days.push("Thursday");
    }

    if (this.camp.Friday == true) {
      days.push("Friday");
    }

    if (this.camp.Saturday == true) {
      days.push("Saturday");
    }

    if (this.camp.Sunday == true) {
      days.push("Sunday");
    }

    if (days.length) {
      for (var i = 0; i < days.length; i++) {

        if (days.length === Number(1)) {

          retVal = days[i];
        } else if ((days.length - 1) == i) {
          retVal += days[i];
        } else {
          retVal += days[i] + ', '
        }
      }
    } else {
      return " - ";
    }
    return retVal;
  }

  channelReviewToString(): string {
    var retVal = "";

    if (this.camp.Channel != null) {
      for (var i = 0; i < this.camp.Channel.length; i++) {

        if (this.camp.Channel.length === Number(1)) {

          retVal = this.camp.Channel[i].Name;
        } else if ((this.camp.Channel.length - 1) == i) {
          retVal += this.camp.Channel[i].Name;
        } else {
          retVal += this.camp.Channel[i].Name + ', '
        }
      }
    }
    else {
      retVal = ' - ';
    }
    return retVal;
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o1 == null || o2 == null) {
      return false;
    }
    return o1.Name === o2.Name && o1.Value === o2.Value;
  }

  //Remove selection if promo informations change
  refreshProductTree() {
    this.productSelectionById = new SelectionModel<Element>(true, []);
    this.productSelectionByIdExclude = new SelectionModel<Element>(true, []);
    this.checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
    this.productChecklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  }

  ngOnInit(): void {

    this.storeDataSource = new MatTableDataSource();
    this.storeDataSourceById = new MatTableDataSource();
    this.storeDataSourceByIdExclude = new MatTableDataSource();
    this.productDataSourceById = new MatTableDataSource();
    this.productDataSourceByIdExclude = new MatTableDataSource();
    this.setCampaignProperties();
  }

  ngAfterViewInit() {
    //Service 
    this.getDefinationsFromCrmCampaignService();

    // Initialize form wizard
    this.wizard = new KTWizard(this.el.nativeElement, {
      clickableSteps: true, startStep: 1
    });

    // Validation before going to next page
    this.wizard.on('change', (wizardObj) => {
      console.log("Campaign Information", this.camp);


      if (wizardObj.currentStep === 1) {
        //SNACKBAR TEST
        //if (this.camp.CampaignName === "" || this.camp.CampaignName === null || this.camp.CampaignName == "undefined") {
        //  this.openSnackBar("Campaign Name Cannot be null", "OK");
        //  this.openSnackBar("Campaign Name Cannot be null 2", "OK");
        //  wizardObj.stop();
        //}
      }
      if (wizardObj.currentStep === 2) {

      }

      if (wizardObj.currentStep === 3) {

      }
      if (wizardObj.currentStep === 4) {

      }
      if (wizardObj.currentStep === 5) {

      }
      if (wizardObj.currentStep === 6) {

      }
      if (wizardObj.getNewStep() === 7) {
        this.campaignReview()
      }


      if (wizardObj.getNewStep() === 3) {

      }

      // https://angular.io/guide/forms
      // https://angular.io/guide/form-validation

      //Wizard sekmeleri arasında kontrol burada yapılır.
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 1000);
    });

    //// Change event
    //this.wizard.on('change', () => {
    //  //Wizard sekmeleri arasında kontrol burada yapılır.
    //  setTimeout(() => {
    //    KTUtil.scrollTop();
    //  }, 500);
    //});

    this.cdr.detectChanges();
  }

  setCampaignProperties() {
    if (this.camp == null) {
      this.camp = new CampaignModel();
    } else {
      //Campaign Start and End Date
      var tempStartDate = this.camp.CampaignStartDate != null ? new Date(this.camp.CampaignStartDate) : null;
      var tempEndDate = this.camp.CampaignEndDate != null ? new Date(this.camp.CampaignEndDate) : null;
      this.campaignStartDate = tempStartDate != null ? { year: tempStartDate.getFullYear(), month: tempStartDate.getMonth() + 1, day: tempStartDate.getDate() } : null;
      this.campaignEndDate = tempEndDate != null ? { year: tempEndDate.getFullYear(), month: tempEndDate.getMonth() + 1, day: tempEndDate.getDate() } : null;
      //Campaign Start and End Time
      var startTimeArr = this.camp.CampaignStartTime != null ? this.camp.CampaignStartTime.split(":") : null;
      var endTimeArr = this.camp.CampaignEndTime != null ? this.camp.CampaignEndTime.split(":") : null;
      this.campaignStartTime = startTimeArr != null ? { hour: Number(startTimeArr[0]), minute: Number(startTimeArr[1]), second: Number(startTimeArr[2]) } : null;
      this.campaignEndTime = endTimeArr != null ? { hour: Number(endTimeArr[0]), minute: Number(endTimeArr[1]), second: Number(endTimeArr[2]) } : null;
      //Campaign Bonus Deffered Time and Accrual Time
      var bonusDeferredTimeArr = this.camp.BonusDeferredTime != null ? this.camp.BonusDeferredTime.split(":") : null;
      var bonusEveryAfterAccrualTimeArr = this.camp.BonusEveryAfterAccrualTime != null ? this.camp.BonusEveryAfterAccrualTime.split(":") : null;
      this.bonusDeferredTime = bonusDeferredTimeArr != null ? { hour: Number(bonusDeferredTimeArr[0]), minute: Number(bonusDeferredTimeArr[1]), second: Number(bonusDeferredTimeArr[2]) } : null;
      this.bonusEveryAfterAccrualTime = bonusEveryAfterAccrualTimeArr != null ? { hour: Number(bonusEveryAfterAccrualTimeArr[0]), minute: Number(bonusEveryAfterAccrualTimeArr[1]), second: Number(bonusEveryAfterAccrualTimeArr[2]) } : null;

      //Campaign Cashback Deffered Time and Accrual Time
      var cashBackDeferredTimeArr = this.camp.CashBackDeferredTime != null ? this.camp.CashBackDeferredTime.split(":") : null;
      var cashBackEveryAfterAccrualTimeArr = this.camp.CashBackEveryAfterAccrualTime != null ? this.camp.CashBackEveryAfterAccrualTime.split(":") : null;
      this.cashBackDeferredTime = cashBackDeferredTimeArr != null ? { hour: Number(cashBackDeferredTimeArr[0]), minute: Number(cashBackDeferredTimeArr[1]), second: Number(cashBackDeferredTimeArr[2]) } : null;
      this.cashBackEveryAfterAccrualTime = cashBackEveryAfterAccrualTimeArr != null ? { hour: Number(cashBackEveryAfterAccrualTimeArr[0]), minute: Number(cashBackEveryAfterAccrualTimeArr[1]), second: Number(cashBackEveryAfterAccrualTimeArr[2]) } : null;

    }
  }

  onStoreTabChange() {
    //Check store values when tab changed
  }

  onSubmit() {

    this.camp.Stores = [];
    this.camp.ExcludedStores = [];
    this.camp.Products = [];
    this.camp.ExcludedProducts = [];

    this.storeDataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        if (this.camp.Stores.indexOf(row) == -1) {
          this.camp.Stores.push(row);
        }
      }
    });

    this.storeDataSourceById.data.forEach(row => {

      if (this.selectionById.isSelected(row)) {

        if (this.camp.Stores.indexOf(row) == -1) {

          this.camp.Stores.push(row);
        }
      }
    });

    this.productDataSourceById.data.forEach(row => {
      if (this.productSelectionById.isSelected(row)) {
        if (this.camp.Products.indexOf(row) == -1) {
          this.camp.Products.push(row);
        }
      }
    });

    this.productDataSourceByIdExclude.data.forEach(row => {
      if (this.productSelectionByIdExclude.isSelected(row)) {
        if (this.camp.ExcludedProducts.indexOf(row) == -1) {
          this.camp.ExcludedProducts.push(row);
        }
      }
    });

    this.storeDataSourceByIdExclude.data.forEach(row => {
      if (this.selectionByIdExclude.isSelected(row)) {
        if (this.camp.ExcludedStores.indexOf(row) == -1) {
          this.camp.ExcludedStores.push(row);
        }
      }
    });

    this.treeControl.dataNodes.forEach(e => {
      if (this.checklistSelection.isSelected(e)) {
        if (e.itemNode.children == null) {
          var store = this.storeList.find(m => m.CrmId == e.itemNode.CrmId && e.itemNode.children == null);
          if (this.camp.Stores.indexOf(store) == -1) {
            this.camp.Stores.push(store);
          }
        }
      }
    });

    if (this.camp.SmsParticipation == null) {
      this.camp.SmsParticipation = this.smsParticipationList.find(e => e.Value == SmsParticipation.No);
    }
    if (this.camp.Approval == null) {
      this.camp.Approval = this.approvalList.find(e => e.Value == Approval.No);
    }

    var sor = JSON.stringify(this.camp);
    console.log(sor);
    this._campaignService.createOrUpdateCampaign(this.camp);

    console.log(this.camp);

    this.submitted = true;
  }

  ngOnDestroy() {
    this.wizard = undefined;
  }

  addClusterItem() {

    if (this.clusterItemDefination.MinSpending == null) {
      alert("Min Spending can not be null");
      return;
    }
    if (this.clusterItemDefination.MinSpending < 0) {
      alert("Min Spending can not be negative");
      return;
    }

    if (this.clusterItemDefination.MaxSpending == null) {
      alert("Max Spending can not be null");
      return;
    }

    if (this.clusterItemDefination.MaxSpending < 0) {
      alert("Max Spending can not be negative");
      return;
    }

    if (this.clusterItemDefination.AmountOff == null) {
      alert("Amount Off can not be null");
      return;
    }

    if (this.clusterItemDefination.AmountOff < 0) {
      alert("Amount Off can not be negative");
      return;
    }

    if (this.clusterItemDefination.PercentOff == null) {
      alert("Percent Off can not be null");
      return;
    }

    if (this.clusterItemDefination.PercentOff < 0) {
      alert("Percent Off can not be negative");
      return;
    }

    this.camp.ClusterItems.push({
      CrmId: null,
      ItemId: Guid.create(), MinSpending: this.clusterItemDefination.MinSpending,
      MaxSpending: this.clusterItemDefination.MaxSpending,
      AmountOff: this.clusterItemDefination.AmountOff,
      PercentOff: this.clusterItemDefination.PercentOff
    });
    this.camp.ClusterItems.reverse();
    this.clusterItemDefination = new ClusterItemModel();
  }

  deleteClusterItem(value) {
    this.camp.ClusterItems = this.camp.ClusterItems.filter(item => item.ItemId !== value);
  }

  addQuantityDefination() {

    if (this.clusterItemDefination.Value == null) {
      alert("Value can not be null");
      return;
    }
    if (this.clusterItemDefination.Quantity == null) {
      alert("Quantity can not be null");
      return;
    }
    this.camp.ClusterItems.push({ ItemId: Guid.create(), Value: this.clusterItemDefination.Value, Quantity: this.clusterItemDefination.Quantity });
    this.camp.ClusterItems.reverse();
    this.clusterItemDefination = new ClusterItemModel();
    console.log(this.camp.ClusterItems);
  }

  addProductClusterItem() {

    if (this.clusterItemDefination.MinQuantity == null) {
      alert("Min Quantity can not be null");
      return;
    }
    if (this.clusterItemDefination.MinQuantity < 0) {
      alert("Min Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.MaxQuantity == null) {
      alert("Max Quantity can not be null");
      return;
    }

    if (this.clusterItemDefination.MaxQuantity < 0) {
      alert("Max Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.ItemQuantity == null) {
      alert("Item can not be null");
      return;
    }

    if (this.clusterItemDefination.ItemQuantity < 0) {
      alert("Item can not be negative");
      return;
    }

    if (this.clusterItemDefination.Value == null) {
      alert("Value can not be null");
      return;
    }

    if (this.clusterItemDefination.Value < 0) {
      alert("Value can not be negative");
      return;
    }

    if (this.clusterItemDefination.Products == null) {
      alert("Products can not be null");
      return;
    }
    debugger;
    var searchString = [];
    var productFindError = false;
    if (this.clusterItemDefination.Products.indexOf(";") > -1) {
      searchString = this.clusterItemDefination.Products.split(";");
    }
    else {
      searchString[0] = this.clusterItemDefination.Products;
    }

    debugger;

    searchString.forEach(fil => {
      var filteredProduct = this.productList.filter(e => e.ProductCode == fil);
      if (!(filteredProduct.length > 0)) {
        alert("Can not find any product with " + fil + " code");
        productFindError = true;
        return;
      }
    })

    if (productFindError) {
      return;
    }


    this.camp.ClusterItems.push({
      CrmId: null,
      ItemId: Guid.create(),
      MinQuantity: this.clusterItemDefination.MinQuantity,
      MaxQuantity: this.clusterItemDefination.MaxQuantity,
      ItemQuantity: this.clusterItemDefination.ItemQuantity,
      Products: this.clusterItemDefination.Products,
      Value: this.clusterItemDefination.Value
    });
    this.camp.ClusterItems.reverse();
    this.clusterItemDefination = new ClusterItemModel();
  }

  addBogoSameProduct() {
    if (this.clusterItemDefination.MinQuantity == null) {
      alert("Min Quantity can not be null");
      return;
    }
    if (this.clusterItemDefination.MinQuantity < 0) {
      alert("Min Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.MaxQuantity == null) {
      alert("Max Quantity can not be null");
      return;
    }

    if (this.clusterItemDefination.MaxQuantity < 0) {
      alert("Max Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.FreeQuantity == null) {
      alert("Free Quantity can not be null");
      return;
    }

    if (this.clusterItemDefination.FreeQuantity < 0) {
      alert("Free Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.Value == null) {
      alert("Value can not be null");
      return;
    }

    if (this.clusterItemDefination.Value < 0) {
      alert("Value can not be negative");
      return;
    }

    this.camp.ClusterItems.push({
      CrmId: null,
      ItemId: Guid.create(),
      MinQuantity: this.clusterItemDefination.MinQuantity,
      MaxQuantity: this.clusterItemDefination.MaxQuantity,
      FreeQuantity: this.clusterItemDefination.FreeQuantity,
      Products: this.clusterItemDefination.Products,
      Value: this.clusterItemDefination.Value
    });
    this.camp.ClusterItems.reverse();
    this.clusterItemDefination = new ClusterItemModel();
  }

  addProductCategory() {
    if (this.clusterItemDefination.MinQuantity == null) {
      alert("Min Quantity can not be null");
      return;
    }
    if (this.clusterItemDefination.MinQuantity < 0) {
      alert("Min Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.MaxQuantity == null) {
      alert("Max Quantity can not be null");
      return;
    }

    if (this.clusterItemDefination.MaxQuantity < 0) {
      alert("Max Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.ItemQuantity == null) {
      alert("Item Quantity can not be null");
      return;
    }

    if (this.clusterItemDefination.ItemQuantity < 0) {
      alert("Item Quantity can not be negative");
      return;
    }

    if (this.clusterItemDefination.ProductCategories == null) {
      alert("Product Category can not be null");
      return;
    }

    if (this.clusterItemDefination.Value == null) {
      alert("Value can not be null");
      return;
    }

    if (this.clusterItemDefination.Value < 0) {
      alert("Value can not be negative");
      return;
    }

    this.camp.ClusterItems.push({
      CrmId: null,
      ItemId: Guid.create(),
      MinQuantity: this.clusterItemDefination.MinQuantity,
      MaxQuantity: this.clusterItemDefination.MaxQuantity,
      ItemQuantity: this.clusterItemDefination.ItemQuantity,
      ProductCategories: this.clusterItemDefination.ProductCategories,
      Value: this.clusterItemDefination.Value
    });
    this.camp.ClusterItems.reverse();
    this.clusterItemDefination = new ClusterItemModel();
  }

  addQuantityValueDefination() {
    if (this.clusterItemDefination.MinQuantity == null) {
      alert("Min Quantity can not be null");
      return;
    }
    if (this.clusterItemDefination.MaxQuantity == null) {
      alert("Max Quantity can not be null");
      return;
    }

    if (this.clusterItemDefination.Value == null) {
      alert("Value can not be null");
      return;
    }

    this.camp.ClusterItems.push({ ItemId: Guid.create(), Value: this.clusterItemDefination.Value, MaxQuantity: this.clusterItemDefination.MaxQuantity, MinQuantity: this.clusterItemDefination.MinQuantity });
    this.camp.ClusterItems.reverse();
    this.clusterItemDefination = new ClusterItemModel();
    console.log(this.camp.ClusterItems);
  }

  generateTreeViewForStoreList(storeList: StoreModel[]) {
    let l: TodoItemNode[] = [];
    let distCountryList = from(storeList).pipe(map((x) => { return { CrmId: x.CountryId, Name: x.CountryName } })).pipe(distinct((x) => x.CrmId && x.Name));
    distCountryList.forEach(country => {
      let companyList = from(storeList).pipe(filter((c) => c.CountryId == country.CrmId)).pipe(distinct(x => x.CompanyId));
      //City
      let l1: TodoItemNode[] = [];
      companyList.forEach(company => {
        let cityList = from(storeList).pipe(filter((c) => c.CountryId == company.CountryId &&
          c.CompanyId == company.CompanyId)).pipe(distinct(x => x.CityId));
        //Region
        let k: TodoItemNode[] = [];
        cityList.forEach(city => {
          let regionList = from(storeList).pipe(filter((c) => c.CountryId == company.CountryId &&
            c.CompanyId == company.CompanyId &&
            c.CityId == city.CityId)).pipe(distinct(x => x.RegionId));
          //Store Type
          let r: TodoItemNode[] = [];
          regionList.forEach(region => {
            let storeTypeList = from(storeList).pipe(filter((c) => c.CountryId == company.CountryId &&
              c.CompanyId == company.CompanyId &&
              c.CityId == city.CityId &&
              c.RegionId == region.RegionId)).pipe(distinct(x => x.StoreTypeId));

            let t: TodoItemNode[] = [];
            storeTypeList.forEach(sType => {
              let storeGroupList = from(storeList).pipe(filter((c) => c.CountryId == company.CountryId &&
                c.CompanyId == company.CompanyId &&
                c.CityId == city.CityId &&
                c.RegionId == region.RegionId &&
                c.StoreTypeId == sType.StoreTypeId)).pipe(distinct(x => x.StoreGroupId));

              let v: TodoItemNode[] = [];
              storeGroupList.forEach(sGroup => {
                let storeSegmentList = from(storeList).pipe(filter((c) => c.CountryId == company.CountryId &&
                  c.CompanyId == company.CompanyId &&
                  c.CityId == city.CityId &&
                  c.RegionId == region.RegionId &&
                  c.StoreTypeId == sType.StoreTypeId &&
                  c.StoreGroupId == sGroup.StoreGroupId)).pipe(distinct(x => x.StoreSegmentId));

                let y: TodoItemNode[] = [];
                storeSegmentList.forEach(sSegment => {
                  let tStoreList = from(storeList).pipe(filter((c) => c.CountryId == company.CountryId &&
                    c.CompanyId == company.CompanyId &&
                    c.CityId == city.CityId &&
                    c.RegionId == region.RegionId &&
                    c.StoreTypeId == sType.StoreTypeId &&
                    c.StoreGroupId == sGroup.StoreGroupId &&
                    c.StoreSegmentId == sSegment.StoreSegmentId)).pipe(distinct(x => x.CrmId));

                  let storeItem: TodoItemNode[] = [];
                  tStoreList.forEach(store => {
                    let storeTemp: TodoItemNode = { CrmId: store.CrmId, item: store.Name, children: null };
                    storeItem.push(storeTemp);
                  });
                  let yTemp: TodoItemNode = { CrmId: sSegment.StoreSegmentId, item: sSegment.StoreSegmentName, children: storeItem }
                  y.push(yTemp);
                });
                let vTemp: TodoItemNode = { CrmId: sGroup.StoreGroupId, item: sGroup.StoreGroupName, children: y }
                v.push(vTemp);
              });
              let tTemp: TodoItemNode = { CrmId: sType.StoreTypeId, item: sType.StoreTypeName, children: v }
              t.push(tTemp);
            });
            let rTemp: TodoItemNode = { CrmId: region.RegionId, item: region.RegionName, children: t }
            r.push(rTemp);
          });
          let kTemp: TodoItemNode = { CrmId: city.CityId, item: city.CityName, children: r };
          k.push(kTemp);
        });
        let l1Temp: TodoItemNode = { CrmId: company.CompanyId, item: company.CompanyName, children: k };
        l1.push(l1Temp);
      });
      let todoItem: TodoItemNode = { CrmId: country.CrmId, item: country.Name, children: l1 }
      l.push(todoItem);

    });
    this.database.dataChange.next(l);



  }

  generateTreeViewForProductList(pCategoryList: ProductCategoryModel[], productList: ProductModel[]) {
    var nodes: TodoItemNode[] = [];
    var mainList = from(pCategoryList).pipe(filter((x) => x.MainCategoryId == Guid.createEmpty()))
    mainList.forEach(main => {
      nodes = this.generateProductTreeNode(main, this.productCategoryList);
    });
    this.database.productDataChange.next(nodes);
  }

  generateProductTreeNode(row: ProductCategoryModel, list: ProductCategoryModel[]): TodoItemNode[] {

    var node = new TodoItemNode();
    node.CrmId = row.CrmId;
    node.item = row.Name;
    var filteredList = list.filter(e => e.MainCategoryId == row.CrmId);
    var retVal: TodoItemNode[] = [];

    if (filteredList.length > 0) {
      filteredList.forEach(e => {

        var nodeResult = this.generateProductTreeNode(e, list);
        if (nodeResult.length > 0) {
          node.children = nodeResult;
          retVal.push(node);
        }
      });
    } else {

      var productList = this.productList.filter((f) => f.ProductCategoryId == row.CrmId);
      if (productList.length > 0) {

        var products: TodoItemNode[] = [];
        for (var i = 0; i < productList.length; i++) {
          var currentProduct = new TodoItemNode();
          currentProduct.CrmId = productList[i].CrmId;
          currentProduct.item = productList[i].Name;
          products.push(currentProduct);
        }
        node.children = products;
        retVal.push(node);
      }
    }
    return retVal;
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';
  /**
 * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
 */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.itemNode = node;
    flatNode.level = level;
    if (node.children != null) {
      flatNode.expandable = !!node.children;
    }
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  productDescendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.productTreeControl.getDescendants(node);
    return descendants.every(child => this.productChecklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  productDescendantsPartiallySelected(node: TodoItemFlatNode): boolean {

    const descendants = this.productTreeControl.getDescendants(node);
    const result = descendants.some(child => this.productChecklistSelection.isSelected(child));
    return result && !this.productDescendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  productTodoItemSelectionToggle(node: TodoItemFlatNode): void {

    this.productChecklistSelection.toggle(node);
    const descendants = this.productTreeControl.getDescendants(node);
    this.productChecklistSelection.isSelected(node)
      ? this.productChecklistSelection.select(...descendants)
      : this.productChecklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

  filterPromoCluster() {
    this.filterPromoClusterList = this.promoClusterList.filter((pr) => pr.Value == PromoCluster.Bonus ||
      pr.Value == PromoCluster.Discount ||
      pr.Value == PromoCluster.CashBack);
  }

  disableCampGroupPriceSt(campGroup: boolean, priceSt: boolean) {
    this.disablePromoGroup = campGroup;
    this.disablePriceStrategy = priceSt;
  }

  hidePriceClusterItemDivs() {

    this.hideClusterItem = true;
    this.hideProductSelection = true;
    this.hideQuantityDefination = true;
    this.hideAllowRepeatAction = true;
    this.hideProductItemDefination = true;
    this.hideAmountEqualType = true;
    this.hidePurchaseHistory = true;
    this.hideDiscountItems = true;
    this.hideValuePercentage = true;
    this.hideBogoSameProduct = true;
    this.hideBogoCategoryDiscount = true;
  }

  showPercentage(str: string) {

    if (str.indexOf("(%)") > -1) {
      str = str.replace("(%)", "");
      str = str.trim();
    }

    if (this.hideValuePercentage) {
      return str;
    }
    return str + " (%)";
  }

  onPriceStrategyUpdateForm() {
    debugger;
    //Promo Cluster
    this.filterAndEnanblePropertiesOnPromoClusterChanged();
    //Promo Type
    this.filterAndEnanblePropertiesOnPromoTypeChanged();

    this.filterAndEnanblePropertiesOnPromoGroupChanged();

    this.onBonusExpirationChange();
    this.onBonusActivationChange();
  }

  clearPromoClusterControls() {

    this.camp.BonusAccrualPercentage = null;
    this.camp.BonusFixedValue = null;
    this.camp.BonusRedemptionValue = null;
    this.camp.BonusActivation = null;
    this.bonusDeferredTime = null;
    this.camp.BonusEveryAfterAccrualMonth = null;
    this.camp.BonusEveryAfterAccrualWeek = null;
    this.camp.BonusEveryAfterAccrualDay = null;
    this.bonusEveryAfterAccrualTime = null;
    this.camp.BonusExpiration = null;
    this.camp.BonusExpirationType = null;
    this.camp.BonusExpirationValue = null;


    this.camp.CashBackAccrualPercentage = null;
    this.camp.CashBackFixedValue = null;
    this.camp.CashBackActivation = null;
    this.cashBackDeferredTime = null;
    this.camp.CashBackEveryAfterAccrualMonth = null;
    this.camp.CashBackEveryAfterAccrualWeek = null;
    this.camp.CashBackEveryAfterAccrualDay = null;
    this.cashBackEveryAfterAccrualTime = null;

    this.productDataSourceById.data = this.productList;
    this.productDataSourceByIdExclude.data = this.productList;

    this.camp.PurchaseHistoryType = null;
    this.camp.PurchaseHistoryValue = null;

    this.camp.AmountEqualType = null;
    this.camp.AmountEqualValue = null;

  }

  onPromoClusterChange() {

    this.clearPromoClusterControls();

    this.camp.ClusterItems = [];
    this.hidePriceClusterItemDivs();
    this.hideBonusControls();
    this.hideCashBackControls();

    this.camp.PromoGroup = null;
    this.camp.PriceStrategy = null;
    this.camp.PromoType = null;

    this.filteredPromoTypeList = this.promoTypeList;
    this.filteredPromoGroupList = this.promoGroupList;
    this.filteredPriceStrategyList = this.priceStrategyList;

    this.filterAndEnanblePropertiesOnPromoClusterChanged();


  }

  filterAndEnanblePropertiesOnPromoClusterChanged() {
    if (this.camp.PromoCluster != null && this.camp.PromoCluster.Value == PromoCluster.Discount) {
      this.filteredPromoTypeList = this.promoTypeList.filter((f) => f.Value == PromoType.Monetary || f.Value == PromoType.Quantitative);
    } else {
      this.filteredPromoTypeList = this.promoTypeList.filter((f) => f.Value == PromoType.Basic || f.Value == PromoType.Plus)
    }
  }

  onPromoTypeChange() {
    debugger;
    this.clearPromoClusterControls();

    this.camp.ClusterItems = [];
    this.hidePriceClusterItemDivs();
    this.hideBonusControls();
    this.hideCashBackControls();
    this.refreshProductTree();

    this.camp.PromoGroup = null;
    this.camp.PriceStrategy = null;
    this.filteredPromoGroupList = this.promoGroupList;
    this.filteredPriceStrategyList = this.priceStrategyList;

    this.filterAndEnanblePropertiesOnPromoTypeChanged();

  }

  filterAndEnanblePropertiesOnPromoTypeChanged() {
    if (this.camp.PromoCluster != null && this.camp.PromoCluster.Value == PromoCluster.Bonus) {

      this.showBonusControls();
      this.disableCampGroupPriceSt(true, true);

      if (this.camp.PromoType != null && this.camp.PromoType.Value == PromoType.Basic) {
        this.filteredPromoGroupList = this.promoGroupList.filter(e => e.Value == PromoGroup.Basic);
        this.camp.PromoGroup = this.promoGroupList.find(e => e.Value == PromoGroup.Basic);

        this.filteredPriceStrategyList = this.priceStrategyList.filter(e => e.Value == PriceStrategy.Basic);
        this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.Basic);

      }
      else if (this.camp.PromoType != null && this.camp.PromoType.Value == PromoType.Plus) {
        this.filteredPromoGroupList = this.promoGroupList.filter(e => e.Value == PromoGroup.Plus);
        this.camp.PromoGroup = this.promoGroupList.find(e => e.Value == PromoGroup.Plus);

        this.filteredPriceStrategyList = this.priceStrategyList.filter(e => e.Value == PriceStrategy.Plus);
        this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.Plus);

        this.hideProductItemDefination = false;
      }
    }
    else if (this.camp.PromoCluster != null && this.camp.PromoCluster.Value == PromoCluster.Discount) {
      if (this.camp.PromoType != null && this.camp.PromoType.Value == PromoType.Monetary) {

        this.hideClusterItem = false;
        this.hideProductSelection = false;
        this.hideQuantityDefination = true;


        this.disableCampGroupPriceSt(true, true);
        this.filteredPromoGroupList = this.promoGroupList.filter(e => e.Value == PromoGroup.SubtotalWOProduct);
        this.camp.PromoGroup = this.promoGroupList.find(e => e.Value == PromoGroup.SubtotalWOProduct);

        this.filteredPriceStrategyList = this.priceStrategyList.filter(e => e.Value == PriceStrategy.AmountOffPercentOff);
        this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.AmountOffPercentOff);

      }
      if (this.camp.PromoType != null && this.camp.PromoType.Value == PromoType.Quantitative) {
        this.hideClusterItem = true;
        this.hideProductSelection = true;
        this.hideQuantityDefination = true;

        this.disableCampGroupPriceSt(false, true);
        this.filteredPromoGroupList = this.promoGroupList.filter(e => e.Value == PromoGroup.BundleSetDiscount || e.Value == PromoGroup.BuyXGetY || e.Value == PromoGroup.BulkTieredDiscounts ||
          e.Value == PromoGroup.StoreWideDiscount || e.Value == PromoGroup.ProductDiscount || e.Value == PromoGroup.DiscountBasedOnPreviousPurchases || e.Value == PromoGroup.BogoSameProduct ||
          e.Value == PromoGroup.BuyOneGetOne || e.Value == PromoGroup.FixPricePerUnit || e.Value == PromoGroup.ProductDependent || e.Value == PromoGroup.BogoCategoryDiscount ||
          e.Value == PromoGroup.CategorySpecificDiscount || e.Value == PromoGroup.Group || e.Value == PromoGroup.Conditional || e.Value == PromoGroup.MultipleBOGO
        );
      }
    }
    else if (this.camp.PromoCluster != null && this.camp.PromoCluster.Value == PromoCluster.CashBack) {

      this.showCashBackControls();
      this.disableCampGroupPriceSt(true, true);
      if (this.camp.PromoType != null && this.camp.PromoType.Value == PromoType.Basic) {
        this.filteredPromoGroupList = this.promoGroupList.filter(e => e.Value == PromoGroup.Basic);
        this.camp.PromoGroup = this.promoGroupList.find(e => e.Value == PromoGroup.Basic);

        this.filteredPriceStrategyList = this.priceStrategyList.filter(e => e.Value == PriceStrategy.Basic);
        this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.Basic);

        //basic

      } else if (this.camp.PromoType != null && this.camp.PromoType.Value == PromoType.Plus) {

        this.filteredPromoGroupList = this.promoGroupList.filter(e => e.Value == PromoGroup.Plus);
        this.camp.PromoGroup = this.promoGroupList.find(e => e.Value == PromoGroup.Plus);

        this.filteredPriceStrategyList = this.priceStrategyList.filter(e => e.Value == PriceStrategy.Plus);
        this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.Plus);

        this.hideProductItemDefination = false;
      }
    }
  }

  onPromoGroupChange() {

    this.clearPromoClusterControls();

    this.camp.ClusterItems = [];
    this.hidePriceClusterItemDivs();
    

    this.filteredPriceStrategyList = this.priceStrategyList;
    this.filterAndEnanblePropertiesOnPromoGroupChanged();
  }

  filterAndEnanblePropertiesOnPromoGroupChanged() {

    if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.BundleSetDiscount) {
      this.hideProductSelection = false;
      this.hideQuantityDefination = false;
      this.hideAllowRepeatAction = false;
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.BundleSetDiscount);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.BundleSetDiscount);

    } else if (this.camp.PromoGroup != null && (this.camp.PromoGroup.Value == PromoGroup.BuyXGetY || this.camp.PromoGroup.Value == PromoGroup.BuyOneGetOne)) {

      this.hideProductSelection = false;
      this.hideAllowRepeatAction = false;
      this.hideProductItemDefination = false;

      this.camp.PriceStrategy = null;
      this.disableCampGroupPriceSt(false, false);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) =>
        f.Value == PriceStrategy.BuyXGetYCheapestAmongAllCategoryInBasket ||
        f.Value == PriceStrategy.BuyXGetYCheapestAmongAllItemsInBasket ||
        f.Value == PriceStrategy.BuyXGetYSelectedCategoriesCheapestinBasket);

    } else if (this.camp.PromoGroup != null && (this.camp.PromoGroup.Value == PromoGroup.BulkTieredDiscounts ||
      this.camp.PromoGroup.Value == PromoGroup.StoreWideDiscount || this.camp.PromoGroup.Value == PromoGroup.DiscountBasedOnPreviousPurchases)) {
      this.hideProductSelection = false;
      this.hideAllowRepeatAction = false;
      this.hideDiscountItems = false;
      this.hideValuePercentage = false;
      if (this.camp.PromoGroup.Value == PromoGroup.DiscountBasedOnPreviousPurchases) {
        this.hidePurchaseHistory = false;
        this.hideAmountEqualType = false;
      }
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.PercentageDiscount);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.PercentageDiscount);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.ProductDiscount) {

      this.hideProductSelection = false;
      this.hideAllowRepeatAction = false;
      this.hideDiscountItems = false;

      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.PriceDiscount);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.PriceDiscount);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.BogoSameProduct) {
      this.hideProductSelection = false;
      this.hideAllowRepeatAction = false;
      this.hideBogoSameProduct = false;
      this.hideValuePercentage = false;
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.BuyXGetXSameProduct);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.BuyXGetXSameProduct);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.BogoCategoryDiscount) {
      this.hideProductSelection = false;
      this.hideAllowRepeatAction = false;
      this.hideBogoCategoryDiscount = false;
      this.hideValuePercentage = false;
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.BuyXGetYSelectedCategoriesCheapestinBasket);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.BuyXGetYSelectedCategoriesCheapestinBasket);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.ProductDependent) {
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.BuyXGetYSelectedCategoriesCheapestinBasket);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.BuyXGetYSelectedCategoriesCheapestinBasket);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.CategorySpecificDiscount) {
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.BuyXGetYSelectedCategoriesCheapestinBasket);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.BuyXGetYSelectedCategoriesCheapestinBasket);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.FixPricePerUnit) {
      this.hideProductSelection = false;
      this.hideDiscountItems = false;
      this.hideAllowRepeatAction = false;
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.FixPricePerUnit);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.FixPricePerUnit);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.Group) {
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.FixPricePerUnit);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.FixPricePerUnit);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.Conditional) {
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.FixPricePerUnit);
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.FixPricePerUnit);

    } else if (this.camp.PromoGroup != null && this.camp.PromoGroup.Value == PromoGroup.MultipleBOGO) {
      this.disableCampGroupPriceSt(false, true);
      this.camp.PriceStrategy = this.priceStrategyList.find(e => e.Value == PriceStrategy.FixPricePerUnit)[0];
      this.filteredPriceStrategyList = this.priceStrategyList.filter((f) => f.Value == PriceStrategy.FixPricePerUnit);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.storeDataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedById() {
    const numSelectedById = this.selectionById.selected.length;
    const numRowsById = this.storeDataSourceById.data.length;
    return numSelectedById === numRowsById;
  }

  isAllSelectedByIdExclude() {
    const numSelectedByIdExclude = this.selectionByIdExclude.selected.length;
    const numRowsByIdExclude = this.storeDataSourceByIdExclude.data.length;
    return numSelectedByIdExclude === numRowsByIdExclude;
  }

  isAllProductSelectedById() {
    const numSelectedById = this.productSelectionById.selected.length;
    const numRowsById = this.productDataSourceById.data.length;
    return numSelectedById === numRowsById;
  }

  isAllProductSelectedByIdExclude() {
    const numSelectedByIdExclude = this.productSelectionByIdExclude.selected.length;
    const numRowsByIdExclude = this.productDataSourceByIdExclude.data.length;
    return numSelectedByIdExclude === numRowsByIdExclude;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.storeDataSource.filteredData.forEach(row => { this.selection.select(row) });
  }

  masterToggleById() {
    this.isAllSelectedById() ?
      this.selectionById.clear() :
      this.storeDataSourceById.filteredData.forEach(row => this.selectionById.select(row));
  }

  masterToggleByIdExclude() {
    this.isAllSelectedByIdExclude() ?
      this.selectionByIdExclude.clear() :
      this.storeDataSourceByIdExclude.filteredData.forEach(row => this.selectionByIdExclude.select(row));
  }

  productMasterToggleById() {

    this.isAllProductSelectedById() ?
      this.productSelectionById.clear() :
      this.productDataSourceById.filteredData.forEach(row => this.productSelectionById.select(row));
  }

  productMasterToggleByIdExclude() {
    this.isAllProductSelectedByIdExclude() ?
      this.productSelectionByIdExclude.clear() :
      this.productDataSourceByIdExclude.filteredData.forEach(row => this.productSelectionByIdExclude.select(row));
  }

  getDefinationsFromCrmCampaignService() {

    this._campaignService.getPeriodTypes().then(data => {
      if (data.IsSuccess) {
        this.periodTypeList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getDiscountDistributaions().then(data => {
      if (data.IsSuccess) {
        this.discountDistributionList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getBonusActivations().then(data => {
      if (data.IsSuccess) {
        this.bonusActivationList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getBonusEveryAfterAccrualMonths().then(data => {
      if (data.IsSuccess) {
        this.bonusEveryAfterAccrualMonthList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getBonusEveryAfterAccuralDays().then(data => {
      if (data.IsSuccess) {
        this.bonusEveryAfterAccuralDayList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getBonusEveryAfterAccuralWeeks().then(data => {
      if (data.IsSuccess) {
        this.bonusEveryAfterAccuralWeekList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getBonusExpirations().then(data => {
      if (data.IsSuccess) {
        this.bonusExpirationList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getBonusExpirationTypes().then(data => {
      if (data.IsSuccess) {
        this.bonusExpirationTypeList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getPurchaseHistories().then(data => {
      if (data.IsSuccess) {
        this.purchaseHistoryList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getAmountEqualTypes().then(data => {
      if (data.IsSuccess) {
        this.amountEqualTypeList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCashBackActivations().then(data => {
      if (data.IsSuccess) {
        this.cashBackActivationList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCashBackEveryAfterAccrualMonths().then(data => {
      if (data.IsSuccess) {
        this.cashBackEveryAfterAccrualMonthList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCashBackEveryAfterAccuralDays().then(data => {
      if (data.IsSuccess) {
        this.cashBackEveryAfterAccuralDayList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCashBackEveryAfterAccuralWeeks().then(data => {
      if (data.IsSuccess) {
        this.cashBackEveryAfterAccuralWeekList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getInvRfmSegments().then(data => {
      if (data.IsSuccess) {
        this.invRfmSegmentList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCompanyCardTypes().then(data => {
      if (data.IsSuccess) {
        this.companyCardTypeList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCompanyMacroSegments().then(data => {
      if (data.IsSuccess) {
        this.companyMacroSegmentList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCardTypes().then(data => {
      if (data.IsSuccess) {
        this.invCardTypeList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getInvMacroSegments().then(data => {
      if (data.IsSuccess) {
        this.invMacroSegmentList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getInvMicroSegments().then(data => {
      if (data.IsSuccess) {
        this.invMicroSegmentList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getSmsParticipations().then(data => {
      if (data.IsSuccess) {
        this.smsParticipationList = data.Result;
        this.onSmsParticipationChange(this.camp.SmsParticipation);
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCampaignStatus().then(data => {
      if (data.IsSuccess) {
        this.campaignStatuList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCampaignChannels().then(data => {
      if (data.IsSuccess) {
        this.campaignChannelList = data.Result;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getApprovals().then(data => {
      if (data.IsSuccess) {
        this.approvalList = data.Result;
        this.onApprovalChange(this.camp.Approval);
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCompanies().then(data => {
      if (data.IsSuccess) {
        this.companyList = data.Result
      } else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getCountries().then(data => {
      if (data.IsSuccess) {
        this.countryList = data.Result;
      } else {
        throw new Error(data.ResultMessage);
      }
    });

    this._campaignService.getCities().then(data => {
      if (data.IsSuccess) {
        this.cityList = data.Result;
      } else {
        throw new Error(data.ResultMessage);
      }
    });

    this._campaignService.getStoreGroups().then(data => {
      if (data.IsSuccess) {
        this.storeGroupList = data.Result;
      } else {
        throw new Error(data.ResultMessage);
      }
    });

    this._campaignService.getStoreTypes().then(data => {
      if (data.IsSuccess) {
        this.storeTypeList = data.Result;
      } else {
        throw new Error(data.ResultMessage);
      }
    });

    this._campaignService.getStoreSegments().then(data => {
      if (data.IsSuccess) {
        this.storeSegmentList = data.Result;
      } else {
        throw new Error(data.ResultMessage);
      }
    });

    this._campaignService.getStores().then(data => {
      if (data.IsSuccess) {

        this.storeList = data.Result;
        this.setStoreValuesToTables();
        this.generateTreeViewForStoreList(this.storeList);
        this.setSelectedStoreToTree();
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })

    this._campaignService.getPromoClusters().then(data => {
      if (data.IsSuccess) {

        this.promoClusterList = data.Result as OptionsModel[];
        this.filterPromoCluster();

        this._campaignService.getPromoTypes().then(data => {
          if (data.IsSuccess) {

            this.promoTypeList = data.Result as OptionsModel[];
            this.filteredPromoTypeList = data.Result as OptionsModel[];

            this._campaignService.getPromoGroups().then(data => {
              if (data.IsSuccess) {

                this.promoGroupList = data.Result as OptionsModel[];
                this.filteredPromoGroupList = data.Result as OptionsModel[];

                this._campaignService.getPriceStrategies().then(data => {
                  if (data.IsSuccess) {

                    this.priceStrategyList = data.Result as OptionsModel[];
                    this.filteredPriceStrategyList = data.Result as OptionsModel[];
                    this.onPriceStrategyUpdateForm();

                  } else {
                    throw new Error(data.ResultMessage);
                  }
                });

              } else {
                throw new Error(data.ResultMessage);
              }
            });


          } else {
            throw new Error(data.ResultMessage);
          }
        });

      } else {
        throw new Error(data.ResultMessage);
      }
    });

    this._campaignService.getProducts().then(productData => {
      if (productData.IsSuccess) {
        this._campaignService.getProductCategories().then(pCategoryData => {
          if (pCategoryData.IsSuccess) {
            this.productCategoryList = pCategoryData.Result as ProductCategoryModel[];
            this.productList = productData.Result as ProductModel[];
            this.setProductValuesToTables();
            this.generateTreeViewForProductList(this.productCategoryList, this.productList);
            this.setSelectedProductToTree();

          } else {
            throw new Error(pCategoryData.ResultMessage);
          }
        });
      } else {
        throw new Error(productData.ResultMessage);
      }
    });
  }

  setProductValuesToTables() {


    this.productDataSourceById.data = this.productList;
    this.productDataSourceByIdExclude.data = this.productList;

    this.productDataSourceById.filterPredicate = this.filterPredicateByProductId();
    this.productDataSourceByIdExclude.filterPredicate = this.filterPredicateByProductId();

    this.productDataSourceById.paginator = this.paginator4;
    this.productDataSourceByIdExclude.paginator = this.paginator5;

    //filter CRM defined store List and check 
    if (this.camp.Products != null) {
      debugger;
      if (this.camp.Products.length > 0) {
        debugger;
        this.camp.Products.forEach(store => {
          debugger;
          this.productDataSourceById.data.forEach(m => {
            debugger;
            if (m.CrmId == store.CrmId) {
              {
                debugger;
                this.productSelectionById.select(m);
              }
            }
          });
        });
      }
    }

    if (this.camp.ExcludedProducts != null) {
      if (this.camp.ExcludedProducts.length > 0) {
        this.camp.ExcludedProducts.forEach(store => {
          this.productDataSourceByIdExclude.data.forEach(m => {
            if (m.CrmId == store.CrmId) {
              this.productSelectionByIdExclude.select(m);
            }
          })
        });
      }
    }

    //setTimeout(() => this.productDataSourceById.paginator = this.paginator4);
    //setTimeout(() => this.productDataSourceByIdExclude.paginator = this.paginator5);
    //this.cdr.detectChanges();
  }

  setStoreValuesToTables() {

    this.storeDataSource.data = this.storeList;
    this.storeDataSourceById.data = this.storeList;
    this.storeDataSourceByIdExclude.data = this.storeList;

    this.storeDataSource.filterPredicate = this.customFilterPredicate();
    this.storeDataSourceById.filterPredicate = this.filterPredicateByStoreId();
    this.storeDataSourceByIdExclude.filterPredicate = this.filterPredicateByStoreId();

    this.storeDataSource.paginator = this.paginator;
    this.storeDataSourceById.paginator = this.paginator2;
    this.storeDataSourceByIdExclude.paginator = this.paginator3;

    this.storeDataSource.sort = this.sort;

    //filter CRM defined store List and check 
    if (this.camp.Stores != null) {
      if (this.camp.Stores.length > 0) {
        this.camp.Stores.forEach(store => {
          this.storeDataSource.data.forEach(m => {
            if (m.CrmId == store.CrmId) {
              this.selection.select(m);
            }
          });

          this.storeDataSourceById.data.forEach(m => {
            if (m.CrmId == store.CrmId) {
              this.selectionById.select(m);
            }
          });
        });
      }
    }

    if (this.camp.ExcludedStores != null) {
      if (this.camp.ExcludedStores.length > 0) {
        this.camp.ExcludedStores.forEach(store => {
          this.storeDataSourceByIdExclude.data.forEach(m => {
            if (m.CrmId == store.CrmId) {
              this.selectionByIdExclude.select(m);
            }
          })
        });
      }
    }

    //setTimeout(() => this.storeDataSource.paginator = this.paginator);
    //setTimeout(() => this.storeDataSourceById.paginator = this.paginator2);
    // setTimeout(() => this.storeDataSourceByIdExclude.paginator = this.paginator3);
    //this.cdr.detectChanges();
  }

  onAllDaysChange(event) {
    //let startDate = this.ngbDateParserFormatter.format(this.camp.CampaignStartDate);
    this.camp.AllDays = event.checked;
    this.camp.Monday = event.checked;
    this.camp.Tuesday = event.checked;
    this.camp.Wednesday = event.checked;
    this.camp.Thursday = event.checked;
    this.camp.Friday = event.checked;
    this.camp.Saturday = event.checked;
    this.camp.Sunday = event.checked;
  }

  onMondayChange(event) {
    this.camp.Monday = event.checked;
  }

  onTuesdayChange(event) {
    this.camp.Tuesday = event.checked;
  }

  onWednesdayChange(event) {
    this.camp.Wednesday = event.checked;
  }

  onThursdayChange(event) {
    this.camp.Thursday = event.checked;
  }

  onFridayChange(event) {
    this.camp.Friday = event.checked;
  }

  onSaturdayChange(event) {
    this.camp.Saturday = event.checked;
  }

  onSundayChange(event) {
    this.camp.Sunday = event.checked;
  }

  onSmsParticipationChange(event) {
    if (this.camp.SmsParticipation != null && this.camp.SmsParticipation.Value == SmsParticipation.Yes) {
      this.SmsParticipationDivShow = true;
    }
    else {
      this.SmsParticipationDivShow = false;
      this.camp.ParticipationCode = null;
      this.camp.ParticipationNumber = null;
    }
  }


  onPurchaseHistoryTypeChange() {
    if (this.camp.PurchaseHistoryType != null) {
      this.hidePurchaseHistoryValue = false;
    } else {
      this.hidePurchaseHistoryValue = true;
    }
  }

  onAmountEqualTypeChange() {
    if (this.camp.AmountEqualType != null) {
      this.hideAmountEqualValue = false;
    } else {
      this.hideAmountEqualValue = true;
    }
  }

  onApprovalChange(event) {
    if (this.camp.Approval != null && this.camp.Approval.Value == Approval.Yes) {
      this.IsApprovalDivShow = true;

    }
    else {
      this.IsApprovalDivShow = false;
      this.camp.ApprovedBy = null;
    }
  }

  filterArrayByValues(array, values) {
    return array.filter(function (arrayItem) {
      return values.some(function (value) {
        return value === arrayItem;
      });
    });
  }

  searchByFilterColumn(guidData: Guid[], strData: string) {
    var retVal = false;
    if (guidData != null && guidData.length > 0) {

      for (var i = 0; i < guidData.length; i++) {
        retVal = strData.trim().indexOf(guidData[i].toString()) !== -1 &&
          strData.toString().trim().toLowerCase().indexOf(guidData[i].toString().toLowerCase()) !== -1;
        if (retVal) {
          break;
        }
      }
    } else {
      retVal = true;
    }
    return retVal;
  }

  filterPredicateByStoreId() {
    const myFilterPredicate = (data: StoreModel, filter: string): boolean => {
      let searchString = [];

      if (filter.indexOf(";") > -1) {
        searchString = filter.split(";");
      }
      else {
        searchString[0] = filter;
      }
      var retVal = false;

      if (searchString != null && searchString.length > 0) {

        for (var i = 0; i < searchString.length; i++) {
          if (searchString[i] != "" && searchString[i] != null) {
            retVal = data.StoreId.trim().indexOf(searchString[i].toString()) !== -1 &&
              data.StoreId.toString().trim().toLowerCase().indexOf(searchString[i].toString().toLowerCase()) !== -1;
            if (retVal) {
              break;
            }
          }
        }
      } else {
        retVal = true;
      }
      return retVal;
    }
    return myFilterPredicate;
  }

  filterPredicateByProductId() {
    const myFilterPredicate = (data: ProductModel, filter: string): boolean => {
      let searchString = [];

      if (filter.indexOf(";") > -1) {
        searchString = filter.split(";");
      }
      else {
        searchString[0] = filter;
      }

      var retVal = false;

      if (searchString != null && searchString.length > 0) {

        for (var i = 0; i < searchString.length; i++) {
          if (searchString[i] != "" && searchString[i] != null) {
            retVal = data.ProductCode.trim().indexOf(searchString[i].toString()) !== -1 &&
              data.ProductCode.toString().trim().toLowerCase().indexOf(searchString[i].toString().toLowerCase()) !== -1;
            if (retVal) {
              break;
            }
          }
        }
      } else {
        retVal = true;
      }
      return retVal;
    }
    return myFilterPredicate;
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: StoreModel, filter: string): boolean => {
      let searchString = JSON.parse(filter);

      var companyFound, countyFound, cityFound, regionFound, segmentFound, groupFound, typeFound = false;
      companyFound = this.searchByFilterColumn(searchString.CompanyId, data.CompanyId.toString());
      countyFound = this.searchByFilterColumn(searchString.CountryId, data.CountryId.toString());
      cityFound = this.searchByFilterColumn(searchString.CityId, data.CityId.toString());
      regionFound = this.searchByFilterColumn(searchString.RegionId, data.RegionId.toString());
      segmentFound = this.searchByFilterColumn(searchString.StoreSegmentId, data.StoreSegmentId.toString());
      groupFound = this.searchByFilterColumn(searchString.StoreGroupId, data.StoreGroupId.toString());
      typeFound = this.searchByFilterColumn(searchString.StoreTypeId, data.StoreTypeId.toString());
      return companyFound && countyFound && cityFound && regionFound && segmentFound && groupFound && typeFound;
    };
    return myFilterPredicate;
  }

  clFilterStore() {
    this.storeDataSource.filter = JSON.stringify(this.storeCriteria);
  }

  clFilterStoresById() {
    this.storeDataSourceById.filter = this.storeIdfilter;
  }

  clFilterProductsById() {
    this.productDataSourceById.filter = this.productIdfilter;
  }

  clFilterStoresByIdExclude() {
    this.storeDataSourceByIdExclude.filter = this.storeExcludeIdfilter;
  }

  clFilterProductsByIdExclude() {
    this.productDataSourceByIdExclude.filter = this.productExcludeIdfilter;
  }

  hideBonusControls() {
    this.hideProductItemDefination = true;
    this.hideProductSelection = true;
    this.hideBonusExpiration = true;
    this.hideBonusExpirationType = true;
    this.hideBnsAccuralPercentageFixedValue = true;
    this.hideBonusActivation = true;
    this.hideBonusRedemptionValue = true;
    this.hideBonusDeferredTime = true;
    this.hideBonusEveryAfterAccrualProperties = true;
  }

  showBonusControls() {
    this.hideBonusExpiration = false;
    this.hideBnsAccuralPercentageFixedValue = false;
    this.hideBonusActivation = false;
    this.hideBonusRedemptionValue = false;
    this.hideProductSelection = false;
  }

  onBonusActivationChange() {
    this.hideBonusEveryAfterAccrualProperties = true;
    this.hideBonusDeferredTime = true;
    this.camp.BonusDeferredTime = null;

    if (this.camp.BonusActivation != null && this.camp.BonusActivation.Value == BonusActivation.Deferred) {
      this.hideBonusDeferredTime = false;
    }
    if (this.camp.BonusActivation != null && this.camp.BonusActivation.Value == BonusActivation.EveryAfterAccrual) {
      this.hideBonusEveryAfterAccrualProperties = false;
    }
  }

  onBonusExpirationChange() {

    if (this.camp.BonusExpiration != null && this.camp.BonusExpiration.Value == BonusExpiration.Yes) {

      this.hideBonusExpirationType = false;
    } else {
      this.camp.BonusExpirationType = null;
      this.camp.BonusExpirationValue = null;
      this.hideBonusExpirationType = true;
    }
  }

  onCashActivationChange() {
    this.hideCashBackEveryAfterAccrualProperties = true;
    this.hideCashBackDeferredTime = true;
    this.camp.CashBackDeferredTime = null;

    if (this.camp.CashBackActivation != null && this.camp.CashBackActivation.Value == CashBackActivation.Deferred) {
      this.hideCashBackDeferredTime = false;
    }
    if (this.camp.CashBackActivation != null && this.camp.CashBackActivation.Value == CashBackActivation.EveryAfterAccrual) {
      this.hideCashBackEveryAfterAccrualProperties = false;

    }
  }

  hideCashBackControls() {
    this.hideProductItemDefination = true;
    this.hideProductSelection = true;
    this.hideCashBackActivation = true;
    this.hideCashBackDeferredTime = true;
    this.hideCashBackAccrualProperties = true;
    this.hideCashBackEveryAfterAccrualProperties = true;
  }

  showCashBackControls() {
    this.hideCashBackActivation = false;
    this.hideCashBackAccrualProperties = false;
    this.hideProductSelection = false;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  campaignReview() {

    this.camp.CampaignStartDate = this.ngbDateParserFormatter.format(this.campaignStartDate);
    this.camp.CampaignEndDate = this.ngbDateParserFormatter.format(this.campaignEndDate);

    var t = "<div class=\"border-bottom mb-5 pb-5\">";
    t += "<div class=\"font-weight-bolder mb-3\">Campaign Defination</div>";
    t += "<div class=\"line-height-xl\">";
    t += "<b>Campaign Name</b> : " + (this.camp.CampaignName != null ? this.camp.CampaignName : " - ");
    t += "<br/>";
    t += "<b>Statu</b> : " + (this.camp.Statu != null ? this.camp.Statu.Name : " - ");
    t += "<br/>";
    t += "<b>Channel</b> : " + this.channelReviewToString();
    t += "<br/>";
    t += "<b>Start Date</b> : " + (this.camp.CampaignStartDate != null ? this.dateTimeToString(this.ngbDateParserFormatter.parse(this.camp.CampaignStartDate)) : " - ");
    t += "<br/>";
    t += "<b>End Date</b> : " + (this.camp.CampaignEndDate != null ? this.dateTimeToString(this.ngbDateParserFormatter.parse(this.camp.CampaignEndDate)) : " - ");
    t += "<br/>";
    t += "<b>Working Days</b> : " + this.workingReviewsDaysToString();

    if (this.camp.AllHour) {
      t += "<b>Working Hours</b> : True";
    } else {
      t += "<b>Working Start Time</b>";
      t += "<b>Working End Time</b>";
    }

    t += "<br/>";
    t += "</div>";
    t += "</div>";

    this.campaignReviewStr = t;
  }

  setSelectedStoreToTree() {
    //filter CRM defined store List and check 
    if (this.camp.Stores != null) {
      if (this.camp.Stores.length > 0) {
        this.camp.Stores.forEach(store => {
          this.treeControl.dataNodes.forEach(e => {
            if (e.itemNode.CrmId == store.CrmId) {
              this.checklistSelection.toggle(e);
              this.treeControl.expand(e);
            }
          })
        });
      }
    }
  }

  setSelectedProductToTree() {
    //filter CRM defined product List and check 
    if (this.camp.Products != null) {
      if (this.camp.Products.length > 0) {
        this.camp.Products.forEach(product => {
          this.productTreeControl.dataNodes.forEach(e => {
            if (e.itemNode.CrmId == product.CrmId) {
              this.productChecklistSelection.toggle(e);
              this.productTreeControl.expand(e);
            }
          })
        });
      }
    }
  }
}
