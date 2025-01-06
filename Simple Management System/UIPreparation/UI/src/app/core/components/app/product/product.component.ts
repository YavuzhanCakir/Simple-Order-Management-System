import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { Product } from './models/product';
import { ProductService } from './services/product.service';
import { environment } from 'environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ColorService } from '../color/services/color.service';
import { Color } from '../color/models/color';
import { MatDialog } from '@angular/material/dialog';
import { ColorDialogComponent } from '../color-dialog/color-dialog.component';


declare var jQuery: any;

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','createdUserId','createdDate','lastUpdatedUserId','lastUpdatedDate','status','name','ColorName','size', 'update','delete'];

	productList: Product[];
	product: Product = new Product();
  
	productAddForm: FormGroup;
  
	colors: Color[] = []; // Renklerin listesi
	selectedColorId: number | null = null; // Seçilen renk ID'si
	// colorService: any;

	constructor(private productService:ProductService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService, private colorService:ColorService, private dialog: MatDialog) { }

    ngAfterViewInit(): void {
        this.getProductList();
    }

	ngOnInit() {
		this.createProductAddForm();
		this.loadColors(); // Renk listesini yükle
	  }
	
	  loadColors(): void {
		this.colorService.getColorList().subscribe({
		  next: (response: Color[]) => {
			this.colors = response.filter(response => response.isDeleted !== true) // Gelen renk listesini ata
			console.log('Renk Listesi:', this.colors); // Test için log
		  },
		  error: (err) => {
			console.error('Hata oluştu:', err);
		  },
		});
	  }
	


	getProductList() {
		this.productService.getProductList().subscribe(data => {
			const filteredData = data.filter(product => product.isDeleted !== true);
			this.productList = filteredData;
			console.log(filteredData)
			this.dataSource = new MatTableDataSource(filteredData);
            this.configDataTable();
		});
	}

	

	

	save(){

		if (this.productAddForm.valid) {
			this.product = Object.assign({}, this.productAddForm.value)

			delete this.product.createdDate;
			delete this.product.lastUpdatedDate;

			
			if (this.product.id === 0)
				this.addProduct();
			else
				this.updateProduct();
		}

	}

	update(){
		if(this.productAddForm.valid){
			this.product = Object.assign({}, this.productAddForm.value)
			this.updateProduct()
		}
	}

	addProduct(){

		this.productService.addProduct(this.product).subscribe(data => {
			this.getProductList();
			this.product = new Product();
			jQuery('#product').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.productAddForm);

		})

	}

	updateProduct(){

		this.product.lastUpdatedUserId = this.authService.getCurrentUserId();
		this.productService.updateProduct(this.product).subscribe(data => {

			var index=this.productList.findIndex(x=>x.id==this.product.id);
			this.productList[index]=this.product;
			this.dataSource = new MatTableDataSource(this.productList);
            this.configDataTable();
			this.product = new Product();
			jQuery('#product').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.productAddForm);

		})

	}

	createProductAddForm() {
		this.productAddForm = this.formBuilder.group({	
			id:[0],	
			createdUserId : this.authService.getCurrentUserId(),
			createdDate : [null],
			lastUpdatedUserId : this.authService.getCurrentUserId(),
			lastUpdatedDate : [null],
			status : [true, Validators.required],
			name : ["", Validators.required],
			colorId : [0, Validators.required],
			size : ["", Validators.required],
		})
	}

	deleteProduct(productId:number){
		this.productService.deleteProduct(productId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.productList=this.productList.filter(x=> x.id!=productId);
			this.dataSource = new MatTableDataSource(this.productList);
			this.configDataTable();
		})
	}

	getProductById(productId: number) {
		this.clearFormGroup(this.productAddForm);
		this.productService.getProductById(productId).subscribe(data => {
			this.product = data;
			console.log('Ürün Verileri:', data);
			this.productAddForm.patchValue(data); // Tüm form değerlerini doldurur
		});
	}
	


	clearFormGroup(group: FormGroup) {
		group.markAsUntouched();
		group.reset();
	
		Object.keys(group.controls).forEach(key => {
			group.get(key)?.setErrors(null);
			if (key === 'id') {
				group.get(key)?.setValue(null); // ID alanını null olarak ayarlıyoruz
			}
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

	openColorDialog(): void {
		const dialogRef = this.dialog.open(ColorDialogComponent, {
		  width: '400px',
		  data: {} // Gerekirse mevcut renk bilgilerini burada gönderebilirsiniz
		});
	
		dialogRef.afterClosed().subscribe(result => {
		  if (result) {
			// Yeni eklenen/güncellenen rengi renk listesine ekleyin.
			this.colors.push(result); // Backend'e kaydedip listeyi güncelleyebilirsiniz.
		  }
		});
	  }


	  getColorName(colorId: number): string {
		const color = this.colors.find(c => c.id === colorId);
		return color ? color.name : 'Bilinmiyor'; // Eğer eşleşen yoksa 'Bilinmiyor' döner.
	  }

	

  }
