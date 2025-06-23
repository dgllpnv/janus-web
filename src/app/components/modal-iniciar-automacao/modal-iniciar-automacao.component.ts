import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-iniciar-automacao',
  templateUrl: './modal-iniciar-automacao.component.html',
  styleUrls: ['./modal-iniciar-automacao.component.css']
})
export class ModalIniciarAutomacaoComponent {
  @Input() servidor: any;

  robosDisponiveis = [
    { nome: 'Robô Sentença Final', codigo: 'sentenca_final', descricao: 'Lança movimentação 874 após validar minuta e documentos obrigatórios.' },
    { nome: 'Robô Intimação', codigo: 'intimacao', descricao: 'Gera e envia intimação para as partes via PJe ou e-mail.' },
    { nome: 'Robô Cálculo Multa', codigo: 'multa', descricao: 'Calcula multa com base nos dados processuais e lança valor.' }
  ];

  roboSelecionado: any = null;

  constructor(public activeModal: NgbActiveModal) {}

  confirmarAutomacao() {
    if (this.roboSelecionado) {
      console.log('Lançar automação', {
        servidor: this.servidor.nome,
        robo: this.roboSelecionado
      });
      this.activeModal.close(this.roboSelecionado);
    }
  }

  cancelar() {
    this.activeModal.dismiss();
  }
}
