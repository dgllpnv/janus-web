package br.janus.loginpje.service;

import br.janus.loginpje.playwright.PjeLoginPage;
import br.janus.loginpje.playwright.PlaywrightManager;
import com.microsoft.playwright.*;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PjePlaywrightLoginService {

    private final PlaywrightManager manager;

    public PjePlaywrightLoginService(PlaywrightManager manager) {
        this.manager = manager;
    }

    /**
     * Realiza fluxo completo de login no PJe via browser.
     * Retorna um map contendo:
     * - "needsOtp": true/false
     * - caso false: "sessionCookies" com JSON dos cookies
     * - caso true : "action", "execution" para envio de OTP
     */
    public Map<String, Object> doLogin(String login, String senha) {
        BrowserContext context = manager.newContext();
        Page page = context.newPage();
        PjeLoginPage loginPage = new PjeLoginPage(page);

        loginPage.navigate();
        // Opcional: captura ViewState se precisar repassar ao backend
        String viewState = loginPage.getViewState();

        loginPage.submitCredentials(login, senha);

        if (loginPage.isOtpRequired()) {
            String[] params = loginPage.captureKeycloakParams();
            return Map.of(
                    "needsOtp", true,
                    "action", params[0],
                    "execution", params[1]
            );
        } else if (loginPage.isLoginSuccessful()) {
            // Exporta cookies para manter sessão ativa
            var cookies = context.cookies();
            return Map.of(
                    "needsOtp", false,
                    "sessionCookies", cookies
            );
        } else {
            throw new RuntimeException("Falha inesperada no login via Playwright");
        }
    }

    /**
     * Após o usuário submeter o OTP via frontend/backend,
     * você pode reusar o mesmo context e página aqui (ou
     * reconstruir do cookieJar) para finalizar o login.
     */
}
