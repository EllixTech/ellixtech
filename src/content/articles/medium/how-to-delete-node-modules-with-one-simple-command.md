---
title: "How To Delete node_modules With One Simple Command"
description: "Get rid of node_modules and regain gigabytes of disk space"
date: "2022-08-22"
category: "Developer tools"
tags: ["Programming", "JavaScript", "Web Development", "Open Source", "Nodejs"]
minutes: 2
lang: "en"
art: "terminal"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/better-programming/how-to-delete-node-modules-with-one-simple-command-3ba27ea2cca7"
sourceName: "Medium"
coverImage: "/images/articles/medium/f2964c28ac768d7c.png"
---

## Introduction

`node_modules` folders are the bane of JavaScript developers. With each new project we start, a lovely new `node_modules` folder is born on our machine, and, as you probably know, these babies are hungry for disk space.

If you’re as big of a nerd as I am, I’m sure you’ll have dozens of JS projects you’re currently working on, which translates to gigabytes of space being hogged by `node_modules` on your hard drive.

Whenever I had the time (or rather, whenever my machine complained of having little to no available space left), I went on the `node_modules` hunt. However, as it usually happens, I can’t always remember where all my projects are, so even with the aid of the `find` command, it wasn’t always easy to find and destroy them.

## Npkill to the Rescue

Allow me to introduce [Npkill](https://npkill.js.org/), an open source npm package (developed by yours truly) that allows to easily find and destroy `node_modules`. How do we use it? It’s as simple as running the following command on your terminal:

```bash
npx npkill
```

Npkill will then take care of finding all of the `node_modules` folders, neatly displaying them in a list and then waiting patiently for you to hit the space bar and destroy those hard drive invaders. Here’s an example:

![Npkill in action](/images/articles/medium/e3009a1185ec848b.gif)

Npkill in action

Simple, graphic, and easy. What more can we ask for?

### Npkill options

By default, Npkill searches for `node_modules` in the directory where you run the command. However, there are quite a few options that will allow you to customize Npkill’s behavior (including changing the highlight color, if you’re so inclined to). Here’s a table featuring all of the different options:

![Npkill options](/images/articles/medium/243d34eab6aa1f23.png)

Npkill options

For more information about Npkill, you can visit the [official website](https://npkill.js.org/) or the [GitHub repository](https://github.com/voidcosmos/npkill).

## Conclusion

That’s all, folks! This one was short, sweet, and (I hope) quite useful. Now you know how to get rid of old and heavy easily `node_modules` folders by running one simple command on your terminal.

If you have any questions, drop them in the comments, and I’ll try my best to answer them. Thank you very much for reading!
