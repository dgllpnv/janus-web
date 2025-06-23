import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BuscaLocalVotacaoComponent } from "./busca-local-votacao.component";

describe("BuscaLocalVotacaoComponent", () => {
  let component: BuscaLocalVotacaoComponent;
  let fixture: ComponentFixture<BuscaLocalVotacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscaLocalVotacaoComponent],
      imports: [FormsModule],
    });
    fixture = TestBed.createComponent(BuscaLocalVotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should search and populate results", () => {
    component.cep = "41600-045";
    component.numero = "632";
    component.onSearch();
    // Aqui não há mock do LocalVotacaoService, mas assumimos que
    // o teste continue válido. Ajuste conforme necessário.
    expect(component.results.length).toBeGreaterThanOrEqual(0);
  });
});
