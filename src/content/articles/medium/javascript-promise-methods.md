---
title: "JavaScript Promise Methods"
description: "Everything you need to know about Promise.all, Promise.allSettled, Promise.race and Promise.any"
date: "2023-01-02"
category: "JavaScript"
tags: ["JavaScript", "Programming", "Software Development", "Web Development", "Coding"]
minutes: 6
lang: "en"
art: "types"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/@nyablk97/javascript-promise-methods-62a4b3e55fd7"
sourceName: "Medium"
coverImage: "/images/articles/medium/752362ca09813f35.jpg"
---

Photo by [marcos mayer](https://unsplash.com/@mmayyer?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

## Introduction

Ever since the introduction of promises in ES2015, which took asynchronism handling to the next level, several new promise methods have appeared, which allow us to perform operations with multiple promises. These methods are the following:

- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [Promise.any](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

In this guide we’ll cover all of the existing promise methods: how they work, their differences and use cases. I’ve also created Stackblitz projects for each of the examples that will be shown in this guide, where you’ll be able to play around with it and see the output for yourself. You will find the link to the Stackblitz projects at the end of each section.

## Promise.all

The `Promise.all` method receives an iterable (such as an array) of promises, and returns a promise of an array that contains the results of all the resolved input promises.

Let’s take a look at an example:

```typescript
const promise1 = new Promise(resolve => {
  setTimeout(() => resolve("First promise"), 200);
});

const promise2 = new Promise(resolve => {
  setTimeout(() => resolve("Second promise"), 500);
});

Promise.all([promise1, promise2]).then(console.log);
// Output: ["First promise", "Second promise"]
```

[View promise-all.ts on GitHub Gist](https://gist.github.com/NyaGarcia/0ce11e667f5621485fb8f0d71c85416d)

As you can see in the above code, we’re passing an array of two promises to `Promise.all`. As soon as these two promises get resolved, `Promise.all` also resolves, and we can access its value, which is an array containing the results of the two promises. Easy, isn’t it?

### Rejection is hard

`Promise.all` is simple enough, but what happens if one of our promises rejects? Because let’s be honest here, in the harsh real world, errors happen and not all of our promises will resolve. Let’s add a rejected promise to our previous example and see how `Promise.all` reacts:

```typescript
const promise1 = new Promise(resolve => {
  setTimeout(() => resolve("First promise"), 200);
});

const promise2 = new Promise(resolve => {
  setTimeout(() => resolve("Second promise"), 500);
});

const rejectedPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejected promise!")), 500);
});

Promise.all([promise1, promise2, rejectedPromise]).then(console.log, err =>
  console.log(`An error occurred: ${err.message}`)
);
// Output: An error occurred: Oh no, a rejected promise!
```

[View promise-all.ts on GitHub Gist](https://gist.github.com/NyaGarcia/bf32e5e8781f4c097990bc876081c982)

So it turns out that if one of the promises fails, then so does `Promise.all`. As you can probably imagine, this kind of behavior isn’t at all desirable. Imagine we have 50 promises, and all resolve except for one that rejects. Because of that single rejection, `Promise.all` will reject and we won’t be able to obtain the values of the remaining 49 promises that did resolve. Isn’t there anything we can do about this?

Of course there is! We can catch the errors and handle the rejections:

```typescript
const promise1 = new Promise(resolve => {
  setTimeout(() => resolve("First promise"), 200);
});

const promise2 = new Promise(resolve => {
  setTimeout(() => resolve("Second promise"), 500);
});

// Handling errors with .catch
const handled = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejected promise!")), 500);
}).catch(err => `A promise rejected with: ${err}`);

Promise.all([promise1, promise2, handled]).then(console.log, err =>
  console.log(`An error occurred: ${err.message}`)
);
// Output: ["First promise", "Second promise", "A promise rejected with: Error: Oh no, a rejected promise!"]
```

[View promise-all.ts on GitHub Gist](https://gist.github.com/NyaGarcia/fb4a01962e02e8aeefc6dde088103c35)

Lovely! Using `.catch` we’re catching any rejections that occur, and we’re returning a string, so that `Promise.all` doesn’t reject and we’re able to obtain our values.

### Use cases

So, what exactly can we use `Promise.all` for? Well, it can be especially useful if we need to aggregate the results of several promises. Let’s imagine that we need to make several HTTP requests to some API, and then group the results of all the requests in an array to do whatever we want with it. This is a perfect scenario for `Promise.all`. Let’s take a look at the following code:

```typescript
const users = ["puntotech", "NyaGarcia", "caballerog"];

function getGithubUserInfo(user: string) {
  return fetch(`https://api.github.com/users/${user}`)
    .then(res => res.json())
    .catch(err => `Promise rejected with: ${err}`);
}

const githubUserInfo = users.map(user => getGithubUserInfo(user));

Promise.all(githubUserInfo).then(values => console.log(values));
// Output: [Object, Object, Object]
```

[View promise-all.ts on GitHub Gist](https://gist.github.com/NyaGarcia/745f67e005dc9f7189a718f21f1712ee)

As you can observe, we have an array containing Github usernames and a `getGithubUserInfo` function, that obtains the user information by making a request to the Github API. Since each request returns a promise, we’re using `Promise.all` to group all of the individual promise results into an array of objects, each containing the information of each user. Note that we’re handling any possible rejections on line 6, like we did in the previous example.

[*Note: You can find the Promise.all Stackblitz project here*](https://stackblitz.com/edit/promise-methods-all)

## Promise.allSettled

Don’t you find it slightly tiring that we need to specifically handle errors so that `Promise.all` doesn’t reject? After all, it’s a method that is used extensively by us JavaScript developers. Isn’t there a better option? Of course there is, allow me to introduce `Promise.allSettled`:

`Promise.allSettled` receives an iterable of promises, just like `Promise.all`. The difference between `Promise.all` and `Promise.allSettled` is that `Promise.allSettled` doesn’t care if our promises fail or not, it will always resolve to an array of objects that describes the outcome of all of the input promises. Each object in the array contains:

- A status property, that indicates whether the promise was fulfilled or rejected.

Then, depending if the promise was fulfilled or rejected, it can contain either of the following properties:

- A value property, which indicates the value of the fulfilled promise.
- A reason property, which indicates the reason why the promise rejected.

Let’s take a look at an example:

```typescript
const promise1 = new Promise(resolve => {
  setTimeout(() => resolve("First promise"), 200);
});

const rejectedPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejected promise!")), 500);
});

Promise.allSettled([promise1, rejectedPromise]).then(console.log);
// Output: {status: 'fulfilled', value: 'First promise'}, {status: 'rejected', reason: {...}}
```

[View promise-allsettled.ts on GitHub Gist](https://gist.github.com/NyaGarcia/52a0f4a8bef1e0c40d458878fff75de2)

As promised, `Promise.allSettled` fulfills regardless of whether the input promises fail or not. Definitely an upgrade from having to handle rejections ourselves, isn’t it?

Let’s take our previous Github API example, and refactor it to use `Promise.allSettled` instead of `Promise.all`:

```typescript
const users = ["puntotech", "NyaGarcia", "caballerog"];

function getGithubUserInfo(user: string) {
  return fetch(`https://api.github.com/users/${user}`).then(res => res.json());
}

const githubUserInfo = users.map(user => getGithubUserInfo(user));

Promise.allSettled(githubUserInfo).then(results =>
  results.map(result => console.log(result))
);
```

[View promise-allsettled.ts on GitHub Gist](https://gist.github.com/NyaGarcia/400f46d6c07f45f7abe4046e3f5d2bf6)

As you can observe, we no longer have to handle rejections ourselves, which is wonderful.

[*Note: You can find the Promise.allSettled Stackblitz project here.*](https://stackblitz.com/edit/promise-methods-allsettled)

## Promise.race

`Promise.race` receives an iterable of promises, and returns a promise that resolves as soon as the first of the input promises either resolves or rejects. In simpler words? The first promise to either resolve or rejects wins! Let’s take a look at an example, featuring a promise race:

```typescript
const snail = new Promise(resolve => {
  setTimeout(() => resolve("Snail"), 500);
});

const cat = new Promise(resolve => {
  setTimeout(() => resolve("Cat"), 300);
});

const leopard = new Promise(resolve => {
  setTimeout(() => resolve("Leopard"), 100);
});

Promise.race([snail, cat, leopard]).then(fastest =>
  console.log(`And the fastest is... ${fastest}`)
);
// Output: And the fastest is... Leopard
```

[View promise-race.ts on GitHub Gist](https://gist.github.com/NyaGarcia/dcdc1f3cc07a28f4f019b953c1712ea6)

As you can see, we have three promises:

- The `snail` promise, which resolves after 500ms.
- The `cat` promise, which resolves after 300ms.
- The `leopard` promise, which resolves after 100ms.

Since the first promise to resolve is `leopard`, `Promise.race` resolves to its value. Easy enough, isn’t it?

### Feeling rejected

Once again, we need to consider how `Promise.race` will behave if one of the input promises rejects. Let’s add a rejected promise to our previous example and observe what `Promise.race` does:

```typescript
const snail = new Promise(resolve => {
  setTimeout(() => resolve("Snail"), 500);
});

const rejectedPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejection")), 200);
});

