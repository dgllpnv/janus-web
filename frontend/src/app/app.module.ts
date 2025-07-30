import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

// Módulos de Formulários
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Módulos Bootstrap
import { NgbModule, NgbPaginationModule, NgbAlertModule } from "@ng-bootstrap/ng-bootstrap";

// Máscaras (opcional, se usar)
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";

// Locale para Português do Brasil
import ptBr from "@angular/common/locales/pt";
import { registerLocaleData } from "@angular/common";

// Componentes utilizados no JANUS WEB
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ModalIniciarAutomacaoComponent } from "./components/modal-iniciar-automacao/modal-iniciar-automacao.component";
import { PainelServidorComponent } from "./components/painel-servidor/painel-servidor.component";
import { DashboardAutomacoesComponent } from "./components/dashboard-automacoes/dashboard-automacoes.component";
import { LoginPjeComponent } from './login-pje/login-pje.component';

// Registro de Locale
registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    ModalIniciarAutomacaoComponent,
    PainelServidorComponent,
    DashboardAutomacoesComponent,
    LoginPjeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgxMaskDirective,
    NgxMaskPipe,
    RouterModule.forRoot([
      { path: "automacoes", component: DashboardAutomacoesComponent },
      { path: "servidor/:nome", component: PainelServidorComponent },
      { path: "login-pje", component: LoginPjeComponent },
      { path: "", redirectTo: "automacoes", pathMatch: "full" },
      { path: "**", component: PageNotFoundComponent },
    ])
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pt" },
    { provide: DEFAULT_CURRENCY_CODE, useValue: "BRL" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
