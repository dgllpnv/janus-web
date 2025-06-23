import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalVotacaoService {
  private apiUrl = 'http://localhost:8081/api/locations';

  constructor(private http: HttpClient) {}

  validateCep(cep: string): boolean {
    return /^[0-9]{5}-?[0-9]{3}$/.test(cep);
  }

  getVotingLocationsFiltered(lat: number, lon: number, zona: number|null, limite: number = 5) {
    let url = `${this.apiUrl}/proximos?lat=${lat}&lon=${lon}&limite=${limite}`;
    if (zona !== null && !isNaN(zona)) {
      url += `&zona=${zona}`;
    }

    console.log('Realizando requisição para:', url);

    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  getZonaByBairro(bairro: string) {
    const url = `${this.apiUrl}/zona?bairro=${encodeURIComponent(bairro)}`;
    return this.http.get<number>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obter estatísticas de geocodificação por zona eleitoral
   */
  getEstatisticasPorZona() {
    const url = `${this.apiUrl}/estatisticas/zona`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obter estatísticas de geocodificação por município
   */
  getEstatisticasPorMunicipio() {
    const url = `${this.apiUrl}/estatisticas/municipio`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obter locais de votação sem coordenadas geográficas
   */
  getLocaisSemCoordenadas() {
    const url = `${this.apiUrl}/sem-coordenadas`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Iniciar geocodificação em massa de todos os locais sem coordenadas
   */
  iniciarGeocodificacaoEmMassa() {
    const url = `${this.apiUrl}/geocodificar-todos`;
    return this.http.post<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro no servidor: ${error.status}, mensagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
