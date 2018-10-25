import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebaseAuth/firebase-auth.service'
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(private auth: FirebaseAuthService) { }

  ngOnInit() {
  }
  firebaseSignUp(email: string, password: string, displayName: string) {
   console.log("email:" , email);
   console.log("password:" , password);
   console.log("name:" , displayName);
   this.auth.signup(email, password, displayName);
  }
}
