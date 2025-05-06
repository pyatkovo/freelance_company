import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserInfoService} from "../../services/user-info.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {UserInfoType} from "../../../types/userInfo.type";
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService, private popupService: PopupService,
              private _snackBar: MatSnackBar, private router: Router, private userInfoService: UserInfoService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.getUserName();
    })

    this.getUserName();

  }

getUserName():void{
  this.userInfoService.getUserInfo().subscribe((data: DefaultResponseType | UserInfoType) => {
    if ((data as DefaultResponseType).error !== undefined) {
      throw new Error((data as DefaultResponseType).message)
    }
    const userInfo = data as UserInfoType;
    this.userName = userInfo.name;
  })
}


  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout()
        },
        error: () => {
          this.doLogout()
        }
      })
  }


  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/'])
  }

  scrollTo(fragment: string) {
    setTimeout(() => {
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  openPopup(type: 'order' | 'consultation', category?: string) {
    this.popupService.open(type, category || null);
  }
}
