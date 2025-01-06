import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product/services/product.service';
import { ColorService } from '../color/services/color.service'; // ColorService'yi import ettik
import { Product } from '../product/models/product';
import { Color } from '../color/models/color'; // Color modelini import ettik

@Component({
  selector: 'app-product-detail',
  templateUrl: './productDetail.component.html',
  styleUrls: ['./productDetail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product!: Product; // Seçilen ürün bilgisi burada saklanır
  colors: Color[] = []; // Renkler burada saklanacak
  sizes: { name: string, id: number }[] = [
    { name: 'S', id: 1 },
    { name: 'M', id: 2 },
    { name: 'L', id: 3 },
    { name: 'XL', id: 4 }
  ]; 
  staticImage: string = 'https://i.pinimg.com/originals/2f/f7/7d/2ff77d149b32f6ac6b6664f9181ca803.png'; 
  quantity: number = 1;

  productDatabase: Product[] = []; // API'den gelen dinamik veriler burada saklanacak

  selectedName:string = "";
  selectedColorId: number | null = null; // Seçilen ColorId
  selectedSize: string | null = null; // Seçilen Size
  foundProductId: number | null = null;
  selectedColor: any;





  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private colorService: ColorService // ColorService'i inject ettik
  ) {}

  ngOnInit(): void {
    // URL'den id parametresini almak
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      // id ile API'den ürün detaylarını alıyoruz
      this.productService.getProductById(+productId).subscribe((data) => {
        this.product = data;
        this.selectedName = this.product.name;
        console.log('Seçili Ürün Adı:', this.selectedName);
        this.loadProducts(); // Ürün listesini al
        this.loadColors(); // Renk listesini al
      });
    }

    console.log('Seçilen Renk ID:', this.selectedColorId);
    console.log('Seçilen Beden ID:', this.selectedSize);

    console.log('Ürün Size:', this.productDatabase[25].size);
    console.log('Seçilen Size:', this.selectedSize);

    
    
  }

  // Ürün listesini ProductService'den alıyoruz
  loadProducts(): void {
    this.productService.getProductList().subscribe((data) => {
      this.productDatabase = data; // Dinamik olarak ürünleri yüklüyoruz
      console.log('database',this.productDatabase);
    });
  }

  // Renkleri ColorService ile alıyoruz
  loadColors(): void {
    this.colorService.getColorList().subscribe((data) => {
      // isDeleted değeri true olmayan renkleri filtreliyoruz
      this.colors = data.filter(color => color.isDeleted !== true);
    });
  }
  

  // Renk seçme işlemi
  onColorSelect(color: any) {
    // Seçilen rengin id'sine erişim
    this.selectedColorId = color.id;
    console.log('Seçilen Renk ID:', this.selectedColorId);
    // Seçilen renk işlemi burada yapılabilir
  }

  // beden seçme
  onSizeSelect(size: { name: string, id: number }) {
    this.selectedSize = size.name;
    console.log('Seçilen Beden ID:', this.selectedSize);
  }
  

  // Sepete ekleme işlemi
  

  incrementQuantity() {
    this.quantity++;
  }
  
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Ürün arama fonksiyonu
  searchProduct(): void {
    
    // Seçilen Name, ColorId ve Size'yi kontrol edip, productDatabase içinde arama yapıyoruz
    const foundProduct = this.productDatabase.find(product => 
      
      
      product.name.toLowerCase() === this.selectedName.toLowerCase() && 
      product.colorId === this.selectedColorId && 
      product.size.toLowerCase() === this.selectedSize?.toLowerCase() // Bedenleri karşılaştırırken büyük küçük harf duyarsız yapıyoruz
    );
    console.log("productName", this.product.name);
    console.log('SelectedName',this.selectedName);

    console.log('product.ColorId', this.product.colorId);
    console.log('selectedColorId', this.selectedColorId);

    console.log('Ürün Size:', this.product.size);
    console.log('Seçilen Size:', this.selectedSize);

  
    if (foundProduct) {
      this.foundProductId = foundProduct.id;
      console.log('Bulunan Ürün ID:', this.foundProductId); // Eşleşen ürünün ID'sini yazdırıyoruz
    } else {
      console.log('Eşleşen ürün bulunamadı.');
    }
  }


  addToCart(): void {
    // Ürünü bulma işlemi ve gerekli bilgileri oluşturduktan sonra
    const cartItem = {
      productId: this.foundProductId,
      quantity: this.quantity,
    };
  
    // localStorage'a ekleme
    let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Mevcut sepeti al (eğer varsa)
    cart.push(cartItem); // Yeni ürünü sepete ekle
    localStorage.setItem('cart', JSON.stringify(cart)); // Sepeti tekrar kaydet
  
    console.log('Sepet güncellendi:', cart);
  }
  
  

}
