import { EventTypes } from "../enums/event-types";

export interface ToastEvent {
    type: EventTypes;
    title: string;
    message: string;
  }