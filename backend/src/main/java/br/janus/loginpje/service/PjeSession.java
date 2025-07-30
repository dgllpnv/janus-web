package br.janus.loginpje.service;

/**
 * Armazena o estado de uma sessão de login no PJe.
 * Mantém cookies e o último ViewState conhecido.
 */
public class PjeSession {
    private final SessionCookieJar cookieJar = new SessionCookieJar();
    private String viewState;

    public SessionCookieJar getCookieJar() {
        return cookieJar;
    }

    public String getViewState() {
        return viewState;
    }

    public void setViewState(String viewState) {
        this.viewState = viewState;
    }
}
