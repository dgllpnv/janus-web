import { TestBed } from '@angular/core/testing';

import { MostraImagemService } from './mostra-imagem.service';

describe('MostraImagemService', () => {
  let service: MostraImagemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostraImagemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
