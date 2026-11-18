---
title: "Angular 13 Firebase Authentication Tutorial With AngularFire 7"
description: "Implementing social and traditional login strategies with Angular and Firebase"
date: "2021-12-29"
category: "Tutorials"
tags: ["Programming", "JavaScript", "Angular", "Firebase", "Web Development"]
minutes: 12
lang: "en"
art: "types"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/better-programming/angular-13-firebase-authentication-tutorial-with-angularfire-7-23dc8cee42c4"
sourceName: "Medium"
coverImage: "/images/articles/medium/21408429c9744568.jpg"
---

Photo by [Guido Jansen](https://unsplash.com/@gxjansen?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

## Introduction

Authentication is key to protecting our apps from unregistered users. In this tutorial, you will learn how to implement both a traditional email/password login and a Google social login in Firebase, with the new tree-shakable [AngularFire](https://github.com/angular/angularfire) v.7.0 modular SDK, which allows us to take full advantage of the [new tree-shakable Firebase JS SDK (v9)](https://firebase.google.com/docs/web/modular-upgrade).

You’ll also learn how to protect routes with the AngularFire Auth Guard, and how to redirect users to certain pages based on whether they’re authenticated or not.

> Please note that, at the time of writing this tutorial, the Angular fire v.7.0 API [is still in development, and isn’t feature complete](https://github.com/angular/angularfire/blob/master/docs/version-7-upgrade.md); and the docs aren’t yet updated to the latest version. AngularFire provides a compatibility layer that will allow you to use the latest version of the library, while fully supporting the AngularFire v6.0 API. This said, if you’re as curious as I am, and enjoy trying out the latest versions of all your libraries, go ahead and enjoy this tutorial.

Here’s a preview of the app we’ll be building today:

![Preview of the authentication app](/images/articles/medium/f6ff9643a4ad10e5.gif)

Preview of the authentication app

You can [find the full code here](https://github.com/puntotech/ngbytes-fireauth).

### Index

- Setting up a firebase project.
- Setting up an Angular project with AngularFire.
- Building the App.
- Creating the dashboard.
- Creating the auth module.
- Adding Google sign-in.
- Protecting the routes.

## Setting up Firebase project

To create a new Firebase project, we need to log in to the [Firebase console.](https://console.firebase.google.com/) Once we’ve done that, we can click on Add Project to create a new project:

![Firebase — Creating a new project](/images/articles/medium/574575aed4e09abc.png)

Firebase — Creating a new project

We’ll need to choose a name for our project:

![Firebase — Choosing a name](/images/articles/medium/8876c3850defe9c7.png)

Firebase — Choosing a name

Decide whether or not we want Google Analytics in our project (your choice, I’ll go with no):

![Firebase — Enabling Google Analytics](/images/articles/medium/3f7affb4ef1cc8c7.png)

Firebase — Enabling Google Analytics

We’re done! We now have a lovely new Firebase project.

### Adding Firebase to a Web app

Now we need to add Firebase to our Angular app. To do so, we need to click on the Web app button, in the dashboard:

![Firebase — Adding a web app](/images/articles/medium/74c03ca3b2c72081.png)

Firebase — Adding a web app

We then need to choose a name:

![Angular 13 Firebase Authentication Tutorial With AngularFire 7 illustration](/images/articles/medium/c4e4a4d4c8425750.png)

Finally, we now have the configuration that will be used later on to add Firebase to our Angular application:

![Angular 13 Firebase Authentication Tutorial With AngularFire 7 illustration](/images/articles/medium/b912c19f775c282a.png)

### Adding Authentication

It’s time to add authentication and choose the sign-in methods that we want to implement. In this tutorial, we’ll add a Google social login, and a traditional email/password login. Head over to the Authentication page, and choose the providers:

![Firebase — Choosing sign-in methods](/images/articles/medium/b3de30882588d9ef.png)

Firebase — Choosing sign-in methods

Once we’ve enabled both sign-in methods, our Authentication dashboard should look like this:

![Firebase — Enabled sign-in methods](/images/articles/medium/357d93931bba5a4e.png)

Firebase — Enabled sign-in methods

That’s all! We now have our Firebase app fully set up and ready. It’s time to get started on our Angular app.

## Setting up an Angular project

The first thing we’re going to do is create a new project with the Angular CLI.

*Tip: If you haven’t installed the Angular CLI, you can do so by running the following command:*

```bash
npm i -g @angular/cli
```

To create a new Angular project, we can run the following command:

```bash
ng new ngbytes-fireauth
```

*Note: Don’t forget to answer yes when you’re asked if you want to add routing to your new app!*

Once the CLI has worked its magic, we can open the newly created project with our favorite IDE (I suggest [VSCode](https://code.visualstudio.com/), which is the one I normally use).

### Adding Firebase and AngularFire

Let’s add Firebase and Angularfire to our project. To do so, we’ll use the AngularFire schematic, that will take care of setting everything up for us. Let’s run the following command:

```bash
ng add @angular/fire
```

We’ll be asked a series of questions, like which Firebase features we’d like to setup. For this tutorial, we only need to add authentication, so let’s select that:

![Angular 13 Firebase Authentication Tutorial With AngularFire 7 illustration](/images/articles/medium/0fac298b4bdd63b5.png)

We’ll then be asked about the Firebase account we’d like to use, and which project we want to setup. Select the project we created previously, and then select the app we also created earlier.

Once we’ve done all this, you will see that the schematic has taken care of all the Firebase configuration for us. Awesome!

### Adding Angular Material

We’ll also add Angular Material. Once again, we’ll use a schematic:

```bash
ng add @angular/material
```

### Disabling strictPropertyInitialization

We’ll need to set the `strictPropertyInitialization` property in the `tsconfig.json` file to false. We’re doing this because the strict mode is enabled by default in all new Angular apps starting from version 12, which means that TypeScript will complain if we declare any class properties without setting them in the constructor (a common practice in Angular). Here’s what our `tsconfig.json` file should look like:

```jsonc
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "strictPropertyInitialization": false,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2017",
    "module": "es2020",
    "lib": [
      "es2018",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

[View tsconfig.json on GitHub Gist](https://gist.github.com/NyaGarcia/3813894482f0c1a4927544043224d29c)

tsconfig.json file

### Deleting the Angular boilerplate

Last, but not least, we’ll delete the boilerplate code that Angular automatically generates in the `app.component.html`. Be very careful and make sure that you do not delete the `<router-outlet></router-outlet>` tags when you delete the boilerplate code, or the router won’t work.

After deleting everything, your `app.component.html` should only contain the router-outlet tags:

![router-outlet tags in the app.component.html](/images/articles/medium/8ea1a27796ba95e2.png)

router-outlet tags in the app.component.html

## Creating the dashboard

It’s time to start building our Angular app. Let’s begin by creating a `dashboard` module. This is the module that will contain the pages which we want to protect from unauthenticated users. Let’s begin by creating a `features` directory inside the `src/app` directory, which will contain all of our feature modules:

```text
mkdir features
```

Inside this new directory, we’ll create our `dashboard` module with the Angular CLI:

```bash
ng g m dashboard -m app --route dashboard
```

*Tip: We’re using the* `--route` *option, which creates a component in the new module, and adds the route to that component in the* `Routes` *array declared in the module provided in the* `-m` *option.*

You’ll see that the CLI has created a `dashboard` module inside the `features` directory, with its corresponding `dashboard-routing.module.ts` and component. It’s also modified the `app-routing.module.ts`, and added a `dashboard` route, lazy loading the `DashboardModule`.

Let’s add some information to our the `dashboard` component, by modifying the `dashboard.component.html` file:

```html
<mat-toolbar></mat-toolbar>
<div class="background">
  <h1>Welcome to the NgBytes Dashboard</h1>
  <h2>Built with &lt;3 by Dottech</h2>

  <a target="_blank" class="btn" href="https://github.com/puntotech/ngbytes-fireauth">
    Click here to view the source code
  </a>
</div>
```

[View dashboard.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/12332185a8532bdde97367364eedb9fd)

The dashboard component template

Feel free to add whatever you want to this file.

*Tip: Don’t forget to import the* `MatToolbarModule` *to the* `DashboardModule`*, if you decide to use it too.*

Let’s add a little CSS, to make the dashboard look pretty:

```css
h1 {
  color: #5eccd6;
  font-size: 50px;
  font-weight: bolder;
}

h2 {
  color: #698893;
  margin-bottom: 50px;
}

a {
  color: #5eccd6;
  border-bottom: 2px solid transparent;
  transition: 0.5s border-bottom;
}

mat-toolbar {
  background-color: transparent;
  display: flex;
  justify-content: right;
}

.background {
  align-items: center;
  background-image: url("/assets/mountains.png");
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  padding-top: 10%;
}

.btn {
  background-color: #5eccd6;
  border-radius: 20px;
  color: #fff;
  padding: 10px 30px;
  text-decoration: none;
  transition: 0.5s background-color;
}

a:hover {
  border-bottom: 2px solid #5eccd6;
  cursor: pointer;
}

.btn:hover {
  background-color: #52b7c0;
}
```

[View dashboard.component.css on GitHub Gist](https://gist.github.com/NyaGarcia/fc48ae4c9d73ac22258e3c0801e4847b)

The dashboard component CSS

Et voilà, our `dashboard` module is ready! To see it, we can navigate to `http://localhost:4200/dashboard`:

![Dashboard preview](/images/articles/medium/9e3a7a72eeccf853.png)

Dashboard preview

It’s time to get started on our authentication.

## Creating the Auth Module

Inside the `features` directory, we’ll use the Angular CLI to create an `auth` module:

```bash
ng g m auth --routing
```

*Tip: We’re using the* `--routing` *flag, which generates an* `auth-routing.module.ts` *as well as the* `auth.module.ts`.

Once we’ve created our module, we need to add its corresponding route to the `app-routing.module.ts` file.

```typescript
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

[View app-routing.module.ts on GitHub Gist](https://gist.github.com/NyaGarcia/fefeb0ded8cf40419c0cc56bb5699b52)

Adding routes the app-routing module

Note that we’re adding a wildcard route, that redirects to the default route. We do this so that if we try to navigate to any routes that don’t exist, instead of an error being thrown, we’ll be redirected.

### Creating an AuthService

All of our interactions with Firebase and AngularFire will take place within the `AuthService`. To create our service, we’ll once again make use of the Angular CLI. Inside our `app` directory:

```text
mkdir core
cd core
mkdir services
cd services
ng g s auth
```

Inside our `authService`, the first thing we’ll need to do is inject the AngularFire `Auth` instance in the constructor. Then, we’ll create a `login` method, which will receive the login data (email and password), and use the `signInWithEmailAndPassword` AngularFire method to sign in:

```typescript
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
}
```

[View auth.service.ts on GitHub Gist](https://gist.github.com/NyaGarcia/e903bfdf6dd7b433723b27f1b60f9c7b)

AuthService with untyped login method

However, doesn’t something about our `login` function seem a little off? We have a very unseemly `any`! Since we’re using TypeScript, and we want to have everything nicely typed, let’s create a `LoginData` interface, to type our login data. In our `core` directory:

```text
mkdir interfaces
cd interfaces
touch login-data.interface.ts
```

Here’s what out interface will look like:

```typescript
export interface LoginData {
  email: string;
  password: string;
}
```

[View login-data.interface.ts on GitHub Gist](https://gist.github.com/NyaGarcia/2ec63c5fe25c1d281fcdb011722e9712)

The LoginData interface

Now we can use our new interface to properly type our `login` function’s parameters:

```typescript
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import { Injectable } from '@angular/core';
import { LoginData } from '../interfaces/login-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
}
```

[View auth.service.ts on GitHub Gist](https://gist.github.com/NyaGarcia/700e0eec5f1e76d41baff29874316949)

AuthService with typed login function

Looking much better, isn’t it?

We’ll also create a register method, which will use the AngularFire `createUserWithEmailAndPassword` method, so that new users can be registered in our app. We’ll also create a `logout` method, which, as you can probably guess, will allow our users to log out of our application:

```typescript
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

import { Injectable } from '@angular/core';
import { LoginData } from '../interfaces/login-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register({ email, password }: LoginData) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
```

[View auth.service.ts on GitHub Gist](https://gist.github.com/NyaGarcia/df64f2401bb8434a2169c054b5b7ccc5)

Adding the register and logout functions to the AuthService

That’s all we have to do in our `AuthService` (we’ll be adding the Google social login option later on) for now.

It’s now time to create the register and login forms, so that our users can be authenticated.

### Creating the login page

Inside the `auth` directory, we’ll create a `login-page` component, which will display a welcome message, the login form so that users can sign in, and later on, the google login button:

```text
mkdir pages
cd pages
ng g c login-page
```

Once we’ve created our page, let’s head over to the `login-page.component.html` file and add a simple title:

```text
<h1>Welcome to NgBytes Login</h1>
```

Since pages are routed components, we need to add a route to our `auth-routing.module.ts` file that points to the `LoginPageComponent`, like so:

```typescript
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: LoginPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
```

[View auth-routing.module.ts on GitHub Gist](https://gist.github.com/NyaGarcia/75e0e1dae4d6d25a7e43000b42a7f90b)

Routing the LoginPageComponent in the AuthRoutingModule

Let’s run the `npm start` script, and check that everything is routed correctly. If you open up your browser to `localhost:4200`, you should be seeing this:

![LoginPageComponent preview](/images/articles/medium/681c2f3a86ca2f66.png)

LoginPageComponent preview

Awesome! It’s time to create a login form, so that our users can sign into our app:

### Creating the login form

Now we’ll create a `login-form` component, inside our `auth` directory:

```text
mkdir components
cd components
ng g c login-form
```

*Tip: Since we won’t be writing any tests in this tutorial, feel free to delete the* `login-form.component.spec.ts` *file.*

To create our form, we’ll be using the Reactive Forms module. We’ll also be using the Angular Material modules, to style our form. Since it isn’t the goal of this tutorial, I won’t go into any details about how to use reactive forms.

First, we’ll import the `ReactiveFormsModule`, the `MatInputModule`, the `MatFormFieldModule` and the `MatButtonModule` modules into our `AuthModule`:

```typescript
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginPageComponent, LoginFormComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
})
export class AuthModule {}
```

[View auth.module.ts on GitHub Gist](https://gist.github.com/NyaGarcia/0bbcd2ae3c871cbb6fadbf8c1d76815c)

Importing modules into the AuthModule

Then, we’ll create the form in our `login-form.component.ts` file:

```typescript
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngbytes-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @Output() formData: EventEmitter<{
    email: string;
    password: string;
  }> = new EventEmitter();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.formData.emit(this.form.value);
  }
}
```

[View login-form.component.ts on GitHub Gist](https://gist.github.com/NyaGarcia/d2bc2bb91bcc1426515664631b2c731f)

The LoginFormComponent logic

As you can see, we’ve added basic validation to our form: both the email and password fields are required, and the email field only allows valid email addresses.

*Tip: Find it odd that we’re using an* `EventEmitter` *to emit our form’s data upon submission? This is because we’re using the smart/dumb component pattern, which decouples business logic from purely presentational components.*

Lastly, in our `login-form.component.html` file:

```html
<form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
  <mat-form-field class="form-control">
    <mat-label>Email</mat-label>
    <input matInput formControlName="email" type="text" required />
    <mat-error *ngIf="email?.hasError('required')">
      Email is required
    </mat-error>
    <mat-error *ngIf="email?.hasError('email')">
      Email isn't valid. Please enter a valid email.
    </mat-error>
  </mat-form-field>
  <mat-form-field class="form-control">
    <mat-label>Password</mat-label>
    <input matInput formControlName="password" type="password" required />
    <mat-error *ngIf="password?.hasError('required')">
      Password is required
    </mat-error>
  </mat-form-field>
  <div class="form-footer">
    <button [disabled]="form.invalid" mat-raised-button type="submit">
      Submit
    </button>
  </div>
</form>
```

[View login-form.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/0c283a7589115134d2048b3d35187167)

The LoginFormComponent template

*Note: See how we’re disabling the submit button if the form isn’t valid? That’s a bad practice (poor UX), and the only reason I’m doing it is for the sake of brevity, since this tutorial should be focused on AngularFire and not on best practices in Angular forms. However, be warned, don’t do this at home folks!*

Let’s add a little CSS in our `login-form.component.css` file to make the form prettier (you can skip this step if you wish):

```css
button {
  background-color: #5eccd6;
  border-radius: 20px;
  color: #fff;
  padding: 0 50px;
}

form {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 200px;
  width: 300px;
}

mat-form-field {
  width: 100%;
}
```

[View login-form.component.css on GitHub Gist](https://gist.github.com/NyaGarcia/3b0c0bb6502f3f511e588ce4cef2e27b)

The LoginFormComponent CSS

Great! We now have a lovely login form. All that’s left is to add it to to the `login-page.component.html` template:

```html
<div class="form-container">
      <h1>Welcome to NgBytes Login</h1>
      <h5>Sign in with your email</h5>
      <ngbytes-login-form (formData)="login($event)"></ngbytes-login-form>
</div>
```

[View login-page.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/d1f47f78aa43435c7afa0bee24ee5c9b)

Adding the login form to the login page

We also need to inject the `authService` we created earlier into our `login-page.component.ts` file and create a `login` method, which will use the `authService` to log the user in, redirecting to the dashboard once it’s done. Don’t forget to catch any possible errors!

```typescript
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { LoginData } from 'src/app/core/interfaces/login-data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  login(loginData: LoginData) {
    this.authService
      .login(loginData)
      .then(() => this.router.navigate(['/dashboard']))
      .catch((e) => console.log(e.message));
  }
}
```

[View login-page.component.ts on GitHub Gist](https://gist.github.com/NyaGarcia/95e7be2a61090ac15f7a92ad3505e729)

Creating a login method in the login-page.component

Let’s test what we’ve done so far by going over to our browser, and filling in the form. As you can see, if we try to leave the email field blank, or to enter an invalid email, an error will be shown, which means our validation is working splendidly. However, if we try to press the submit button…

We’re getting a User not found error in our console. Well, of course we are. We haven’t registered any users yet, have we? Let’s create a register form so that we can do so!

### Creating a register page

Just like we did for our login page, we’re going to create a register page, which will contain the register form. Inside the `auth/pages` directory:

```bash
ng g c register-page
```

Let’s add a title to our register page, and some styles:

```html
<div class="container">
  <h1>Welcome to NgBytes Register</h1>
