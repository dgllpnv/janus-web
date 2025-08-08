// 📄 src/main/java/br/janus/loginpje/service/PjeLoginService.java
package br.janus.loginpje.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import okhttp3.*;
import org.springframework.stereotype.Service;

@Service
public class PjeLoginService {

    private final OkHttpClient client;
    private String viewState = "";

    public PjeLoginService(OkHttpClient client) {
        this.client = client; // <-- agora é singleton com CookieJar
    }

    public void iniciarSessao() {
        try {
            Request request = new Request.Builder()
                    .url("https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false")
                    .header("User-Agent", "Mozilla/5.0")
                    .get()
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new RuntimeException("Erro ao acessar página de login: HTTP " + response.code());
                }
                String html = response.body().string();
                Document doc = Jsoup.parse(html);
                viewState = doc.select("input[name=javax.faces.ViewState]").val();
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao iniciar sessão no PJe: " + e.getMessage(), e);
        }
    }

    public boolean enviarCredenciais(String login, String senha) {
        try {
            RequestBody form = new FormBody.Builder()
                    .add("formLogin", "formLogin")
                    .add("formLogin:j_username", login)
                    .add("formLogin:j_password", senha)
                    .add("formLogin:botaoEntrar", "Entrar")
                    .add("javax.faces.ViewState", viewState)
                    .build();

            Request request = new Request.Builder()
                    .url("https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false")
                    .header("User-Agent", "Mozilla/5.0")
                    .post(form)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String html = response.body().string();
                // Atualiza ViewState quando a página troca (JSF gera novo token)
                Document doc = Jsoup.parse(html);
                String newViewState = doc.select("input[name=javax.faces.ViewState]").val();
                if (newViewState != null && !newViewState.isBlank()) {
                    viewState = newViewState;
                }
                // Retorna true se exigir 2FA
                return html.contains("formAutenticacaoCodigo") || html.contains("kc-form-login");
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro na autenticação: " + e.getMessage(), e);
        }
    }

    public boolean validarCodigo(String codigo) {
        try {
            RequestBody form = new FormBody.Builder()
                    .add("formAutenticacaoCodigo", "formAutenticacaoCodigo")
                    .add("formAutenticacaoCodigo:codigo", codigo)
                    .add("javax.faces.ViewState", viewState)
                    .build();

            Request request = new Request.Builder()
                    .url("https://pje1g-ba.tse.jus.br/pje/autenticacaoCodigo.seam")
                    .header("User-Agent", "Mozilla/5.0")
                    .post(form)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String html = response.body().string();
                // Atualiza ViewState
                Document doc = Jsoup.parse(html);
                String newViewState = doc.select("input[name=javax.faces.ViewState]").val();
                if (newViewState != null && !newViewState.isBlank()) {
                    viewState = newViewState;
                }
                return response.isSuccessful() && html.contains("painel-usuario-interno");
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao validar código: " + e.getMessage(), e);
        }
    }
}
