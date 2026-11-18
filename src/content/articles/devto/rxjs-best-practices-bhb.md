---
title: "RxJS Best Practices"
description: "A series of best practices for RxJS code."
date: "2020-03-28T17:14:34Z"
category: "RxJS"
tags: ["rxjs", "bestpractices", "javascript", "programming"]
minutes: 10
lang: "en"
art: "orbit"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/rxjs-best-practices-bhb"
coverImage: "/images/articles/devto/4429a1330d28e946.png"
---

RxJS is the most popular framework for reactive functional programming in
JavaScript. This means that a lot of people are using RxJS daily in their
projects. Most developers are aware of the common clean code practices, but…
What about **RxJS best practices**? Are you aware of the dos and don’ts when it
comes to functional reactive programming? Are you applying them in your code? 

This tutorial will focus on several best practices that I use daily when writing
code, with practical examples. We will be covering the following points:

1. Avoid logic inside the subscribe function

2. Using Subjects to force completion

3. Avoid duplicated logic

4. Avoid nesting — Use chaining instead

5. Sharing to avoid stream duplication

6. Don’t expose Subjects

7. Use marble diagrams for testing

Without further ado, let’s get started:

## Avoid logic inside the subscribe function

This statement may seem pretty obvious to some of you, but it’s a common pitfall for RxJS beginners. Until you learn how to **think reactively**, you may be tempted to do something like this:

```typescript
pokemon$.subscribe((pokemon: Pokemon) => {
  if (pokemon.type === "Water") {
    return;
  }
  const pokemonStats = getStats(pokemon);
  logStats(pokemonStats);
  saveToPokedex(pokemonStats);
});
```

