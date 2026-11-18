---
title: "RxJS Lessons: Understanding Multicasting Operators"
description: "Introduction   When it comes to RxJS, multicasting is probably one of its most daunting feat..."
date: "2021-02-02T13:17:07Z"
category: "RxJS"
tags: ["javascript", "rxjs", "webdev", "programming"]
minutes: 8
lang: "en"
art: "orbit"
author: "Nya"
series: "RxJS Lessons"
part: 2
sourceUrl: "https://dev.to/nyagarcia/rxjs-lessons-understanding-multicasting-operators-372g"
coverImage: "/images/articles/devto/08091b03b2879041.jpg"
---

## Introduction
When it comes to RxJS, multicasting is probably one of its most daunting features. Multicasting requires a prior RxJS knowledge base and is, in itself, a feature which some programmers struggle to grasp. To this we add that there exist quite a few multicasting operators, and that knowing which one to pick can prove to be quite difficult if we don't understand how they each work, and which particular problem they solve.

This is an introductory guide to the RxJS multicasting operators. By the end of this guide, you'll (hopefully) understand these operators a little better, and know when and why you need to use each one. We will start by taking a look at the hot/cold Observable concept, and we'll then make our way through all of the multicasting operators, discussing their particularities and looking at examples, until we understand them all. 

I've created a StackBlitz project for each and every one of the examples that we'll see in this guide, so that you can play around with the code snippets, since, in my humble opinion, this considerably helps to understand how the operators work. You can find the link to the  corresponding StackBlitz project in the caption below each example.
Before we get started, here is a list of all the operators that we'll cover today:

