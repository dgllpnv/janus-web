import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPjeComponent } from './login-pje.component';

describe('LoginPjeComponent', () => {
  let component: LoginPjeComponent;
  let fixture: ComponentFixture<LoginPjeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPjeComponent]
    });
    fixture = TestBed.createComponent(LoginPjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
