import { Injectable } from "@angular/core";
import { AppConstants } from "../constants/app-constants";
import { Usuario } from "../model/usuario";


@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {

    signOut() {
        window.sessionStorage.clear();
    }

    saveToken(token: string) {
        window.sessionStorage.removeItem(AppConstants.TOKEN_KEY);
        window.sessionStorage.setItem(AppConstants.TOKEN_KEY, token);
    }

    getToken(): string {
        return sessionStorage.getItem(AppConstants.TOKEN_KEY);
    }

    saveUser(user) {
        window.sessionStorage.removeItem(AppConstants.USER_KEY);
        window.sessionStorage.setItem(AppConstants.USER_KEY, JSON.stringify(user));
    }

    getUser(): Usuario {
        return JSON.parse(sessionStorage.getItem(AppConstants.USER_KEY));
    }
}