- [multicast](https://rxjs.dev/api/operators/multicast)
- [publish](https://rxjs.dev/api/operators/publish)
- [publishReplay](https://rxjs.dev/api/operators/publishReplay)
- [publishLast](https://rxjs.dev/api/operators/publishLast)
- [publishBehavior](https://rxjs.dev/api/operators/publishBehavior)
- [refCount](https://rxjs.dev/api/operators/refCount)
- [share](https://rxjs.dev/api/operators/share)
- [shareReplay](https://rxjs.dev/api/operators/shareReplay)

---

## Hot & cold Observables
*Note: If you're already familiar with these concepts, feel free to skip this section and move on to the next.*

Most Observables are cold by default. Each time we subscribe to a cold Observable, its producer is recreated. So what does this mean exactly? First, we must understand what a producer is: in a nutshell, it's the source of our Observable's values. It can be a DOM event, a callback, an HTTP request, an iterator and so on. In short, anything that can produce values and pass them to an observer. 

Now that we know what a producer is, it'll be easier to understand the meaning of the previous statement, which basically comes to say that our Observable's producer is being created over and over again with each subscription. Let's take a look at an example: 

```typescript
import { timer } from "rxjs";
import { tap } from "rxjs/operators";

const cold$ = timer(1000).pipe(tap(() => console.log("Side Effect")));

cold$.subscribe(val => console.log(`Observer 1: ${val}`));
cold$.subscribe(val => console.log(`Observer 2: ${val}`));

// Since we have a cold Observable, the side effect is executed twice: once for every subscription

/* Output:
Side Effect,
Observer 1: 0,
Side Effect, 
Observer 2: 0
*/
```

[View cold-observable.ts on GitHub Gist](https://gist.github.com/NyaGarcia/ee38dfeadbd39ca75950979719be9a31) 

[StackBlitz](https://stackblitz.com/edit/cold-observable-example)

As you can see, because our Observable is cold, and its producer is being recreated with each subscription, the side effect is being executed twice, one time for each subscription. If the Observable were hot, the side effect would be performed only once, regardless of how many times we subscribe.

Some may think, after seeing the previous code, that the consequences derived from this behavior aren't particularly important, which is why I always like to explain this concept, and its considerable importance, by using an HTTP request as an example.

Let's imagine that we have an Ajax Observable, that gets some data for us. Because the Ajax Observable is cold, each time we subscribe to it, a new HTTP request is made. Yes, you read correctly, a new request is made for each subscription. 20 subscriptions = 20 HTTP requests. Let's take a look at some code:

```typescript
import { ajax } from "rxjs/ajax";
import { map, mergeAll, take, tap } from "rxjs/operators";

// A cold ajax Observable
const sharedGhibliFilm$ = ajax
  .getJSON("https://ghibliapi.herokuapp.com/films")
  .pipe(
    tap(() => console.log("New request")),
    mergeAll(),
    take(1)
  );

// Two subscriptions...
sharedGhibliFilm$
  .pipe(map(({ title }) => title))
  .subscribe(title => console.log(`Title: ${title}`));

sharedGhibliFilm$
  .pipe(map(({ description }) => description))
  .subscribe(description => console.log(`Description: ${description}`));

// ...and two requests

/* Output:
'New request',
'Title: Castle in the Sky',
'New request',
'Description: The orphan Sheeta inherited a mysterious crystal that...'
*/
```

[View cold-observable-ajax.ts on GitHub Gist](https://gist.github.com/NyaGarcia/5e2978f151a5f5fe548eaee915e44a1b)

[StackBlitz](https://stackblitz.com/edit/cold-observable-ajax-example?file=index.html)

Upon seeing this, I believe that the importance of properly handling hot/cold Observables becomes exceedingly clear. Having the producer recreated with each subscription is something we most certainly don't want happening in our code. So, how do we fix this serious issue? By making our cold Observables hot. How do we do that? With multicasting operators! So, without further ado, let's get started on those operators.

*Note: There is a wonderful article by Ben Lesh that treats the topic of hot/cold Observables in-depth. You can find it [here](https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339).*


---

## multicast
`multicast` shares the source Observable by using a Subject. Let's take a look at an example using multicast:

```typescript
import { interval, Subject } from "rxjs";
import { take, tap, multicast } from "rxjs/operators";

const number$ = interval(1000).pipe(take(10));

const multicast$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  multicast(() => new Subject())
);

multicast$.subscribe(console.log);
// Output:
```

[View multicast-no-connect.ts on GitHub Gist](https://gist.github.com/NyaGarcia/433269daa077b4bc4d9a90907edb4298)

[StackBlitz](https://stackblitz.com/edit/multicasting-multicast-no-connect?file=index.ts)

Have you tried the StackBlitz? Noticed anything strange? If we run the previous code, we won't receive any values at all! Why isn't our source Observable emitting anything? 

Because `multicast` returns a special kind of Observable: a `ConnectableObservable`. This special type of Observable has a `connect()` method, which, when called, is responsible for subscribing to the source Observable with the Subject that we provided. 

This means that if we don't call `connect()`, the source will never be subscribed to, and will never begin emitting values. So, let's change our previous code, adding a call to `connect()`:

```typescript
import { ConnectableObservable, interval, Subject } from "rxjs";
import { take, tap, multicast } from "rxjs/operators";

const number$ = interval(1000).pipe(take(2));

const multicast$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  multicast(() => new Subject())
) as ConnectableObservable<number>;

// Until we call connect, number$ won't start emitting values
multicast$.connect();

multicast$.subscribe(val => console.log(`Observer 1: ${val}`));
multicast$.subscribe(val => console.log(`Observer 2: ${val}`));
/* Output:
Shared source, side effect executing once,
Observer 1: 0,
Observer 2: 0
(1s)
Shared source, side effect executing once,
Observer 1: 1,
Observer 2: 1
*/
```

[View multicast.ts on GitHub Gist](https://gist.github.com/NyaGarcia/6431815f7e4a7fa2a7cfb2d31bebba2e)

[StackBlitz]( https://stackblitz.com/edit/multicasting-multicast?file=index.ts)

Et voilà! Our code is now working as it should. Since `multicast` is sharing the source Observable, the side effect will only be executed once, even if we were to subscribe 1000 times.

### Unsubscribing
As with all Observables, it's important to unsubscribe from our multicast Observables to avoid memory leaks. We need to bear in mind that, when dealing with multicasting operators that return a ConnectableObservable, we need to unsubscribe from the multicast subscription. 

Let's take our previous code snippet, remove the `take(2)` from the source that was taking care of ending our Observable for us, and unsubscribe:

```typescript
import { ConnectableObservable, interval, Subject, timer } from "rxjs";
import { tap, multicast } from "rxjs/operators";

const number$ = interval(1000);

const multicast$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  multicast(() => new Subject())
) as ConnectableObservable<number>;

const connectSubscription = multicast$.connect();

multicast$.subscribe(val => console.log(`Observer 1: ${val}`));
multicast$.subscribe(val => console.log(`Observer 2: ${val}`));

// Unsubscribing after 2s
timer(2000)
  .pipe(tap(() => connectSubscription.unsubscribe()))
  .subscribe();
```

[View multicast-unsubscribe.ts on GitHub Gist](https://gist.github.com/NyaGarcia/e02550c2915680c8da7be0e5d5d8bd01)

[StackBlitz](https://stackblitz.com/edit/multicasting-multicast-unsubscribe?file=index.ts)

Memory leak successfully avoided!

### What about late subscribers?
In a perfect sandbox environment, all the subscriptions to the multicast Observable happen at the same time. However, what are the odds of finding this kind of behavior in real life? I can assure you that they are not very good. Let's take a look at a more realistic example, where we have different subscriptions occurring at different times:

```typescript
import { ConnectableObservable, interval, Subject, timer } from "rxjs";
import { take, tap, multicast } from "rxjs/operators";

const number$ = interval(1000).pipe(take(2));

// By using multicast, we're sharing the number$ Observable
const multicasted$ = number$.pipe(
  tap(_ => console.log("Shared source, side effect executing once")),
  multicast(() => new Subject())
) as ConnectableObservable<number>;

multicasted$.connect();

multicasted$.subscribe(val => console.log(`Observer 1: ${val}`));

// Late observers won't receive the values that have already been emitted
timer(2000)
  .pipe(
    tap(() =>
      multicasted$.subscribe(val => console.log(`Late observer: ${val}`))
    )
  )
  .subscribe();
/* Output:
Shared source, side effect executing once,
Observer 1: 0,
(1s)
Shared source, side effect executing once,
Observer 1: 1,
Late observer: 1
*/
```

[View multicast-late-observer.ts on GitHub Gist](https://gist.github.com/NyaGarcia/c708e8f54c39113022c29faa9eac390b)

[StackBlitz](https://stackblitz.com/edit/multicasting-multicast)

Well, it seems that our late observer is missing out on the values that were emitted before it subscribed to the multicast Observable. This can lead to unexpected behavior and major headaches trying to discover the cause.

So, how can we solve this problem? It's actually quite simple, all we have to do is use a [ReplaySuject](https://rxjs.dev/api/index/class/ReplaySubject) instead of a regular Subject. Since ReplaySubjects replay old values to new subscribers, our issue is effectively  solved:

```typescript
import { ConnectableObservable, interval, ReplaySubject, timer } from "rxjs";
import { take, tap, multicast } from "rxjs/operators";

const number$ = interval(1000).pipe(take(2));

const multicasted$ = number$.pipe(
  tap(_ => console.log("Shared source, side effect executing once")),
  // Using a ReplaySubject instead of a regular Subject
  multicast(() => new ReplaySubject())
) as ConnectableObservable<number>;

multicasted$.connect();

multicasted$.subscribe(val => console.log(`Observer 1: ${val}`));

// Late observers will receive the values that have already been emitted, thanks to ReplaySubject
timer(2000)
  .pipe(
    tap(() =>
      multicasted$.subscribe(val => console.log(`Late observer: ${val}`))
    )
  )
  .subscribe();
/* Output:
Shared source, side effect executing once,
Observer 1: 0,
(1s)
Late observer: 0,
Shared source, side effect executing once,
Observer 1: 1,
Late observer: 1
*/
```

[View multicast-replaySubject.ts on GitHub Gist](https://gist.github.com/NyaGarcia/29a3ddd98f4a6ab39baace10524459eb) 

[StackBlitz](https://stackblitz.com/edit/multicasting-multicast-replaysubject)

Et, voilà, our late observers now have access to the previously emitted values.


---

## publish()
We can all agree that `multicast` is an amazing operator, but having to type `multicast(() => new Subject())` each time we want to multicast our streams can get a little verbose…
`publish` operator to the rescue! `publish` basically uses `multicast` plus a Subject under the hood, so that we don't have to go the trouble of typing it. Pretty cool, right? Let's take a look at an example:

```typescript
import { ConnectableObservable, interval, timer } from "rxjs";
import { publish, tap, take } from "rxjs/operators";

const number$ = interval(1000).pipe(take(4));

const multicast$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  // Using publish instead of multicast(() => new Subject())
  publish()
) as ConnectableObservable<number>;

// Calling connect
multicast$.connect();

multicast$.subscribe(val => console.log(`Observer 1: ${val}`));
multicast$.subscribe(val => console.log(`Observer 2: ${val}`));

/* Output:
Shared source, side effect executing once,
Observer 1: 0, 
Observer 2: 0,
(1s)
Shared source, side effect executing once,
Observer 1: 1,
Observer 2: 1...
*/
```

[View publish.ts on GitHub Gist](https://gist.github.com/NyaGarcia/a3a21bd3b0ea87044abf234ebd2eca11)

[StackBlitz](https://stackblitz.com/edit/multicasting-publish)

Remember, we still have to call connect() if we want our source Observable to be subscribed to!

### The publish variants
Remember the issue we had with late subscribers and `multicast`? How do we deal with them in this case? Since publish is equivalent to using `multicast(() => new Subject())`, we can't just change the Subject for a ReplaySubject manually. Luckily for us, publish has several variants, one for every kind of Subject that there is. Let's take a look at them:

### publishReplay()
`publishReplay` is equivalent to `multicast(() => new ReplaySubject())`. Since we've already seen an example with `multicast` + ReplaySubject, we know that it allows late subscribers to receive the emissions prior to their subscription:

```typescript
import { ConnectableObservable, interval, timer } from "rxjs";
import { publishReplay, take, tap } from "rxjs/operators";

const number$ = interval(1000).pipe(take(3));

const multicast$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  publishReplay()
) as ConnectableObservable<number>;

// calling connect
multicast$.connect();

multicast$.subscribe(val => console.log(`Observer 1: ${val}`));

timer(2000)
  .pipe(
    tap(() =>
      multicast$.subscribe(val => console.log(`Late observer: ${val}`))
    )
  )
  .subscribe();

/* Output:
  Shared source, side effect executing once,
  Observer 1: 0,
  (1s)
  Shared source, side effect executing once,
  Observer 1: 1,
  Late observer: 0,
  Late observer: 1,
  (1s) 
  Shared source, side effect executing once,
  Observer 1: 2
  Late observer: 2
*/
```

[View publishReplay.ts on GitHub Gist](https://gist.github.com/NyaGarcia/12f1afbf3efb4545a485814967625682) 

[StackBlitz](https://stackblitz.com/edit/multicasting-publishreplay)

### publishLast()

`publishLast` is equivalent to `multicast(() => new AsyncSubject())`. It will wait until the source Observable has completed to emit the last value. Here's an example:

```typescript
import { ConnectableObservable, interval } from "rxjs";
import { publishLast, take } from "rxjs/operators";

const number$ = interval(1000).pipe(take(4));

const multicast$ = number$.pipe(publishLast()) as ConnectableObservable<
  number
>;

// Calling connect
multicast$.connect();

multicast$.subscribe(val => console.log(`Observer 1: ${val}`));
multicast$.subscribe(val => console.log(`Observer 2: ${val}`));
/* Output:
(4s)
Observer 1: 3, 
Observer 2: 3
*/
```

[View publishLast.ts on GitHub Gist](https://gist.github.com/NyaGarcia/c10e80c5a6d822d764009a89c08be382) 

[StackBlitz](https://stackblitz.com/edit/multicasting-publishlast)

### publishBehavior
`publishBehavior` is equivalent to `multicast(() => new BehaviorSubject())`. Since it uses a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject), `publishBehavior` allows us to specify an initial value:

```typescript
import { ConnectableObservable, interval } from "rxjs";
import { publishBehavior, take } from "rxjs/operators";

const number$ = interval(1000).pipe(take(2));

// Providing an initial value of -1
const multicast$ = number$.pipe(publishBehavior(-1)) as ConnectableObservable<
  number
>;

// Calling connect
multicast$.connect();

multicast$.subscribe(val => console.log(`Observer 1: ${val}`));
multicast$.subscribe(val => console.log(`Observer 2: ${val}`));

/* Output:
Observer 1: -1, 
Observer 2: -1,
(1s)
Observer 1: 0,  
Observer 2: 0,
(1s)
Observer 1: 1, 
Observer 2: 1
*/
```

[View publishBehavior.ts on GitHub Gist](https://gist.github.com/NyaGarcia/c281cca3f8b0f45d274fa7451e8d460f) 

[StackBlitz](https://stackblitz.com/edit/multicasting-publishbehavior?file=index.ts)

---

## refCount()

We now know about several amazing operators to share our streams. However, having to call `connect()` gets old quick. It's verbose and, should we forget to call it, we'd probably end up wasting time figuring out why our Observables aren't emitting. So, isn't there a better alternative?

Of course there is! Allow me to introduce the `refCount` operator. `refCount` is in charge of counting the number of subscriptions to the source internally, which takes care of two crucial things for us:

- If the number of subscriptions is larger than 0, a.k.a. there's at least one subscriber, `refCount` subscribes (once only) to the source, calling `connect()`.
- If the number of subscriptions is smaller than 1, a.k.a. there aren't any subscribers, `refCount` unsubscribes from the source.

Let's refactor our previous code to include `refCount`:

```typescript
import { interval, Subject, timer } from "rxjs";
import { take, takeUntil, tap, multicast, refCount } from "rxjs/operators";

const number$ = interval(1000).pipe(take(10));

// We're going to use the takeUntil + Subject technique instead of unsubscribing
const stop$ = new Subject();

const multicast$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  multicast(() => new Subject()),
  // By using refCount, we no longer have to call connect() manually
  refCount(),
  takeUntil(stop$)
);

// refCount === 1, number$ is subscribed to
multicast$.subscribe(val => console.log(`Observer 1: ${val}`));
// refCount === 2
multicast$.subscribe(val => console.log(`Observer 2: ${val}`));

// refCount === 0, number$ is unsubscribed from
timer(2000)
  .pipe(
    tap(() => stop$.next()),
    tap(() => console.log("The end"))
  )
  .subscribe();

/* Output:
  (1s)
  Shared source, side effect executing once,
  Observer 1: 0,
  Observer 2: 0,
  (1s) 
  Shared source, side effect executing once,
  Observer 1: 1,
  Observer 2: 1,
  The end
 */
```

[View refcount.ts on GitHub Gist](https://gist.github.com/NyaGarcia/7c20a880a2753323fde2e4425d75d7a9) 

[StackBlitz](https://stackblitz.com/edit/multicasting-refcount)

As you can see, `refCount` takes care of calling `connect()` and of unsubscribing from the source Observable for us.


---

## share()
Last, but not least, we have the `share` operator, which is equivalent to using `multicast(() => new Subject())` + `refCount`. It's the easiest and most commonly used multicasting operator, since it takes care of everything under the hood. Here's our previous example, refactored to use `share`:

```typescript
import { interval } from "rxjs";
import { take, tap, share } from "rxjs/operators";

const number$ = interval(1000).pipe(take(2));

const share$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  share()
);

share$.subscribe(val => console.log(`Observer 1: ${val}`));
share$.subscribe(val => console.log(`Observer 2: ${val}`));
/* Output:
Shared source, side effect executing once,
Observer 1: 0,
Observer 2: 0,
(1s)
Shared source, side effect executing once,
Observer 1: 1, 
Observer 2: 1
*/
```

[View share.ts on GitHub Gist](https://gist.github.com/NyaGarcia/acbf46915766768a26969ca324c76254) 

[StackBlitz](https://stackblitz.com/edit/multicasting-share?file=index.ts)

Just for fun, let's take a look at a slightly more realistic example, featuring a shared Ajax Observable instead of a boring old interval:

```typescript
import { ajax } from "rxjs/ajax";
import { map, mergeAll, take, tap, share } from "rxjs/operators";

// Sharing the source Observable to make it hot
const sharedGhibliFilm$ = ajax
  .getJSON("https://ghibliapi.herokuapp.com/films")
  .pipe(
    tap(() => console.log("Shared source, only one request will be made!")),
    mergeAll(),
    take(1),
    share()
  );

// Two subscriptions...
sharedGhibliFilm$
  .pipe(map(({ title }) => title))
  .subscribe(title => console.log(`Title: ${title}`));

sharedGhibliFilm$
  .pipe(map(({ description }) => description))
  .subscribe(description => console.log(`Description: ${description}`));

// ...but only one request!

/* Output:
'Shared source, only one request will be made!',
'Title: Castle in the Sky',
'Description: The orphan Sheeta inherited a mysterious crystal that...'
*/
```

[View share-ajax.ts on GitHub Gist](https://gist.github.com/NyaGarcia/2fa1f8f97337fd9d4419f1ea3f1ddb3f) 

[StackBlitz](https://stackblitz.com/edit/multicasting-share-ajax?file=index.ts)

## shareReplay()
Once again, we must remember our late subscribers. In this case, share only has one variant, `shareReplay`. As you can imagine, shareReplay is equivalent to `multicast(() => new ReplaySubject())` + `refCount`. Here's an example:

```typescript
import { interval, timer } from "rxjs";
import { shareReplay, take, tap } from "rxjs/operators";

const number$ = interval(1000).pipe(take(3));

// Making the source hot with shareReplay
const multicasted$ = number$.pipe(
  tap(() => console.log("Shared source, side effect executing once")),
  shareReplay()
);

multicasted$.subscribe(val => console.log(`Observer 1: ${val}`));

// We subscribe late to the multicasted source...
timer(2000)
  .pipe(
    tap(() =>
      multicasted$.subscribe(val => console.log(`Late observer: ${val}`))
    )
  )
  .subscribe();

// ...but we'll receive the previously emitted values regardless!

/* Output:
  Shared source, side effect executing once,
  Observer 1: 0,
  (1s)
  Shared source, side effect executing once,
  Observer 1: 1,
  Late observer: 0,
  Late observer: 1,
  (1s) 
  Shared source, side effect executing once,
  Observer 1: 2
  Late observer: 2
*/
```

[View shareReplay.ts on GitHub Gist](https://gist.github.com/NyaGarcia/9e919977c2dd6120566fe13510be6dd1)

[StackBlitz](https://stackblitz.com/edit/sharereplay-multicasting)

---

## Wrapping up
💡 `publish` is equivalent to `multicast(() => new Subject())`.
💡 `publishBehavior` is equivalent to `multicast(() => new BehaviorSubject())`.
💡 `publishLast` is equivalent to `multicast(() => new AsyncSubject())`.
💡 `publishReplay` is equivalent to `multicast(() => new ReplaySubject())`.
💡 With `refCount`, we no longer have to manually call `connect()` nor do we have to take care of unsubscribing.
💡 `share` is equivalent to `multicast(() => new Subject())`, `refCount()`.
💡 `shareReplay` is equivalent to `multicast(() => new ReplaySubject())`, `refCount()`.


---

## Conclusion
That's all folks! I hope this post helped you understand multicasting operators a little better, and realize that multicasting is not as hard as it initially seems.

As I mentioned earlier, I've created a StackBlitz project for each and every example in this guide, so feel free to play around with the code, I promise that it really helps to better understand how the operators work. 

If you enjoyed this guide, feel free to leave a nice comment! If you have any questions, you can drop them in the comments and I'll try my best to answer.
