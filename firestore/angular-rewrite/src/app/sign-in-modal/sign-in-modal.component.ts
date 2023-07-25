import { Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SignInOptions } from './signInOptions';

@Component({
  selector: 'app-sign-in-modal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignInModalComponent {
  private auth = inject(Auth);
  userEmail: string = "";
  userPassword: string = "";
  failedSignIn: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SignInModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SignInOptions
  ) {
    this.dialogRef.backdropClick().subscribe(_ => dialogRef.close());
  }

  public closeDialog() {
    this.dialogRef.close()
  }

  launchAuthAction() {
    if (this.data.isCreatingAccount) {
      this.createNewUserAccount();
    } else {
      this.signInWithUserInfo();
    }
  }

  async createNewUserAccount() {
    try {
      await createUserWithEmailAndPassword(this.auth, this.userEmail, this.userPassword);
      this.dialogRef.close();
    } catch (err) {
      this.failedSignIn = true;
    }
  }

  async signInWithUserInfo() {
    try {
      await signInWithEmailAndPassword(this.auth, this.userEmail, this.userPassword);
      this.dialogRef.close();
    } catch (err) {
      this.failedSignIn = true;
    }
  }
}
