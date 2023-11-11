import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from '@angular/fire/auth'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private router: Router) { }

  //login method
  login(email: any, password: any) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((res: any) => {
        localStorage.setItem('token', 'true');
        if (res.user.emailVerified == true) {
          this.router.navigate(['dashboard'])
        }
        else {
          this.router.navigate(['/verify-email'])
        }
      })
      .catch(err => {
        alert("Something went wrong");
        this.router.navigate(['/login']);
      });
  }

  //Register method
  async register(email: any, password: any): Promise<void> {
    try {
      await this.fireAuth.createUserWithEmailAndPassword(email, password).then((res: any) => {
        alert("Registration successfully.");
        this.router.navigate(['/login']);
        this.sendEmailForVerification(res.user);
      });
    } catch (error) {
      console.error('Error during registration:', error);
      this.router.navigate(['/register']);
      throw error;
    }
  }

  //email varification method
  sendEmailForVerification(user: any) {
    user.sendEmailVerification().then((res: any) => {
      this.router.navigate(['/verify-email']);
    }, (error: any) => {
      alert("Something went wrong. Not able to send email to your email address");
    });
  }

  //signout method
  signOut() {
    this.fireAuth.signOut().then(() => {
      localStorage.removeItem('token')
      this.router.navigate(['/login']);
    }, err => {
      alert("Something went wrong.");
    })
  }

  //forgot password method
  forgotPassword(email: any) {
    this.fireAuth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }, error => {
      alert("Something went wrong.");
    })
  }

  //sign in with google
  googlesignIn() {
    return this.fireAuth.signInWithPopup(new GoogleAuthProvider).then((res: any) => {
      this.router.navigate(['dashboard'])
      localStorage.setItem('token', JSON.stringify(res.user?.uid))
    }, err => {
      alert(err.message);
    })
  }
}
