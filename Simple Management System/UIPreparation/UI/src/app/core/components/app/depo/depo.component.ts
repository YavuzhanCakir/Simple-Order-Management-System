import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { Depo } from './models/depo';
import { DepoService } from './services/depo.service';
import { environment } from 'environments/environment';
import { ProductService } from '../product/services/product.service';
import { Product } from '../product/models/product';
import { ColorService } from '../color/services/color.service';
import { Color } from '../color/models/color';

declare var jQuery: any;

@Component({
	selector: 'app-depo',
	templateUrl: './depo.component.html',
	styleUrls: ['./depo.component.scss']
})
export class DepoComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','createdUserId','createdDate','lastUpdatedUserId','lastUpdatedDate','status','productId','productName','ColorName','quantity','size', 'update','delete'];

	depoList:Depo[];
	depo:Depo=new Depo();

	depoAddForm: FormGroup;


	depoId:number;

	products: Product[] = [];
	depolookUp: any[] = [];
	colors: Color[] = [];

	selectedColorName: string = ''; // Seçilen renk adı
 	selectedSize: string = '';
	

	constructor(private depoService:DepoService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService, private productService:ProductService, private colorService:ColorService) { }

    ngAfterViewInit(): void {
        this.getDepoList();
    }

	ngOnInit() {
		this.createDepoAddForm();
		this.loadProducts();
		this.loadColors();
	  
		// Ürün ID seçildiğinde ismi, colorId ve size otomatik doldur
		this.depoAddForm.get('productId')?.valueChanges.subscribe((selectedProductId) => {
		  const selectedProduct = this.products.find(product => product.id === selectedProductId);
		  if (selectedProduct) {
			this.depoAddForm.patchValue({
			  productName: selectedProduct.name,
			  colorId: selectedProduct.colorId,  // colorId'yi güncelliyoruz
			  size: selectedProduct.size  // size'yi de güncelliyoruz
			});
		  } else {
			this.depoAddForm.patchValue({
			  productName: '',
			  colorId: '',  // colorId'yi boş bırakıyoruz
			  size: ''  // size'yi boş bırakıyoruz
			});
		  }
		});
	  }
	  
	  


	getDepoList() {
		this.depoService.getDepoList().subscribe(data => {
			const filteredData = data.filter(depo => depo.isDeleted !== true);
			this.depoList = filteredData;
			this.dataSource = new MatTableDataSource(filteredData);
            this.configDataTable();
		});
	}


	save(){

		if (this.depoAddForm.valid) {
			this.depo = Object.assign({}, this.depoAddForm.value)

			if (this.depo.id == 0)
				this.addDepo();
			else
				this.updateDepo();
		}

	}

	addDepo() {
		this.depoService.addDepo(this.depo).subscribe(
		  (data) => {
			this.getDepoList(); // Depo listesini yenile
			this.depo = new Depo(); // Formu temizle
			jQuery('#depo').modal('hide'); // Modalı kapat
			this.alertifyService.success('Depo başarıyla eklendi.'); // Başarı mesajı
			this.clearFormGroup(this.depoAddForm); // Form grubunu sıfırla
		  },
		  (error) => {
			console.error('Hata oluştu:', error); // Hata konsola yazılır
			this.alertifyService.error(error.error.message || 'Var olan ürün tekrar eklenemez'); // Hata mesajını göster
		  }
		);
	  }
	  

	updateDepo() {

		if (this.depo.isDeleted) {
			this.alertifyService.error("Silinmiş bir ürün güncellenemez.");
			return;
		}
		
		this.depoService.updateDepo(this.depo).subscribe({
			next: (data) => {
				// Başarılı durum
				var index = this.depoList.findIndex(x => x.id == this.depo.id);
				this.depoList[index] = this.depo;
				this.dataSource = new MatTableDataSource(this.depoList);
				this.configDataTable();
				this.depo = new Depo();
				jQuery('#depo').modal('hide');
				this.alertifyService.success("Depo başarıyla güncellendi!");
				this.clearFormGroup(this.depoAddForm);
			},
			error: (err) => {
				// Hata durumu
				console.error("Hata:", err);
				const errorMessage = err.error.Message || "Yeni ürün ID'si zaten başka bir ürüne ait.";
				this.alertifyService.error(errorMessage); // Hata mesajını göster
			}
		});
	}
	

	createDepoAddForm() {
		this.depoAddForm = this.formBuilder.group({		
			id : [0],
			createdUserId : this.authService.getCurrentUserId(),
			lastUpdatedUserId : this.authService.getCurrentUserId(),
			status : true,
			isDeleted : false,
			productId : [0, Validators.required],
			productName : ["", Validators.required],
			colorId : [0, Validators.required],
			quantity : [0, Validators.required],
			size: [null, Validators.required]
					})
	}

	deleteDepo(depoId:number){
		this.depoService.deleteDepo(depoId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.depoList=this.depoList.filter(x=> x.id!=depoId);
			this.dataSource = new MatTableDataSource(this.depoList);
			this.configDataTable();
		})
	}

	getDepoById(depoId:number){
		this.clearFormGroup(this.depoAddForm);
		this.depoService.getDepoById(depoId).subscribe(data=>{
			this.depo=data;
			this.depoAddForm.patchValue(data);
		})
	}


	clearFormGroup(group: FormGroup) {

		group.markAsUntouched();
		group.reset();

		Object.keys(group.controls).forEach(key => {
			group.get(key).setErrors(null);
			if (key == 'id')
				group.get(key).setValue(0);
		});
	}

	checkClaim(claim:string):boolean{
		return this.authService.claimGuard(claim)
	}

	configDataTable(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	loadProducts(): void {
		this.productService.getProductList().subscribe(
		  (data) => {
			this.products = data; // Ürünleri saklıyoruz
			// Selectbox için `depolookUp` formatını hazırlıyoruz
			this.depolookUp = data.map(product => ({
			  id: product.id,
			  label: product.name // İlgili alanı kullanabilirsiniz
			}));
			console.log('Depo Lookup', this.depolookUp);
		  },
		  (error) => {
			console.error('Hata oluştu: ', error);
		  }
		);
	  }

	  onProductChange(event: Event): void {
		const selectedProductId = (event.target as HTMLSelectElement).value;
	  
		// Seçilen ID'ye karşılık gelen ürünü bul
		const selectedProduct = this.products.find(product => product.id === +selectedProductId);
	  
		// Formdaki productName, colorId ve size alanlarını güncelle
		if (selectedProduct) {
		  this.depoAddForm.get('productName')?.setValue(selectedProduct.name);
		  this.depoAddForm.get('colorId')?.setValue(selectedProduct.colorId);  // colorId, formControlName
		  this.depoAddForm.get('size')?.setValue(selectedProduct.size);  // size, formControlName
		} else {
		  this.depoAddForm.get('productName')?.setValue('');
		  this.depoAddForm.get('colorId')?.setValue('');
		  this.depoAddForm.get('size')?.setValue('');
		}
	  }
	  
	  

	  onColorChange(event: Event): void {
		const selectedProductId = (event.target as HTMLSelectElement).value;
	  
		// Seçilen ID'ye karşılık gelen ürünü bul
		const selectedProduct = this.products.find(product => product.id === +selectedProductId);
	  
		// Formdaki productName alanını güncelle
		if (selectedProduct) {
		  this.depoAddForm.get('colorId')?.setValue(selectedProduct.colorId);
		} else {
		  this.depoAddForm.get('colorId')?.setValue(selectedProduct.colorId);
		}
	  }


	  

	  loadColors(): void {
		this.colorService.getColorList().subscribe(
		  (data) => {
			this.colors = data;
			console.log('Colors loaded:', this.colors);
		  },
		  (error) => {
			console.error('Error loading colors:', error);
		  }
		);
	  }

	  getColorName(colorId: number): string {
		const color = this.colors.find(c => c.id === colorId);
		return color ? color.name : 'Bilinmiyor'; // Eğer eşleşen yoksa 'Bilinmiyor' döner.
	  }
	  

  }
