package br.janus.loginpje.service;

import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CookieJar isolado por host para manter a sessão do PJe.
 */
public class SessionCookieJar implements CookieJar {

    private final Map<String, List<Cookie>> store = new ConcurrentHashMap<>();

    @Override
    public synchronized void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
        store.put(url.host(), new ArrayList<>(cookies));
    }

    @Override
    public synchronized List<Cookie> loadForRequest(HttpUrl url) {
        List<Cookie> cookies = store.get(url.host());
        return cookies != null ? new ArrayList<>(cookies) : Collections.emptyList();
    }

    public synchronized void clear() {
        store.clear();
    }
}
