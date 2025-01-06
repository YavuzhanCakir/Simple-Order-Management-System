import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Depo } from '../models/depo';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DepoService {

  constructor(private httpClient: HttpClient) { }


  getDepoList(): Observable<Depo[]> {

    return this.httpClient.get<Depo[]>(environment.getApiUrl + '/depoes/getall')
  }

  getDepoById(id: number): Observable<Depo> {
    return this.httpClient.get<Depo>(environment.getApiUrl + '/depoes/getbyid?id='+id)
  }

  addDepo(depo: Depo): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/depoes/', depo, { responseType: 'text' });
  }

  updateDepo(depo: Depo): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/depoes/', depo, { responseType: 'text' });

  }

  deleteDepo(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/depoes/', { body: { id: id } });
  }


}