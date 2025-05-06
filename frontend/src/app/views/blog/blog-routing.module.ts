import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArticlesComponent} from "./articles/articles.component";
import {DetailComponent} from "./detail/detail.component";

const routes: Routes = [
  {path: 'articles', component: ArticlesComponent},
  {path: 'articles/:url', component: DetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