</div>
```

[View register-page.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/188dca5ddac6e50c71536f766055a7e8)

The RegisterPageComponent template

```css
h1 {
  color: #838383;
  margin-bottom: 50px;
}

.container {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 80px;
}
```

[View register-page.component.css on GitHub Gist](https://gist.github.com/NyaGarcia/f6f3f5892f711fa31fa4acac1c886968)

The RegisterPageComponent CSS

Last, but not least, we need to add a `register` route to the `auth-routing.module.ts` file:

```typescript
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
```

[View auth-routing.module.ts on GitHub Gist](https://gist.github.com/NyaGarcia/3774e56c5a740394accc73f693771005)

Adding the RegisterPageComponent route

Since our register page is done, all that we need to do is create a register form… Or do we?

Our login form has two fields, an email and a password field. Our register form needs to have two fields, an email and a password field. See where I’m getting at? Our two forms are going to be exactly the same! You may be thinking that no, they aren’t the same. One form is used to log in, the other to register a new user; two completely different pieces of logic.

However…

Remember how we used the smart/dumb component pattern to decouple the login form, from the login page? Our login form isn’t in charge of performing any logic at all, our login page is. Which means we are free to reuse the login form in our register page:

```html
<div class="container">
  <h1>Welcome to NgBytes Register</h1>
  <ngbytes-login-form (formData)="register($event)"></ngbytes-login-form>
