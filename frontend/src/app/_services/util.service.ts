import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UtilService {
  currentSection: any;
  currentSubSection: any;

  setCurrentSection(section) {
    this.currentSection = section;
  }

  convertCamelToHyphenCase(string) {
    return string.replace(/\s+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').replace(/s+$/, '').toLowerCase();
  }

  gotoHashtag(fragment: string, event, subSection = '') {
    event.preventDefault();
    const element = document.querySelector('#' + fragment);
    this.currentSubSection = fragment;
    if (element) {
      element.scrollIntoView();
      document.getElementById(fragment).focus();
      return fragment;
    }
  }

  createId(value: string) {
    const id = value.replace(/[^A-Z0-9]+/gi, '-').toLowerCase().substring(0, 20);
    return id;
  }

  handleError(error: Response | any) {
    let errors: any = [];
    if (error instanceof Response) {
      let body = error.json() || '';
      errors = body.errors;
      if (error.status) {
        switch (error.status) {
          case 400:
            body = error.json() || '';
            errors = body.errors;
            break;
          case 401:
            errors = [{ message: 'Please log in.' }];
            break;
          case 403:
            errors = [{ message: 'Access denied.' }];
            break;
          case 404:
            errors = [{ message: 'The requested application is not found.' }];
            break;
          default:
            errors = [];
        }
      }
    }
    return Observable.throw(errors);
  }
}
