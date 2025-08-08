package br.janus.loginpje.controller;

import br.janus.loginpje.service.R8G1Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/r8g1")
@CrossOrigin(origins = "*")
public class R8G1Controller {

    private final R8G1Service service;

    public R8G1Controller(R8G1Service service) {
        this.service = service;
    }

    @PostMapping("/executar")
    public ResponseEntity<?> executar() {
        service.executarComSessaoAtual(); // sincrono p/ POC; depois evoluímos p/ fila
        return ResponseEntity.ok().body(
                java.util.Map.of("mensagem", "R8.G1 iniciado. Acompanhe os logs no frontend.")
        );
    }
}
