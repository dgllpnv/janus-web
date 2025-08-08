export interface Usuario {
    login: string;
    password: string;
    roles?: string[];
    token?: string;
    nomeCompleto?: string;
    email?: string;
    comissao?: number;
  }
  
  export interface LoginResponse {
    token: string;
    roles: string[];
    nomeCompleto: string;
    email: string;
    comissao: number;
  }
  