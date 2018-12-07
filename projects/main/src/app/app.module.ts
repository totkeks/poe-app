import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkilltreeComponent } from './modules/skilltree/components/skilltree.component';
import { NodeComponent } from './modules/skilltree/components/node.component';
import { EdgeComponent } from './modules/skilltree/components/edge.component';

@NgModule({
  declarations: [
    AppComponent,
    SkilltreeComponent,
    NodeComponent,
    EdgeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