[View logic-in-subscribe.ts on GitHub Gist](https://gist.github.com/NyaGarcia/108faab1122e120706e1edfa3af237fc)

Our *pokemon$* Observable emits Pokemon objects, and, in a very **non-reactive way**, we are subscribing to it in order to access these objects and perform some actions, like returning early if the Pokemon type is Water, making a call to a *getStats()* function, logging the stats that this function returns and finally saving the data to the *Pokedex*. **All our logic is inside the subscribe function.**

However, doesn’t this code look exactly like something we would see in the traditional **imperative** programming paradigm? Since RxJS is a **functional reactive** programming library, we have to say goodbye to our traditional way of thinking, and start **thinking reactively** (streams! Pure functions!). 

So, how do we make our code **reactive**? By using the **pipeable operators** that RxJS provides us with:

```typescript
pokemon$
  .pipe(
    filter(({ type }) => type !== "Water"),
    map(pokemon => getStats(pokemon)),
    tap(stats => logStats(stats))
  )
  .subscribe(stats => saveToPokedex(stats));
```

[View pipeable-operators.ts on GitHub Gist](https://gist.github.com/NyaGarcia/c08f30d937698b5daef038571cec913a)

Et voilá, our code has gone **from imperative to reactive** with a few simple changes. It even looks cleaner, doesn’t it? 

> **Note:** I am fully aware of the fact that a part of the logic (the
saveToPokedex() function) still remains in the subscribe. I find that by keeping the last part of the logic inside the subscribe makes it easier for me to read the code. You are all free to choose whether or not to keep the subscribe completely empty :)

The operators we have used are pretty straightforward: [filter](https://www.learnrxjs.io/learn-rxjs/operators/filtering/filter) and [map](https://rxjs-dev.firebaseapp.com/api/operators/map) work exactly the same as the Array operators that they share name with, and [tap](https://rxjs-dev.firebaseapp.com/api/operators/tap) is used to perrform **side effects.**

> [**Wikipedia:**](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) An operation, function or expression is said to have a side effect if it modifies some state variable value outside its local environment.

*****

## Using Subjects to force completion

Memory leaks are a real danger when it comes to using Observables. Why? Because, once we subscribe to an Observable, it will **keep emitting values indefinitely** until one of the following two conditions are met:

1.  We manually **unsubscribe** from the Observable.
1.  It **completes**.

Seems simple enough, right? Let’s take a look at how to unsubscribe from an Observable:

```typescript
pokemonSubscription = pokemon$.subscribe(pokemon => {
  // Do something with pokemon
});

pokemonSubscription.unsubscribe();
```

[View unsubscribe.ts on GitHub Gist](https://gist.github.com/NyaGarcia/bdfc5ce07c17b98ed432d474154bf1af)

As you can see in the above example, we have to **store the subscription** of our *pokemon$* Observable in a variable, and then manually **call unsubscribe** on that stored subscription. Doesn’t seem too difficult so far…

But what happens if we have more Observables that we need to subscribe to?

```typescript
const pokemonSubscription = pokemon$.subscribe(pokemon => {
  // Do something with pokemon
});

const trainerSubscription = trainer$.subscribe(trainer => {
  // Do something with trainer
});

const numberSubscription = number$.subscribe(number => {
  // Do something with number
});

function stop() {
  pokemonSubscription.unsubscribe();
  trainerSubscription.unsubscribe();
  numberSubscription.unsubscribe();  
}
```

[View multiple-subscriptions.ts on GitHub Gist](https://gist.github.com/NyaGarcia/a48e9cfdd433af06bfd1c4ada9ed6541)

As you can see, as we add more Observables to our code, we need to keep track of **more and more subscriptions**, and our code starts looking a bit crowded. Isn’t there a better way for us to tell our Observables to **stop emitting values?** Luckily for us, there is, and it’s very, very simple:

We can use a **Subject**, together with the **takeUntil()** operator, to force our Observables to **complete**. How? Here’s an example:

```typescript
const stop$ = new Subject<void>();

trainer$
  .pipe(takeUntil(stop$)).subscribe(trainer => {
    // Do something with trainer
  });

pokemon$
  .pipe(takeUntil(stop$)).subscribe(pokemon => {
    // Do something with pokemon
  });

number$
  .pipe(takeUntil(stop$)).subscribe(number => {
    // Do something with number
  });

function stop() {
  stop$.next();
  stop$.complete();
}
```

[View destroy-subject.ts on GitHub Gist](https://gist.github.com/NyaGarcia/30c94926b5374e6c1bf611b4e03a2a89)

Let’s understand what’s going on above. We’ve created a *stop$* Subject, and we’ve piped our three Observables with the takeUntil operator. This operator is used for an Observable to **keep emitting** values, **until a notifier Observable emits**. Which means that our three Observables will **stop emitting values when the stop$ Subject emits.**

So how do we make our *stop$* Observable emit? By **calling the next()**
**function** on it, which is exactly what we are doing inside our
*stopObservables()* function. Therefore, whenever we call our
*stopObservables()* function, our *stop$* Observable will emit and all our Observables **will automatically complete**. Sounds cool, doesn’t it?

No more having to store any subscriptions and call unsubscribe, no more messing around with arrays? All hail the takeUntil operator!

*****

## Avoid duplicated logic

We all know that  duplicated code is a bad sign, and something that should be
avoided. (If you didn’t know that, I would recommend that you go and read
[this](https://medium.com/better-programming/the-art-of-refactoring-5-tips-to-write-better-code-3bc1f6f7689),
and then come back.) You may be wondering which scenarios could lead to having duplicate RxJS logic. Let’s take a look at the following example:

```typescript
import { from } from "rxjs";
import { filter, reduce } from "rxjs/operators";

const number$ = from([null, 2, 1, undefined, 5, false, 6, 7]);

// Adding numbers
number$
  .pipe(
    filter<number>(Boolean),
    reduce((acc, curr) => acc + curr)
  )
  .subscribe(n => console.log(`Total: ${n}`));

// Emit even numbers
number$
  .pipe(
    filter<number>(Boolean),
    filter(n => n % 2 === 0)
  )
  .subscribe(console.log);
```

[View duplicated-logic.ts on GitHub Gist](https://gist.github.com/NyaGarcia/f03d3e6217a974c41d9af5fbc68809da)

As you can see, we have a number$ Observable, which emits every second. We subscribe twice to this Observable: Once to keep score with *scan()* and once to call the *getPokemonByID()* function every ten seconds. Seems quite straightforward, but…

Notice how we **have duplicated the takeUntil() logic in both Observables?** This should be avoided, as long as our code allows it. How? By attaching this logic to the **source observable**, like this:

```typescript
import { from } from "rxjs";
import { filter, reduce } from "rxjs/operators";

const number$ = from([null, 2, 1, 0, 5, false, 6, 7]).pipe(
  filter<number>(Boolean)
);

// Adding numbers
number$
  .pipe(
    reduce((acc, curr) => acc + curr)
  )
  .subscribe(n => console.log(`Total: ${n}`));

// Emit even numbers
number$
  .pipe(
    filter(n => n % 2 === 0)
  )
  .subscribe(console.log);
```

[View fix-duplicated-logic.ts on GitHub Gist](https://gist.github.com/NyaGarcia/21fa56b270affd69da35e26cf371d524)

Less code && no duplication === Cleaner code. Awesome!

*****

## Avoid nesting — Use chaining instead

Nested subscriptions should be avoided at all cost. They make our code complex, dirty, difficult to test and can cause some pretty nasty bugs. What is a nested subscription, you may ask? It’s when we subscribe to an Observable in the subscribe block of another Observable. Let’s take a look at the following code:

```javascript
getTrainer().subscribe(trainer =>
  getStarterPokemon(trainer).subscribe(pokemon =>
    // Do stuff with pokemon
  )
);
```

[View nested-subscribes.js on GitHub Gist](https://gist.github.com/NyaGarcia/0e4df5a5aab27fb9e5f9e0ee1577fc1b)

Doesn’t look very neat, does it? The above code is confusing, complex, and, should we need to call more functions that return Observables, we’re going to have to keep adding more and more subscriptions. This is starting to sound suspiciously like a ‘**subscription hell**’. So, what can we do to avoid nested subscriptions?

The answer is to use **higher order mapping operators**. Some of these operators are: [switchMap](https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap), [mergeMap](https://www.learnrxjs.io/learn-rxjs/operators/transformation/mergemap) etc.

To fix our example, we are going to make use of the *switchMap* operator. Why? Because *switchMap* unsubscribes from the previous Observable, and **switches** (easy to remember, right?) to the inner Observable, which, in our case, is the perfect solution. However, please note that **depending on which behavior** you need, you may need to use a different higher order mapping operator.

```javascript
getTrainer()
  .pipe(
    switchMap(trainer => getStarterPokemon(trainer))
  )
  .subscribe(pokemon => {
    // Do stuff with pokemon 
  });
```

[View switchMap.js on GitHub Gist](https://gist.github.com/NyaGarcia/4c0c5476d67d6e363584c00266c3dcd1)

Just look at how lovely our code looks now.

*****

## Sharing to avoid stream duplication

Ever had your angular code make duplicate HTTP requests and wondered why? Read on and you will discover the reason behind this widespread bug:

Most Observables are **cold**. This means that their **producer is created and activated when we subscribe to them**. This might sound a bit confusing, but is simple enough to understand. With cold Observables, every time we subscribe to them, a **new producer is created**. So if we subscribe to a cold Observable five times, five producers will be created. 

So, what is a producer exactly? It’s basically the **source of our Observable’s values** (for example, a DOM event, an HTTP request, an array etc.) What does this imply for us reactive programmers? Well, if we, for example, subscribe twice to an observable that makes an HTTP request, **two HTTP requests will be made.**

Sounds like trouble.

The following example (borrowing Angular’s HttpClient) would trigger two
different HTTP requests, because *pokemon$* is a cold Observable, and we are subscribing to it twice:

```typescript
pokemon$ = http.get(/* make an http request here*/);
/*Every time we subscribe to pokemon$, an http request will be made*/

pokemon$
  .pipe(
    flatMap(pokemon => pokemon),
    filter(({ type }) => type === "Fire")
  )
  .subscribe(pokemon => {
    // Do something with pokemon
  });

pokemon$.pipe(switchMap(pokemon => getStats(pokemon))).subscribe(stats => {
  // Do something with stats
});
```

[View cold-observable.ts on GitHub Gist](https://gist.github.com/NyaGarcia/4fbed562a24ba71b13e648fec80c0554)

As you can imagine, this behavior can lead to nasty bugs, so, how can we avoid it? Isn’t there  a way to subscribe multiple times to an Observable **without triggering duplicated logic** as its source its created over and over again? Of course there is, allow me to introduce: **The share() operator.**

This operator is used to allow **multiple subscriptions** to an Observable, **without recreating its source**. In other words, it turns an Observable from cold, to **hot.** Let’s see how it’s used:

```typescript
pokemon$ = http.get(/* make an http request here*/).pipe(share());
/*The pokemon$ Observable is now hot, we won't have multiple http requests*/

pokemon$
  .pipe(
    flatMap(pokemon => pokemon),
    filter(({ type }) => type === "Fire")
  )
  .subscribe(pokemon => {
    // Do something with pokemon
  });

pokemon$.pipe(switchMap(pokemon => getStats(pokemon))).subscribe(stats => {
  // Do something with stats
});
```

[View share.ts on GitHub Gist](https://gist.github.com/NyaGarcia/70a6de58c090891a05413a8b2cb78f76)

Yes, that is really all we need to do, and our problem is ‘magically solved’. By adding the *share()*  operator, our previously cold *pokemon$* Observable now **behaves as if it were hot,** and only one HTTP request will be made, even though we subscribe to it twice. 

> **A word of caution:** Since hot Observables don’t replicate the source, if we subscribe late to a stream, we won’t be able to access previously emitted values.  The [shareReplay()](https://www.learnrxjs.io/learn-rxjs/operators/multicasting/sharereplay) operator can be a solution for this. 

*****

## Don’t expose Subjects

It’s a common practice to use services to contain Observables that we reuse in our application. It’s also common to have Subjects inside such services. A common mistake many developers make is **exposing these Subjects** directly to the ‘outside world’, by doing something like this:

```typescript
class DataService {
  pokemonLevel$ = new BehaviorSubject<number>(1);
  stop$: Subject<void> = new Subject();

  number$ = interval(1000).pipe(takeUntil(this.stop$));
}
```

[View exposed-subjects.ts on GitHub Gist](https://gist.github.com/NyaGarcia/4ba1abeee1793fd5fe8153e4e43e3bc0)

**Don’t do this.** By exposing a Subject, we’re allowing anyone to push data into it, not to mention that we are completely **breaking the encapsulation** of our *DataService* class. Instead of **exposing our Subject**, we should **expose our Subject’s data.**

Isn’t it the same thing, you may be wondering? The answer is **no.** If we expose a Subject, we are making all of its methods available, including the *next()* function, which is used to make the Subject **emit** a new value. On the other hand, if we just expose its  data, we won’t make our Subject’s methods available, **just the values that it emits.**

So, how can we expose our Subject’s data but not it’s methods? By using the *asObservable*() operator, which transforms a Subject into an Observable. Since Observables **do not have the next() function**, our Subject’s data will be **safe from tampering**:

```typescript
class DataService {
  private pokemonLevel = new BehaviorSubject<number>(1);
  private stop$: Subject<void> = new Subject();

  pokemonLevel$ = this.pokemonLevel.asObservable();

  increaseLevel(level: number) {
    if (!this.isValidLevel(level)) {
      throw new Error("Level is not valid");
    }

    this.pokemonLevel.next(level);
  }

  stop() {
    this.stop$.next();
  }

  private isValidLevel(level: number): boolean {
    return level % 2 === 0;
  }
}
```

[View encapsulated-subjects.ts on GitHub Gist](https://gist.github.com/NyaGarcia/c049b7c8c2fb5ce9477b061600ffe6c1)

We have four different things going on in the above code:

- Both our *pokemonLevel* and *stop$* Subjects are now **private,** and therefore **not accessible** from outside our *DataService* class.

- We now have a *pokemonLevel$* Observable, that has been created by calling the *asObservable()* operator on our *pokemonLevel* Subject. This way, we can access the *pokemonLevel* data from outside the class, while keeping the Subject **safe from manipulation**.

- You may have noticed that, for the *stop$* Subject, we **did not create an Observable**. This is because we don’t need to access stop$’s data from outside the class.

- We now have two public methods, named *increaseLevel()* and *stop()*. The latter is simple enough to understand. It allows us to make the **private** stop$ Subject **emit from outside the class**, thus completing all Observables that have piped *takeUntil(stop$)*.

- *increaseLevel()* acts as a filter and only allows us to pass **certain values** to the *pokemonLevel()* Subject.

This way, no arbitrary data will be able to find its way to into our Subjects,which are nicely protected inside the class.

> **Note**: Please bear in mind that Observables have complete() and error() methods, which can still be used to mess with the Subject.

Remember everyone, **encapsulation** is the key.

*****

## Use marble diagrams for testing

As we all (should) know, **writing tests is as important as writing code itself.** However, if the thought of writing RxJS tests sounds a bit daunting to you… Fear not, from RxJS 6+, the RxJS marble testing utils will make life very, very easy for us. Are you familiar with **marble diagrams**? If not, here’s an example:

![](/images/articles/devto/29aca584c1c2e098.png)

Even if you’re a newbie to RxJS, you should more or less understand these
diagrams. They’re all over the place, are quite intuitive, and make it quite easy to understand how some of the more complicated RxJS operators work. The RxJS testing utils allows us to use these marble diagrams to write simple, intuitive and visual tests. All you have to do is import *TestScheduler* from the rxjs/testing module, and start writing tests!

Let’s take a look at how it’s done, by testing our number$ Observable:

```typescript
import { TestScheduler } from "rxjs/testing";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

describe("Awesome testing with Marble Diagrams", () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  const isMultipleOfTen = (number: number) => number % 10 === 0;

  it("should filter numbers that aren't multiples of ten", () => {
    scheduler.run(({ cold, expectObservable }) => {
      const values = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10
      };
      const number$ = cold("-a-b-c-d-e-f-g-h-i-j|", values);
      const expectedMarbleDiagram = "-------------------a|";
      const expectedValues = { a: 10 };
      const result = number$.pipe(filter(number => isMultipleOfTen(number)));
      expectObservable(result).toBe(expectedMarbleDiagram, expectedValues);
    });
  });
});
```

[View marble-testing.spec.ts on GitHub Gist](https://gist.github.com/NyaGarcia/d68ebe7b6f2d0ea0e3adfc4c7a542ce0)

Since deep diving into marble testing isn’t the goal of this tutorial, I will only briefly cover the key concepts that appear in the above code, so we have a basic understanding of what’s going on:

- **TestScheduler:** Is used to virtualize time. It receives a callback, which can be called with **helper** objects (in our case, the *cold()* and *expectObservable()* helpers.)

- **Run():** Automatically calls *flush()* when the callback returns. 

- **-** : Each - represents 10ms of time. 

- **Cold():** Creates a cold Observable whose subscription starts when the test begins. In our case, we are creating a cold Observable that will emit a value very 10ms, and complete. 

- **|**: Represents the completion of an Observable.

- Therefore, our *expectedMarbleDiagram*, expects for a to be emitted at 20ms.

- The *expectedValues* variable contains the expected values of every item that is emitted by our Observable. In our case, *a* is the only value that will be emitted, and equals 10.

- **ExpectObservable():** Schedules an assertion that will be executed when the *testScheduler* flushes. In our case, our assertion expects the number$ Observable to be like the *expectedMarbleDiagram*, with the values contained in the *expectedValues* variable.

You can find more information about helpers etc. in the [official RxJS
docs](https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing).

Advantages of using RxJS marble testing utils:

- You avoid **a lot** of boilerplate code. (Jasmine-marbles users will be able to appreciate this.)
- It’s very **easy** and **intuitive** to use. 
- It’s **fun**! Even if you aren’t a big fan of writing tests, I can guarantee you’ll enjoy marble testing.

Since I enjoy making all my code examples Pokemon-themed, I’ll throw in another spec, this time featuring a pokemon$ Observable test:

```typescript
import { TestScheduler } from "rxjs/testing";
import { filter, map } from "rxjs/operators";

describe("Awesome testing with Marble Diagrams", () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  it("should filter non-Water type pokemon and add attack property", () => {
    scheduler.run(({ cold, expectObservable }) => {
      const values = {
        a: { name: "Bulbasur", type: "Grass" },
        b: { name: "Charmander", type: "Fire" },
        c: { name: "Squirtle", type: "Water" }
      };

      const marbleDiagram = "-a-b-c|";
      const pokemon$ = cold(marbleDiagram, values);

      const expectedMarbleDiagram = "-----c|";
      const expectedValues = {
        c: { name: "Squirtle", type: "Water", attack: 30 }
      };
      const result = pokemon$.pipe(
        filter(({ type }) => type === "Water"),
        map(pokemon => ({ ...pokemon, attack: 30 }))
      );

      expectObservable(result).toBe(expectedMarbleDiagram, expectedValues);
    });
  });
});
```

[View marble-testing-pokemon.spec.ts on GitHub Gist](https://gist.github.com/NyaGarcia/8e985e7667d88ca4b3204ce29f1f6ce8)

*****

## Conclusion

That’s all folks! Today we discussed a few of the RxJS best practices that I always take careful care to apply in my code. I hope that you found them useful, if you didn’t already know about them. 

Do you know any more RxJS best practices? If you do, let me know in the comments below. This way we can all contribute to writing better and cleaner reactive code! 

If you enjoyed this post, don’t forget to share with your friends/colleagues, and maybe give me a lil’ clap :) If you have any questions, don’t hesitate to ask, either in the comments, or by reaching out to me via [Twitter](https://twitter.com/nyablk). See you all in the next tutorial!
