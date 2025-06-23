import { HttpClient } from "@angular/common/http";
import { Usuario } from '../model/usuario';
import { BaseService } from "./base-service";
import { Injectable } from '@angular/core';
import { AppConstants } from "../constants/app-constants";

@Injectable({
    providedIn: 'root'
})
export class LoginService extends BaseService<Usuario> {

    constructor(protected httpClient: HttpClient) {
        super(AppConstants.AUTH_PATH, httpClient);
    }
}