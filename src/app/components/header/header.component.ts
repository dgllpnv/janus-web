import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/constants/app-constants';
import { TokenStorageService } from 'src/app/helpers/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  nomeCompleto?: string;

  constructor(private tokenService: TokenStorageService,
    private router: Router) {}


  ngOnInit(): void {
    this.nomeCompleto = this.tokenService.getUser().nomeCompleto;
  }

  logout() {  
    this.tokenService.signOut();
    this.router.navigate([AppConstants.LOGIN_PATH]);
  }
}
