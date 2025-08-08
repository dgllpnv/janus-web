import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const SEPARADOR = "/";

@Injectable({
    providedIn: 'root'
})
export abstract class BaseService<T> {

    basePath = environment.apiUrl;

    constructor(private path: string, 
        private http: HttpClient) {
            this.path = this.basePath + this.path;
        }

    getEntity(id: string) : Observable<T> {
        return this.http.get<T>(this.path + SEPARADOR + id);
    }

    getAllEntities() : Observable<T[]> {
        return this.http.get<T[]>(this.path);
    }

    postEntity(entity: T) : Observable<T> {
        return this.http.post<T>(this.path, entity);
    }

    deleteEntity(id: string) : Observable<T> {
        return this.http.delete<T>(this.path + SEPARADOR + id);
    }
}