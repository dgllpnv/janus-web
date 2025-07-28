package br.janus.loginpje.service;

import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CookieJar isolado por host, recomendado para automações multiprocessadas.
 * Cada SessionCookieJar é associado a um sessionId (usuário) no serviço de login.
 */
public class SessionCookieJar implements CookieJar {

    // Armazena cookies por host (garante isolamento por domínio, essencial para SSO/Keycloak)
    private final Map<String, List<Cookie>> cookieStore = new ConcurrentHashMap<>();

    @Override
    public synchronized void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
        cookieStore.put(url.host(), new ArrayList<>(cookies));
    }

    @Override
    public synchronized List<Cookie> loadForRequest(HttpUrl url) {
        // Retorna cópia defensiva (boa prática para evitar concorrência)
        List<Cookie> cookies = cookieStore.get(url.host());
        return cookies != null ? new ArrayList<>(cookies) : Collections.emptyList();
    }

    // (Opcional) Limpeza manual, se necessário
    public synchronized void clear() {
        cookieStore.clear();
    }
}
