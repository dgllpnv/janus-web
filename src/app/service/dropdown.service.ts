import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CamposPesquisa } from '../model/campos-pesquisa';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) {}

  getCamposPequisa() {
    return this.http.get<CamposPesquisa[]>('assets/json/campos-pesquisa.json');
  }
}
