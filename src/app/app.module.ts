import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { WizardComponent } from './layouts/campaingwizard/wizard/wizard.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { NgbDateCustomParserFormatter } from './NgbDateCustomParserFormatter';
import { MatCheckboxModule, MAT_CHECKBOX_CLICK_ACTION } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common'
import { CampaignService } from './services/campaingservices';
import { OptionsModel } from './models/OptionsModel';
import { CityModel } from './models/CityModel';
import { CountryModel } from './models/CountryModel';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelect2Module } from 'ng-select2'
import { Select2Module } from "ng-select2-component";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChecklistDatabase } from './models/StoreHierarchyModel';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogBoxComponent } from './layouts/dialog/dialog-box/dialog-box.component'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CampaignlistComponent } from './layouts/campaignlist/campaignlist.component'
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";


export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [AppComponent, WizardComponent, DialogBoxComponent, CampaignlistComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    NgbModule,
    ClipboardModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    InlineSVGModule.forRoot(),
    HighlightModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    NgxMatSelectSearchModule,
    NgSelect2Module,
    Select2Module,
    MatTableModule,
    MatPaginatorModule,
    MatTreeModule,
    MatIconModule,
    CdkTreeModule,
    NgxSpinnerModule,
    FileUploadModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    NgxCurrencyModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' },
    CampaignService,
    OptionsModel,
    CityModel,
    CountryModel,
    ChecklistDatabase,
    
  ],
  entryComponents: [
    DialogBoxComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {



}
