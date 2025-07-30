import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalIniciarAutomacaoComponent } from '../modal-iniciar-automacao/modal-iniciar-automacao.component';

@Component({
  selector: 'app-dashboard-automacoes',
  templateUrl: './dashboard-automacoes.component.html',
  styleUrls: ['./dashboard-automacoes.component.css']
})
export class DashboardAutomacoesComponent implements OnInit {
  servidores: any[] = [];
  servidorSelecionado: any = null;

  constructor(
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Mock inicial - será substituído por chamada ao backend
    this.servidores = [
      { nome: 'Servidor 01', status: 'online', tarefas: 3 },
      { nome: 'Servidor 02', status: 'ocupado', tarefas: 5 },
      { nome: 'Servidor 03', status: 'inativo', tarefas: 0 }
    ];
  }

  visualizarPainelServidor(servidor: any): void {
    this.router.navigate(['/servidor', servidor.nome]);
  }

  iniciarAutomacao(): void {
    const modalRef = this.modalService.open(ModalIniciarAutomacaoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.result.then((roboSelecionado) => {
      if (roboSelecionado) {
        console.log('Automação confirmada:', roboSelecionado);
      }
    }).catch(() => {
      console.log('Modal fechado sem confirmação');
    });
  }
}
