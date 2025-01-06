import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { ComponentsModule } from "./core/modules/components.module";
import { AdminLayoutComponent } from "./core/components/app/layouts/admin-layout/admin-layout.component";
import { TranslationService } from "./core/services/Translation.service";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LoginGuard } from "./core/guards/login-guard";
import { AuthInterceptorService } from "./core/interceptors/auth-interceptor.service";
import { HttpEntityRepositoryService } from "./core/services/http-entity-repository.service";

// Angular Material Modules
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatListModule } from '@angular/material/list';


// Components
import { RegisterComponent } from "./core/components/admin/register/register.component";
import { CreateuserComponent } from "./core/components/admin/createuser/createuser.component";

// Services
import { ColorService } from "./core/components/app/color/services/color.service";
import { ColorComponent } from "./core/components/app/color/color.component";
import { ColorDialogComponent } from "./core/components/app/color-dialog/color-dialog.component";
import { OrderComponent } from "./core/components/app/order/order.component";
import { CardComponent } from "./core/components/app/card/card.component";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  imports: [
    BrowserAnimationsModule, // Animations support
    FormsModule, // Template-driven forms
    ReactiveFormsModule, // Reactive forms
    HttpClientModule, // HTTP requests
    ComponentsModule, // Custom components module
    RouterModule, // Routing module
    AppRoutingModule, // App routing
    NgMultiSelectDropDownModule.forRoot(), // Dropdown module
    SweetAlert2Module.forRoot(), // SweetAlert2 for notifications
    NgbModule, // Bootstrap module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationService,
        deps: [HttpClient],
      },
    }),

    // Angular Material Modules
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatListModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    RegisterComponent,
    CreateuserComponent,
    ColorComponent,
    ColorDialogComponent,
    OrderComponent,
  ],
  providers: [
    LoginGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    HttpEntityRepositoryService,
    ColorService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
