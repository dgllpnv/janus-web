import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-painel-servidor',
  templateUrl: './painel-servidor.component.html',
  styleUrls: ['./painel-servidor.component.css']
})
export class PainelServidorComponent implements OnInit {
  nomeServidor: string = '';
  fila: any[] = [];
  historico: any[] = [];
  logsAtivos: string[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.nomeServidor = this.route.snapshot.paramMap.get('nome') || 'Servidor Desconhecido';

    // Mock de fila
    this.fila = [
      { robo: 'Robô Sentença Final', status: 'Em execução' },
      { robo: 'Robô Intimação', status: 'Aguardando' }
    ];

    // Mock de histórico
    this.historico = [
      {
        robo: 'Robô Sentença Final',
        status: 'Concluído',
        data: '23/06/2025 09:10',
        logs: ['[INFO] Execução iniciada', '[INFO] Requisição HTTP enviada', '[INFO] Sucesso']
      },
      {
        robo: 'Robô Cálculo Multa',
        status: 'Erro',
        data: '23/06/2025 08:45',
        logs: ['[INFO] Execução iniciada', '[ERROR] Timeout HTTP', '[INFO] Iniciado fallback', '[ERROR] Falha ao autenticar no PJe']
      }
    ];

    // Simulação de logs ativos
    setInterval(() => {
      if (this.fila.length > 0 && this.fila[0].status === 'Em execução') {
        this.logsAtivos.push(`[LOG][${new Date().toLocaleTimeString()}] Robô executando...`);
      }
    }, 3000);
  }

  baixarLogs(logs: string[]) {
    const blob = new Blob([logs.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'logs-automacao.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
