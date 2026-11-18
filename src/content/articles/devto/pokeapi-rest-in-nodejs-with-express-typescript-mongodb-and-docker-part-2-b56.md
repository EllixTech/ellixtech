---
title: "PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 2"
description: "Foreword   This is part 2 of a series of posts which will show you how to create a RESTful..."
date: "2019-07-11T11:25:06Z"
category: "Tutorials"
tags: ["typescript", "node", "express", "mongodb"]
minutes: 7
lang: "en"
art: "terminal"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-2-b56"
series: "PokeAPI REST API"
part: 2
---

<img src="/images/articles/devto/bd795de22a30892d.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 2 screenshot" loading="lazy" decoding="async">

## Foreword
This is part 2 of a series of posts which will show you how to create a RESTful API in NodeJS. For further reading please check out the following links:

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 1](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-1-5f8g/)

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 3](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-3-494a/)

If you prefer to check out the full code, you can find the full PokeApi project [here](https://github.com/NyaGarcia/pokeAPI).

## Introduction

In the previous post we set up our server, and implemented our first GET route, which returned a lovely welcome message. Since our goal is to perform basic CRUD operations on our Pokemon data, we need to have a database to store our information.

In this post we are going to create and deploy a docker container for our MongoDB database. We are also going to define our Pokemon data model using Mongoose.

## Let’s code
### Preview
Once again, before we start, a little preview of how our directory tree will look by the end of this post:

<img src="/images/articles/devto/c95afa40cf6c2b17.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 2 screenshot" loading="lazy" decoding="async">

Just as a reminder, to run our project we are currently using the following command:

```
npm run start
```
This said, let us begin.

### Creating our docker-compose file
The first thing we are going to do is create a docker-compose.yml file, on the same level of our “src” directory, which is to say, outside the “src” directory. Once this is done, copy and paste the following code into the newly created file:

```yaml
version: "3.1"

services:
  db:
    container_name: mongoDB
    image: mongo:latest
    restart: always
    volumes:
      - ./pokeData:/data/db
    environment:
      - MONGO_INITDB_DATABASE= Pokemon
    ports:
      - 27017:27017
```

[View docker-compose.yml on GitHub Gist](https://gist.github.com/NyaGarcia/232be7fedb0247e05bb2d572d0b67424)

Let’s explain briefly what all of these configuration options mean:

**version:** Specifies the docker-compose version we are going to use.

**services:** We can specify a list of services which will be deployed with our container. In our case, we want a database, which is why we use the following attribute:

**db:** We indicate that we are going to deploy a database.

**container_name:** This is optional, it allows us to specify a custom container name. If we omit this option, a default container name will be generated.

**image:** Specifies the image that the container will be built from. In our case, the latest MongoDB image.

**restart:** Always restart the container if it stops. If it is manually stopped, it is restarted only when Docker daemon restarts or the container itself is manually restarted.

**volumes:** This is a very interesting option. It allows us to have data persistence. What does this mean? All of our data is going to be stored in a docker container. However, docker containers can be stopped, restarted etc. In such cases, what happens to our data? Does it disappear? The answer is, it won’t disappear if we use the volumes option. We can specify a directory in our local machine where our data will be stored. In our case, this directory is named “pokeData”.

**environment:** We can specify environment variables. In our case, we are creating a database named “Pokemon” when the container starts.

**ports:** Specifies the ports that will be exposed (Host port: Container port). In our case, we are mapping our local port 27017 to the container port 27017 (27017 is the default port for MongoDB).

> Note: For more information about docker-compose files, you can check out this [link](https://docs.docker.com/compose/compose-file/).

Now that we have our docker-compose file ready, let’s start the container. Fire up your terminal, and type this command:

```
docker-compose up 
```

If you’ve done everything correctly, you should be seeing output similar to this on your terminal:

<img src="/images/articles/devto/f4bbfad2b8017665.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 2 screenshot" loading="lazy" decoding="async">

You should also see that a new directory named **pokeData** has appeared in your directory tree. This is the directory we specified earlier in our docker-compose file, by using the “volumes” attribute. Our pokeData directory will store all our database data (once we insert some), and keep it safe and sound.

Isn’t docker awesome and easy to use? A simple, intuitive, extensively documented configuration file and one command are all we need to have our database instance up and running. Beautiful.

> Troubleshooting: If you’re getting the following output after executing the docker-compose up command:

> *ERROR: Couldn’t connect to Docker daemon at http+docker://localhost — is it running?*

> It means that your docker daemon isn’t running. Execute this command to start the docker daemon:
```
sudo systemctl start docker
```
> And try the docker-compose up command again. The error should be gone.

### Connecting our app to our dockerized MongoDB database
We have our database container deployed and running, so we now need to connect our application to it. Open the app.ts file, and add the following code:

```js
//src/app.ts

import express, { Application } from 'express';
import { Controller } from './main.controller';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

class App {
  public app: Application;
  public pokeController: Controller;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();

    this.pokeController = new Controller(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(cors());
  }

  //Connecting to our MongoDB database
  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost:27017/Pokemon", {
      useNewUrlParser: true
    });
  }
}

export default new App().app;

```

You may have noticed that once again, we are hard coding a variable: the mongoose connection string. To avoid this, let’s open our constants file, and store it there:

```js
//src/constants/pokeAPI.constants.ts

export const PORT = 9001;
export const WELCOME_MESSAGE = "Welcome to pokeAPI REST by Nya ^^";
export const MONGO_URL = "mongodb://localhost:27017/Pokemon";
```

Back in our app.ts, we can now change the hard coded String for our newly defined constant:

```js
//src/app.ts

import express, { Application } from 'express';
import { Controller } from './main.controller';

//importing our MONGO_URL constant
import { MONGO_URL } from './constants/pokeApi.constants';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

class App {
  public app: Application;
  public pokeController: Controller;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();

    this.pokeController = new Controller(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(cors());
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;

//using our constant instead of the hard coded String
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true
    });
  }
}

export default new App().app;

```

If we’ve done everything correctly, we should now be seeing the following output in our terminal where we ran our “docker-compose up” command (if, for any reason, you stopped docker-compose previously, run the command again):

<img src="/images/articles/devto/65c0552323a9a5c9.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 2 screenshot" loading="lazy" decoding="async">

As you can see, our docker container has accepted the connection we made from our application. So far, so good.

### Creating our data model

Now that we are connected to our database, we need a way to interact with it. To achieve this, we are going to use Mongoose, which provides us with several data modelling tools, such as Schemas and Models. Mongoose makes interacting with MongoDB exceedingly easy and simple.

> From the mongoose docs: *Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.*

To store our data models, we are going to create a models directory in src, which will contain a file named “pokemon.model.ts”. Inside this file, we are going to import Mongoose and create our data model:

```js
//src/models/pokemon.model.ts

import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
  name: String,
  gender: String,
  type: String,
  height: Number,
  weight: Number,
  photo: String
});
```
Once we’ve created our pokemon Schema, we need to create a Mongoose model. To do this, we will part from our newly created Schema. Therefore, in the same file:

```js
//src/models/pokemon.model.ts

import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
  name: String,
  gender: String,
  type: String,
  height: Number,
  weight: Number,
  photo: String
});

//Creating our model
export const Pokemon = mongoose.model("Pokemon", PokemonSchema);
```

> Note: I am fully aware of the fact that we are defining both our schema and model in the same file; a file named “pokemon.**model**”. Despite being a control freak, I refuse to create two separate files for 10 lines of code. If you are even more obsessed than I, you may, of course, create a separate file for your schema. Don’t count me in though :p

With our Pokemon model just created, it is now time to import it in the PokeService:

```js
//src/services/pokemon.service.ts

import { WELCOME_MESSAGE } from "../constants/pokeAPI.constants";
import { Request, Response } from "express";
//importing our model
import { Pokemon } from "../models/pokemon.model";

export class PokeService {
  public welcomeMessage(req: Request, res: Response) {
    return res.status(200).send(WELCOME_MESSAGE);
  }
}
```
The Pokemon model will later be used to query our MongoDB database, once we create the CRUD routes and their respective db query functions. This, however, we will leave for the following post.

## Conclusion

In this post we’ve learnt how to deploy an instance of MongoDB with docker-compose, and how to connect our application to it. We’ve also used Mongoose to create both a Schema and a Model for our database.

If you’d like to see the full code for this post, you can do so [here](https://github.com/NyaGarcia/pokeAPI/tree/part2) (branch “part2” of the pokeAPI project).

Thank you so much for reading, I hope you both enjoyed and found this post useful. Feel free to share with your friends and/or colleagues, and if you have any comments, don’t hesitate to reach out to me! Here’s a link to my [twitter](https://twitter.com/NyaBlk) page.

In the following post we will be implementing the rest of the routes that are necessary to create a basic CRUD, as well as their respective database query functions.

Here is the link to the next post:

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 3](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-3-494a/)
