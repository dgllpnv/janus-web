package br.janus.loginpje.service;

import okhttp3.OkHttpClient;
import org.springframework.stereotype.Service;

@Service
public class R8G1Service {

    private final OkHttpClient client;

    public R8G1Service(OkHttpClient client) {
        this.client = client; // já vem com CookieJar e sessão ativa
    }

    public void executarComSessaoAtual() {
        // TODO: implementar etapas após análise dos HARs
        // Exemplo de logs (substituir por Logger/Otel):
        System.out.println("🟦 [R8.G1] Iniciando rotina com cookies de sessão atuais...");
        // 1) Selecionar processo...
        // 2) Vincular etiqueta...
        // ...
        System.out.println("🟩 [R8.G1] Finalizado (POC). Aguardando mapeamento de requests.");
    }
}
