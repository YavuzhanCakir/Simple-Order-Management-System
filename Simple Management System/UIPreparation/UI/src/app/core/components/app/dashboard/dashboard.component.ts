import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: any[] = []; // Ürünler listesi

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log("Name here", this.loadProducts())
    this.loadProducts(); // Ürünleri yükle
    this.productService.getProductList().subscribe(products => {
      console.log("products here",products); // Burada id alanlarını kontrol et
      this.products = products;
    });
  }

  loadProducts(): void {
    this.productService.getProductList().subscribe({
      next: (data) => {
        // Farklı resim URL'lerini manuel olarak ekliyoruz
        this.products = data.map((product, index) => ({
          name: product.name,
          image: this.getImageForProduct(index) // Her ürün için bir resim seç
        }));
      },
      error: (err) => console.error('Ürünler yüklenirken hata oluştu:', err)
    });
  }
  
  // Her ürün için bir resim URL'si döndüren fonksiyon
  getImageForProduct(index: number): string {
    const images = [
      'https://i.pinimg.com/originals/2f/f7/7d/2ff77d149b32f6ac6b6664f9181ca803.png', // Ürün 1 resmi
      'https://i.pinimg.com/originals/2f/f7/7d/2ff77d149b32f6ac6b6664f9181ca803.png', // Ürün 2 resmi
      'https://i.pinimg.com/originals/2f/f7/7d/2ff77d149b32f6ac6b6664f9181ca803.png', // Ürün 3 resmi
      'https://i.pinimg.com/originals/2f/f7/7d/2ff77d149b32f6ac6b6664f9181ca803.png'
      // Daha fazla resim ekleyebilirsin
    ];
    return images[index % images.length]; // Index dışına çıkmamak için mod alıyoruz
  }
  
  
}
