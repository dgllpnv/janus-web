package br.janus.loginpje.controller;

import br.janus.loginpje.service.PjeLoginService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/pje")
@CrossOrigin(origins = "*")
public class PjeLoginController {

    private final PjeLoginService pjeLoginService;

    public PjeLoginController(PjeLoginService service) {
        this.pjeLoginService = service;
    }

    /**
     * 1. Inicia a sessão de login (captura ViewState e cookies)
     * Parâmetro obrigatório: sessionId
     * Retorno: { viewState: "..." }
     */
    @GetMapping("/iniciar-login")
    public ResponseEntity<?> iniciarLogin(@RequestParam String sessionId) {
        try {
            String viewState = pjeLoginService.iniciarSessao(sessionId);
            return ResponseEntity.ok(Map.of("viewState", viewState));
        } catch (Exception e) {
            // logger.warn("Erro ao iniciar sessão", e);
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao iniciar sessão: " + e.getMessage()));
        }
    }

    /**
     * 2. Autentica usuário (envia login, senha e viewState)
     * Parâmetro obrigatório: sessionId
     * Body: { login, senha, viewState }
     * Retorno: { redirectUrl: "..." } ou { erro: "..." }
     */
    @PostMapping("/autenticar")
    public ResponseEntity<?> autenticar(
            @RequestParam String sessionId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String login = body.get("login");
            String senha = body.get("senha");
            String viewState = body.get("viewState");

            // Validação mínima
            if (login == null || senha == null || viewState == null) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Parâmetros obrigatórios ausentes."));
            }

            Map<String, String> result = pjeLoginService.autenticar(sessionId, login, senha, viewState);

            // Caso de erro ou ausência de redirectUrl (login falhou)
            if (result == null || !result.containsKey("redirectUrl")) {
                String erroMsg = result != null && result.containsKey("erro") ? result.get("erro") : "Login ou senha inválidos.";
                return ResponseEntity.status(401).body(Map.of("erro", erroMsg));
            }

            return ResponseEntity.ok(Map.of("redirectUrl", result.get("redirectUrl")));
        } catch (Exception e) {
            // logger.warn("Erro ao autenticar usuário", e);
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao autenticar: " + e.getMessage()));
        }
    }

    /**
     * 2b. Captura dados do formulário Keycloak/2FA (action, execution)
     * Parâmetros: sessionId, redirectUrl (query params)
     * Retorno: { action: "...", execution: "..." }
     */
    @GetMapping("/capturar-keycloak")
    public ResponseEntity<?> capturarKeycloak(@RequestParam String sessionId, @RequestParam String redirectUrl) {
        try {
            Map<String, String> result = pjeLoginService.capturarKeycloak(redirectUrl, sessionId);
            if (result == null || !result.containsKey("action") || !result.containsKey("execution")) {
                return ResponseEntity.status(500).body(Map.of("erro", "Falha ao capturar dados do 2FA."));
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // logger.warn("Erro ao capturar etapa de 2FA", e);
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao capturar 2FA: " + e.getMessage()));
        }
    }

    /**
     * 3. Valida código de autenticação 2FA (OTP)
     * Parâmetro obrigatório: sessionId
     * Body: { action, execution, otp }
     * Retorno: { sucesso: true } ou { erro: "OTP inválido." }
     */
    @PostMapping("/enviar-otp")
    public ResponseEntity<?> enviarOtp(
            @RequestParam String sessionId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String action = body.get("action");
            String execution = body.get("execution");
            String otp = body.get("otp");

            if (action == null || execution == null || otp == null) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Parâmetros obrigatórios ausentes para 2FA."));
            }

            boolean sucesso = pjeLoginService.enviarCodigoOTP(sessionId, action, execution, otp);
            if (sucesso) {
                return ResponseEntity.ok(Map.of("sucesso", true));
            } else {
                return ResponseEntity.status(401).body(Map.of("erro", "OTP inválido."));
            }
        } catch (Exception e) {
            // logger.warn("Erro ao validar OTP", e);
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao validar OTP: " + e.getMessage()));
        }
    }

    /** Endpoint de healthcheck */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "loginpje"));
    }
}
