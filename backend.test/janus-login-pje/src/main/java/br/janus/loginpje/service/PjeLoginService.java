package br.janus.loginpje.service;

import okhttp3.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PjeLoginService {

    // Thread-safe: permite acesso concorrente em ambiente web real
    private final Map<String, SessionCookieJar> sessionJars = new ConcurrentHashMap<>();
    private final OkHttpClient baseClient = new OkHttpClient.Builder()
            .followRedirects(false) // Importante: nunca siga redirect em autenticação inicial!
            .build();

    /**
     * Inicia sessão: captura ViewState do PJe, armazena o cookieJar por sessionId
     */
    public String iniciarSessao(String sessionId) throws IOException {
        SessionCookieJar jar = new SessionCookieJar();
        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(jar).build();

        Request request = new Request.Builder()
                .url("https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false")
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/117.0.0.0")
                .get()
                .build();

        try (Response resp = clientSessao.newCall(request).execute()) {
            if (!resp.isSuccessful()) {
                throw new RuntimeException("Falha ao acessar página de login do PJe. HTTP " + resp.code());
            }
            String html = resp.body().string();
            Document doc = Jsoup.parse(html);
            String viewState = doc.select("input[name=javax.faces.ViewState]").val();
            if (viewState == null || viewState.isEmpty()) {
                throw new RuntimeException("ViewState não encontrado no HTML de login.");
            }
            sessionJars.put(sessionId, jar);
            System.out.println("[JANUS] Sessão iniciada: " + sessionId + " (ViewState: " + viewState.substring(0, Math.min(8, viewState.length())) + "...)");
            return viewState;
        }
    }

    /**
     * Realiza autenticação no PJe (login/senha) e retorna redirect se sucesso
     */
    public Map<String, String> autenticar(String sessionId, String login, String senha, String viewState) throws IOException {
        SessionCookieJar jar = sessionJars.get(sessionId);
        if (jar == null) throw new RuntimeException("Sessão expirada ou inválida.");

        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(jar).build();

        RequestBody form = new FormBody.Builder()
                .add("loginAplicacao", login)
                .add("senhaAplicacao", senha)
                .add("botaoEntrar", "Entrar")
                .add("javax.faces.ViewState", viewState)
                .build();

        Request request = new Request.Builder()
                .url("https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false")
                .header("Faces-Request", "partial/ajax")
                .header("X-Requested-With", "XMLHttpRequest")
                .header("Referer", "https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false")
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0")
                .post(form)
                .build();

        try (Response resp = clientSessao.newCall(request).execute()) {
            String xml = resp.body().string();

            System.out.println("[JANUS] [POST LOGIN] XML ================");
            System.out.println(xml);

            if (!xml.contains("<redirect")) {
                // Falha de autenticação
                return Map.of("erro", "Login ou senha inválidos.");
            }

            Element redirect = Jsoup.parse(xml).selectFirst("redirect");
            if (redirect == null) {
                return Map.of("erro", "Redirect não encontrado no XML.");
            }
            String redirectUrl = redirect.attr("url");
            System.out.println("[JANUS] Login OK, redirectUrl: " + redirectUrl);
            return Map.of("redirectUrl", redirectUrl);
        }
    }

    /**
     * Captura action e execution do Keycloak para o segundo fator (2FA)
     */
    public Map<String, String> capturarKeycloak(String redirectUrl, String sessionId) throws IOException {
        SessionCookieJar jar = sessionJars.get(sessionId);
        if (jar == null) throw new RuntimeException("Sessão expirada ou inválida.");
        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(jar).build();

        Request req = new Request.Builder().url(redirectUrl).get().build();

        try (Response resp = clientSessao.newCall(req).execute()) {
            String html = resp.body().string();
            Document doc = Jsoup.parse(html);
            Element form = doc.selectFirst("form#kc-form-login");
            if (form == null) throw new RuntimeException("Formulário Keycloak não encontrado!");
            String action = form.attr("abs:action");
            String execution = form.selectFirst("input[name=execution]").val();

            System.out.println("[JANUS] 2FA capturado - action: " + action + ", execution: " + execution);

            return Map.of(
                    "action", action,
                    "execution", execution
            );
        }
    }

    /**
     * Envia código OTP (2FA) para Keycloak
     */
    public boolean enviarCodigoOTP(String sessionId, String action, String execution, String otpCode) throws IOException {
        SessionCookieJar jar = sessionJars.get(sessionId);
        if (jar == null) throw new RuntimeException("Sessão expirada ou inválida.");
        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(jar).build();

        RequestBody formOtp = new FormBody.Builder()
                .add("otp", otpCode)
                .add("execution", execution)
                .add("client_id", "pje-treba-1g")
                .build();

        Request req = new Request.Builder().url(action).post(formOtp).build();

        try (Response resp = clientSessao.newCall(req).execute()) {
            // Keycloak retorna 302 Location se sucesso
            if (resp.code() == 302) {
                String painelUrl = resp.header("Location");
                try (Response painel = clientSessao.newCall(new Request.Builder().url(painelUrl).get().build()).execute()) {
                    boolean sucesso = painel.body().string().contains("painel-usuario-interno");
                    System.out.println("[JANUS] 2FA OK? " + sucesso);
                    return sucesso;
                }
            }
            System.out.println("[JANUS] 2FA não autenticado. Código retornado: " + resp.code());
            return false;
        }
    }
}