</div>
```

[View register-page.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/293f89e8f4811a529ae3f8e1f5c2fa36)

Adding the login form to the register page

Neat, isn’t it? Now comes the time to implement the logic to register a new user. We will do so, of course, in our `register-page.component.ts` file:

```typescript
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { LoginData } from 'src/app/core/interfaces/login-data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  register(data: LoginData) {
    this.authService
      .register(data)
      .then(() => this.router.navigate(['/login']))
      .catch((e) => console.log(e.message));
  }
}
```

[View register-page.component.ts on GitHub Gist](https://gist.github.com/NyaGarcia/f39a4646ff383c4e7519ada41d04224c)

Adding the register logic to the RegisterPageComponent

As you can see, we’re calling the `authService.register` method, which will register the new user in our Firebase app, and then we’re navigating to the login page, so that our newly registered user can log into our app.

Let’s add some final touches to the login page: a button that will redirect new users to the register page, and change the layout a bit to make it look decent:

```html
<div class="background">
  <div class="login-container">
    <div class="text-container">
      <h1>Hey Stranger</h1>
      <p>
        Want to create an awesome account to access this awesome app? Go ahead
        and click the button below!
      </p>
      <button mat-button routerLink="/register">Sign up</button>
    </div>
    <div class="form-container">
      <h1>Welcome to NgBytes Login</h1>
      <h5>Sign in with your email</h5>
      <ngbytes-login-form (formData)="login($event)"></ngbytes-login-form>
    </div>
  </div>
