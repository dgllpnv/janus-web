package br.janus.loginpje.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import okhttp3.*;
import org.springframework.stereotype.Service;

@Service
public class PjeLoginService {

    private final OkHttpClient client = new OkHttpClient();
    private String viewState = "";

    public void iniciarSessao() {
        try {
            Request request = new Request.Builder()
                    .url("https://pje1g-ba.tse.jus.br/pje/login.seam?loginComCertificado=false")
                    .header("User-Agent", "Mozilla/5.0")
                    .get()
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                throw new RuntimeException("Erro ao acessar página de login: HTTP " + response.code());
            }

            String html = response.body().string();
            Document doc = Jsoup.parse(html);
            viewState = doc.select("input[name=javax.faces.ViewState]").val();

            System.out.println("✅ ViewState capturado com sucesso: " + viewState);

        } catch (Exception e) {
            System.err.println("❌ Erro ao iniciar sessão no PJe:");
            e.printStackTrace();
            throw new RuntimeException("Erro ao iniciar sessão no PJe: " + e.getMessage());
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

            Response response = client.newCall(request).execute();
            String html = response.body().string();

            System.out.println("🔐 Resposta do login: " + html.substring(0, Math.min(500, html.length())) + "...");

            // Se HTML contiver a tela de código (autenticação secundária)
            return html.contains("formAutenticacaoCodigo");

        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar credenciais:");
            e.printStackTrace();
            throw new RuntimeException("Erro na autenticação: " + e.getMessage());
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

            Response response = client.newCall(request).execute();
            String html = response.body().string();

            System.out.println("📩 Resposta da verificação de código: " + html);

            return response.isSuccessful() && html.contains("painel-usuario-interno");

        } catch (Exception e) {
            System.err.println("❌ Erro ao validar código:");
            e.printStackTrace();
            throw new RuntimeException("Erro ao validar código: " + e.getMessage());
        }
    }
}