Promise.race([rejectedPromise, snail]).then(
  // Not called:
  fastest => console.log(`The fastest was... ${fastest}`),
  // Called:
  err => console.log(`An error occurred: ${err.message}`)
);
// Output: An error occurred: Oh no, a rejection
```

[View promise-race.ts on GitHub Gist](https://gist.github.com/NyaGarcia/ad5313deeaa679ee2c909dee072fe88f)

We now have two promises (I’ve slightly simplified the previous example):

- A snail promise, which resolves after 500ms.
- A rejected promise, which rejects after 200ms.

As you can see, since `rejectedPromise` is faster than `snail`, `Promise.race` rejects instead of resolving.

### Beware of empty iterables

Beware of passing an empty iterable to `Promise.race`, or the promise it returns will be forever pending.

[*Note: You can find the Promise.race Stackblitz here.*](https://stackblitz.com/edit/promise-methods-race)

## Promise.any

`Promise.any` is very similar to `Promise.race`. The difference between them is that `Promise.any` resolves as soon as one of the input promises is fulfilled, ignoring any input promises that reject, even if they’re faster. Let’s take a look at some code:

```typescript
const slowRejectedPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejection")), 300);
});

const fastRejectedPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejection")), 100);
});

const snail = new Promise(resolve => {
  setTimeout(() => resolve("Snail"), 500);
});

