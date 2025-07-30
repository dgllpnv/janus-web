package br.janus.loginpje.controller;

import br.janus.loginpje.service.PjeLoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pje")
@CrossOrigin(origins = "*")
public class PjeLoginController {

    private final PjeLoginService service;

    public PjeLoginController(PjeLoginService service) {
        this.service = service;
    }

    /** Inicia a sessão de login e devolve o ViewState. */
    @GetMapping("/iniciar-login")
    public ResponseEntity<?> iniciarLogin(@RequestParam String sessionId) {
        try {
            String viewState = service.iniciarSessao(sessionId);
            return ResponseEntity.ok(Map.of("viewState", viewState));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", e.getMessage()));
        }
    }

    /** Envia login e senha. Retorna redirectUrl se sucesso ou erro. */
    @PostMapping("/autenticar")
    public ResponseEntity<?> autenticar(@RequestParam String sessionId, @RequestBody Map<String, String> body) {
        try {
            String login = body.get("login");
            String senha = body.get("senha");
            String viewState = body.get("viewState");
            if (login == null || senha == null || viewState == null) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Parâmetros obrigatórios."));
            }
            Map<String, String> result = service.autenticar(sessionId, login, senha, viewState);
            if (!result.containsKey("redirectUrl")) {
                String msg = result.getOrDefault("erro", "Falha na autenticação.");
                return ResponseEntity.status(401).body(Map.of("erro", msg));
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", e.getMessage()));
        }
    }

    /** Coleta action e execution do Keycloak para 2FA. */
    @GetMapping("/capturar-keycloak")
    public ResponseEntity<?> capturarKeycloak(@RequestParam String sessionId, @RequestParam String redirectUrl) {
        try {
            Map<String, String> result = service.capturarKeycloak(redirectUrl, sessionId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", e.getMessage()));
        }
    }

    /** Envia o código de autenticação 2FA. */
    @PostMapping("/enviar-otp")
    public ResponseEntity<?> enviarOtp(@RequestParam String sessionId, @RequestBody Map<String, String> body) {
        try {
            String action = body.get("action");
            String execution = body.get("execution");
            String otp = body.get("otp");
            if (action == null || execution == null || otp == null) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Dados incompletos."));
            }
            boolean ok = service.enviarCodigoOTP(sessionId, action, execution, otp);
            if (ok) {
                return ResponseEntity.ok(Map.of("sucesso", true));
            }
            return ResponseEntity.status(401).body(Map.of("erro", "OTP inválido."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
