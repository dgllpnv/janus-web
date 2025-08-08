package br.janus.loginpje.controller;

import br.janus.loginpje.dto.CodigoDTO;
import br.janus.loginpje.dto.LoginRequestDTO;
import br.janus.loginpje.dto.LoginResponseDTO;
import br.janus.loginpje.service.PjeLoginOrchestratorService;
import br.janus.loginpje.service.PjeLoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pje")
@CrossOrigin(origins = "*")
public class PjeLoginController {

    private final PjeLoginService loginService;
    private final PjeLoginOrchestratorService orchestrator;

    public PjeLoginController(
            PjeLoginService loginService,
            PjeLoginOrchestratorService orchestrator
    ) {
        this.loginService = loginService;
        this.orchestrator = orchestrator;
    }

    /**
     * GET /iniciar-login
     * Inicia a sessão via HTTP (busca ViewState).
     */
    @GetMapping("/iniciar-login")
    public ResponseEntity<String> iniciarLogin() {
        loginService.iniciarSessao();
        return ResponseEntity.ok("Sessão iniciada.");
    }

    /**
     * POST /autenticar
     * Tenta login via HTTP; se falhar, faz fallback via Playwright.
     * Retorna LoginResponseDTO (requisição HTTP) ou Map (Playwright).
     */
    @PostMapping("/autenticar")
    public ResponseEntity<?> autenticar(@RequestBody LoginRequestDTO dto) {
        Object result = orchestrator.login(dto);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /validar-codigo
     * Valida o OTP após 2FA (HTTP).
     */
    @PostMapping("/validar-codigo")
    public ResponseEntity<String> validarCodigo(@RequestBody CodigoDTO dto) {
        boolean sucesso = loginService.validarCodigo(dto.getCodigo());
        if (sucesso) {
            return ResponseEntity.ok("Login finalizado");
        } else {
            return ResponseEntity.status(401).body("Código inválido");
        }
    }
}
