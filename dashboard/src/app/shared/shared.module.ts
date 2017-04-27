import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { ConnectionService } from './connection.service';
import {DeploymentService} from "./deployment.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  providers: [
    ApiService,
    ConnectionService,
    DeploymentService,
  ],
})
export class SharedModule { }
