# Janus Web - Prova de Conceito de Login no PJe

Este repositório contém um backend em Spring Boot destinado a automatizar o login no sistema PJe (Primeiro Grau) mantendo a sessão ativa para utilizações posteriores.

## Como executar o backend

```bash
cd backend
./mvnw spring-boot:run
```

O servidor iniciará na porta `8081`.

## Fluxo de autenticação

1. **Iniciar sessão**
   - `GET /api/pje/iniciar-login?sessionId=UNICO`
   - Abre a página de login do PJe e retorna o `viewState` que deve ser enviado nos próximos passos.

2. **Enviar credenciais**
   - `POST /api/pje/autenticar?sessionId=UNICO`
   - Body: `{ "login": "cpf", "senha": "senha", "viewState": "..." }`
   - Retorno: `{ "redirectUrl": "..." }` se as credenciais estiverem corretas. Caso haja erro, é retornado `{ "erro": "..." }`.

3. **Verificar necessidade de 2FA**
   - Caso o `redirectUrl` recebido no passo anterior aponte para o Keycloak do PJe, é necessário capturar os dados do formulário de autenticação:
   - `GET /api/pje/capturar-keycloak?sessionId=UNICO&redirectUrl=URL`
   - Retorno: `{ "action": "...", "execution": "..." }`.

4. **Enviar código recebido por e-mail**
   - `POST /api/pje/enviar-otp?sessionId=UNICO`
   - Body: `{ "action": "...", "execution": "...", "otp": "123456" }`
   - Retorno `{ "sucesso": true }` em caso de login concluído.

Após a autenticação bem-sucedida, a sessão (cookies) permanece armazenada em memória, permitindo que robôs ou outras rotinas reutilizem a mesma sessão enquanto o processo estiver ativo.

Este fluxo deve ser acionado pelo frontend solicitando as informações de login ao usuário, verificando se o 2FA foi solicitado e, caso necessário, exibindo um campo para o código recebido por e-mail.
