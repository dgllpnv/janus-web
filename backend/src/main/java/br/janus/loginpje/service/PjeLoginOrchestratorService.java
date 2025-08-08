package br.janus.loginpje.service;

import org.springframework.stereotype.Service;
import br.janus.loginpje.dto.LoginRequestDTO;
import br.janus.loginpje.dto.LoginResponseDTO;
import java.util.Map;

@Service
public class PjeLoginOrchestratorService {

    private final PjeLoginService httpService;
    private final PjePlaywrightLoginService pwService;

    public PjeLoginOrchestratorService(
            PjeLoginService httpService,
            PjePlaywrightLoginService pwService
    ) {
        this.httpService = httpService;
        this.pwService = pwService;
    }

    /**
     * Tenta primeiro o login via requisições HTTP; se falhar,
     * retorna o resultado do Playwright.
     */
    public Object login(LoginRequestDTO dto) {
        try {
            // 1) HTTP puro
            httpService.iniciarSessao();
            boolean requires2FA = httpService.enviarCredenciais(dto.getLogin(), dto.getSenha());
            return new LoginResponseDTO(requires2FA);
        } catch (RuntimeException httpError) {
            // 2) Fallback para Playwright
            Map<String, Object> pwResult = pwService.doLogin(dto.getLogin(), dto.getSenha());
            return pwResult;
        }
    }
}
