import {Component, HostListener, Input, OnInit} from '@angular/core';
import {CategoryService} from "../services/category.service";
import {CategoryType} from "../../types/category.type";
import {FormBuilder, Validators} from "@angular/forms";
import {PopupService} from "../services/popup.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RequestType} from "../../types/request.type";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {UserInfoService} from "../services/user-info.service";
import {UserInfoType} from "../../types/userInfo.type";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  categories: CategoryType[] = [];
  popupForm = this.fb.group({
    category: [''],
    name: ['', [Validators.required, Validators.pattern(/^[A-ZА-Я][a-zа-я]+(?: [A-ZА-Я][a-zа-я]+)*$/)]],
    phone: ['', [Validators.required, Validators.pattern('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$')]]
  })
  type: string = '';
  isVisible: boolean = false;
  selectedCategory: string = '';
  errorMessage: boolean = false;
  successRequest: boolean = false;
  requestData: RequestType = {
    name: '',
    phone: '',
    type: ''
  }

  constructor(private categoryService: CategoryService, private userInfoService: UserInfoService,
              private fb: FormBuilder, private popupService: PopupService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {



    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });

    this.popupService.isVisible.subscribe(show => {
      this.successRequest = false;
      this.isVisible = show;

      this.userInfoService.getUserInfo().subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }
        const userInfo = data as UserInfoType;
        this.popupForm.get('name')?.setValue(userInfo.name);
      })
    });

    this.popupService.type.subscribe(type => {
      this.type = type;
    });

    this.popupService.selectedCategory.subscribe(category => {
      if (category) {
        if (this.categories.find(c => c.name === category)) {
          this.selectedCategory = category;
          this.popupForm.get('category')?.setValue(category);
        } else {
          this._snackBar.open('Категории не существует')
        }
      }
    })
  }

  sendPopupRequest() {
    if (this.popupForm.valid && this.popupForm.value.phone && this.popupForm.value.name) {
      this.requestData.type = this.type
      this.requestData.phone = this.popupForm.value.phone
      this.requestData.name = this.popupForm.value.name
      if (this.popupForm.value.category) {
        this.requestData.service = this.popupForm.value.category
      }

      this.popupService.sendRequest(this.requestData)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error && data.message){
              this.errorMessage = true;
              this._snackBar.open(data.message)
            }
            this.popupForm.reset();
            this.errorMessage = false;
            this.successRequest = true;
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.errorMessage = true;
            } else {
              this._snackBar.open('Ошибка отправки формы')
              this.errorMessage = true;
            }
          }
        })
    }
  }

  close() {
    this.popupForm.reset();
    this.popupService.close();
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    const target = event.target as HTMLElement;
    if (this.isVisible && target.classList.contains('popup-overlay')) {
      this.close();
    }
  }
}

