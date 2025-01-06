import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order/services/order.service';
import { Order } from '../order/models/order';


@Component({
  selector: 'app-orderReport',
  templateUrl: './orderReport.component.html',
  styleUrls: ['./orderReport.component.css']
})
export class OrderReportComponent implements OnInit {

  orders : Order[] = [];

  filteredOrders: Order[] = [];
  searchText: string = '';

  constructor(private orderService:OrderService) { }

  ngOnInit() {
    this.getOrder()
  }

  getOrder() {
    this.orderService.getOrderList().subscribe(
      (data) => {
        this.orders = data; // Tüm veriyi alıyoruz
        this.filteredOrders = this.orders.filter(order => order.isDeleted !== true); // isDeleted=1 olanları filtreliyoruz
        console.log('data', this.filteredOrders); // Sadece filtrelenmiş veriyi göster
      },
      (error) => {
        console.error('Hata oluştu: ', error);
      }
    );
  }

  onSearchChange(): void {
    this.filteredOrders = this.orders.filter(order =>
      (order.customerId?.toString().includes(this.searchText) || '') ||
      (order.productId?.toString().includes(this.searchText) || '') ||
      (order.quantity?.toString().includes(this.searchText) || '') ||
      (order.orderStatus?.toString().includes(this.searchText) || '')
    );
  }

}
