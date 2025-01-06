import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { Router } from '@angular/router';
import { AlertifyService } from 'app/core/services/alertify.service';
import { RegisterUser } from '../login/model/register-user';  // Kendi RegisterUser modelini eklemelisin
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from '../login/services/auth.service';
import { FormsModule } from '@angular/forms';
// import { log } from 'console';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  
})
export class RegisterComponent implements OnInit {
  registerUser: RegisterUser = new RegisterUser();  // Yeni kullanıcı nesnesi

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private alertifyService: AlertifyService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    // username initialisi yapılabilir
  }

  // Kayıt işlemi
  register() {
    if (this.isFormValid()) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpClient.post<any>(environment.getApiUrl + "/Auth/register", this.registerUser, { headers })
        .subscribe(
          (data) => {
           
            if (data.success) {
              this.alertifyService.success('Kayıt başarılı!');
              this.router.navigate(['/login']);  // Kayıt başarıyla tamamlandıktan sonra giriş sayfasına yönlendir.
            } else {
              this.alertifyService.error(data.message);
            }
          },
          (error) => {
            console.error('Kayıt Hatası:', error); 
            this.alertifyService.error('Kayıt sırasında bir hata oluştu.');
          }
        );
    } else {
      this.alertifyService.warning('Lütfen tüm alanları doldurun.');
    }
  }

  // Formun geçerliliğini kontrol et
  isFormValid(): boolean {
    return !!this.registerUser.fullName && !!this.registerUser.password && !!this.registerUser.email;
  }
}
