import { OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseService } from '../service/base-service';
import { Injectable } from '@angular/core';
import { ToastService } from '../service/toast-service';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseComponentList<T> implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  entities: T[] = [];
  entitiesFiltrada: T[] = [];
  filter = new FormControl('');
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  constructor(protected service: BaseService<T>,
    protected toastService: ToastService) {}
  
  ngOnInit(): void {
    this.buscarEntities();
  }

  buscarEntities() {
    this.service.getAllEntities()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: entities => { 
       // console.log(entities);
        this.entities = entities;
        this.collectionSize = this.entities.length;
        this.refresh();
      },
      error: error =>  { 
        this.toastService.showErrorToast('Erro', "Não foi possível obter os registros.")
      }
    });
  }

  refresh() {
    this.entitiesFiltrada = this.entities
      .map((entity, i) => ({id: i + 1, ...entity}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  ngOnDestroy(): void {    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
