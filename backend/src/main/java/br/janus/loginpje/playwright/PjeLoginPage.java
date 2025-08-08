package br.janus.loginpje.playwright;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.WaitForSelectorState;

/**
 * Encapsula seletores e ações na página de login do PJe.
 */
public class PjeLoginPage {
    private final Page page;

    private static final String LOGIN_URL =
            "https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false";

    public PjeLoginPage(Page page) {
        this.page = page;
    }

    public void navigate() {
        page.navigate(LOGIN_URL);
        page.waitForSelector("input[name='loginAplicacao']", new Page.WaitForSelectorOptions()
                .setState(WaitForSelectorState.VISIBLE));
    }

    public String getViewState() {
        return page.inputValue("input[name='javax.faces.ViewState']");
    }

    public void submitCredentials(String login, String senha) {
        page.fill("input[name='loginAplicacao']", login);
        page.fill("input[name='senhaAplicacao']", senha);
        page.click("button:has-text('Entrar')");
    }

    public boolean isOtpRequired() {
        return page.isVisible("form#kc-form-login");
    }

    /**
     * Captura os parâmetros action e execution do formulário Keycloak.
     */
    public String[] captureKeycloakParams() {
        // Espera o form aparecer
        page.waitForSelector("form#kc-form-login", new Page.WaitForSelectorOptions()
                .setState(WaitForSelectorState.VISIBLE));

        // Pega o formulário
        ElementHandle form = page.querySelector("form#kc-form-login");

        // Extrai o atributo action
        String action = form.getAttribute("action");

        // Usa querySelector + inputValue() para extrair execution
        ElementHandle execInput = form.querySelector("input[name='execution']");
        String execution = execInput.inputValue();

        return new String[]{ action, execution };
    }

    public void submitOtp(String codigo) {
        page.fill("input[name='otp']", codigo);
        page.click("button:has-text('Continuar')");
    }

    public boolean isLoginSuccessful() {
        return page.waitForSelector("nav ul.navbar-nav").textContent()
                .contains("Painel");
    }
}
