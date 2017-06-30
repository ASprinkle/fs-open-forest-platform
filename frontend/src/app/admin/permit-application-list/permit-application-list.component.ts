import { Application } from '../../_models/application';
import { ApplicationService } from '../../_services/application.service';
import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-permit-application-list',
  templateUrl: './permit-application-list.component.html',
  providers: [ ApplicationService ]
})

@Injectable()
export class PermitApplicationListComponent implements OnInit {

  applications: any;
  apiErrors: any;

  constructor( private applicationService: ApplicationService ) {
    this.applications = [];
  }

  isApproachingBeginDateTime(startDateTime) {
    const now = moment();
    const deadline = moment(startDateTime, 'YYYY-MM-DDTHH:mm:ss').subtract(2, 'weeks');
    return now.isAfter(deadline);
  }

  isOverOneDayOld(submittedDateTime) {
    const now = moment();
    const deadline = moment(submittedDateTime, 'YYYY-MM-DDTHH:mm:ss').add(1, 'days');
    return now.isAfter(deadline);
  }

  isOverTwoDaysOld(submittedDateTime) {
    const now = moment();
    const deadline = moment(submittedDateTime, 'YYYY-MM-DDTHH:mm:ss').add(2, 'days');
    return now.isAfter(deadline);
  }

  showAttentionAlert() {
    let result = false;
    this.applications.forEach((application) => {
      if (this.isOverTwoDaysOld(application.createdAt)) {
        result = true;
      }
    });
    return result;
  }

  getApplications() {
    this.applicationService.get()
      .subscribe(
        (applications: any) => {
          this.applications = applications;
        },
        (e: any) => {
          this.apiErrors = e;
          window.scroll(0, 0);
        }
      );
  }

  ngOnInit() {
    this.getApplications();
  }

}