</div>
```

[View login-page.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/aa0437630462e5afaf2da4e1fa0bd124)

Improving the login page

Some CSS magic:

```css
a {
  color: #838383;
  margin-top: 30px;
  text-decoration: none;
}

h1 {
  color: #5eccd6;
  font-weight: bolder;
  margin-bottom: 20px;
}

h5 {
  color: #838383;
}

button {
  border-radius: 20px;
  padding: 0 50px;
}

p {
  margin-bottom: 20px;
  text-align: center;
}

.background {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
}

.login-container {
  border-radius: 10px;
  box-shadow: 0 0 20px 2px #e4e4e4;
  display: flex;
  width: 60%;
}

.text-container {
  align-items: center;
  background-color: #5eccd6;
  border-radius: 10px 0 0 10px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  width: 30%;
}

.form-container {
  align-items: center;
  background-color: #fff;
  border-radius: 0 10px 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  width: 70%;
}

.text-container h1 {
  color: #fff;
}

.text-container button {
  background-color: transparent;
  border: 1px solid #fff;
}
```

[View login-page.component.css on GitHub Gist](https://gist.github.com/NyaGarcia/f84468562c06cc4b81279f502e411fd1)

Adding styles to the login page

Since we’ve made our login page look pretty, let’s take a moment and do the same for our register page:

```html
<div class="background">
  <div class="login-container">
    <div class="form-container">
      <h1>Welcome to NgBytes Register</h1>
      <h5>Register with your email</h5>
      <ngbytes-login-form (formData)="register($event)"></ngbytes-login-form>
    </div>
    <div class="text-container">
      <h1>Hey Buddy</h1>
      <p>
        Already have an awesome account? Go ahead and click the button below to
        sign in!
      </p>
      <button mat-button routerLink="/">Sign in</button>
    </div>
  </div>
