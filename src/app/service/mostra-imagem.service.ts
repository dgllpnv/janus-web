import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Injectable({
  providedIn: 'root',
})
export class MostraImagemService {
  constructor(private sanitizer: DomSanitizer) {}

  convertBytesToSafeUrl(foto: any): SafeUrl {
    if (foto != null) {
      const base64Image = btoa(String.fromCharCode(...new Uint8Array(foto)));
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    return null;
  }
}