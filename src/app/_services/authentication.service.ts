import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    register(name,email,password) {
        return this.http.post<any>(`${config.apiUrl}/api/register`, { name, email, password }).pipe(map(user => {
            return this.setAuthorization(user);
        }))
    }

    login(email, password) {
        
        return this.http.post<any>(`${config.apiUrl}/api/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                return this.setAuthorization(user);
            }));
    }

    setAuthorization(user){
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('Authorization',user.data.token);
        this.currentUserSubject.next(user);
        return user;
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    getDashboard(){
        let authorization = localStorage.getItem("Authorization");
        const headers= new HttpHeaders()
                .set('content-type', 'application/json')
                .set('Authorization',authorization);
        
        return this.http.get(`${config.apiUrl}/api/dashboard`, { 'headers': headers });
    }
}