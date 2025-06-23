import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Servidor } from "../model/servidor";
import { BaseService } from "./base-service";
import { Injectable } from "@angular/core";
import { AppConstants } from "../constants/app-constants";
import { PageRoot } from '../model/pagination/page-root';
import { environment } from '../../environments/environment';
import { IfStmt } from "@angular/compiler";

const SEPARADOR = "/";

@Injectable({
  providedIn: 'root'
})
export class ServidorService extends BaseService<Servidor> {

  override basePath = environment.apiUrl;

  constructor(protected httpClient: HttpClient) {
    super(AppConstants.SERVIDOR_PATH, httpClient);
  }
  //getEntitiesPaginadas(page: number, size: number): Observable<Page<Servidor>> {
  getEntitiesPaginadas(page: number, size: number, filtro: string): Observable<PageRoot> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('titulo',filtro);

      

    console.log(this.basePath + AppConstants.SERVIDOR_PATH);
    return this.httpClient.get<PageRoot>(this.basePath + AppConstants.SERVIDOR_PATH, { params });

  }
}
