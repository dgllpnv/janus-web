package br.janus.loginpje.dto;

/**
 * DTO para requisição de login.
 */
public class LoginRequestDTO {

    private String login;
    private String senha;

    // Construtor padrão para Jackson
    public LoginRequestDTO() { }

    // Construtor utilitário (opcional)
    public LoginRequestDTO(String login, String senha) {
        this.login = login;
        this.senha = senha;
    }

    // Getters e setters (Java Bean)
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
