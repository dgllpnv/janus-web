package br.janus.loginpje.playwright;

import com.microsoft.playwright.*;
import org.springframework.stereotype.Component;

/**
 * Singleton para Playwright e BrowserContext compartilhados,
 * permitindo manter a página aberta e a sessão ativa.
 */
@Component
public class PlaywrightManager {
    private final Playwright playwright;
    private final Browser browser;

    public PlaywrightManager() {
        // Cria instância Playwright e abre Chromium em modo não‐headless
        this.playwright = Playwright.create();
        this.browser = playwright.chromium()
                .launch(new BrowserType.LaunchOptions().setHeadless(false));
    }

    /**
     * Abre (ou retorna) um novo contexto com cookies isolados.
     * Permite manter a sessão ativa pelo tempo necessário.
     */
    public BrowserContext newContext() {
        return browser.newContext(
                new Browser.NewContextOptions()
                        .setViewportSize(1280, 800)
        );
    }

    public void close() {
        browser.close();
        playwright.close();
    }
}
