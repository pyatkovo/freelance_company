import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isShowed$ = new Subject<boolean>();

  constructor() { }


  show() {
    this.isShowed$.next(true);
  }

  hide() {
    this.isShowed$.next(false);
  }
}
