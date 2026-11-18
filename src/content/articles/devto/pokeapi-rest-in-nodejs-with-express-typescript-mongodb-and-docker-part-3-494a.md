---
title: "PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3"
description: "Foreword   This is part 3 of a series of posts which will show you how to create a RESTful..."
date: "2019-07-11T11:26:03Z"
category: "Tutorials"
tags: ["typescript", "node", "docker", "express"]
minutes: 9
lang: "en"
art: "terminal"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-3-494a"
series: "PokeAPI REST API"
part: 3
---

<img src="/images/articles/devto/bd795de22a30892d.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

## Foreword

This is part 3 of a series of posts which will show you how to create a RESTful API in NodeJS. For further reading please check out the following links:

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 1](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-1-5f8g/)

[PokeAPI REST in NodeJS with Express, TypeScript, MongoDB and Docker — Part 2](/journal/devto/pokeapi-rest-in-nodejs-with-express-typescript-mongodb-and-docker-part-2-b56/)

If you prefer to check out the full code, you can find the full PokeApi project [here](https://github.com/NyaGarcia/pokeAPI).

## Introduction

In the previous post we deployed an instance of MongoDB with docker-compose, and connected our application to it. We also created our Mongoose Schema and data Model.

In this post we are going to implement the rest of the routes that are necessary to create a basic CRUD, as well as their respective database query functions. These functions will make use of the Model we created previously to query our MongoDB database.

## The coding begins
### Preview

As always, we will begin with a preview of how our directory will look by the end of this post:

<img src="/images/articles/devto/b587c76f2592fbde.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

You may note that, directory-wise, nothing has changed since the previous post. Content-wise, however, there are quite a few changes.

Just as a reminder, to run our project we are currently using the following command:

```
npm run start
```

To start our dockerized MongoDB instance, use the following command:

```
docker-compose up
```

This said, let us begin.

### PokeService: Querying the database

It is now time to create our database query functions. For this, as previously mentioned, we are going to make use of our Pokemon Model. Since our goal is to implement the four basic CRUD operations, the first function we are going to implement is one for reading the contents of the db. Open up the pokemon.service.ts file, and type in the following:

```js
//src/services/pokemon.service.ts

import { Request, Response } from 'express';
import { MongooseDocument } from 'mongoose';
import { Pokemon } from '../models/pokemon.model';
import { WELCOME_MESSAGE } from '../constants/pokeApi.constants';

export class PokeService {
  public welcomeMessage(req: Request, res: Response) {
    res.status(200).send(WELCOME_MESSAGE);
  }

//Getting data from the db
  public getAllPokemon(req: Request, res: Response) {
    Pokemon.find({}, (error: Error, pokemon: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(pokemon);
    });
  }
 }
```

As you can see, we’ve created a new function, named “getAllPokemon”. It uses the Pokemon Model to interact with MongoDB and find all the Pokemon in the db.

Since Mongoose’s helper functions are extensively documented in the [Mongoose docs](https://mongoosejs.com/docs/queries.html), I don’t think it’s necessary to break them down here. I will, however, comment on the **guard clause** inside the callback:

> Note: Guard clauses are, put simply, a check that exits the function, either with a return statement or an exception, in case of an error or fulfilled condition. They allow us to avoid unnecessary complexity (if else if structures) in our code.

This is our guard clause:

```js
if (error) {
   res.send(error);
  }
  res.json(pokemon);
```

By reversing the logic, and checking first for errors, we can avoid an “else” statement. If any errors are encountered, we exit the function by sending the error. If we find no errors, then the pokemon result is sent. We will make use of this technique throughout the rest of this post.

### Implementing GET routing

We now have our getAllPokemon function in our PokeService. To be able to interact with this function, we must create another GET route. Let’s open our controller, and add a new route:

```js
//src/main.controller.ts

import { PokeService } from "./services/pokemon.service";
import { Application } from "express";

export class Controller {
  private pokeService: PokeService;

  constructor(private app: Application) {
    this.pokeService = new PokeService();
    this.routes();
  }

  public routes() {
    this.app.route("/").get(this.pokeService.welcomeMessage);

    //Our new route
    this.app.route("/pokemons").get(this.pokeService.getAllPokemon);
  }
}

```

As you can see, the endpoint to access this new route is “/pokemons”. (Excuse the glaring grammatical error, it’s to avoid confusion further on.)

From here on, I recommend using Postman to test our routes. You can find more information about Postman [here](https://www.getpostman.com/) and install it [here](https://www.getpostman.com/downloads/).

If all goes well, you should be obtaining output like the following from Postman:

<img src="/images/articles/devto/1a132260e155c1c8.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

Since we haven’t introduced any data into our db, we are receiving an empty array. We have now completed our first db query successfully!

### Adding a new Pokemon

Let’s implement a function to add a new pokemon to our db. Go back to the PokemonService and type:

```js
//src/services/pokemon.service.ts

import { Request, Response } from 'express';
import { MongooseDocument } from 'mongoose';
import { Pokemon } from '../models/pokemon.model';
import { WELCOME_MESSAGE } from '../constants/pokeApi.constants';

export class PokeService {
  public welcomeMessage(req: Request, res: Response) {
    res.status(200).send(WELCOME_MESSAGE);
  }

  public getAllPokemon(req: Request, res: Response) {
    Pokemon.find({}, (error: Error, pokemon: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(pokemon);
    });
  }

  //Adding a new pokemon

  public addNewPokemon(req: Request, res: Response) {
    const newPokemon = new Pokemon(req.body);
    newPokemon.save((error: Error, pokemon: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(pokemon);
    });
  }
}
```

To explain briefly, we create a Mongoose Document (newPokemon) from the request body, and we save it into the db.

> Note: Just as a reminder, Mongoose Documents are instances of Mongoose Models

Let’s create the route to interact with our function. In our controller:

```js
//src/main.controller.ts

import { PokeService } from "./services/pokemon.service";
import { Application } from "express";

export class Controller {
  private pokeService: PokeService;

  constructor(private app: Application) {
    this.pokeService = new PokeService();
    this.routes();
  }

  public routes() {
    this.app.route("/").get(this.pokeService.welcomeMessage);
    this.app.route("/pokemons").get(this.pokeService.getAllPokemon);

    //Our new route
    this.app.route("/pokemon").post(this.pokeService.addNewPokemon);
  }
}

```

Note that our new route is accessed through a POST request. Head over to Postman, and let’s add a new Pokemon to our db:

<img src="/images/articles/devto/fd0e83703352b631.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

If everything goes well, you should be receiving the Pokemon you just added as output. To double-check, we can make use of our GET route:

<img src="/images/articles/devto/7514dbe413352b54.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

As you can see, we now have a Squirtle in our db. Don’t worry about the “\_id” and “__v” fields. They are generated automatically by Mongooose, and we will deal with them later.

### Deleting a Pokemon

To implement a function to delete a Pokemon, open up the PokeService, and type the following:

```js
//src/services/pokemon.service.ts

import { Request, Response } from 'express';
import { MongooseDocument } from 'mongoose';
import { Pokemon } from '../models/pokemon.model';
import { WELCOME_MESSAGE } from '../constants/pokeApi.constants';

export class PokeService {
  public welcomeMessage(req: Request, res: Response) {
    res.status(200).send(WELCOME_MESSAGE);
  }

  public getAllPokemon(req: Request, res: Response) {
    Pokemon.find({}, (error: Error, pokemon: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(pokemon);
    });
  }

  public addNewPokemon(req: Request, res: Response) {
    const newPokemon = new Pokemon(req.body);
    newPokemon.save((error: Error, pokemon: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(pokemon);
    });
  }

  public deletePokemon(req: Request, res: Response) {
    const pokemonID = req.params.id;
    Pokemon.findByIdAndDelete(pokemonID, (error: Error, deleted: any) => {
      if (error) {
        res.send(error);
      }
      const message = deleted ? 'Deleted successfully' : 'Pokemon not found :(';
      res.send(message);
    });
  }
}
```

We obtain the ID of the Pokemon to delete from the request parameters, this is to say, the parameters in the query string in the URL to which we make the GET request. It would look something like this:

```
localhost:9001/pokemon/123pokemonId
```

Mongoose has a very useful findByIdAndDelete helper function, which allows us to delete a document (in our case, a Pokemon) by said document’s “_id” field. This function is shorthand for findOneAndDelete({_id: pokemonId}).

> Note: If you have the need of deleting a document by any field other than _id, you may use the findOneAndDelete function aforementioned. More information about it [here](https://mongoosejs.com/docs/api.html#model_Model.findOneAndDelete).

I’d now like to draw your attention to the following line:

```js
const message = deleted ? "Deleted successfully" : "Pokemon not found :(";
```

Here we have a ternary expression, which assigns a different value to the “message” variable, depending on the value of the second parameter (“deleted”) passed to the callback.

This is because Mongoose’s *findByIdAndDelete* function finds a matching document, deletes it, and then passes the found document (if any) to the callback. Therefore, if Mongoose finds a document, it will be deleted, in which case we return the “Deleted successfully” message. If not, we return the “Pokemon not found” message.

Once we have our function ready, let’s create our route. In our controller:

```js
//src/main.controller.ts

import { PokeService } from "./services/pokemon.service";
import { Application } from "express";

export class Controller {
  private pokeService: PokeService;

  constructor(private app: Application) {
    this.pokeService = new PokeService();
    this.routes();
  }

  public routes() {
    this.app.route("/").get(this.pokeService.welcomeMessage);
    this.app.route("/pokemons").get(this.pokeService.getAllPokemon);
    this.app.route("/pokemon").post(this.pokeService.addNewPokemon);

    //Our new route
    this.app.route("/pokemon/:id").delete(this.pokeService.deletePokemon);
  }
}

```

In the route we have just created, we are indicating that we will receive a request parameter in the URL, a parameter we have named “id”. This is the parameter we previously used in the Pokemon Service to obtain the id.

Note that this route is accessed through a DELETE request.

Once again, we open Postman, and test our new route by deleting the Squirtle (or whichever Pokemon you chose) we added to our db earlier:

<img src="/images/articles/devto/8a90f4bdfc00f431.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

As you can see, we receive the “Deleted successfully” message. If no Pokemon with the id we specified were to be found, we would receive the “Pokemon not found” message instead.

We can double check that our squirtle has been deleted correctly by obtaining all Pokemon from the db:

<img src="/images/articles/devto/88b71556b7ad5415.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

Empty array = no Pokemon = Squirtle has been deleted successfully.

### Updating a Pokemon

In our Pokemon Service:

```js
//src/services/pokemon.service.ts

import { Request, Response } from 'express';
import { MongooseDocument } from 'mongoose';
import { Pokemon } from '../models/pokemon.model';
import { WELCOME_MESSAGE } from '../constants/pokeApi.constants';

export class PokeService {
  public welcomeMessage(req: Request, res: Response) {
    res.status(200).send(WELCOME_MESSAGE);
  }

  public getAllPokemon(req: Request, res: Response) {
    Pokemon.find({}, (error: Error, pokemon: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(pokemon);
    });
  }

  public addNewPokemon(req: Request, res: Response) {
    const newPokemon = new Pokemon(req.body);
    newPokemon.save((error: Error, pokemon: MongooseDocument) => {
      if (error) {
        res.send(error);
      }
      res.json(pokemon);
    });
  }

  public deletePokemon(req: Request, res: Response) {
    const pokemonID = req.params.id;
    Pokemon.findByIdAndDelete(pokemonID, (error: Error, deleted: any) => {
      if (error) {
        res.send(error);
      }
      const message = deleted ? 'Deleted successfully' : 'Pokemon not found :(';
      res.send(message);
    });
  }

  //Updating a pokemon

  public updatePokemon(req: Request, res: Response) {
    const pokemonId = req.params.id;
    Pokemon.findByIdAndUpdate(
      pokemonId,
      req.body,
      (error: Error, pokemon: any) => {
        if (error) {
          res.send(error);
        }
        const message = pokemon
          ? 'Updated successfully'
          : 'Pokemon not found :(';
        res.send(message);
      }
    );
  }
}

```

Note that we have used precisely the same technique as in the deletePokemon function. Obtaining the ID as a request parameter, using Mongoose’s findByIdAndUpdate helper function, and returning a message according to the value of the second callback parameter.

In our controller, let’s create the final route:

```js
//src/main.controller.ts

import { PokeService } from "./services/pokemon.service";
import { Application } from "express";

export class Controller {
  private pokeService: PokeService;

  constructor(private app: Application) {
    this.pokeService = new PokeService();
    this.routes();
  }

  public routes() {
    this.app.route("/").get(this.pokeService.welcomeMessage);
    this.app.route("/pokemons").get(this.pokeService.getAllPokemon);
    this.app.route("/pokemon").post(this.pokeService.addNewPokemon);

    //Chaining our route

    this.app
      .route("/pokemon/:id")
      .delete(this.pokeService.deletePokemon)
      .put(this.pokeService.updatePokemon);
  }
}

```

Considering that both the delete and put routes have exactly the same endpoint, we can chain them as shown above. This way, we don’t have to declare the same route twice, one for each verb.

Let’s head over to Postman, and test our final route. Don’t forget to add a new Pokemon, or you won’t have any data to update! I chose to add another Squirtle, which I will now update:

<img src="/images/articles/devto/306230cfe17ad546.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

Let’s obtain all our Pokemon to check on our Squirtle:

<img src="/images/articles/devto/96b4c0f626f97588.png" alt="PokeAPI REST in NodeJS with Express, Typescript, MongoDB and Docker — Part 3 screenshot" loading="lazy" decoding="async">

Congratulations! Your Squirtle has evolved into a Wartortle, and you have successfully implemented all the basic CRUD functions and their respective routes.

## Conclusion

In this post we’ve learnt how to query MongoDB by means of Mongoose Models and Documents. We have also implemented routes to access our CRUD functions.

If you’d like to see the full code for this post, you can do so [here](https://github.com/NyaGarcia/pokeAPI/tree/part3) (branch “part3” of the pokeAPI project).

Thank you so much for reading, I hope you both enjoyed and found this post useful. Feel free to share with your friends and/or colleagues, and if you have any comments, don’t hesitate to reach out to me! Here’s a link to my [twitter](https://twitter.com/NyaBlk) page.