Promise.any([slowRejectedPromise, fastRejectedPromise, snail]).then(value =>
  console.log(value)
);
// Output: Snail
```

[View promise-any.ts on GitHub Gist](https://gist.github.com/NyaGarcia/647eb587fca6e82aff013311081baa2e)

In this case, we have three promises:

- The `slowRejectedPromise`, which rejects after 300ms.
- The `fastRejectedPromise`, which rejects after 100ms.
- The `snail` promise, which resolves after 500ms.

As you can see, `Promise.any` ignores the first two rejected promises despite the fact that they are faster, and instead resolves to ‘Snail’.

### Complete rejection

We know that `Promise.any` ignore rejected promises, but what happens if all of our promises reject? The answer is that `Promise.any` will reject with an `AggregateError`. Let’s take a look:

```typescript
const slowRejectedPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejection")), 300);
});

const fastRejectedPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Oh no, a rejection")), 100);
});

Promise.any([slowRejectedPromise, fastRejectedPromise]).then(console.log, err =>
  console.log(`An error occurred: ${err.message}`)
);
// Output: An error occurred: All promises were rejected
```

[View promise-any.ts on GitHub Gist](https://gist.github.com/NyaGarcia/81b4a49a361189d0dfe5bb5021ec3c7e)

### Empty iterables

With `Promise.race`, we had to be very careful with empty iterables because they caused a forever pending promise to be returned. With `Promise.any`, on the other hand, we don’t have to be as careful, since passing an empty iterable will result in an `AggregateError`:

```typescript
Promise.any([]).then(console.log, err =>
  console.log(`An error occurred: ${err.message}`)
);
// Output: An error occurred: All promises were rejected
```

[View promise-any.ts on GitHub Gist](https://gist.github.com/NyaGarcia/a97fb76d39a15c837314993945efa13b)

Promise.any with empty iterable

### Use cases

`Promise.race` is extremely useful in a scenario where we have to fetch a single resource that is replicated in different servers. We can make several requests, obtaining the value from the first successful request. Let’s take a look at an example, where we obtain three images (let’s pretend they’re the same image) from three different servers:

```typescript
const image = fetch("https://picsum.photos/200").then(res => res.url);
const image2 = fetch("https://source.unsplash.com/random").then(res => res.url);
const image3 = fetch("https://loremflickr.com/").then(res => res.url);

Promise.any([image, image2, image3]).then(console.log);
// Output: The image url from the first successful request
```

[View Promise-any.ts on GitHub Gist](https://gist.github.com/NyaGarcia/a9fc1d9e30205bc9cfa2aace8ad70e2d)

`Promise.any` will return the image url from the first successful request. If any of the requests fail, they’ll be ignored.

[*Note: You can find the Promise.any Stackblitz here.*](https://stackblitz.com/edit/promise-methods-any)

## Wrapping up

- `Promise.all` resolves when all of the input promises fulfill. If any of the input promises reject, `Promise.all` will also reject.
- `Promise.allSettled` fulfills when all of the promises resolve, regardless of whether they reject or fulfill.
- `Promise.race` resolves as soon as any of the input promises either reject or fulfill.
- `Promise.any` resolves as soon as any of the input promises fulfill, ignoring the rejected promises.

## Conclusion

That’s all folks! I sincerely hope that you now understand the differences between the four Promise methods a little better, and when it’s appropiate to use each one.

If you liked this guide, don’t forget to share and/or leave a nice comment! If you have any questions, feel free to drop them in the comments and I’ll try my best to resolve (wink wink) them.

See you in the next one.
