---
title: "Using variables in Docker-Compose"
description: "Learn how to configure Docker Compose using environment variables, .env files, and env_file."
date: "2019-09-05T15:45:15Z"
category: "DevOps"
tags: ["docker", "dockercompose", "beginners", "devops"]
minutes: 5
lang: "en"
art: "terminal"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/using-variables-in-docker-compose-11mf"
coverImage: "/images/articles/devto/4beba4f9d4ab1c69.png"
---

## Introduction

Sooner or later, we all have to deal with environment variables in our Compose files. They can become a pain, especially if we don't know how to use them properly. This piece is a recollection of everything I've learned about environment variables, and  aims to make using these variables easy, and above all, **secure**. 

### First of all, how do we use environment variables?
Docker Compose allows us to pass environment variables in via command line, or to define them in our shell. However, it's recommended to keep these values inside the actual Compose file, and out of the command line. 

Why, you may ask? 

Because this way, we don't have to remember all the environment variables we use every time we deploy our container. By storing them in the Compose file, we are able to **maintain consistency during our builds**. 

There are several ways to do this:

## Using the environment option

Using the Compose environment option allows us to declare environment variables and their values inside our Compose file, like this:

```yaml
version: '3.1'

services:
  db:
    container_name: Mongo-db
    image: mongo:latest
    restart: always
    volumes:
      - ./myData:/data/db
    environment:
      - MONGO_INITDB_DATABASE=MyDatabase
      - MONGODB_USER=Nya
      - MONGODB_PASS=secretpassword
    ports:
      - 27020:27017
```

[View docker-compose.yml on GitHub Gist](https://gist.github.com/NyaGarcia/0767844cd052e07b3923b434731eba68)

This is the easiest, quickest way of storing environment variables inside Compose files. However, it has a (in my opinion) **huge** drawback. It is related to security. Can you guess what it is?

That's right. 

Storing the values of your environment variables in the Compose file, which, 9 and a half times out of ten will go to straight to source control, is a huge security risk. Luckily, we have an alternative: using an external file to store our environment variables.

## Using a .env file

The main advantage of using an external file for your environment variables is the fact that you can keep said file **out of your source control**. After all, no one enjoys their passwords/API keys/other super secret information to be displayed all over the internet, for anyone to see :p 

*.env* files are plain text files. You don't need to name them, the extension is the actual name of the file. They must be created at the **root of your project**, which is also where your *docker-compose.yml* file should be. 

We declare and assign variables in our *.env* file. You can name the variables however you want, since we will only be accessing their values. Here's my *.env* file:

![.env file contents](/images/articles/devto/e1823c34809045c4.png)

You can also create and populate your *.env* file from the command line, by using the linux cat command:

![Creating .env file from command line](/images/articles/devto/5e63e06cf3462ebc.png)

> **Tip**: Remember not to leave any spaces between the "=" sign and the value assigned to your variable, as they will be added to the string.

So, now that we have our variables stored in our *.env* file, let's use them in our Compose file. Now's the time to use string interpolation (that's a fancy name for using this notation: **${string}** ) to assign the **values** of our *.env* variables to the environment variables in the Compose file, like so:

```yaml
version: '3.1'

services:
  db:
    container_name: Mongo-db
    image: mongo:latest
    restart: always
    volumes:
      - ./myData:/data/db
    environment:
      - MONGO_INITDB_DATABASE=${DATABASE}
      - MONGODB_USER=${USERNAME}
      - MONGODB_PASS=${PASS}
    ports:
      - 27020:27017
```

[View docker-compose.yml on GitHub Gist](https://gist.github.com/NyaGarcia/0606d59c3dcbf4489cfea1cce8f4f1ca)


As you can see, we maintain the environment option, and simply assign our external values to the Compose environment variables.

To check that everything is working properly, run the following command:

```
docker-compose up
```

> **Tip**: You can check which values are assigned to the environment variables by running the following command (in a different terminal):


```
docker-compose config
```

### Environment variable priority

Something very important we must keep in mind is the priority used by Compose to choose which environment value it uses. What does this mean? 

If we declare the same environment variable in several files, for example, both in the Compose file and in the external *.env* file, with different values, Compose will use the value of the variable declared in the Compose file. Why? 

Because depending on where the variable is declared, it is given a higher or lower priority by Compose. Here's the order, ranking from highest priority, to lowest:

**1. Compose file**
**2. Shell environment variables**
**3. Environment file**
**4. Dockerfile**
**5. Variable is not defined**

If for some reason, Compose is picking up and assigning a value you weren't expecting, this is probably the cause. Make sure to have all your variables declared exactly where you want them to be. 

## Using the env-file option

In the previous section, we talked about *.env* files, and we said that these files aren't named. However, if for whatever reason we do want our *.env* file to have a name, a name like *secret-stuff.env*, Compose has a nifty little option named **env-file**.

This option allows us to tell Compose which *.env* file it has to look for, as opposed to its default behavior, which is to look for an unnamed *.env* file. This is how we use the *env-file* option:

```yaml
version: '3.1'

services:
  db:
    container_name: Mongo-db
    image: mongo:latest
    restart: always
    volumes:
      - ./myData:/data/db
    env_file:
      - ./secret-stuff.env
    ports:
      - 27020:27017
```

[View docker-compose.yml on GitHub Gist](https://gist.github.com/NyaGarcia/59e3d4d1e43dbb1a9290a476ec19bfcb)

As you can see, we added the env_file option, which points to a file named *secret-stuff.env* file. All that is left is to rename our previous *.env* file to *secret-stuff.env* .

You may have noticed that the environment option is no longer present in our Compose file. This is because using the *env-file* option raises a problem (that gave me quite a headache). Allow me to explain:

To be able to assign values declared in an external **named** *.env* file to Compose variables requires said file to be defined in **the primary Compose service.** This is related to the order that Compose follows when performing operations. However, we have no primary service, since we are only using a **db service**. Therefore, if we try to deploy our Compose file, it will complain about our variables not being defined, and substitute them with blank strings.

> **Comment**: You don't have to take my word for it, go ahead and try it! Run docker-compose up and see what happens :)

So, how do we solve this problem? Here's what I figured out:

If we remove the environment option from the Compose file, upon deployment, Compose will search for the specified **secret-stuff.env file**, something it doesn't do when the environment option is present. Problem solved!

Bear in mind though, since we don't have the environment option any longer, we must declare the environment variables directly in the *secret-stuff.env* file, like this:

![Alt Text](/images/articles/devto/878f3b13bc8a0d9c.png)

Once again, to check everything works properly, run:

```
docker-compose up
```

## Conclusion

That's all folks! By now you've (hopefully!) learnt the different ways of securely dealing with environment variables in Compose files. If you have any doubts or would like to discuss anything, don't hesitate to reach out to me. Here's a link to my [Twitter page](https://twitter.com/NyaBlk).
 
Thank you for reading :)
