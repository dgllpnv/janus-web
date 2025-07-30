import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Função utilitária para gerar sessionId único (melhore usando UUID em produção)
function gerarSessionId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString();
}

@Component({
  selector: 'app-login-pje',
  templateUrl: './login-pje.component.html',
  styleUrls: ['./login-pje.component.css']
})
export class LoginPjeComponent {
  etapa: 'inicio' | 'credenciais' | 'codigo' | 'finalizado' = 'inicio';
  login: string = '';
  senha: string = '';
  codigoVerificacao: string = '';
  logs: string[] = [];
  loading = false;

  // Controle de sessão e estados do fluxo
  sessionId: string = gerarSessionId();
  viewState: string = '';
  action: string = '';
  execution: string = '';

  constructor(private http: HttpClient) {}

  // Inicia a etapa de login (captura o viewState para a sessão)
  iniciarLogin() {
    this.logs = ['⏳ Conectando ao PJe...'];
    this.loading = true;
    this.sessionId = gerarSessionId(); // Sempre renove o sessionId
    this.login = '';
    this.senha = '';
    this.codigoVerificacao = '';
    this.viewState = '';
    this.action = '';
    this.execution = '';
    this.etapa = 'inicio';

    this.http.get<any>(`/api/pje/iniciar-login?sessionId=${this.sessionId}`)
      .subscribe(res => {
        this.viewState = res.viewState;
        this.logs.push('✅ Sessão iniciada. Informe seu login e senha.');
        this.etapa = 'credenciais';
        this.loading = false;
      }, err => {
        this.logs.push('❌ Erro ao conectar no PJe: ' + (err.error?.erro || err.message));
        this.loading = false;
      });
  }

  // Submete usuário e senha (espera redirectUrl, indicando necessidade de 2FA)
  enviarCredenciais() {
    this.logs.push('🔐 Enviando credenciais...');
    this.loading = true;

    this.http.post<any>(
      `/api/pje/autenticar?sessionId=${this.sessionId}`,
      {
        login: this.login,
        senha: this.senha,
        viewState: this.viewState
      }
    ).subscribe(res => {
      if (res.redirectUrl && res.redirectUrl.includes('auth')) {
        this.logs.push('📩 Código de verificação solicitado. Aguarde o e-mail.');

        // Busca action/execution para o Keycloak
        this.http.get<any>(`/api/pje/capturar-keycloak?sessionId=${this.sessionId}&redirectUrl=${encodeURIComponent(res.redirectUrl)}`)
          .subscribe(resp => {
            this.action = resp.action;
            this.execution = resp.execution;
            this.logs.push('➡️ Digite o código recebido por e-mail.');
            this.etapa = 'codigo';
            this.loading = false;
          }, err => {
            this.logs.push('❌ Falha ao capturar etapa de 2FA: ' + (err.error?.erro || err.message));
            this.loading = false;
          });

      } else if (res.redirectUrl) {
        // Login concluído sem necessidade de 2FA
        this.logs.push('✅ Login realizado com sucesso.');
        this.etapa = 'finalizado';
        this.loading = false;
      } else {
        this.logs.push('❌ Falha de login: ' + (res.erro || 'Verifique credenciais.'));
        this.loading = false;
      }
    }, err => {
      this.logs.push('❌ Falha na autenticação: ' + (err.error?.erro || err.message));
      this.loading = false;
    });
  }

  // Submete o código recebido por e-mail (2FA)
  enviarCodigo() {
    this.logs.push('📥 Enviando código de verificação...');
    this.loading = true;

    this.http.post<any>(
      `/api/pje/enviar-otp?sessionId=${this.sessionId}`,
      {
        action: this.action,
        execution: this.execution,
        otp: this.codigoVerificacao
      }
    ).subscribe(res => {
      if (res.sucesso) {
        this.logs.push('✅ Login finalizado com sucesso.');
        this.etapa = 'finalizado';
      } else {
        this.logs.push('❌ Código inválido. Verifique seu e-mail e tente novamente.');
      }
      this.loading = false;
    }, err => {
      this.logs.push('❌ Erro ao validar código: ' + (err.error?.erro || err.message));
      this.loading = false;
    });
  }
}
