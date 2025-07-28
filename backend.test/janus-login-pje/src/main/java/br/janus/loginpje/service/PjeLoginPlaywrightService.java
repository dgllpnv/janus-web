package br.janus.loginpje.service;

import com.microsoft.playwright.*;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável por automatizar o login no PJe usando Playwright (Java).
 * Permite simulação de login real para contornar restrições de JSF/ViewState.
 */
@Service
public class PjeLoginPlaywrightService {

    public static class LoginPlaywrightResult {
        public boolean sucesso;
        public String mensagem;
        public String cookiesJson;
    }

    /**
     * Realiza login no PJe via navegador real (Chromium headless).
     *
     * @param login Usuário (CPF/CNPJ)
     * @param senha Senha do usuário
     * @return Resultado do login (sucesso, mensagem, cookies de sessão)
     */
    public LoginPlaywrightResult fazerLogin(String login, String senha) {
        LoginPlaywrightResult result = new LoginPlaywrightResult();
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                    new BrowserType.LaunchOptions().setHeadless(true) // mude para false para depurar visualmente
            );
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            // 1. Acessa a página de login do PJe
            System.out.println("[PLAYWRIGHT] Acessando página de login...");
            page.navigate("https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false");

            // 2. Preenche campos de login e senha (selectors robustos)
            page.waitForSelector("input[id='loginAplicacao'], input[name='loginAplicacao']");
            page.fill("input[id='loginAplicacao'], input[name='loginAplicacao']", login);

            page.waitForSelector("input[id='senhaAplicacao'], input[name='senhaAplicacao']");
            page.fill("input[id='senhaAplicacao'], input[name='senhaAplicacao']", senha);

            // 3. Clica no botão "Entrar"
            System.out.println("[PLAYWRIGHT] Submetendo login...");
            page.click("button[id='botaoEntrar'], button[name='botaoEntrar']");

            // 4. Aguarda retorno e processamento do PJe
            page.waitForTimeout(2000); // timeout curto para aguardar resposta (melhore conforme necessário)

            // 5. Analisa resultado do login
            if (page.url().contains("painel-usuario-interno") || page.url().contains("ng2/dev.seam")) {
                result.sucesso = true;
                result.mensagem = "Login realizado com sucesso!";
                System.out.println("[PLAYWRIGHT] Login OK - URL: " + page.url());
            } else if (page.content().contains("Código de autenticação") || page.isVisible("#formAutenticacaoCodigo")) {
                result.sucesso = false;
                result.mensagem = "Autenticação em dois fatores solicitada.";
                System.out.println("[PLAYWRIGHT] 2FA requerido.");
            } else if (page.content().contains("Usuário ou senha inválidos")) {
                result.sucesso = false;
                result.mensagem = "Usuário ou senha inválidos.";
                System.out.println("[PLAYWRIGHT] Credenciais inválidas.");
            } else {
                result.sucesso = false;
                result.mensagem = "Não foi possível determinar o status do login. URL: " + page.url();
                System.out.println("[PLAYWRIGHT] Status indefinido - URL: " + page.url());
            }

            // 6. Coleta cookies de sessão (em JSON)
            result.cookiesJson = context.cookies().toString();

            // (Opcional) Você pode persistir os cookies localmente ou integrar com backend, se necessário.

            browser.close();
        } catch (Exception e) {
            result.sucesso = false;
            result.mensagem = "Erro no Playwright: " + e.getMessage();
            System.err.println("[PLAYWRIGHT] Falha de automação: " + e.getMessage());
            e.printStackTrace();
        }
        return result;
    }
}
