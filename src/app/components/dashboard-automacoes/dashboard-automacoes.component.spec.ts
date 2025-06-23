import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAutomacoesComponent } from './dashboard-automacoes.component';

describe('DashboardAutomacoesComponent', () => {
  let component: DashboardAutomacoesComponent;
  let fixture: ComponentFixture<DashboardAutomacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAutomacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAutomacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
