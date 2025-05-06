import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ArticleCardType} from "../../types/article-card.type";
import {environment} from "../../../environments/environment";
import {RequestType} from "../../types/request.type";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private isVisible$: Subject<boolean> = new Subject<boolean>();
  private typePopup$: Subject<string> = new Subject<string>();
  private selectedCategory$:Subject<string | null> = new Subject<string | null>();

  constructor(private http: HttpClient) { }

  get isVisible() {
    return this.isVisible$.asObservable();
  }

  get type() {
    return this.typePopup$.asObservable();
  }

  get selectedCategory() {
    return this.selectedCategory$.asObservable();
  }

  open(type: string, selectedCategory: string | null = null) {
    this.typePopup$.next(type);
    this.selectedCategory$.next(selectedCategory);
    this.isVisible$.next(true);
  }

  close() {
    this.isVisible$.next(false);
    this.selectedCategory$.next(null);
  }

  sendRequest(data: RequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', data);
  }
}
