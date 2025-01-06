import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Color } from '../models/color';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(private httpClient: HttpClient) { }


  getColorList(): Observable<Color[]> {

    return this.httpClient.get<Color[]>(environment.getApiUrl + '/colors/getall')
  }

  getColorById(id: number): Observable<Color> {
    return this.httpClient.get<Color>(environment.getApiUrl + '/colors/getbyid?id='+id)
  }

  addColor(color: Color): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/colors/', color, { responseType: 'text' });
  }

  updateColor(color: Color): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/colors/', color, { responseType: 'text' });

  }

  deleteColor(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/colors/', { body: { id: id } });
  }


}