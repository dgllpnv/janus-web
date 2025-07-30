import { OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseService } from '../service/base-service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import AppUtils from '../helpers/app-utils';
import { ToastService } from '../service/toast-service';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseComponent<T> implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  form: FormGroup;
  entity = {} as T;  
  filter = new FormControl('');

  constructor(protected service: BaseService<T>,
    protected router: Router,
    protected toastService: ToastService,
    protected pathToRedirect: string) {}
  
  ngOnInit(): void {
  }

  salvarEntity(entity: T) {
    if (this.form.valid) {        
        this.service.postEntity(entity)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: x => { 
            this.toastService.showSuccessToast('Sucesso', 'Informação salva com sucesso.');
            this.router.navigate([this.pathToRedirect]);
          },
          error: erro => this.toastService.showErrorToast('Erro', 'Não foi possível salvar a informação.')
        });
    } else {
        AppUtils.findInvalidControlsRecursive(this.form);
    }
  }
 
  ngOnDestroy(): void {    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}