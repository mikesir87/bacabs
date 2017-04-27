import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DeploymentsOverviewComponent } from "./deployments-overview.component";
import { DeploymentGroupDisplayComponent } from "./deployment-group-display.component";
import { ObjectKeysPipe } from "./object-keys.pipe";
import { MomentModule } from "angular2-moment";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    MomentModule
  ],
  declarations: [
    HomeComponent,
    DeploymentsOverviewComponent,
    DeploymentGroupDisplayComponent,
    ObjectKeysPipe,
  ],
})
export class HomeModule { }
