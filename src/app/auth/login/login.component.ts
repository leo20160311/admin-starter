import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {

  login() {
    this.messages = ["登录成功，即将进入系统！"];
    setTimeout(() =>{
      this.router.navigate(["/page/dashboard"]);
    }, 3000);
  }
}