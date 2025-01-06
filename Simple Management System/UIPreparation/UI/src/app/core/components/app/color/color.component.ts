import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { Color } from './models/color';
import { ColorService } from './services/color.service';
import { environment } from 'environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../product/services/product.service';
import { Product } from '../product/models/product';

declare var jQuery: any;

@Component({
	selector: 'app-color',
	templateUrl: './color.component.html',
	styleUrls: ['./color.component.scss']
})
export class ColorComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','createdUserId','createdDate','lastUpdatedUserId','lastUpdatedDate','name','code', 'update','delete'];

	colorList:Color[];
	color:Color=new Color();

	colorAddForm: FormGroup;


	colorId:number;

	products2 = [
		{ id: 1, name: 'T-Shirt', colorId: 1, size: 'M', createdUserId: 23 },
		{ id: 2, name: 'Pantolon', colorId: 2, size: 'L', createdUserId: 1 },
		{ id: 3, name: 'Kazak', colorId: 3, size: 'S', createdUserId: 45 },
	  ];

	products: Product[] = [];

	constructor(private colorService:ColorService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService, private productService: ProductService,) { }

    ngAfterViewInit(): void {
        this.getColorList();
    }

	ngOnInit() {

		this.createColorAddForm();
	}


	getColorList() {
		this.colorService.getColorList().subscribe(data => {
			const filteredData = data.filter(color => color.isDeleted !== true);
			this.colorList = filteredData;
			this.dataSource = new MatTableDataSource(filteredData);
            this.configDataTable();
		});
	}

	

	save() {
		if (this.colorAddForm.valid) {
		  // Form verilerini alıyoruz
		  this.color = Object.assign({}, this.colorAddForm.value);
	  
		  // createdDate gibi istemediğiniz alanları siliyoruz
		  delete this.color.createdDate;
		  delete this.color.lastUpdatedDate;

	  
		  // Eğer color.id == 0 ise yeni renk ekliyoruz, yoksa güncelliyoruz
		  if (this.color.id === 0) {
			this.addColor();
		  } else {
			this.updateColor();
		  }
		}
	  }

	  addColor() {
		this.colorService.addColor(this.color).subscribe(
		  (data) => {
			// Renk listesini yenile
			this.getColorList();
			
			// Formu temizle ve modalı kapat
			this.color = new Color();
			jQuery('#color').modal('hide');
			this.alertifyService.success('Renk başarıyla eklendi.'); // Başarı mesajı
			this.clearFormGroup(this.colorAddForm); // Formu sıfırla
		  },
		  (error) => {
			console.error('Hata oluştu:', error); // Hata konsola yazılır
			this.alertifyService.error(error.error.message || 'Kayıtlı Renk'); // Hata mesajını göster
		  }
		);
	  }
	  

	  updateColor() {
		this.colorService.updateColor(this.color).subscribe(
		  (data) => {
			// Renk verisini güncelle
			var index = this.colorList.findIndex(x => x.id == this.color.id);
			this.colorList[index] = this.color;
	  
			// Veritabanı kaydını tabloya yansıt
			this.dataSource = new MatTableDataSource(this.colorList);
			this.configDataTable();
	  
			// Formu temizle ve modalı kapat
			this.color = new Color();
			jQuery('#color').modal('hide');
			this.alertifyService.success('Renk başarıyla güncellendi.'); // Başarı mesajı
			this.clearFormGroup(this.colorAddForm); // Formu sıfırla
		  },
		  (error) => {
			console.error('Hata oluştu:', error); // Hata konsola yazılır
			this.alertifyService.error(error.error.message || 'Güncellenecek Renk Zaten Mevcut'); // Hata mesajını göster
		  }
		);
	  }
	  

	createColorAddForm() {
		this.colorAddForm = this.formBuilder.group({		
			id : [0],
			createdUserId : this.authService.getCurrentUserId(),
			lastUpdatedUserId : this.authService.getCurrentUserId(),
			status : [false],
			isDeleted : [false],
			name : ["", Validators.required],
			code : [0, Validators.required]
		})
	}

	deleteColor(colorId:number){
		this.colorService.deleteColor(colorId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.colorList=this.colorList.filter(x=> x.id!=colorId);
			this.dataSource = new MatTableDataSource(this.colorList);
			this.configDataTable();
		})
	}

	getColorById(colorId:number){
		this.clearFormGroup(this.colorAddForm);
		this.colorService.getColorById(colorId).subscribe(data=>{
			this.color=data;
			this.colorAddForm.patchValue(data);
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

	getProducts(): void {
		this.productService.getProductList().subscribe(
		  (data) => {
			this.products = data
			console.log('data here', data);
		  },
		  (error) => {
			console.error('Error fetching product list', error);
		  }
		);
	  }

  }
