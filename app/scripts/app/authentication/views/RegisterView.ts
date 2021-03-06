'use strict';

import {AuthenticationViews} from './AuthenticationViews';
import {AuthenticationService} from '../service/AuthenticationService';
import {Component} from "../../../decorators/AngularComponent";

@Component(AuthenticationViews, 'register', {
    templateUrl: 'authentication/register.html',
    controllerAs: 'ctrl',
})
class RegisterController {
    public loading = false;
    public email:string;
    public password:string;
    public showPassword = false;

    // @ngInject
    constructor(
        private AuthenticationService:AuthenticationService,
        private Analytics:any
    ) {

    }

    public register() {
        if (this.loading) return;
        this.loading = true;

        this.AuthenticationService.logout();
        this.AuthenticationService.register(this.email, this.password)
            .then((response:any) => {
                this.Analytics.trackEvent('register', 'success', response.config.data.email);
                // todo login & redirect
            }).catch((reason) => {
            this.Analytics.trackEvent('register', 'error', reason.config.data.email);
            console.log(reason);
            // todo handle errors
        }).finally(() => {
            this.loading = false;
        });
    }
}