</div>
```

[View register-page.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/e1f37b15bee887265e02a0bf822fec11)

Improving the register page

Some more CSS:

```css
a {
  color: #838383;
  margin-top: 30px;
  text-decoration: none;
}

h1 {
  color: #5eccd6;
  font-weight: bolder;
  margin-bottom: 20px;
}

h5 {
  color: #838383;
}

button {
  border-radius: 20px;
  padding: 0 50px;
}

p {
  margin-bottom: 20px;
  text-align: center;
}

.background {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
}

.login-container {
  border-radius: 10px;
  box-shadow: 0 0 20px 2px #e4e4e4;
  display: flex;
  width: 60%;
}

.text-container {
  align-items: center;
  background-color: #5eccd6;
  border-radius: 0 10px 10px 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  width: 30%;
}

.form-container {
  align-items: center;
  background-color: #fff;
  border-radius: 10px 0 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  width: 70%;
}

.text-container h1 {
  color: #fff;
}

.text-container button {
  background-color: transparent;
  border: 1px solid #fff;
}
```

[View register-page.component.css on GitHub Gist](https://gist.github.com/NyaGarcia/249b315d1438335f6d1b4c9a228b4e52)

Adding styles to the register page

It’s time to test what we’ve done so far. Head over to your browser:

![Registering a new user and logging in](/images/articles/medium/4c738dddf92f2db9.gif)

Registering a new user and logging in

Awesome! We’re logging into our app! However, we’re still missing something, aren’t we? We need a logout option! Let’s add it to our dashboard.

### Adding a logout option

Let’s head over to our `dashboard.component.html` and create a logout option:

```html
<mat-toolbar><a (click)="logout()">Log out</a></mat-toolbar>
<div class="background">
  <h1>Welcome to the NgBytes Dashboard</h1>
  <h2>Built with &lt;3 by Dottech</h2>

  <a
    target="_blank"
    class="btn"
    href="https://github.com/puntotech/ngbytes-fireauth"
  >
    Click here to view the source code
  </a>
