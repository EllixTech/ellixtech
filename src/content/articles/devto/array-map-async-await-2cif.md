---
title: "Array.map() + async/await"
description: "MDN Web Docs: The map() method creates a new array with the results of calling a provided function..."
date: "2019-05-02T15:06:25Z"
category: "JavaScript"
tags: ["javascript", "async", "typescript", "map"]
minutes: 2
lang: "en"
art: "orbit"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/array-map-async-await-2cif"
---

![Meow](/images/articles/devto/34f8fa62faf9d772.png)

> MDN Web Docs: The map() method creates a new array with the results of calling a provided function on every element in the calling array.

Today I found myself in a situation where I had to use an asynchronous function inside of an Array.map. Needless to say, Array.map is a synchronous function. Therefore, I had a slight problem in my hands.

I came across this problem while refactoring my code to get rid of a nasty “for..of”. Basically, I had an Array of objects upon which I had to make several calculations. One of these calculations involved making a call to an API which, of course, is asynchronous. Before my refactoring, I had no problem with using async/await inside my for..of loop. However, after making the switch to Array.map, I realized it wouldn’t be as simple.

Here’s what I did:


```javascript
 function getCalculatedRoutes(routes: Array<any>): Promise<any> {
    return Promise.all(
      routes.map(async (route: any) => {
        const distance = await getDistance();
        route.distance = distance;
        route.cost = calculateCost(distance);
        return route;
      })
    );
  }
  
  function calculateCost(distance: number): string {
    return (distance * 0.19).toFixed(2);
  }
  
  async function getDistance() {
    //simulating the API call
     return Math.floor(Math.random() * 10) + 1;
  }

  async function printResults() {
    const routes = await getCalculatedRoutes([{destination: "Malaga"}, {destination: "Barcelona"}]);
    document.write(JSON.stringify(routes));
  }

printResults();
```

[View async Array.map on GitHub Gist](https://gist.github.com/NyaGarcia/7a47881a46eefd147a5763cf0a79125b) 

<figcaption>Asynchronous Array.map()</figcaption>

As you can see, my getDistance function simulates a call to an API, and returns a Promise.

> Note: The return value of async functions is always a Promise

This means that our Array.map function will return an Array of unresolved promises. Therefore, outside of the Array.map, we have to wait for all the promises to be resolved before we can make use of the resulting Array. This is why we use Promise.all().

> Note: If you aren’t comfortable with async/await syntax, you can always resort to good ol’ “.then”

You can check out and play with my solution in the following CodePen:

<iframe class="codepen-embed" src="https://codepen.io/nyagarcia/embed/axXEWa?default-tab=js%2Cresult" title="Asynchronous Array.map() demo" loading="lazy" allowfullscreen></iframe>

[Open the asynchronous Array.map() demo on CodePen](https://codepen.io/nyagarcia/pen/axXEWa/)

Pretty simple, right? It took me a while to figure it out…
Which is why I decided to share my solution, in case someone else encounters this issue. I hope it helps! Thank you for reading, feel free to share or leave a comment :)

P.S. You can check out my Github and Twitter pages if you like...
