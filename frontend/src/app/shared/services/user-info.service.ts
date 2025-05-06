import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../types/default-response.type";
import {UserInfoType} from "../../types/userInfo.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<DefaultResponseType | UserInfoType>{
    return  this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users')
  }
}
