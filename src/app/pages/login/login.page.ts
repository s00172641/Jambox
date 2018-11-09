import { Component, OnInit } from "@angular/core";
import { FirebaseAuthService } from "../../services/firebaseAuth/firebase-auth.service";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { SpotifyService } from "../../services/spotify/spotify.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  constructor(
    private auth: FirebaseAuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private spotifyService: SpotifyService
  ) {}
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ngOnInit() {}

  login(email: string, password: string) {
    this.auth.doLogin(email, password);
  }

  navigateToSignUp() {
    this.router.navigate(["signUp"]);
  }
  signInWithSpotify() {
      this.spotifyService.authWithSpotify();
    }
  
}
