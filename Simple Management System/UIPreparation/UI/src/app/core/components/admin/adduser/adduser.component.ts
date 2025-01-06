import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { Router } from '@angular/router';
import { AlertifyService } from 'app/core/services/alertify.service';
import { AddUser } from '../login/model/add-user';  // Kendi RegisterUser modelini eklemelisin
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from '../login/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})

export class RegisterComponent implements OnInit {
  addUser: AddUser = new AddUser();  // Yeni kullanıcı nesnesi

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
      this.httpClient.post<any>(environment.getApiUrl + "/Users/Add", this.addUser, { headers })
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
    return !!this.addUser.FullName && !!this.addUser.Password && !!this.addUser.Email;
  }
}