</div>
```

[View dashboard.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/704a5ef9d1a87e5935df25deab805aac)

Adding a logout option to the dashboard

Now that we have our logout option, we need to add some logic to our `dashboard.component.ts`. First, we’ll inject the `AuthService`in the constructor, and then we’ll create a `logout` method:

```typescript
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.authService
      .logout()
      .then(() => this.router.navigate(['/']))
      .catch((e) => console.log(e.message));
  }
}
```

[View dashboard.component.ts on GitHub Gist](https://gist.github.com/NyaGarcia/298654cd9c7c93f1c8f2af4d8cce0ca6)

Adding a logout method to the dashboard component

As you can see, once we call the `logout` method, we’ll redirect the user to the default route. That’s it! We’ve successfully implemented a way for our users to log out of our app. Once again, let’s test our app:

![Logging out](/images/articles/medium/ba13b04e97a069d7.gif)

Logging out

## Adding Google Sign In

Now that our traditional login has been fully implemented, it’s time to add our Google social login. To do so, we’ll first create the necessary method in the `auth.service`:

```typescript
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';

import { Injectable } from '@angular/core';
import { LoginData } from '../interfaces/login-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  register({ email, password }: LoginData) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
```

[View auth.service.ts on GitHub Gist](https://gist.github.com/NyaGarcia/e950afd05fae806be9c12661b53ebc35)

Adding a loginWithGoogle method to the AuthService

Then, we’ll need to add a Google sign in button to the login page:

```html
<div class="background">
  <div class="login-container">
    <div class="text-container">
      <h1>Hey Stranger</h1>
      <p>
        Want to create an awesome account to access this awesome app? Go ahead
        and click the button below!
      </p>
      <button mat-button routerLink="/register">Sign up</button>
    </div>
    <div class="form-container">
      <h1>Welcome to NgBytes Login</h1>
      <button class="mat-raised-button" (click)="loginWithGoogle()">
        Sign In with Google
      </button>
      <h5>Or sign in with your email</h5>
      <ngbytes-login-form (formData)="login($event)"></ngbytes-login-form>
    </div>
  </div>
