import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertifyService } from 'app/core/services/alertify.service';
import { LookUpService } from 'app/core/services/LookUp.service';
import { AuthService } from 'app/core/components/admin/login/services/auth.service';
import { Order } from './models/order';
import { OrderService } from './services/order.service';
import { environment } from 'environments/environment';
import { CustomerService } from '../customer/services/customer.service';
import { Customer } from '../customer/models/customer';
import { ProductService } from '../product/services/product.service';
import { Product } from '../product/models/product';
import { DepoService } from '../depo/services/depo.service';
import { Depo } from '../depo/models/depo';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

declare var jQuery: any;

export enum StatusEnum {
	Approved = 'Approved',
	Pending = 'Pending',
	Cancelled = 'Cancelled',
	Rejected = 'Rejected'
  }

  export const OrderStatusList = [
	{ id: 0, label: 'Approved' },
	{ id: 1, label: 'Pending' },
	{ id: 2, label: 'Cancelled' },
	{ id: 3, label: 'Rejected' },
  ];




  

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})
export class OrderComponent implements AfterViewInit, OnInit {
	
	dataSource: MatTableDataSource<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns: string[] = ['createdUserId','createdDate','lastUpdatedUserId','lastUpdatedDate','OrderStatus','customerId','productId','quantity', 'update','delete'];

	orderList:Order[];
	order:Order=new Order();

	orderAddForm: FormGroup;


	orderId:number;

	customers: Customer[] = [];
	products: Product[] = [];
	depos: Depo[] = [];

;
	orderStatusList = OrderStatusList;

	quantityOptions: number[] = [];

	colorMapping: { [key: number]: string } = {
		8: 'Kırmızı',
		9: 'Mavi',
		13: 'Siyah',
		14: 'Beyaz'
	  };

	constructor(private orderService:OrderService, private lookupService:LookUpService,private alertifyService:AlertifyService,private formBuilder: FormBuilder, private authService:AuthService, private customerService: CustomerService, private productService: ProductService, private depoService:DepoService) { }

	

    ngAfterViewInit(): void {
        this.getOrderList();
    }

	ngOnInit() {

		this.createOrderAddForm();
		this.getCustomers();
		this.getProducts();
		this.getDepos();
		this.onProductChange();
		
		console.log('quantityOptions', this.quantityOptions)
		console.log('Data Sorsss', this.dataSource);


		this.orderAddForm.get('productId').valueChanges.subscribe(value => {
			console.log('Product ID value changed:', value);
			this.onProductChange();
		  });
		

	}

	

	getOrderList() {
		this.orderService.getOrderList().subscribe(data => {
		  // isDeleted değeri 1 olmayanları filtreliyoruz
		  const filteredData = data.filter(item => item.isDeleted !== true);
	  
		  this.orderList = filteredData;
		  this.dataSource = new MatTableDataSource(filteredData);
		  console.log('dataSource', this.dataSource);
		  this.configDataTable();
		});
	  }
	  

	save(){

		if (this.orderAddForm.valid) {
			this.order = Object.assign({}, this.orderAddForm.value)

			if (this.order.id == 0)
				this.addOrder();
			else
				this.updateOrder();
		}

	}

	addOrder(){

		this.orderService.addOrder(this.order).subscribe(data => {
			this.getOrderList();
			this.order = new Order();
			jQuery('#order').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.orderAddForm);

		})

	}

	updateOrder(){

		this.orderService.updateOrder(this.order).subscribe(data => {

			var index=this.orderList.findIndex(x=>x.id==this.order.id);
			this.orderList[index]=this.order;
			this.dataSource = new MatTableDataSource(this.orderList);
            this.configDataTable();
			this.order = new Order();
			jQuery('#order').modal('hide');
			this.alertifyService.success(data);
			this.clearFormGroup(this.orderAddForm);

		})

	}

	createOrderAddForm() {
		this.orderAddForm = this.formBuilder.group({		
			id : [0],
			createdUserId : this.authService.getCurrentUserId(),
			lastUpdatedUserId : this.authService.getCurrentUserId(),
			orderStatus: [null],
			isDeleted : [false],
			customerId : [0, Validators.required],
			productId : [0, Validators.required],
			quantity: [0, Validators.required],
			status: [true]
		})
	}

	deleteOrder(orderId:number){
		this.orderService.deleteOrder(orderId).subscribe(data=>{
			this.alertifyService.success(data.toString());
			this.orderList=this.orderList.filter(x=> x.id!=orderId);
			this.dataSource = new MatTableDataSource(this.orderList);
			this.configDataTable();
		})
	}

	getOrderById(orderId:number){
		this.clearFormGroup(this.orderAddForm);
		this.orderService.getOrderById(orderId).subscribe(data=>{
			this.order=data;
			this.orderAddForm.patchValue(data);
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

	getCustomers() {
		this.customerService.getCustomerList().subscribe(
		  (data: Customer[]) => {
			console.log('api yanıtı', data);
			this.customers = data.filter(customer => customer.isDeleted !== true);
		  },
		  (error) => {
			console.error('Müşteri listesi alınırken bir hata oluştu:', error);
		  }
		);
	  }

	getProducts(){
		this.productService.getProductList().subscribe(
			(data: Product[]) => {
				console.log('product Yanıtı', data);
				this.products = data.filter(data => data.isDeleted !== true)
			},
			(error) => {
				console.error('Customer hata', error);
			}
		)
	}

	getDepos(){
		this.depoService.getDepoList().subscribe(
			(data: Depo[]) => {
				console.log('depo yanıtı', data);
				this.depos = data.filter(depo => depo.isDeleted !== true)
			},
			(error) => {
				console.error('depo hata', error);
			}
		)
	}

	  // Formdaki productId değişimi üzerine quantity seçeneklerini güncelle

	  onProductChange() {
		const productId = Number(this.orderAddForm.get('productId').value); 
		console.log('Selected Product ID:', productId); // Değeri kontrol et
	  
		if (productId) {
		  const selectedDepo = this.depos.find(depo => {
			console.log('Checking Depo productId:', depo.productId); // Depoların productId'lerini kontrol et
			return depo.productId === productId;
		  });
		  console.log('Selected Depo:', selectedDepo); // Depo kontrolü
		  if (selectedDepo) {
			this.updateQuantityOptions(selectedDepo.quantity);
		  } else {
			console.log('No matching depo found for productId:', productId);
		  }
		}
	  }
	  

	    // Depo stoğuna göre quantity seçeneklerini güncelle

		updateQuantityOptions(stockQuantity: number) {
			console.log('Stock Quantity:', stockQuantity); // Depo stoğunu kontrol et
			this.quantityOptions = []; // Önce eski seçenekleri temizle
			for (let i = 1; i <= stockQuantity; i++) {
			  this.quantityOptions.push(i);
			}
			console.log('Quantity Options:', this.quantityOptions); // Yeni quantity seçeneklerini kontrol et
		  }
		  


	getColorName(colorId: number): string {
		return this.colorMapping[colorId] || 'Bilinmiyor'; // Eğer colorId yoksa 'Bilinmiyor' döner.
	}

	


	

	

  }
