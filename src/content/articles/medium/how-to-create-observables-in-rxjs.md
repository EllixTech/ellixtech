---
title: "How to Create Observables in RxJS"
description: "Create Observables from a variety of data types, objects, and events"
date: "2020-04-28"
category: "RxJS"
tags: ["Programming", "Rxjs", "JavaScript", "Typescript", "Nodejs"]
minutes: 8
lang: "en"
art: "orbit"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/better-programming/how-to-create-observables-in-rxjs-aa3bf79b05e0"
sourceName: "Medium"
coverImage: "/images/articles/medium/5db2fca0163c7ebe.png"
series: "RxJS Lessons"
part: 1
---

Photo by [chuttersnap](https://unsplash.com/@chuttersnap?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/observe?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

## Introduction

RxJS is the most popular framework for functional reactive programming (FRP) in JavaScript. Angular is entirely built around RxJS and FRP concepts. It’s a fantastic technology and incredibly useful, but it has one major downfall: It has a somewhat steep learning curve, which some developers find discouraging.

In view of this, I’ve decided to create the “RxJS Lessons” series, which will cover every single operator provided by RxJS with simple examples. Here are the parts that this series is comprised of so far:

- RxJS Lessons: How to Create Observables

## How to Create Observables

RxJS provides us with many functions to create Observables. So many, in fact, that some developers can find themselves at a loss of where to start. In this part of the “RxJS Lessons” series, we’ll cover all of the Observable creation functions, which are the following:

- `of()`
- `from()`
- `fromEvent()`
- `interval()`
- `timer()`
- `range()`
- `defer()`
- `ajax()`
- `fromFetch()`
- `generate()`

Without further ado, let’s get started:

## Creation Functions

### ‘of()’

`of()` allows us to create Observables out of arrays, objects, strings, etc. It’ll emit each argument it receives as a whole and then complete. Let’s take a look at how to use it:

```typescript
import { of } from "rxjs";

// Creating an Observable of numbers
const number$ = of(1, 2, 3, 4, 5);

// Creating an Observable of strings
const pokemon$ = of("Squirtle", "Charmander", "Bulbasur");

// Creating an Observable of arrays
const fruit$ = of(["Strawberry", "Cherry"], ["Lemon", "Orange"]);

// Creating an Observable of objects
const iceCream$ = of(
  { size: "Large", toppings: ["Oreos", "Chocolate syrup"] },
  { size: "small", toppings: ["Strawberries"] }
);
```

[View of.ts on GitHub Gist](https://gist.github.com/NyaGarcia/34937b07f5014e2e9890acddde44825d)

Here we have four different Observables created with `of()`:

- The `number$` Observable, created from a sequence of numbers
- The `pokemon$` Observable, created from three strings
- The `fruit$` Observable, created from two arrays of strings
- The `iceCream$` Observable, created from two objects

So how can we access the values our Observables will emit? By subscribing to them, like this:

```typescript
number$.subscribe(number => console.log(number));
// Output: 1 2 3 4 5

pokemon$.subscribe(pokemon => console.log(pokemon));
// Output: Squirtle Charmander Bulbasur

fruit$.subscribe(fruit => console.log(fruit));
// Output: ["Strawberry", "Cherry"] ["Lemon", "Cherry"]

iceCream$.subscribe(iceCream => console.log(iceCream));
// Output: { size: "Large", toppings: ["Oreos", "Chocolate syrup"] } { size: "small", toppings: ["Strawberries"] }
```

[View of-subscription.ts on GitHub Gist](https://gist.github.com/NyaGarcia/0f9ad96869f4a574aae87bd60c56ce4f)

As you can see, we can subscribe to the Observable to access the values it emits.

**Tip:** We can avoid using the anonymous function (the `=>` function) if we like and do this instead:

```text
pokemon$.subscribe(console.log);// Output: Squirtle Charmander Bulbasur
```

I believe it’s a lot easier to understand Observables and how they work if you actually play around with them and see their output live, which is why I prepared a StackBlitz for every single code snippet we’ll cover in this tutorial. Therefore, I recommend that you play around with `of()` in [this StackBlitz](https://stackblitz.com/edit/creation-from?file=index.html).

### ‘from()’

`from()` creates Observables from an array, promise, object, string, etc. Sounds pretty familiar to `of()`, doesn’t it? So what’s the difference between them?

The difference is `from()` emits the items that are inside the argument it receives, while `of()` emits the argument as a whole. What does this mean? We’ll understand it as soon as we subscribe to a few Observables created with `from()`. So first, let’s create some Observables:

```typescript
// Creating an Observable from an array of strings
const fruit$ = from(["Strawberry", "Cherry", "Blackberry"]);

// Creating an Observable from a Map object
const pokemon$ = from(
  new Map([
    ["Squirtle", "Water"],
    ["Charmander", "Fire"],
    ["Bulbasur", "Grass"]
  ])
);

// Creating an Observable from a promise
const promise$ = from(Promise.resolve("I promise to start learning RxJS"));

// Creating an Observable from a nodeList
const node$ = from(document.querySelectorAll("p"));
```

[View from.ts on GitHub Gist](https://gist.github.com/NyaGarcia/425b9cc1e5f0a6ecb4da9b1823396bc3)

As you can see, we’re creating five different Observables in the above code snippet:

- The `letters$` Observable, created from a string
- The `fruit$` Observable, created from an array of strings
- The `pokemon$` Observable, created from a `Map` object
- The `promise$` Observable, created from a `Promise`
- The `node$` Observable, created from a `NodeList`

Let’s subscribe and take a look at the output of these Observables:

```typescript
letter$.subscribe(letter => console.log(letter));
// Output: "R","x","J","S"," ","i","s"," ","c","o","o","l"

fruit$.subscribe(console.log);
// Output: "Strawberry", "Cherry", "Blackberry"

pokemon$.subscribe(console.log);
// Output: ["Squirtle", "Water"], ["Charmander", "Fire"], ["Bulbasur", "Grass"]

promise$.subscribe(promise => console.log(promise));
// Output "I promise to start learning RxJS"

node$.subscribe(node => console.log(node));
// Output: HTMLParagraphElement {tagName: "p", attributes: {...}}
```

[View from-subscription.ts on GitHub Gist](https://gist.github.com/NyaGarcia/08b2a1f37a4e20c3fa1a3029b542cd60)

It’s time to play spot the difference. Let’s compare both of the `fruit$` Observables, which we created from an array of strings using the `from()` and `of()` functions:

```typescript
const fruitsOf$ = of(["Strawberry", "Cherry"], ["Lemon", "Orange"]);
const fruitsFrom$ = from(["Strawberry", "Cherry", "Blackberry"]);

fruitOf$.subscribe(fruit => console.log(fruit));
// Output: ["Strawberry", "Cherry"] ["Lemon", "Cherry"]

fruitFrom$.subscribe(console.log);
// Output: "Strawberry", "Cherry", "Blackberry"
```

[View of-from-comparation.ts on GitHub Gist](https://gist.github.com/NyaGarcia/cb2b4ccb196da66c4021376373bc1c9e)

Can you see the difference? We can now observe that `from()` emits the items that are inside the array, while `of()` emits the entire array. We could say `from()` has a flattening effect: It takes an array, a string, or an object and emits the items they contain.

You can play around with `from()` in [this StackBlitz](https://stackblitz.com/edit/creation-from?file=index.ts).

### ‘FromEvent()’

JavaScript has many types of events that let us know when interesting things happen. Using `fromEvent()`, we can create Observables that emit when these events are triggered. `fromEvent()` receives two different parameters:

- The event target, where the event handler function will be attached to
- The type of event we want to listen to

We’re going to create four different Observables out of four different events: `click`, `keydown`, `scroll`, and `copy`:

```typescript
import { fromEvent } from "rxjs";
import { map } from 'rxjs/operators';

// Creating an Observable from mouse clicks
const click$ = fromEvent<MouseEvent>(document, "click");

// Creating an Observable from pressed keys
const keyPressed$ = fromEvent<KeyboardEvent>(document, "keydown");

// Creating an Observable from scroll changes
const scroll$ = fromEvent<UIEvent>(document, "scroll");

// Creating an Observable from copy action
const copie$ = fromEvent<ClipboardEvent>(document, "copy");
```

[View fromEvent.ts on GitHub Gist](https://gist.github.com/NyaGarcia/953ffc30b265000beeecdf3fbeb3e217)

‘fromEvent()’ Observables

If any of the four events we used are triggered by user interactions with the document, the corresponding Observable will emit. What will the emitted value be? Let’s take a look at the output:

```typescript
click$.subscribe(click => console.log(click));
// Output: MouseEvent {isTrusted: true}

keyPressed$.subscribe(console.log);
// Output: KeyboardEvent {isTrusted: true}

scroll$.subscribe(scroll => console.log(scroll));
// Output: UIEvent {isTrusted: true}

copie$.subscribe(console.log);
// Output: ClipboardEvent {isTrusted: true}
```

[View fromEvent-subscription.ts on GitHub Gist](https://gist.github.com/NyaGarcia/2d42baeb2f286dcd0a5d75b477dfad5b)

As you can see, we’re receiving an event object, which contains many useful event properties we can use, should we want to.

But how are our Observables able to listen to the event targets? Don’t we have to add event handlers?

Well, that’s the beauty of `fromEvent()`. When we subscribe to an Observable created with `fromEvent()`, an event handler function is automatically attached to the provided event target. This is how our Observable listens to see whether or not the events are being triggered. As soon as we unsubscribe from any Observables created with `fromEvent()`, the Observable will take care of removing the event handlers for us. Pretty cool, right?

You can play around with `fromEvent()` in [this StackBlitz](https://stackblitz.com/edit/creation-fromevent).

### ‘interval()’

`interval()` creates an Observable that emits a sequence of ascending numbers based on a provided time interval. The time-interval size parameter is optional, with a default value of 0. We must be very careful with this. This said, let’s take a look at a couple of examples:

```typescript
import { interval } from "rxjs";

// Observable will emit incremental numbers, one every second (1000ms)
const number$ = interval(1000);

// We didn't pass the interval size parameter, so default value is 0ms 
const superFastNumber$ = interval();


number$.subscribe(console.log);
// Output: 0 1 2 3 4 5...

// Careful with this one, it will emit numbers very very quickly
superFastNumber$.subscribe(number => console.log(number));
// Output: O 1 2 3 4 5 6 7 8 9...
```

[View interval.ts on GitHub Gist](https://gist.github.com/NyaGarcia/56c1d0947c53f4c44dc427d3ee0ebb49)

Creating Observables with ‘interval()’

As you can appreciate, `interval()` is a very straightforward function. The only thing we have to be careful with is the default interval value is 0.

You can play around with `interval()` in [this StackBlitz](https://stackblitz.com/edit/creation-interval).

### ‘timer()’

`timer()` creates an Observable that, after an initial delay, starts emitting a sequence of increasing numbers based on a provided time interval. It’s very similar to `interval()`, with the difference that we can specify when the emissions begin. `timer()` receives two parameters:

- The initial delay to wait before emitting the first value
- The value of the interval between emissions

Both parameters are optional, with a default value of 0.

Let’s take a look at some examples:

```typescript
import { timer } from "rxjs";

// Observable will emit one value (0) after 2s and complete
const onlyOneValue$ = timer(2000);

// Observable will wait 5s, then start emitting values every second
const number$ = timer(5000, 1000);


onlyOneValue$.subscribe(console.log);
// Output: 0

number$.subscribe(number => console.log(number));
// Output: 0, 1, 2, 3...
```

[View timer.ts on GitHub Gist](https://gist.github.com/NyaGarcia/e8bbb8d2b3fe1ad1315586fef4d514a9)

You can play around with `timer()` in [this StackBlitz](https://stackblitz.com/edit/creation-timer).

### ‘range()’

`range()` creates an Observable that emits a range of increasing sequential numbers. It receives two parameters:

- The starting point of the range
- The length of the range — aka the amount of numbers that’ll be emitted. This parameter is optional, with a default value of 0.

Here’s an example:

```typescript
import { range } from "rxjs";

// Observable will emit a sequence of numbers from 0 to 4 and complete
const number$ = range(5);

// Observable will emit a sequence of numbers from 1 to 5 and complete
const range$ = range(1, 5);

// Observable will emit a sequence of 10 numbers starting at 10 (from 10 to 19)
const moreNumber$ = range(10, 10);


number$.subscribe(number => console.log(number));
// Output: 0, 1, 2, 3, 4, 5

range$.subscribe(console.log);
// Output: 1, 2, 3, 4, 5

moreNumber$.subscribe(number => console.log(number));
// Output: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
```

[View range.ts on GitHub Gist](https://gist.github.com/NyaGarcia/218bab0b1341955ddad652e34051e4cc)

Creating Observables with ‘range()’

You can play around with `range()` in [this StackBlitz](https://stackblitz.com/edit/creation-range?file=index.ts).

### ‘defer()’

`defer()` allows us to create Observables lazily. It waits until we subscribe and then executes the Observable creation logic.

This means that a new Observable is created by each subscription. This may sound a little confusing, but it’s very easy to understand if we take a look at an example comparing an Observable created with `defer()` and an Observable created with some other creation function.

Let’s create an Observable with `of()`:

```typescript
import { defer, of } from "rxjs";

const pokemon = ["Squirtle", "Charmander", "Bulbasaur", "Pikachu"];

function getRandomPokemon() {
  return pokemon[Math.floor(Math.random() * 3)];
}

// Each subscriber to this Observable will receive the same value, because the getRandomPokemon function is executed once, when the Observable is created
const randomPokemon$ = of(getRandomPokemon());

// Each time we subscribe we'll receive the same value, because we're subscribing to the same Observable
randomPokemon$.subscribe(console.log);
// Output: Charmander
randomPokemon$.subscribe(console.log);
// Output: Charmander
randomPokemon$.subscribe(console.log);
// Output: Charmander
```

[View of-random.ts on GitHub Gist](https://gist.github.com/NyaGarcia/48bab36cb65c8ff0380cba55c09762ec)

As you can see in the example, we have a `getRandomPokemon()` function, which, as its name indicates, returns a random Pokémon. We’ve created a `randomPokemon$` Observable from the `getRandomPokemon()` function, using `of()`. However, when we subscribe to this Observable, we always get the same value: `Charmander`. Shouldn’t we be getting a random Pokémon each time we subscribe? The answer is no. Why?

Because the `getRandomPokemon()` function is executed when the Observable is created and not when we subscribe. This means it’s only executed once — when we create the Observable. No matter how many times we subscribe, the Observable has already been created, so we always get the same Pokémon.

Basically, we’re subscribing three times to the same Observable, which emits `Charmander`. So how can we make the `getRandomPokemon()` function be executed each time we subscribe, instead of being executed when the Observable is created? By using `defer()`:

```typescript
import { defer, of } from "rxjs";

const pokemon = ["Squirtle", "Charmander", "Bulbasaur", "Pikachu"];

function getRandomPokemon() {
  return pokemon[Math.floor(Math.random() * 3)];
}

// Each subscriber to this Observable will receive a random Pokemon because the getRandomPokemon function is executed with each subscription
const randomPokemonForReal$ = defer(() => of(getRandomPokemon()));

// Each time we subscribe we'll receive different values, because we're subscribing to different Observables
randomPokemonForReal$.subscribe(console.log);
// Output: Charmander
randomPokemonForReal$.subscribe(console.log);
// Output: Squirtle
randomPokemonForReal$.subscribe(console.log);
// Output: Pikachu
```

[View defer.ts on GitHub Gist](https://gist.github.com/NyaGarcia/2fb6f2232115babe23a475e6fbff72a2)

We’ve created the `randomPokemonForReal$` Observable using `defer()` from the `getRandomPokemon()` function. As you can see in the above example, every time we subscribe to it, we obtain a different Pokémon. Like we said before, this is because the Observable creation logic (in this case, the `getRandomPokemon()` function) is executed each time we subscribe.

To sum up, we can use `defer()` when we need lazy Observables. You can play around with `defer()` in [this StackBlitz](https://stackblitz.com/edit/creation-defer?file=index.ts).

### ‘ajax()’

As its name indicates, the `ajax()` function creates an Observable from an AJAX request. Let’s take a look at how to use it:

**Note:** We’ll be making use of the [Ghibli API](https://ghibliapi.herokuapp.com) to test our AJAX calls.

```typescript
import { ajax } from "rxjs/ajax";

// Observable will emit the entire AjaxResponse object
const ghibliFilmsResponse$ = ajax("https://ghibliapi.herokuapp.com/films");

ghibliFilmsResponse$.subscribe(console.log);
// Output: AjaxResponse {xhr: {}, request: {}...}
```

[View ajaxResponse.ts on GitHub Gist](https://gist.github.com/NyaGarcia/1a3d806aea24f78b52a12708f611ecc8)

When we create an Observable with `ajax()`, it’ll emit the entire `AjaxResponse` object returned from the API call. But what if we’re only interested in obtaining the returned data? Well, it turns out that `ajax()` has a neat little function called `getJSON()`:

```typescript
import { ajax } from "rxjs/ajax";

// Observable will only emit the response data
const ghibliFilm$ = ajax.getJSON("https://ghibliapi.herokuapp.com/films");

ghibliFilm$.subscribe(films => console.log(films));
// Output: [Object, Object, Object...]
```

[View ajax-getJSON.ts on GitHub Gist](https://gist.github.com/NyaGarcia/22d31ea2007dd8228b39e9aea17623e1)

Nice! We’ve fetched the data we needed. However, another question arises: What if we need to set custom headers? No problem, we can set them by passing an object to `ajax()`:

```typescript
// What if we need custom headers? No problem!
const ghibliFilmWithHeaders$ = ajax({
  url: 'https://ghibliapi.herokuapp.com/films',
  method: 'GET',
  headers: {
    'Content-Type': 'json'
  },
  body: {
    message: "Custom message 'cause we're so cool"
  }
});

ghibliFilmWithHeaders$.subscribe(console.log);
// Output: AjaxResponse {xhr: {}, request: {}...}
```

[View ajax-custom.ts on GitHub Gist](https://gist.github.com/NyaGarcia/fa3d9ff16d12bbd8065c5b55ae74cf6e)

Et voilà! We now have an Observable created with `ajax()`, with custom headers. You can play around with `ajax()` in [this StackBlitz](https://stackblitz.com/edit/creation-ajax?file=index.ts).

### ‘fromFetch()’

AJAX requests are fine, but what if we want to use `fetch` instead? No problem, `fromFetch()` allows us to do just that. Let’s take a look at an example:

```typescript
import { fromFetch } from "rxjs/fetch";

// This Observable will emit the entire Response object
const ghibliFilmResponse$ = fromFetch("https://ghibliapi.herokuapp.com/films");

ghibliFilmResponse$.subscribe(console.log);
// Output: Response {}
```

[View fromFetch.ts on GitHub Gist](https://gist.github.com/NyaGarcia/d878328b867ea85269a32987226332a4)

As you can see, just like with `ajax()`, the Observable returns the entire `Response` object. So what if we just want the data? Unlike `ajax()`, `fromFetch()` doesn’t have a `getJSON()` function. So how can we obtain the data? By doing something like this:

```typescript
// If we just want the data, we can do something like this
ghibliFilmResponse$
  .pipe(switchMap(response => response.json()))
  .subscribe(console.log);
// [Object, Object, Object...]
```

[View fromFetch-data.ts on GitHub Gist](https://gist.github.com/NyaGarcia/dea1b69a708c4ed08f9110d61928f0af)

What about error handling — because with HTTP requests, so many things can go wrong? Here’s an example of how to handle errors:

```typescript
const ghibliFilmError$ = fromFetch("https://ghibliapi.herokuapp.com/wrongURL").pipe(
  switchMap(response => {
    if (!response.ok) {
      throw `There was an error with status ${response.status}`;
    }
    return response.json();
  }),
  catchError(err => {
    console.error(err);
    return of({ error: true, message: err });
  })
);

ghibliFilmError$.subscribe(result => console.log(result));
// Output: {error: true, message: "There was an error with status 404"}
```

[View fromFetch-error.ts on GitHub Gist](https://gist.github.com/NyaGarcia/866292edb3283c49b1e31f9fdd55471d)

I know it’s quite a handful of code, so let’s break it down:

- First, we use the `switchMap()` operator and check whether or not the response was OK. By using a guard clause, we throw an error if the response wasn’t OK. If nothing went wrong, we return the JSON body content from the response by using the `json()` function.
- Then, we use the `catchError()` operator to catch the error (in case an error occurred) and print it. Then, we return an Observable of an object, containing the error message and an error property, set to `true`.
- Finally, we subscribe. If the `fetch` call went well, we’ll receive the response’s data. If not, we’ll receive an error object, with the message of whatever went wrong.

You can play around with `fromFetch()` in [this StackBlitz](https://stackblitz.com/edit/creation-fromfetch).

### ‘generate()’

I’d like to dedicate `generate()` to all the for loop lovers out there. `generate()` will create an Observable sequence by running a state-driven loop that’ll produce the elements in the sequence. It receives three different parameters:

- `initialState`: Determines the starting point of the loop, the initial value
- `condition`: A function that determines the condition that’ll make the loop end. It receives the current value and checks whether or not the specified condition is fulfilled. If it is, the loop continues. If not, the loop ends.
- `iterate`: A function that determines how the defined value will be modified on each iteration.

It might sound a little complex, but it’s really easy to understand once you see it:

```typescript
import { generate } from "rxjs";

const number$ = generate(
  1,
  x => x < 10,
  x => x + 1
);

number$.subscribe(console.log);
// Output: 1, 2, 3, 4, 5, 6, 7, 8, 9
```

[View generate.ts on GitHub Gist](https://gist.github.com/NyaGarcia/a5343adaa0eef53b6a0592d416bee84c)

Creating an Observable with ‘generate()’

The first parameter is the `initialState` value. As you can see, our loop’s first value will be `1`.

The second parameter is the condition function — our loop will continue as long as the current value is lower than `10`.

Finally, the third parameter corresponds to how the current value will be modified on each interaction. In this case, it’ll be increased by `1`, meaning that our `number$` Observable will emit the numbers from 1-9.

However, passing anonymous functions to `generate()` looks a little strange, doesn’t it? We can pass an object instead, if we prefer that syntax. Here’s an [example](https://gist.github.com/NyaGarcia/73d7de00cf78c100de53888ce2e8bb1b).

As you can see, our `evenNumber$` Observable will emit all the even numbers between 2 and 10.

**Warning:** Passing an object to `generate()` allows us to omit the condition variable. If we do this, we’ll be creating an endless loop, so be very careful.

Here’s an example of an endless loop. Don’t do this:

```typescript
const endles$ = generate({ initialState: 1, iterate: x => +1 });
```

[View generate-endless-loop.ts on GitHub Gist](https://gist.github.com/NyaGarcia/97d58a1d36c3d2ef7eb920fde0b4edb6)

You can play around with `generate()` in [this StackBlitz](https://stackblitz.com/edit/creation-generate).

## Conclusion

That’s all folks! We’ve covered every single function provided by RxJS for Observable creation. As you’ve been able to see, there are many ways to create Observables, although not all of them are commonly used.

Knowing how to create an Observable is essential to begin our RxJS journey, but the real power of RxJS comes from stream manipulation with pipeable operators. We’ll cover all of the existing RxJS operators in the following tutorials of the ‘RxJS Lessons’ series.

I hope you enjoyed this tutorial and found it useful. Cheers.
