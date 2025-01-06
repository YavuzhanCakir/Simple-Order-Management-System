import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../admin/login/services/auth.service";
import { SharedService } from "app/core/services/shared.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  adminMenuItems: any[];
  userMenuItems: any[];
  userName: string;
  clickEventSubscription: Subscription;

  isAdmin: boolean = false;
  isCustomerRepresentative: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
    public translateService: TranslateService
  ) {
    this.clickEventSubscription = this.sharedService
      .getChangeUserNameClickEvent()
      .subscribe(() => {
        this.setUserName();
      });
  }

  isLoggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl("/login");
  }

  help(): void {
    window.open("https://www.devarchitecture.net/", "_blank");
  }
  ngOnInit() {
    this.userName = this.authService.getUserName();

   
    var lang = localStorage.getItem("lang") || "tr-TR";
    this.translateService.use(lang);


    const userId = this.authService.getCurrentUserId();

    // Kullanıcı kimliğine göre yetkilendirme yap
    if (userId === "1") {
      this.isAdmin = true;
      this.isCustomerRepresentative = true;
    }

    // Müşteri temsilcisi kullanıcısı için kontrol
    if (userId === '2') {
      this.isCustomerRepresentative = true;
    }
    
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  setUserName() {
    this.userName = this.authService.getUserName();
  }
  checkClaim(claim: string): boolean {
    return this.authService.claimGuard(claim);
  }
  ngOnDestroy() {
    if (!this.authService.loggedIn()) {
      this.authService.logOut();
      this.router.navigateByUrl("/login");
    }
  }
}
