package br.janus.loginpje.controller;

import br.janus.loginpje.dto.CodigoDTO;
import br.janus.loginpje.dto.LoginRequestDTO;
import br.janus.loginpje.dto.LoginResponseDTO;
import br.janus.loginpje.service.PjeLoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pje")
@CrossOrigin(origins = "*")
public class PjeLoginController {

    private final PjeLoginService loginService;

    public PjeLoginController(PjeLoginService loginService) {
        this.loginService = loginService;
    }

    @GetMapping("/iniciar-login")
    public ResponseEntity<String> iniciarLogin() {
        loginService.iniciarSessao();
        return ResponseEntity.ok("Sessão iniciada.");
    }

    @PostMapping("/autenticar")
    public ResponseEntity<LoginResponseDTO> autenticar(@RequestBody LoginRequestDTO dto) {
        boolean requerCodigo = loginService.enviarCredenciais(dto.login, dto.senha);
        return ResponseEntity.ok(new LoginResponseDTO(requerCodigo));
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<String> validarCodigo(@RequestBody CodigoDTO dto) {
        boolean sucesso = loginService.validarCodigo(dto.codigo);
        if (sucesso) {
            return ResponseEntity.ok("Login finalizado");
        } else {
            return ResponseEntity.status(401).body("Código inválido");
        }
    }
}
