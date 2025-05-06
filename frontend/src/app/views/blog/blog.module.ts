import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { DetailComponent } from './detail/detail.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    ArticlesComponent,
    DetailComponent
  ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        SharedModule,
        FormsModule,
        MatProgressSpinnerModule
    ]
})
export class BlogModule { }