</div>
```

[View login-page.component.html on GitHub Gist](https://gist.github.com/NyaGarcia/a2ce2a9af4ff0dbcf27a571392092316)

Adding a Google sign in button

Finally, we’ll need to add a `loginWithGoogle` function to our `login-page.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { LoginData } from 'src/app/core/interfaces/login-data.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  login(loginData: LoginData) {
    this.authService
      .login(loginData)
      .then(() => this.router.navigate(['/dashboard']))
      .catch((e) => console.log(e.message));
  }

  loginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .then(() => this.router.navigate(['/dashboard']))
      .catch((e) => console.log(e.message));
  }
}
```

[View login-page.component.ts on GitHub Gist](https://gist.github.com/NyaGarcia/a12dc42245fbc853502954c5f50b153e)

Adding a loginWithGoogle method to the LoginPageComponent

We’re done! Let’s head over to our browser and try it out:

![Signing in with google](/images/articles/medium/c9854c4919badc91.gif)

Signing in with google

## Protecting the routes

If you attempt to navigate to the dashboard page `localhost:4200/dashboard`, you’ll see that you’ll be able to do so, even if you’re unauthenticated. To solve this problem, we’ll use the auth guard provided by AngularFire, to automatically redirect unauthorized users to the login page. In our `app-routing.module.ts`:

```typescript
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

