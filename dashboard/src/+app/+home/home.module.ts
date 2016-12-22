import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import {DeploymentsOverviewComponent} from "./deployments-overview.component";
import {MomentModule} from "angular2-moment";

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    MomentModule
  ],
  declarations: [
    HomeComponent,
    DeploymentsOverviewComponent
  ]
})
export class HomeModule { }
