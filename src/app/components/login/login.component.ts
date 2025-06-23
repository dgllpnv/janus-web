import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Usuario } from "../../model/usuario";
import { TokenStorageService } from "../../helpers/token-storage.service";
import { LoginService } from "../../service/login-service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  version = "1.0.0";
  destroy$: Subject<boolean> = new Subject<boolean>();
  form: FormGroup;
  usuario = {} as Usuario;
  error: boolean = false;
  mensagem: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private service: LoginService,
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      login: new FormControl(this.usuario.login, Validators.required),
      password: new FormControl(this.usuario.password, Validators.required),
    });
  }

  login() {
    if (this.form.valid) {
      const login = this.form.get("login").value;
      const password = this.form.get("password").value;

      this.usuario.login = login;
      this.usuario.password = password;

      // Enviar credenciais para o serviço de login
      this.service
        .postEntity(this.usuario)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.error = false;

            // Salvar informações do usuário e token
            this.tokenService.saveUser(data);
            this.tokenService.saveToken(data.token);

            // Redirecionar para /send-pdf após login bem-sucedido
            this.router.navigate(["/busca-local-votacao"]);
          },
          error: (error) => {
            this.error = true;

            // Tratar erros específicos
            if (error.status === 504) {
              this.mensagem = "Sistema Indisponível";
            } else if (error.status === 401) {
              this.mensagem = "Usuário ou Senha incorretos.";
            } else if (error.error.errors && error.error.errors.length > 0) {
              this.mensagem = error.error.errors[0];
            } else {
              this.mensagem = "Erro inesperado.";
            }
          },
        });
    } else {
      this.error = true;
      this.mensagem = "Preencha todos os campos.";
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
