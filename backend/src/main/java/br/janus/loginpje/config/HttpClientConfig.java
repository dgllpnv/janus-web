package br.janus.loginpje.config;

import okhttp3.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.HttpCookie;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Configuration
public class HttpClientConfig {

    // CookieJar simples em memória (thread-safe). Em produção, prefira persistência por usuário.
    static class InMemoryCookieJar implements CookieJar {
        private final Map<HttpUrl, List<Cookie>> store = new ConcurrentHashMap<>();

        @Override
        public void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
            store.compute(url, (k, v) -> {
                List<Cookie> all = new ArrayList<>(v == null ? List.of() : v);
                all.addAll(cookies);
                // Deduplicar por nome+domínio+path
                Map<String, Cookie> idx = new LinkedHashMap<>();
                for (Cookie c : all) {
                    String key = c.name() + "|" + c.domain() + "|" + c.path();
                    idx.put(key, c);
                }
                return new ArrayList<>(idx.values());
            });
        }

        @Override
        public List<Cookie> loadForRequest(HttpUrl url) {
            // Retorna cookies compatíveis com o host/path solicitado
            return store.entrySet().stream()
                    .flatMap(e -> e.getValue().stream())
                    .filter(c -> HttpCookie.domainMatches(c.domain(), url.host()))
                    .filter(c -> url.encodedPath().startsWith(c.path()))
                    .collect(Collectors.toList());
        }
    }

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .cookieJar(new InMemoryCookieJar())
                .followRedirects(true)
                .followSslRedirects(true)
                .build();
    }
}
