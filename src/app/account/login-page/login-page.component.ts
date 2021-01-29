import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/userService/user-service.service';
import { AuthGuard } from 'src/app/authGuard/auth.guard';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/userService/message.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $ : any;
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})


// export class LoginData {
//   email: string;
//   password: string;
// }
// export class forgotpassAdmin {
//   email: string;
// }

export class LoginPageComponent implements OnInit {

  loginData:any=[];
  forgotpwd_email
  loading: boolean = false;
  loader:boolean=false;
  valiemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor( private _appservice: UserServiceService,
                private _message: MessageService,
                private authguard: AuthGuard,
                private spinner: NgxSpinnerService,
                private _router: Router) { }

  ngOnInit()
  {
        const tokenchk = localStorage.getItem('admintoken');

        if (tokenchk != null) {
          this._router.navigate(['/dashboard']);
        } else{
          this._router.navigate(['/account/login-page']);

        }
        this.loginData = {
            email: '',
            password: ''
        };

  }



  doLogin()
  {
    this.spinner.show();

        this.loginData =
        {
            email: this.loginData.email,
            password: this.loginData.password
        };

        if (this.loginData.email.trim() === '' || !this.valiemail.test(this.loginData.email)) {
            const errorMessage = 'Please Provide  Email';
            this._message.showError(errorMessage);
            return false;
        } else if (this.loginData.password === '') {
            const errorMessage = ' Please Provide Password';
            this._message.showError(errorMessage);
            return false;
        } else {
            this._appservice.postApi("admin/adminLogin",this.loginData).then((Response) =>
            {
                  this.spinner.hide();

                    if (Response.response_code == 200)
                    {
                        this._message.showSuccess(Response.response_message);

                        localStorage.setItem('adminemail', Response.response_data.email);
                        localStorage.setItem('admintoken', Response.response_data.authtoken);
                        // this._router.navigate(['/dashboard']);
                        location.reload();

                   } else {
                        this._message.showError(Response.response_message);

                    }
                }, (Error) => {
                    this._message.showError(Error.message);
                });
        }
  }


  forgotpassLinksend()
  {
    this.spinner.show();

    var obj = {  email: this.forgotpwd_email };
    if (this.forgotpwd_email.trim() == '' || !this.valiemail.test(this.forgotpwd_email)) {
        let errorMessage ='Please provide registered email address';
        // alert(errorMessage);

        // this._message.showError(errorMessage);
    } else {
        this.spinner.hide();
        this._appservice.postApi('admin/adminForgotPassword',obj)
            .then(Response => {
                if (Response.response_code == 200) {
                    this._message.showSuccess(Response.response_message);
                    $("#forgotpasswordmodal").modal("hide");
                } else {
                    // this._message.showError(Response.message)
                }
            }).catch(err => {
                this._message.showError(err.message)
            });
    }
}



}
