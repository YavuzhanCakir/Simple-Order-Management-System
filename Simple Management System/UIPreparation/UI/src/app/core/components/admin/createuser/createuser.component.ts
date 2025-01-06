import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { Router } from '@angular/router';
import { AlertifyService } from 'app/core/services/alertify.service';
import { CreateUser } from '../login/model/create-user';  // Kendi RegisterUser modelini eklemelisin
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from '../login/services/auth.service';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit {

  createUser: CreateUser = new CreateUser();  // Yeni kullanıcı nesnesi

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private alertifyService: AlertifyService,
    private httpClient: HttpClient,
    private userServices: UserService
  ) {}

  ngOnInit() {
    // username initialisi yapılabilir
  }

  // Kayıt işlemi
  create() {
    if (this.isFormValid()) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.httpClient.post<any>(environment.getApiUrl + "/Users", this.createUser, { headers })
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

  createuser() {
    console.log('Form data:', this.createUser); // Form verilerini konsola yazdırma
    this.userServices.addUser(this.createUser).subscribe(
      response => {
        console.log('User added successfully', response);
      },
      error => {
        console.error('Error adding user', error);
      }
    );
  }

  // Formun geçerliliğini kontrol et
  isFormValid(): boolean {
    return !!this.createUser.FullName && !!this.createUser.Password && !!this.createUser.Email;
  }

}
