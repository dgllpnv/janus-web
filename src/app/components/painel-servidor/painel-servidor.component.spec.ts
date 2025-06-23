import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelServidorComponent } from './painel-servidor.component';

describe('PainelServidorComponent', () => {
  let component: PainelServidorComponent;
  let fixture: ComponentFixture<PainelServidorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PainelServidorComponent]
    });
    fixture = TestBed.createComponent(PainelServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
