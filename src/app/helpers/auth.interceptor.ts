import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { TokenStorageService } from "./token-storage.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppConstants } from "../constants/app-constants";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private tokenService: TokenStorageService,
        private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.tokenService.getToken();

        if (token != null) {
            authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});
        }
        return next.handle(authReq).pipe(
          tap({
            error: error => 
            { 
                if (error.status === 401) {
                    this.router.navigate([AppConstants.LOGIN_PATH]);
                }
            }            
          }));
    }  
}