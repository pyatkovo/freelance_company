import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import {LayoutComponent} from "./shared/layout/layout.component";
import {AuthForwardGuard} from "./core/auth/auth-forward.guard";
import {PolicyComponent} from "./views/policy/policy.component";

const routes: Routes = [
  {path:'',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: 'policy', component: PolicyComponent},
      {path: '', loadChildren:() => import('./views/user/user.module').then(m => m.UserModule), canActivate: [AuthForwardGuard]},
      {path: '', loadChildren:() => import('./views/blog/blog.module').then(m => m.BlogModule)},
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: "enabled"})],
  exports: [RouterModule],
  providers:[

  ]
})
export class AppRoutingModule { }
