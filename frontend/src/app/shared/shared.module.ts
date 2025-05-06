import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import { ArticleCardComponent } from './components/acticle-card/article-card.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PopupComponent } from './popup/popup.component';
import {ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from './components/loader/loader.component';




@NgModule({
  declarations: [
    ArticleCardComponent,
    PopupComponent,
    LoaderComponent
  ],
    exports: [
        ArticleCardComponent,
        PopupComponent,
        LoaderComponent,
    ],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
