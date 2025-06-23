import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastEvent } from 'src/app/model/toast-event';
import { ToastService } from 'src/app/service/toast-service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent implements OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  currentToasts: ToastEvent[] = [];

  constructor(private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscribeToToasts();
  }

  subscribeToToasts() {
    this.toastService.toastEvents
      .pipe(takeUntil(this.destroy$)) 
      .subscribe((toasts) => {
        const currentToast: ToastEvent = {
          type: toasts.type,
          title: toasts.title,
          message: toasts.message,
      };
      this.currentToasts.push(currentToast);
      this.cdr.detectChanges();
    });
  }

  dispose(index: number) {
    this.currentToasts.splice(index, 1);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {    
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
