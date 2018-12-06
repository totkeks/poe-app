import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkilltreeComponent } from './skilltree/skilltree.component';

const routes: Routes = [
  {
    path: 'skilltree',
    component: SkilltreeComponent
  },
  {
    path: '',
    redirectTo: '/skilltree',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
