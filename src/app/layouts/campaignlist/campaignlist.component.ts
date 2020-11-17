import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CampaignService } from '../../services/campaingservices';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { CampaignModel } from '../../models/CampaingModel';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Guid } from 'guid-typescript';
import { OptionsModel } from '../../models/OptionsModel';


@Component({
  selector: 'app-campaignlist',
  templateUrl: './campaignlist.component.html',
  styleUrls: ['./campaignlist.component.scss']
})
export class CampaignlistComponent implements OnInit, AfterViewInit {

  campId: CampaignModel = null;
  @Output() msgToSibling = new EventEmitter<any>();

  msgToSib() { this.msgToSibling.emit(this.campId) }




  selection = new SelectionModel<Element>(true, []);
  currentTab = 'Day';
  campaignList: CampaignModel[] = [];
  campaignDataSource;

  displayedColumns: string[] = ['CampaignId', 'CampaignName', 'Statu', 'CampaignStartDate', 'CampaignEndDate', 'SmsParticipation', 'Approval', 'actions'];

  constructor(public _campaignService: CampaignService, private ngbDateParserFormatter: NgbDateParserFormatter, ) {

  }

  ngAfterViewInit(): void {
    debugger;
    this.getCampaignList();
  }

  ngOnInit(): void {

  }

  onCampaignDelete(crmId: Guid) {
    alert("Delete Campaign ID : " + crmId);
  }

  onCampaignEdit(crmId: any) {
    this.campId = crmId;
    this.msgToSib();
  }

  getCampaignList() {

    this._campaignService.getCampaigns().then(data => {
      if (data.IsSuccess) {
        this.campaignList = data.Result;

        this.campaignList.forEach(e => {
          e.CampaignStartDate = new Date(e.CampaignStartDate).toString();
          e.CampaignEndDate = new Date(e.CampaignEndDate).toString();

          if (e.CampaignName == null) {
            e.CampaignName = "N/A";
          }
          if (e.Statu == null) {
            e.Statu = new OptionsModel();
          }
        });

        this.campaignDataSource = new MatTableDataSource();
        this.campaignDataSource.data = this.campaignList;
      }
      else {
        throw new Error(data.ResultMessage);
      }
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.campaignDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.campaignDataSource.filteredData.forEach(row => this.selection.select(row));
  }

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }

}
