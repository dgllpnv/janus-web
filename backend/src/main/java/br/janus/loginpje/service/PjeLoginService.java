package br.janus.loginpje.service;

import okhttp3.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import br.janus.loginpje.service.PjeSession;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PjeLoginService {

    private final Map<String, PjeSession> sessions = new ConcurrentHashMap<>();
    private final OkHttpClient baseClient = new OkHttpClient.Builder()
            .followRedirects(false)
            .build();

    /**
     * Abre a página de login e captura o ViewState.
     */
    public String iniciarSessao(String sessionId) throws IOException {
        PjeSession session = new PjeSession();
        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(session.getCookieJar()).build();

        Request req = new Request.Builder()
                .url("https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false")
                .header("User-Agent", "Mozilla/5.0")
                .get().build();

        try (Response resp = clientSessao.newCall(req).execute()) {
            if (!resp.isSuccessful()) {
                throw new RuntimeException("Falha ao acessar página de login. HTTP " + resp.code());
            }
            String html = resp.body().string();
            Document doc = Jsoup.parse(html);
            String viewState = doc.select("input[name=javax.faces.ViewState]").val();
            if (viewState == null || viewState.isEmpty()) {
                throw new RuntimeException("ViewState não encontrado no HTML.");
            }
            session.setViewState(viewState);
            sessions.put(sessionId, session);
            return viewState;
        }
    }

    /**
     * Envia login e senha e retorna a URL de redirecionamento do PJe.
     */
    public Map<String, String> autenticar(String sessionId, String login, String senha, String viewState) throws IOException {
        PjeSession session = sessions.get(sessionId);
        if (session == null) throw new RuntimeException("Sessão expirada ou inválida.");
        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(session.getCookieJar()).build();

        if (viewState == null || viewState.isEmpty()) {
            viewState = session.getViewState();
        }

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
                .header("User-Agent", "Mozilla/5.0")
                .post(form)
                .build();

        try (Response resp = clientSessao.newCall(request).execute()) {
            String xml = resp.body().string();
            if (!xml.contains("<redirect")) {
                return Map.of("erro", "Login ou senha inválidos.");
            }
            Element redirect = Jsoup.parse(xml).selectFirst("redirect");
            if (redirect == null) {
                return Map.of("erro", "Redirect não encontrado.");
            }
            String redirectUrl = redirect.attr("url");
            return Map.of("redirectUrl", redirectUrl);
        }
    }

    /**
     * Obtém dados de 2FA do Keycloak se o PJe solicitar.
     */
    public Map<String, String> capturarKeycloak(String redirectUrl, String sessionId) throws IOException {
        PjeSession session = sessions.get(sessionId);
        if (session == null) throw new RuntimeException("Sessão expirada ou inválida.");
        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(session.getCookieJar()).build();

        Request req = new Request.Builder().url(redirectUrl).get().build();
        try (Response resp = clientSessao.newCall(req).execute()) {
            String html = resp.body().string();
            Document doc = Jsoup.parse(html);
            Element form = doc.selectFirst("form#kc-form-login");
            if (form == null) throw new RuntimeException("Formulário do Keycloak não encontrado.");
            String action = form.attr("abs:action");
            String execution = form.selectFirst("input[name=execution]").val();
            return Map.of("action", action, "execution", execution);
        }
    }

    /**
     * Envia o código OTP do 2FA.
     */
    public boolean enviarCodigoOTP(String sessionId, String action, String execution, String otpCode) throws IOException {
        PjeSession session = sessions.get(sessionId);
        if (session == null) throw new RuntimeException("Sessão expirada ou inválida.");
        OkHttpClient clientSessao = baseClient.newBuilder().cookieJar(session.getCookieJar()).build();

        RequestBody formOtp = new FormBody.Builder()
                .add("otp", otpCode)
                .add("execution", execution)
                .add("client_id", "pje-treba-1g")
                .build();

        Request req = new Request.Builder().url(action).post(formOtp).build();
        try (Response resp = clientSessao.newCall(req).execute()) {
            if (resp.code() == 302) {
                String painelUrl = resp.header("Location");
                try (Response painel = clientSessao.newCall(new Request.Builder().url(painelUrl).get().build()).execute()) {
                    return painel.body().string().contains("painel-usuario-interno");
                }
            }
            return false;
        }
    }
}
