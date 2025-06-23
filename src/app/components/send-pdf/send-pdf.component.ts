import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-send-pdf",
  templateUrl: "./send-pdf.component.html",
  styleUrls: ["./send-pdf.component.css"],
})
export class SendPdfComponent {
  version: string = "1.0.0";

  // Estrutura dos dados do formulário
  formData: { name: string; phone: string; file: File | null } = {
    name: "",
    phone: "",
    file: null,
  };

  // Estados adicionais
  fileTouched: boolean = false; // Controle se o campo de arquivo foi tocado
  isLoading: boolean = false; // Indicador de carregamento
  successMessage: string = ""; // Mensagem de sucesso
  errorMessage: string = ""; // Mensagem de erro

  constructor(private http: HttpClient) {}

  /**
   * Método para tratar a seleção de arquivo.
   * @param event Evento disparado no input de arquivo.
   */
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      this.formData.file = selectedFile;
      this.fileTouched = true; // Define que o campo foi tocado
      this.errorMessage = ""; // Limpa mensagem de erro
    } else {
      this.formData.file = null;
      this.fileTouched = true;
      this.errorMessage = "Apenas arquivos PDF são permitidos.";
    }
  }

  /**
   * Método para enviar o formulário.
   */
  onSubmit() {
    this.successMessage = "";
    this.errorMessage = "";

    // Validação dos campos
    if (!this.formData.name || !this.formData.phone || !this.formData.file) {
      this.errorMessage = "Todos os campos são obrigatórios.";
      this.fileTouched = true;
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", this.formData.file!);
    formDataToSend.append("name", this.formData.name);
    formDataToSend.append("phone", this.formData.phone);

    this.isLoading = true; // Exibe carregamento

    // Chamada HTTP para envio do PDF
    this.http
      .post("http://localhost:8080/api/send-pdf", formDataToSend)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = "PDF enviado com sucesso!";
          this.clearForm(); 
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = "Erro ao enviar PDF. Tente novamente.";
        },
      });
  }

  /**
   * Método para limpar o formulário após envio bem-sucedido.
   */
  clearForm() {
    this.formData = {
      name: "",
      phone: "",
      file: null,
    };
    this.fileTouched = false;
  }
}
