import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIniciarAutomacaoComponent } from './modal-iniciar-automacao.component';

describe('ModalIniciarAutomacaoComponent', () => {
  let component: ModalIniciarAutomacaoComponent;
  let fixture: ComponentFixture<ModalIniciarAutomacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIniciarAutomacaoComponent]
    });
    fixture = TestBed.createComponent(ModalIniciarAutomacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
