import { Routes } from '@angular/router';
import { GroupComponent } from 'app/core/components/admin/group/group.component';
import { LanguageComponent } from 'app/core/components/admin/language/language.component';
import { LogDtoComponent } from 'app/core/components/admin/log/logDto.component';
import { LoginComponent } from 'app/core/components/admin/login/login.component';
import { OperationClaimComponent } from 'app/core/components/admin/operationclaim/operationClaim.component';
import { TranslateComponent } from 'app/core/components/admin/translate/translate.component';
import { UserComponent } from 'app/core/components/admin/user/user.component';
import { LoginGuard } from 'app/core/guards/login-guard';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { RegisterComponent } from 'app/core/components/admin/register/register.component';
import { CustomerComponent } from '../../customer/customer.component';
import { ProductComponent } from '../../product/product.component';
import { ColorComponent } from '../../color/color.component';
import { OrderComponent } from '../../order/order.component';
import { TankComponent } from '../../tank/tank.component';
import { OrderReportComponent } from '../../orderReport/orderReport.component';
import { DepoComponent } from '../../depo/depo.component';





export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard',      component: DashboardComponent,canActivate:[LoginGuard] }, 
    { path: 'user',           component: UserComponent, canActivate:[LoginGuard] },
    { path: 'group',          component: GroupComponent, canActivate:[LoginGuard] },
    { path: 'login',          component: LoginComponent },
    { path: 'language',       component: LanguageComponent,canActivate:[LoginGuard]},
    { path: 'translate',      component: TranslateComponent,canActivate:[LoginGuard]},
    { path: 'operationclaim', component: OperationClaimComponent,canActivate:[LoginGuard]},
    { path: 'log',            component: LogDtoComponent,canActivate:[LoginGuard]},
    { path: 'register',       component: RegisterComponent, canActivate:[LoginGuard]},    
    { path: 'customer',       component: CustomerComponent, canActivate:[LoginGuard]},
    { path: 'product',        component: ProductComponent, canActivate:[LoginGuard]},
    { path: 'color',          component: ColorComponent, canActivate:[LoginGuard]},
    { path: 'order',          component: OrderComponent, canActivate:[LoginGuard]},
    { path: 'tank',           component: TankComponent, canActivate:[LoginGuard]},
    { path: 'orderreport',    component: OrderReportComponent, canActivate:[LoginGuard]},
    { path: 'depo',           component: DepoComponent, canActivate:[LoginGuard]},

    
];
