import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { EventTypes } from "../enums/event-types";
import { ToastEvent } from "../model/toast-event";

@Injectable({
    providedIn: 'root',
  })
  export class ToastService {
    toastEvents: Observable<ToastEvent>;
    private _toastEvents = new Subject<ToastEvent>();
  
    constructor() {
      this.toastEvents = this._toastEvents.asObservable();
    }
  
    showSuccessToast(title: string, message: string) {
      this._toastEvents.next({
        message,
        title,
        type: EventTypes.Success,
      });
    }

    /**
   * Show info toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showInfoToast(title: string, message: string) {
    this._toastEvents.next({
      message,
      title,
      type: EventTypes.Info,
    });
  }

  /**
   * Show warning toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showWarningToast(title: string, message: string) {
    this._toastEvents.next({
      message,
      title,
      type: EventTypes.Warning,
    });
  }

  /**
   * Show error toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showErrorToast(title: string, message: string) {
    this._toastEvents.next({
      message,
      title,
      type: EventTypes.Error,
    });
  }
  }