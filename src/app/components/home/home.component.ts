import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/constants/app-constants';
import { TokenStorageService } from 'src/app/helpers/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  isAdmin = false;
  isComissao = false;
  isLoggedIn = false;

  constructor(private router: Router, 
    private tokenService: TokenStorageService) { 
  }

  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenService.getToken();

    if (!this.isLoggedIn) {      
      this.router.navigate([AppConstants.LOGIN_PATH]);
    } else {
      this.isComissao = this.tokenService.getUser().comissao;
    }
  }

}
