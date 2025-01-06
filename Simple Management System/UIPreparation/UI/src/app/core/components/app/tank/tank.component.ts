import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/services/product.service';
import { Product } from '../product/models/product';
import { DepoService } from '../depo/services/depo.service';
import { Depo } from '../depo/models/depo';

@Component({
  selector: 'app-tank',
  templateUrl: './tank.component.html',
  styleUrls: ['./tank.component.css']
})
export class TankComponent implements OnInit {

  constructor(private productService: ProductService, private depoService:DepoService) { }

  products: Depo[] = [];
  filteredProducts = [];   // Filtrelenmiş ürünler
  searchText: string = '';

  sortOption: string = 'asc'; // Sıralama türü (artan veya azalan)


  ngOnInit() {
    this.loadProducts();
    console.log(this.loadProducts())
  }

  loadProducts(): void {
    // getProductList fonksiyonunu çağırıyoruz
    this.depoService.getDepoList().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = this.products.filter(product => product.isDeleted !== true);
        console.log('products here', this.products)
        console.log('Filtred products', this.filteredProducts) // Veriyi alıp products dizisine atıyoruz
      },
      (error) => {
        console.error('Hata oluştu: ', error); // Hata durumunda console'a yazdırıyoruz
      }
    );
  }

  onSearchChange(): void {
    // sadece 'name' özelliği üzerinden arama yapılıyor
    this.filteredProducts = this.products.filter(product =>
      Depo.name.toLowerCase().includes(this.searchText.toLowerCase()) 
    );
  }

  onSortChange(): void {
    if (this.sortOption === 'asc') {
      this.filteredProducts.sort((a, b) => a.productId - b.productId);
    } else {
      this.filteredProducts.sort((a, b) => b.productId - a.productId);
    }
  }

}
