﻿import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }


  getProductList(): Observable<Product[]> {

    return this.httpClient.get<Product[]>(environment.getApiUrl + '/products/getall')
  }

  getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(environment.getApiUrl + '/products/getbyid?id='+id)
  }

  addProduct(product: Product): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/products/', product, { responseType: 'text' });
  }

  updateProduct(product: Product): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/products/', product, { responseType: 'text' });

  }

  deleteProduct(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/products/', { body: { id: id } });
  }

  getProductName(): Observable<any[]> {
    return this.httpClient.get<any[]>(environment.getApiUrl).pipe(
      map((data: any[]) => {
        return data.map(item => ({ name: item.name }));  // Sadece 'name' alanını alıyoruz
      })
    );
  }

}