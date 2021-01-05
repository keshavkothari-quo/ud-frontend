import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { AuthenticationService, AlertService } from '@/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    userName;
    userEmail;
    userData;
    loading = false;
    clicked = false;

    constructor(
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private formBuilder: FormBuilder,

    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    private loadAllUsers() {
        this.loading = true;
        this.authenticationService.getDashboard().pipe(first())
            .subscribe(data => {
                this.userData = data['data'];
            },
            error => {
                    this.alertService.error(error);
                    
                    this.loading = false;
            });
    }   
}