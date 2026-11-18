---
title: "PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 1"
description: "Foreword   This is part 1 of a series of posts which will show you how to create a RESTful..."
date: "2019-07-11T11:24:00Z"
category: "Tutorials"
tags: ["typescript", "node", "docker", "express"]
minutes: 10
lang: "en"
art: "terminal"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-1-5f8g"
series: "PokeAPI REST API"
part: 1
---

<img src="/images/articles/devto/bd795de22a30892d.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 1 screenshot" loading="lazy" decoding="async">

## Foreword

This is part 1 of a series of posts which will show you how to create a RESTful API in NodeJS. For further reading please check out the following links:

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 2](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-2-b56/)

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 3](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-3-494a/)

If you prefer to check out the full code, you can find the full PokeApi project [here](https://github.com/NyaGarcia/pokeAPI).

## Introduction

In these series of posts we will be learning how to create our own RESTful API in NodeJS, using an excellent web framework named [Express](https://expressjs.com/). However, before we start, a little theory:

[REST](https://en.wikipedia.org/wiki/Representational_state_transfer) = Representational State Transfer. An awesome style of software architecture designed by Roy Fielding for his doctoral dissertation. REST allows us to design loosely coupled applications by using the HTTP protocol.

HTTP provides us with the following verbs, or methods: GET, POST, PUT and DELETE, which correspond to Read, Create, Update and Delete (CRUD operations) respectively. There are a few other verbs, but they aren’t used as frequently. We will be using these verbs to make requests, which will perform various operations on our data.

Since (in my humble opinion) [TypeScript](https://www.typescriptlang.org/) is the best thing since sliced bread, this is the language that we will be using. For those unfamiliar with it, TypeScript is a typed superset of JavaScript, that we compile to plain ol’ JavaScript, and, among many other things, allows us to add types to JavaScript (TS FTW).

Since we need a database to store our data, we will be using a dockerized instance of MongoDB, together with [Mongoose](https://mongoosejs.com/), an ODM which makes interacting with MongoDB that much easier.

Now that we know what we are going to be working on, and how, let us get down and start coding.

## Setting up our project
### Preview

Before we start, I’d like to show you a preview of how our directory tree will look by the end of this post:

<img src="/images/articles/devto/d3b7008c9b133665.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 1 screenshot" loading="lazy" decoding="async">

In case anyone is curious about how I generated the directory tree image, I used the linux “tree” command, and snapped a screenshot of my terminal. Pretty simple.

### Installing NodeJS

Since we will be using NodeJS for our project, the first thing to do is make sure it is installed on our machine.

> Tip: Open up your terminal and type this command to check if Node is installed: **node -v**

If not, you can install it [here](https://nodejs.org/en/).

### Installing Docker and Docker-compose

Docker is a fantastic tool that allows us to create, deploy and run applications (or pretty much anything we want) by using containers. We can deploy a MongoDB database (or any other database, you name it) in a few minutes, with a couple of simple commands.

> Tip: Run this command to see if you have docker on your machine: **docker -v**

If not, you can install it [here](https://docs.docker.com/install/).

As I’ve just mentioned, Docker is awesome. However, and this is purely personal taste, I prefer to deploy my containers using Docker Compose. This is a tool offered by Docker, which allows us to create a .yml configuration file, where we can specify all the details of our container, and deploy said container with a just one simple command.

> Tip: Run this command to check if you have docker-compose: **docker-compose -v**

If not, you can install it [here](https://docs.docker.com/compose/install/).

## Let the coding Begin
### Getting started

With all our pre-requisites out of the way, we can now get down and start coding for real. Let us begin:

The first step is to create the file where our project is going to live. I’m going to name our project file “pokeApi”. Open up your terminal and type this:

```
mkdir pokeApi
cd pokeApi
```

Once inside our project file, we want to create our package.json file. Again, type the following command in your terminal:

```
npm init
```

After running this command, we will be asked a series of questions, and upon answering them, our package.json file will be created.

> Tip: If you don’t feel like answering npm’s questions, use this command instead: **npm init -y** 
    You can always go back to the package.json file and edit it later.

### Installing dependencies

To be able to use express, mongoose, TypeScript etc. we must install a few dependencies. To do so, run the following command:

```
npm i body-parser cors express mongoose
```

We also need to install several dependencies needed only for development. Type:

```
npm i -D @types/body-parser @types/cors @types/express @types/mongoose @types/node nodemon ts-node typescript
```

> Tip: By adding -D or --save-dev to npm i command, the dependencies installed will be listed under “devDependencies” in the package.json file

### Adding npm scripts

To be able to run our projects, we must create the following script in our package.json file:

```
"scripts": {
"start": "nodemon"
},
```

### Configuring nodemon

Nodemon is a neat tool for developing nodeJS applications. It automatically restarts the application whenever it detects changes in the code (basically, whenever you save).

Create a file named nodemon.json, and type in the following:

```
{
"watch": ["src"],
"ext": "ts",
"exec": "ts-node ./src/server.ts"
}
```

This tells nodemon which files to watch and execute.

### Configuring TypeScript

To generate our tsconfig.json file, run the following command:

```
tsc --init
```

Note that this file contains many, many configuration options. You may, of course, configure TypeScript according to your preferences. If not, here’s the configuration I use:

```
"compilerOptions": {
"target": "es6",
"module": "commonjs",
"outDir": "./dist",
"resolveJsonModule": true,
"strict": true,
"esModuleInterop": true,
"experimentalDecorators": true,
"emitDecoratorMetadata": true
},                         
"exclude": ["node_modules"], 
"include": ["src/**/*.ts"]
```

### Creating a .gitignore file

In this file we can list all the files/directories that we want git to ignore, this meaning that when we add and commit the changes made to our project, these files while remain “invisible” to git.

> Tip: It is very, very, very important to add node_modules to our .gitignore. We most definitely don’t want this huge file pushed to our repository!!

To create our .gitignore file, type this (while in the root of the directory, of course):

```
touch .gitignore
```

Then, add the following lines inside the file:

```
//.gitignore

node_modules
package-lock.json
dist
```

## Enough with the config, where’s the real coding?

It begins now, I swear. Let’s go:
### Setting up our server

The first thing we are going to do is create our basic directory structure. We are going to create a directory named src, which will contain all of our project files (aside from config):

```
mkdir src
cd src 
mkdir constants
touch server.ts
touch app.ts 
```

Let us open the app.ts file we just created, which will contain our basic express configuration:

```js
//src/app.ts

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
  }

  private setConfig() {
    //Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: '50mb' }));

    //Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended:true}));

    //Enables cors   
    this.app.use(cors());
  }
}

export default new App().app;
```

We will go over Express’ config quickly:

* Body parser allows us to receive requests with data in different formats, such as json, or x-www-form-urlencoded.
* CORS (Cross-Origin Resource Sharing) uses additional HTTP headers let our browser know that is has to allow a web application running at one domain to access resources from a server at a different origin.

Once this is done, we’re going to create a file to store our app’s constants. Why? Because this way we only have to declare each constant once. Whenever we need to make use of it, we just have to import it.

Furthermore, if the value of our constant changes (yes, even though it’s a constant, sometimes we need to change its value), it will change everywhere in our project, since it’s only declared in one place. All of this said, let’s create our constants file:

```
cd constants
touch pokeApi.constants.ts
```

The first constant we are going to declare is our PORT, which will store the number of the port we are going to open for our server:

```js
//src/constants/pokeApi.constants.ts

export const PORT = 9001;
```

Now, head over to our server.ts file, where we will set up our server:

```js
//src/server.ts

import app from "./app";
import { PORT } from "./constants/pokeApi.constants.ts";

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
```

> Tip: If anyone is unfamiliar with the syntax I’m using in the console.log, it’s a technique named template literals, where you type everything inside grave quotes (also known as backticks), and use interpolation (**${}**) to embed variables. More about this technique [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

Note that we are importing both the app we created previously, and our PORT constant.

And with just these three lil’ files, we’ve created our very own server! Fire up your terminal and execute the npm start script we created previously. You can do this by typing:

```
npm run start
```

> Tip: Since we are using nodemon to watch our project files, we only need to execute the previous command once. Every time we save our changes, nodemon will automatically restart our app for us.

After executing the command, you should be seeing the “Listening on port 9001” message on your terminal. Yeah! We now have our server up and running.

You can also head over to your favorite browser to check it out. Type this:

```
localhost:9001
```

You should be seeing a message similar to this: “Cannot GET /”. I know, not very exciting… But if you’re seeing this message, it works! If not, go back and re-check your code to make sure nothing is missing.

### Creating our first GET route

Since we now have our server up and running, we are going to create the first GET route and display a nice welcome message. After all, “Cannot GET /” isn’t very welcoming…

To do this, create a file named “main.controller.ts”, and type in the following:

```js
//src/main.controller.ts

import { Application } from 'express';

export class Controller {
  private pokeService: PokeService;

  constructor(private app: Application) {
    this.routes();
  }

  public routes() {
    this.app.route('/').get();
  }
}
```

As you may have noted, our Controller is going to act as a router; it is where we will define all of our routes for this project. Each route will execute a different action, which will be defined in a service file.

Why are we going to separate our actions in a different file? Say you defined all of the functions that interact with the database in your controller. For this project, we are going to use MongoDB as our database. Now imagine you want to change the database, and use MySQL instead. You would have to go back to your controller, and change **everything**, to adapt it to a MySQL database. If, however, you’ve declared all of your database functions in a different file, you wouldn’t need to change the controller at all. You could just swap the file with MongoDB query functions for one with MySQL query functions. By using a service, we keep our code **loosely coupled**.

Therefore, we will now create a file named “pokeApi.service.ts”, in a directory named “services”, and type in the following:

```js
//src/services/pokemon.service.ts

import { Request, Response } from "express";

export class PokeService {
  public welcomeMessage(req: Request, res: Response) {
    return res.status(200).send("Welcome to pokeAPI REST by Nya ^^");
  }
}

```

A very simple function, which returns our cute welcome message. Now, head over to our controller, and import the service we have just created:

```js
//src/main.controller.ts

import { Application } from 'express';
import { PokeService } from './services/pokemon.service';

export class Controller {
  private pokeService: PokeService;

  constructor(private app: Application) {
    this.pokeService = new PokeService();
    this.routes();
  }

  public routes() {
    this.app.route('/').get(this.pokeService.welcomeMessage);
  }
}
```

As you can see, our main GET route will call the welcomeMessage function we have just created in our pokemon service.

So far, so good. It’s time to import our Controller into our app.ts:

```js
//src/app.ts

import express, { Application } from 'express';

//importing our controller
import { Controller } from './main.controller';
import bodyParser from 'body-parser';
import cors from 'cors';

class App {
  public app: Application;
  
  //declaring our controller
  public pokeController: Controller;

  constructor() {
    this.app = express();
    this.setConfig();

    //Creating and assigning a new instance of our controller
    this.pokeController = new Controller(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(cors());
  }
}

export default new App().app;
```

And we’re done! Head over to your browser, and if you’ve done everything correctly, you should be seeing your welcome message displayed, like this:

<img src="/images/articles/devto/33ffada9d3953868.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 1 screenshot" loading="lazy" decoding="async">

### A little bit of refactoring

Remember we created a file which would store all of our constants? You may have realized that in our welcomeMessage function (in our pokemon service), we were returning a String containing the message, which we “hard coded” into our service. Not very neat, right? What if we want to change the message? I’d have to modify the service. Not good.

Therefore, we are going to take the message, and declare it in our constants file:

```js
//src/constants/pokeApi.constants.ts

export const PORT = 9001;
export const WELCOME_MESSAGE = "Welcome to pokeAPI REST by Nya ^^";
```

One we’ve done this, we are going to import the constants file in our service, like so:

```js
//src/services/pokemon.service.ts

import { Request, Response } from "express";
import { WELCOME_MESSAGE } from "../constants/pokeApi.constants";

export class PokeService {
  public welcomeMessage(req: Request, res: Response) {
    return res.status(200).send(WELCOME_MESSAGE);
  }
}

```

If you go back to your browser, you should still be seeing the welcome message.

## Conclusion

In this post we’ve covered everything from setting up our project’s configuration, to defining our first route and successfully making our first GET request.

If you want to check out the full code for this post, you can find it [here](https://github.com/NyaGarcia/pokeAPI/tree/part1) (branch “part1” of the pokeAPI project).

Thank you so much for reading, I hope you both enjoyed and found this post useful. Feel free to share with your friends and/or colleagues, and if you have any comments, don’t hesitate to reach out to me! Here’s a link to my [twitter](https://twitter.com/NyaBlk) page.

In the following post we will be connecting our application to a dockerized instance of MongoDB, deployed with docker-compose. We will also be using Mongoose to create a data Model and Schema.

Last, but not least, here is the link to the following post:

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 2](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-2-b56/)
