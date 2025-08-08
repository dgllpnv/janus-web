package br.janus.loginpje.dto;

/**
 * DTO para resposta de login (indica se o OTP é necessário).
 */
public class LoginResponseDTO {

    private boolean requerCodigo;

    // Construtor padrão para frameworks (não estritamente necessário se só for serializar)
    public LoginResponseDTO() { }

    public LoginResponseDTO(boolean requerCodigo) {
        this.requerCodigo = requerCodigo;
    }

    // Getter e setter
    public boolean isRequerCodigo() {
        return requerCodigo;
    }

    public void setRequerCodigo(boolean requerCodigo) {
        this.requerCodigo = requerCodigo;
    }
}
