package br.janus.loginpje.dto;

/**
 * DTO para envio do código de verificação (OTP).
 */
public class CodigoDTO {

    private String codigo;

    // Construtor padrão necessário para desserialização
    public CodigoDTO() { }

    // Construtor auxiliar (opcional)
    public CodigoDTO(String codigo) {
        this.codigo = codigo;
    }

    // Getter e setter
    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
}
