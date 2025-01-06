import { Component, OnInit } from '@angular/core';
import { str } from 'ajv';
import { ProductService } from '../product/services/product.service';
import { Observable, forkJoin } from 'rxjs';
import { Product } from '../product/models/product';
import { OrderService } from '../order/services/order.service';
import { Order } from '../order/models/order';
import { AuthService } from '../../admin/login/services/auth.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  products: any[] = []; // LocalStorage'den alınacak ürünler burada tutulacak
  productNames: string[] = [];
  productIds: number[] = [];
  
  

  constructor(private productService:ProductService, private orderService:OrderService, private authService:AuthService){}

  ngOnInit(): void {
    this.loadProductsFromLocalStorage();
    this.loadProductIds();
    this.loadProductNames();
    this.products = this.getUniqueProducts();
    console.log('products', this.products);

    const storedProducts = localStorage.getItem('cart');
    console.log('Stored Products:', storedProducts);
    
    console.log('productIdlerr', this.productIds);

    console.log('productName', this.productNames);
  }

  // LocalStorage'den ürünleri yükle
  loadProductsFromLocalStorage(): void {
    const storedProducts = localStorage.getItem('cart');
    if (storedProducts) {
      const products = JSON.parse(storedProducts); // JSON'dan diziye dönüştür
  
      // Geçersiz (null veya undefined) ürünleri filtrele
      this.products = products.filter(
        (item: any) => item.productId !== null && item.productId !== undefined
      );
  
      console.log('Filtrelenmiş Ürünler:', this.products);
    } else {
      this.products = []; // Eğer veri yoksa boş dizi
    }
  }

  

  loadProductIds(): number[] {
    const storedProducts = localStorage.getItem('cart');
    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      console.log('Tüm Ürünler:', products);

      // Sadece geçerli (null olmayan) productId'leri filtrele
      this.productIds = products.filter((item: any) => item.productId).map((item: any) => item.productId);

      console.log('Product IDs:', this.productIds);
      return this.productIds; // ID'lerin listesi
    }
    return []; // Eğer veri yoksa boş bir dizi döndür
  }

  loadProductNames(): void {
    // Benzersiz ürünlerden productId'leri al
    const uniqueProductIds = this.products.map(product => product.productId);
  
    // Product ID'lerine göre getProductById servisini çağır
    const productRequests: Observable<Product>[] = uniqueProductIds.map(id =>
      this.productService.getProductById(id) // Her benzersiz id için servisi çağırıyoruz
    );
  
    // Tüm istekleri paralel olarak çalıştır
    forkJoin(productRequests).subscribe(products => {
      // Gelen ürünlerden name bilgilerini al ve productNames dizisine ekle
      console.log(products);

      this.productNames = products.map(product => product.name);
      console.log('Product Names:', this.productNames);
    });
  }
  

  getUniqueProducts(): any[] {
    // Öncelikle geçersiz ürünleri filtrele (null veya undefined)
    const filteredProducts = this.products.filter(
      (item: any) => item.productId !== null && item.productId !== undefined
    );
  
    // Benzersiz ürünleri oluşturmak için bir nesne (map) kullan
    const uniqueProductMap = new Map<number, any>();
  
    for (const product of filteredProducts) {
      const existingProduct = uniqueProductMap.get(product.productId);
  
      if (existingProduct) {
        // Aynı productId varsa quantity'yi artır
        existingProduct.quantity += product.quantity;
      } else {
        // Yeni ürünse map'e ekle
        uniqueProductMap.set(product.productId, { ...product });
      }
    }
  
    // Map'i diziye dönüştür
    const uniqueProducts = Array.from(uniqueProductMap.values());
    console.log('Benzersiz Ürünler:', uniqueProducts);
    return uniqueProducts;
  }

  orderProducts(): void {
    // Her ürün için bir order nesnesi oluştur
    const orders: Order[] = this.products.map(product => ({
      productId: product.productId,
      quantity: product.quantity,
      status: true,
      isDeleted: false,
      createdDate: new Date(),
      orderStatus: 1,
      customerId: this.authService.getCurrentUserId()
    }));
  
    // Tüm siparişleri sırayla gönder
    orders.forEach(order => {
      this.orderService.addOrder(order).subscribe(
        response => {
          console.log('Sipariş başarıyla eklendi:', response);
        },
        error => {
          console.error('Sipariş eklenirken hata oluştu:', error);
        }
      );
    });
  }

  deleteProduct(productId: number): void {
    // Diziden ürünü kaldır
    this.products = this.products.filter(product => product.productId !== productId);
  
    // localStorage'ı güncelle
    localStorage.setItem('cart', JSON.stringify(this.products));
  
    console.log(`Ürün silindi: ${productId}`);
    console.log('Güncel ürünler:', this.products);
  }

  increaseQuantity(productId: number): void {
    const product = this.products.find(p => p.productId === productId);
    if (product) {
      product.quantity++;
      this.updateLocalStorage();
      console.log(`Ürün miktarı artırıldı: ${productId}, Yeni miktar: ${product.quantity}`);
    }
  }
  
  decreaseQuantity(productId: number): void {
    const product = this.products.find(p => p.productId === productId);
    if (product && product.quantity > 1) {
      product.quantity--;
      this.updateLocalStorage();
      console.log(`Ürün miktarı azaltıldı: ${productId}, Yeni miktar: ${product.quantity}`);
    } else if (product) {
      console.log(`Ürün miktarı 1'den daha az olamaz: ${productId}`);
    }
  }
  
  // LocalStorage'ı güncellemek için bir yardımcı metod
  updateLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.products));
  }
  
  
  
}
