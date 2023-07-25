/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