[View app-routing.module.ts on GitHub Gist](https://gist.github.com/NyaGarcia/804cb6dff656a4fd53c7deea11786e91)

Protecting the routes

As you can see, we’ve protected the `dashboard` route with the AngularFire `AuthGuard`, and we’ve built a `redirectUnauthorizedToLogin` pipe, using the AngularFire `redirectUnauthorizedTo` pipe, which we then provide to the `AuthGuard`. This will ensure that any unauthenticated user that tries to access the dashboard page, will automatically be redirected to the login page. Feel free to head over to your browser and try it out.

The same way that we don’t want unauthorized users to access the dashboard, if the user is already authenticated, they shouldn’t be able to navigate to the login page. Let’s create another custom pipe, one that will redirect the already logged in users to the dashboard:

```typescript
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

[View app-routing.module.ts on GitHub Gist](https://gist.github.com/NyaGarcia/3bd59c5fb84664c6a82f39f52421385c)

Adding the redirectLoggedInToHome route guard

Now, if we’re logged in and we try to access the login page, we’ll be automatically redirected to the dashboard.

### The canActivate helper

AngularFire provides us with a `canActivate` helper, which we can use together with the spread operator, to make our routes more readable:

```typescript
import { RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { NgModule } from '@angular/core';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

[View app-routing.module.ts on GitHub Gist](https://gist.github.com/NyaGarcia/45487b4e9d99d4f8a845f6c80957014e)

Using the canActivate helper to make the routes more readable

## Conclusion

That’s all folks! Congratulations, you’ve successfully created an authentication application with Angular 13 and the latest AngularFire 7 modular SDK.

Please remember that the new API isn’t complete, so if you decide to go ahead anyway and use it in production, do so at your own risk. Also, bear in mind that AngularFire 7 provides a compatibility layer so that you can continue using the previous AngularFire 6 API.

I hope you found this tutorial useful. Thank you very much for reading.
