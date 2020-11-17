import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  loading;

  title = 'Promo Engine';
  campaignList = true;
  campaignWizard = false;

  currentCrmIdPassWizard: any;

  ngAfterViewInit(): void {
     
  }



  

  onNewCampignClick() {
    this.campaignList = false;
    this.campaignWizard = true;
  }

  onCampaignListClick() {
    this.campaignList = true;
    this.campaignWizard = false;
  }

  onPress() {

    /*if you want the component to show and hide on click pressed, use 
    use this line
    this.display = !this.display;*/
  }

  passCrmId($event) {
  
    this.currentCrmIdPassWizard = $event;
    this.campaignList = false;
    this.campaignWizard = true;
  }

}

