---
title: "How to Create and Configure a Firebase and Angular Project"
description: "Setting up a Firebase, AngularFire, and Angular project"
date: "2022-06-03"
category: "Tutorials"
tags: ["Angular", "Firebase", "Programming", "Web Development", "JavaScript"]
minutes: 6
lang: "en"
art: "types"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/better-programming/how-to-create-and-configure-a-firebase-and-angular-project-9305c40ee308"
sourceName: "Medium"
coverImage: "/images/articles/medium/a5e62833250b5e0c.jpg"
---

Photo by [Jacob Kiesow](https://unsplash.com/@narrowedge?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

## Introduction

Firebase is an app development platform backed by Google which provides developers with a series of tools to build applications. Some of the key services that Firebase provides are:

- Authentication
- Realtime Database
- Cloud Firestore
- Cloud Storage
- Cloud Functions
- Hosting

This tutorial will show you how to create and configure a new Firebase project and how to add a web application to the Firebase project. You will also learn how to add authentication and the noSQL database known as Cloud Firestore to your project. We will see how to create and set up an Angular project with the AngularFire schematic. Last, but not least, this tutorial will show you how to install the Firebase CLI, which provides us with a very handy set of tools to manage Firebase projects.

### Index

- Setting up a Firebase project
- Adding Authentication (optional)
- Adding the Firestore (optional)
- Installing the Firebase CLI
- Setting up an Angular project

## Setting up a Firebase project

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

![How to Create and Configure a Firebase and Angular Project illustration](/images/articles/medium/c4e4a4d4c8425750.png)

Finally, we now have the configuration that will be used later on to add Firebase to our Angular application:

![How to Create and Configure a Firebase and Angular Project illustration](/images/articles/medium/b912c19f775c282a.png)

## Adding Authentication (optional)

*Note: This step, and the next one (adding Firestore) are optional. If you don’t need to add authentication or the Firestore, feel free to skip these sections, and start reading how to configure Angular and AngularFire.*

It’s time to add authentication and choose the sign-in methods that we want to implement. In this tutorial, we’ll add a Google social login, and a traditional email/password login. Head over to the Authentication page, and click on the Get started button:

![Firebase — Adding authentication](/images/articles/medium/60154b617bdb0d2c.png)

Firebase — Adding authentication

The next thing we have to do is choose the providers:

![Firebase — Choosing sign-in methods](/images/articles/medium/2e6653a13daa1a0e.png)

Firebase — Choosing sign-in methods

Once we’ve enabled both sign-in methods, our Authentication dashboard should look like this:

![Firebase — Enabled sign-in methods](/images/articles/medium/357d93931bba5a4e.png)

Firebase — Enabled sign-in methods

That’s all! We’ve successfully enabled authentication in our Firebase app!

## Adding the Firestore (optional)

It’s time to add the Firestore to our project! The cloud Firestore is a NoSQL cloud database for mobile, web, and server development. It keeps our data in sync across client apps through realtime listeners and offers offline support for mobile and web, so that we can build apps that work even without Internet connectivity.

Head over to the Firestore Database page, and click on the *Create database* button:

![Firebase — Creating the database](/images/articles/medium/ee8dffad7abe848e.png)

Firebase — Creating the database

You’ll have to choose whether to start in production or in test mode. Be very careful with what you choose, since starting in test mode will **allow everyone to access your data. Only choose this option if you know what you’re doing.** [You can read more about Firebase Security rules here.](https://firebase.google.com/docs/rules)

![Firebase — choosing security rules](/images/articles/medium/e668f312de4d5df7.png)

Firebase — choosing security rules

The last thing you will need to choose is the location of your Firestore data. As the warning message indicates, choose wisely, because you won’t be able to change this location later. Once you’ve chosen the location, click on the *enable* button, and your Firestore will be created:

![Firebase — choosing the Firestore data location](/images/articles/medium/f3fd054797398400.png)

Firebase — choosing the Firestore data location

Your Firestore Database page should now contain your newly created Cloud Firestore database:

![Firebase — Newly created Cloud Firestore](/images/articles/medium/0bded73c82656e2e.png)

Firebase — Newly created Cloud Firestore

Awesome! Our Firebase app is fully set up and ready.

## Installing the Firebase CLI

The Firebase CLI provides us with several tools for managing, viewing, and deploying to Firebase projects. We can use npm to install the CLI:

```bash
npm i -g firebase-tools
```

*Note: If you aren’t a Node.js user, you can download the standalone binary for the CLI following* [*these instructions*](https://firebase.google.com/docs/cli#windows-standalone-binary)*.*

Once we’ve successfully installed the CLI, we can use it to sign in. To do so, use the following command:

```bash
firebase login
```

*Note: Don’t forget to sign in with the same account you used to create the Firebase project.*

To check if you’ve successfully signed in, you can run the following command:

```bash
firebase projects:list
```

Congratulations! You should now see a list of all of the Firebase projects in your account. It’s time to get started on our Angular app.

## Setting up an Angular project

The first thing we’re going to do is create a new project with the Angular CLI.

Tip: If you haven’t installed the Angular CLI, you can do so by running the following command:

```bash
npm i -g @angular/cli
```

To create a new Angular project, we can run the following command:

```bash
ng new ngbytes-fireauth
```

Note: Don’t forget to answer yes when you’re asked if you want to add routing to your new app!

Once the CLI has worked its magic, we can open the newly created project with our favorite IDE (I suggest [VSCode](https://code.visualstudio.com/), which is the one I normally use).

### Adding Firebase and AngularFire

Let’s add Firebase and Angularfire to our project. To do so, we’ll use the AngularFire schematic, that will take care of setting everything up for us. Let’s run the following command:

```bash
ng add @angular/fire
```

We’ll be asked a series of questions, like which Firebase features we’d like to setup. If you’d like to add Authentication and/or the Firestore, select them now:

![How to Create and Configure a Firebase and Angular Project illustration](/images/articles/medium/0fac298b4bdd63b5.png)

We’ll then be asked about the Firebase account we’d like to use, and which project we want to setup. Select the project we created previously, and then select the app we also created earlier.

Once we’ve done all this, you will see that the schematic has taken care of all the Firebase configurations for us. Awesome! It’s now time to start building your app!

If you’d like to implement an authentication system, [check out my Angular 13 authentication tutorial, with both social and traditional email/password login.](/journal/medium/angular-13-firebase-authentication-tutorial-with-angularfire-7/)

## Conclusion

That’s all folks! Hopefully, you learned how to configure Angular and Firebase. Your project is now ready for anything you want to build, imagination is your only limit!

I hope you found this tutorial useful. Thank you very much for reading.
