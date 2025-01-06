import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './core/components/app/layouts/admin-layout/admin-layout.component';
import { ProductionComponent } from './core/components/app/production/production.component';
import { LoginGuard } from './core/guards/login-guard';
import { OrderComponent } from './core/components/app/order/order.component';
import { RegisterComponent } from './core/components/admin/register/register.component';
import { Adduser2Component } from './core/components/app/adduser2/adduser2.component';
import { CreateuserComponent } from './core/components/admin/createuser/createuser.component';
import { ProductDetailComponent } from './core/components/app/productDetail/productDetail.component';
import { CardComponent } from './core/components/app/card/card.component';
import { MyordersComponent } from './core/components/app/myorders/myorders.component';
// import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
// import { LoginComponent } from './login/login.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  { 
    path:'register',
    component:RegisterComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      // loadChildren: './core/components/app/layouts/admin-layout/admin-layout.module#AdminLayoutModule'
        loadChildren: () => import('./core/modules/admin-layout.module').then(m => m.AdminLayoutModule)
    },
    { 
    path:'Production',
    component:ProductionComponent, 
    canActivate:[LoginGuard]
    },
    { 
      path:'CreateUser',
      component:CreateuserComponent, 
      canActivate:[LoginGuard]
    },
    { 
      path: 'product/:id', 
      component: ProductDetailComponent 
    },
    { 
      path: 'card', 
      component: CardComponent 
    },
    {
      path: 'myorders',
      component: MyordersComponent
    }

  
  ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
    [RouterModule]
  ],
})
export class AppRoutingModule { }
