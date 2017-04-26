import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { HomeModule } from './home/home.module';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectionIndicator } from './connection-indicator.component';
import {reducer} from "../../../dashboard/src/+app/reducers/index";
import {StoreModule} from "@ngrx/store";
import {RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";


@NgModule({
  declarations: [ AppComponent, ConnectionIndicator ],
  imports: [
    BrowserModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    RouterModule.forRoot([], { useHash: false }),
    StoreModule.provideStore(reducer),
    HttpModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export { AppComponent } from './app.component';
