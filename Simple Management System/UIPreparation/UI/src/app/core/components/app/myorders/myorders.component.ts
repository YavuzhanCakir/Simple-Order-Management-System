import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../admin/login/services/auth.service';
import { OrderService } from '../order/services/order.service';
import { Order } from '../order/models/order';


@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent implements OnInit {

  userId: number | null = null;
  orders: Order[] = [];
  

  constructor(private authService:AuthService, private orderService:OrderService) { }

  ngOnInit() {
    this.getUserId();
    this.loadOrders();

    
  }

  getUserId(): void {
    this.userId = this.authService.getCurrentUserId(); // Kullanıcı ID'sini al
    console.log('Kullanıcı ID:', this.userId); // Test için konsola yazdır
  }

 

  loadOrders(): void {
    this.orderService.getOrderList().subscribe(
      (data: Order[]) => {
        console.log('Tüm siparişler:', data); // Tüm veriyi yazdır
        console.log('Kullanıcı ID:', this.userId); // Kullanıcı ID'sini kontrol et
        this.orders = data.filter(order => String(order.customerId) === String(this.userId));

        console.log('Filtrelenmiş siparişler:', this.orders); // Filtrelenmiş veriyi yazdır
      },
      (error) => {
        console.error('Siparişler alınırken hata oluştu:', error);
      }
    );
  }
  
  

}
