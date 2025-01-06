import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment'
import { UserGroup } from '../../login/model/user-group';
import { CreateUser } from '../../login/model/create-user';
import { LookUp } from '../../../../models/LookUp';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUserList(): Observable<UserGroup[]> {

    return this.httpClient.get<UserGroup[]>(environment.getApiUrl + "/users/");

  }

  addUser(user: CreateUser): Observable<any> {

    var result = this.httpClient.post(environment.getApiUrl + "/users/", user, { responseType: 'text' });
    return result;
  }

  updateUser(user: UserGroup): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + "/users/", user, { responseType: 'text' });
  }


}