import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { environment } from 'environments/environment';
import { LookUpService } from 'app/core/services/LookUp.service';
import { Customer } from './models/customer';
import { CustomerService } from './services/customer.service';

declare var jQuery: any;

@Component({
	selector: 'app-customer',
	templateUrl: './customer.component.html',
	styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['id','createdUserId','createdDate','lastUpdatedUserId','lastUpdatedDate','status','customerName','customerCode','address','phoneNumber','email', 'update','delete'];

	customerList:Customer[];
	customer:Customer=new Customer();

	customerAddForm: FormGroup;


	customerId:number;

	products2 = [
		{ id: 1, name: 'T-Shirt', colorId: 1, size: 'M', createdUserId: 23 },
		{ id: 2, name: 'Pantolon', colorId: 2, size: 'L', createdUserId: 1 },
		{ id: 3, name: 'Kazak', colorId: 3, size: 'S', createdUserId: 45 },
	  ];

	constructor(private customerService:CustomerService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService) { }

    ngAfterViewInit(): void {
        this.getCustomerList();
    }

	ngOnInit() {

		this.createCustomerAddForm();
	}


	getCustomerList() {
		this.customerService.getCustomerList().subscribe(data => {
		  // isDeleted değeri 1 olanları filtreleyin
		  const filteredData = data.filter(customer => customer.isDeleted !== true);
		  this.customerList = filteredData;
		  this.dataSource = new MatTableDataSource(filteredData);
		  this.configDataTable();
		});
	  }
	  

	save(){

		if (this.customerAddForm.valid) {
			this.customer = Object.assign({}, this.customerAddForm.value)

			if (this.customer.id == 0)
				this.addCustomer();
			else
				this.updateCustomer();
		}

	}

	addCustomer() {
		this.customerService.addCustomer(this.customer).subscribe(
		  (data) => {
			this.getCustomerList(); // Müşteri listesini yenile
			this.customer = new Customer(); // Formu temizle
			jQuery('#customer').modal('hide'); // Modalı kapat
			this.alertifyService.success('Müşteri başarıyla eklendi.'); // Başarı mesajı
			this.clearFormGroup(this.customerAddForm); // Form grubunu sıfırla
		  },
		  (error) => {
			console.error('Hata oluştu:', error); // Hata konsola yazılır
			this.alertifyService.error(error.error.message || 'Kayıtlı E-posta!'); // Hata mesajını göster
		  }
		);
	  }
	  

	  updateCustomer() {
		this.customerService.updateCustomer(this.customer).subscribe(
		  (data) => {
			// Müşteri bilgilerini güncelle
			var index = this.customerList.findIndex(x => x.id == this.customer.id);
			this.customerList[index] = this.customer;
	  
			// Veritabanı kaydını tabloya yansıt
			this.dataSource = new MatTableDataSource(this.customerList);
			this.configDataTable();
	  
			// Formu temizle ve modalı kapat
			this.customer = new Customer();
			jQuery('#customer').modal('hide');
			this.alertifyService.success('Müşteri başarıyla güncellendi.'); // Başarı mesajı
			this.clearFormGroup(this.customerAddForm); // Formu sıfırla
		  },
		  (error) => {
			console.error('Hata oluştu:', error); // Hata konsola yazılır
			this.alertifyService.error(error.error.message || 'Kayıtlı E-posta!'); // Hata mesajını göster
		  }
		);
	  }
	  

	createCustomerAddForm() {
		this.customerAddForm = this.formBuilder.group({		
		id : [0],
		createdUserId : this.authService.getCurrentUserId(),
		status : [true, Validators.required],
		customerName : ["", Validators.required],
		customerCode : ["", Validators.required],
		address : ["", Validators.required],
		phoneNumber : ["", Validators.required],
		email : ["", Validators.required]
		})
	}

	deleteCustomer(customerId:number){
		this.customerService.deleteCustomer(customerId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.customerList=this.customerList.filter(x=> x.id!=customerId);
			this.dataSource = new MatTableDataSource(this.customerList);
			this.configDataTable();
		})
	}

	getCustomerById(customerId:number){
		this.clearFormGroup(this.customerAddForm);
		this.customerService.getCustomerById(customerId).subscribe(data=>{
			this.customer=data;
			this.customerAddForm.patchValue(data);
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

  }
