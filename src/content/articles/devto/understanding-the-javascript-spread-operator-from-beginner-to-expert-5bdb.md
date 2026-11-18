---
title: "Understanding the JavaScript Spread Operator - From Beginner to Expert"
description: "The spread operator '…' was first introduced in ES6. It quickly became one of the most popular features. This tutorial will show you how and when to use it."
date: "2019-09-16T19:54:00Z"
category: "Tutorials"
tags: ["javascript", "beginners", "webdev", "codenewbie"]
minutes: 6
lang: "en"
art: "types"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/understanding-the-javascript-spread-operator-from-beginner-to-expert-5bdb"
series: "JavaScript spread operator"
part: 1
coverImage: "/images/articles/devto/49765b7613d8fbbe.png"
---

## Introduction

The spread operator '…' was first introduced in ES6. It quickly became one of the most popular features. So much so, that despite the fact that it only worked on Arrays, a proposal was made to extend its functionalities to Objects. This feature was finally introduced in ES9.

The goal of this tutorial, which is divided into two parts, is to show you why the spread operator should be used, how it works, and deep dive into its uses, from the most basic to the most advanced. 

Here is a short summary of the contents of this tutorial:

## What we are going to learn
#### Part 1
1. Why the spread operator should be used
2. Cloning Arrays/Objects
3. Converting Array-like structures to Array
4. The spread operator as an argument
5. Adding elements to Arrays/Objects
6. Merging Arrays/Objects

#### Part 2
1. Destructuring nested elements
2. Adding conditional properties
3. Short circuiting
4. The rest parameter (…)
5. Default destructuring values
6. Default properties


## Why you should use the spread operator
After reading the previous list, you may be thinking something along these lines: *"But JavaScript has functions to do all those things… Why would I use the spread operator?"* Allow me to introduce you to **immutability**:

> **From Oxford Lexico:** Immutability -  unchanging over time or unable to be changed.

In software development, we use the term immutable to refer to values whose state **cannot change over time**. In fact, most of the values that we normally use (Primitive values, such as Strings , Integers etc.) are immutable. 

However, JavaScript has a peculiar behavior when it comes to Arrays and Objects; they are, in fact, **mutable**. This can become a **big** problem. Here's an example, illustrating why:

```javascript
const mySquirtle = {
  name: 'Squirtle',
  type: 'Water',
  hp: 100
};

const anotherSquirtle = mySquirtle;
anotherSquirtle.hp = 0;

console.log(mySquirtle); //Result: { name: 'Squirtle', type: 'Water', hp: 0 }
```

[View object-mutation.js on GitHub Gist](https://gist.github.com/NyaGarcia/2ca5a41746c6cd93f4c10065b0e08581)

As you can see in the previous code fragment, we have a Squirtle. Our Squirtle has a hp of 100, since we just visited the Pokemon Center. 

Since we want another Squirtle, we declare the variable *anotherSquirtle*, assigning our original Squirtle as its value. After an arduous battle, *anotherSquirtle* is defeated. We therefore access *anotherSquirtle*'s hp, and change it to 0. The next step is to check on our original Squirtle. We console.log and…

Wait, what? Our original Squirtle's hp is down to 0! How can this be? What happened to our poor Squirtle? **JavaScript mutation happened**. Let me explain what's going on. 

When we created the **anotherSquirtle variable**, and assigned our original Squirtle as its value, what we really did was **assign a reference to the memory location of the original Squirtle Object**. This is because JavaScript Arrays and Objects are reference data types. Unlike Primitive data types, they **point to the memory address where the actual Object/Array is stored**.

To make it easier to understand, you can imagine reference data types as pointers to a global variable. By changing a reference data type's value, what we are really doing is changing the value of the global variable. 

This means that, when we changed the **anotherSquirtle**'s hp value to 0, **we were really changing the hp value of the Squirtle Object stored in memory to 0**. This is why *mySquirtle*'s hp value is 0, because *mySquirtle* holds a reference to the Object stored in memory, which we changed via the *anotherSquirtle variable*. Thank you JavaScript.

### How do we solve this problem?
To avoid the accidental mutation of variables, what we have to do is **create a new instance of our Array/Object** whenever we want to copy an Array/Object. How do we achieve this?
 
With the spread operator!! :)

## How does the spread operator work?
> **From the MDN docs: Spread syntax** allows an iterable such as an array expression or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected, or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected
.
To put it simply, the spread operator '…' **spreads** the items that are contained in an **iterable** (an iterable is anything that can be looped over, like Strings, Arrays, Sets…) inside a **receiver** (A receiver is something that receives the spread values). Here are several simple examples with Arrays that will allow you to understand it better:

```javascript
const numbers = [1, 2, 3];
console.log(...numbers); //Result: 1 2 3

const pokemon = ['Squirtle', 'Bulbasur', 'Charmander'];
console.log(...pokemon); //Squirtle Bulbasur Charmander

const pokedex = [
  { name: 'Squirtle', type: 'Water' },
  { name: 'Bulbasur', type: 'Plant' },
  { name: 'Charmander', type: 'Fire' }
];
console.log(...pokedex); //{ name: 'Squirtle', type: 'Water' } { name: 'Bulbasur', type: 'Plant' } { name: 'Charmander', type: 'Fire' }
```

[View spread-array-examples.js on GitHub Gist](https://gist.github.com/NyaGarcia/19983a416dd42d76b258b4107f6d36ea)


As you can see, when we use the spread operator on an Array, we obtain **each individual item** contained in the Array. In all the previous cases, the receiver was a function, the **console.log** function. Easy enough, right?

## Cloning Arrays and Objects
Now that we now how the spread operator works, we can make use of it to copy Arrays and Objects immutably. How? By **spreading** the contents, and then using either the Array or Object literals (**[]** and **{}** respectively) to generate a **new instance** of the Array/Object. Let's take the previous Squirtle example, and fix it, by cloning the *mySquirtle * variable immutably:

```javascript
const mySquirtle = {
  name: 'Squirtle',
  type: 'Water',
  hp: 100
};

const anotherSquirtle = { ...mySquirtle };
anotherSquirtle.hp = 0;

console.log(anotherSquirtle); //Result: { name: 'Squirtle', type: 'Water', hp: 0 }
console.log(mySquirtle); //Result: { name: 'Squirtle', type: 'Water', hp: 100 }
```

[View immutable-object.js on GitHub Gist](https://gist.github.com/NyaGarcia/66d49dc57cfcc7f095df0a15e28388ad)

By **destructuring** the contents of the *mySquirtle* variable with the spread operator, and using the **Object literal**, we are creating a new instance of the Squirtle Object. This way, we **prevent accidental variable mutation**. 

To copy an Array, we use exactly the same syntax:

```javascript
const pokemon = ['Squirtle', 'Bulbasur', 'Charmander'];

const pokedex = [...pokemon];
pokedex.push('Cyndaquil');

console.log(pokemon); //[ 'Squirtle', 'Bulbasur', 'Charmander' ]
console.log(pokedex); //[ 'Squirtle', 'Bulbasur', 'Charmander', 'Cyndaquil' ]
```

[View immutable-array.js on GitHub Gist](https://gist.github.com/NyaGarcia/ebf6a35a3da02b17657cc9d25ac909c7)

> **Note:** Bear in mind the fact that the spread operator only performs **shallow** copies. This means that if you have a reference data type stored inside your Array/Object, when you make a copy with the spread operator, the nested Array/Object will contain a **reference to the original**, and will thus be **mutable**.

## Converting Array-like Objects to Arrays
Array-like Objects are very similar to Arrays. They usually have numbered elements and a length property. However, they have one **crucial** difference: Array-like Objects **do not have any of the Array functions**.

Among the Array-like Objects are the HTML node lists returned by most DOM methods, the arguments variable generated automatically in every JS function and a few others.

With the same syntax as when cloning arrays, we can use the spread operator to transform Array-like structures to Array, as an alternative to using Array.from. Here's an example, converting a **NodeList** to an Array: 

```javascript
const nodeList = document.getElementsByClassName("pokemon");
const array = [...nodeList];
  
console.log(nodeList); //Result: HTMLCollection [ div.pokemon, div.pokemon ]
console.log(array); //Result: Array [ div.pokemon, div.pokemon ]
```

[View nodeList-to-array.js on GitHub Gist](https://gist.github.com/NyaGarcia/b6fbb48e32197620bf31eb6cd96bdeb0)

With this technique, we can transform any Array-like structure to Array, **and thus have access to all the Array functions**.

## The spread operator as an argument
Some functions accept a **variable number of parameters**. A great example of these types of functions are the ones in the Math collection. For our example, let's pick the Math.max() function, which accepts **n numeric parameters**, and returns the largest one. Imagine we have an Array of numbers, which we want to pass to the Math.max() function. How do we do it? 

We could do something like this (don't hate me for the following code):

```javascript
const numbers = [1, 4, 5];
const max = Math.max(numbers[0], numbers[1], numbers[2]);

console.log(max); //Result: 5
```

[View math-max-by-index.js on GitHub Gist](https://gist.github.com/NyaGarcia/acda431acc93bf7d295d6a24a4b14da5)

But, of course, doing this would be suicide. What if we had 20 values? Or 1000? Are we really going to access each value by index? The answer is no. As we already know, the spread operator takes an Array and extracts each individual value. This is just what we're looking for! Therefore, we can do this:

```javascript
const numbers = [1, 4, 5, 6, 9, 2, 3, 4, 5, 6];
const max = Math.max(...numbers);

console.log(max); //Result: 9
```

[View math-max-spread.js on GitHub Gist](https://gist.github.com/NyaGarcia/5fabb4836273b48eeb77c13f5d763593)

Spread operator to the rescue!

## Adding new elements 
### Adding items to an Array
To add new elements to an array, we first spread the Array's contents, and use the Array literal [] to create a new instance of the Array, containing the original array's contents, plus the values we want to add :

```javascript
const pokemon = ['Squirtle', 'Bulbasur'];
const charmander = 'Charmander';
const cyndaquil = 'Cyndaquil';

const pokedex = [...pokemon, charmander, cyndaquil];

console.log(pokedex); //Result: [ 'Squirtle', 'Bulbasur', 'Charmander', 'Cyndaquil' ]
```

[View add-array-element.js on GitHub Gist](https://gist.github.com/NyaGarcia/b70477b66182512f8e1585ac45bd4ba8)

As you can see, we can add as many new items as we want. 

### Adding properties to an Object
By using the same syntax as with Arrays, we can easily add new properties when cloning an Object. To switch it up a little, here's a different syntax to add properties to an Object (it can also be used with Arrays):

```javascript
const basicSquirtle = { name: 'Squirtle', type: 'Water' };
const fullSquirtle = {
  ...basicSquirtle,
  species: 'Tiny Turtle Pokemon',
  evolution: 'Wartortle'
};

console.log(fullSquirtle); //Result: { name: 'Squirtle', type: 'Water', species: 'Tiny Turtle Pokemon', evolution: 'Wartortle' }
```

[View add-object-property.js on GitHub Gist](https://gist.github.com/NyaGarcia/c729a9688f89aa34503547e3a58d091c)

As you can see, we can declare and initialize new variables directly inside the Object literal, instead of doing so outside. 

## Merging Arrays/Objects
### Arrays
We can merge two arrays, by spreading them and using the Array literal, like in the previous examples. However, instead of simply adding a new element, we're going to add another (spread) array:

```javascript
const pokemon = ['Squirtle', 'Bulbasur', 'Charmander'];
const morePokemon = ['Totodile', 'Chikorita', 'Cyndaquil'];

const pokedex = [...pokemon, ...morePokemon];

console.log(pokedex); //Result: [ 'Squirtle', 'Bulbasur', 'Charmander', 'Totodile', 'Chikorita', 'Cyndaquil' ]
```

[View merge-arrays.js on GitHub Gist](https://gist.github.com/NyaGarcia/337fdb0248c5bcbd180b85e4661e5403)

It also works if we have an Array of Objects:

```javascript
const pokemon = [
  { name: 'Squirtle', type: 'Water' },
  { name: 'Bulbasur', type: 'Plant' }];
const morePokemon = [{ name: 'Charmander', type: 'Fire' }];

const pokedex = [...pokemon, ...morePokemon];

console.log(pokedex); //Result: [ { name: 'Squirtle', type: 'Water' }, { name: 'Bulbasur', type: 'Plant' }, { name: 'Charmander', type: 'Fire' } ]
```

[View merge-object-arrays.js on GitHub Gist](https://gist.github.com/NyaGarcia/009c96c8ef445f7bf8931f0ad637d2be)

### Objects
We can merge two (or more) Objects into a single Object, by using the same syntax as before (you may have noticed by now, that the spread operator is used in a very similar same way, both for Arrays and Objects):

```javascript
const baseSquirtle = {
  name: 'Squirtle',
  type: 'Water'
};

const squirtleDetails = {
  species: 'Tiny Turtle Pokemon',
  evolution: 'Wartortle'
};

const squirtle = { ...baseSquirtle, ...squirtleDetails };
console.log(squirtle); //Result: { name: 'Squirtle', type: 'Water', species: 'Tiny Turtle Pokemon', evolution: 'Wartortle' }
```

[View merge-objects.js on GitHub Gist](https://gist.github.com/NyaGarcia/51ebd5883b5c487e2f359eda6f851683)

## Conclusion
In this first part of the tutorial we have learnt why we should use the spread operator (**immutability!**), how it works, and several basic uses of said operator. In the second part of the tutorial we will deepen our knowledge this operator with several advanced techniques and use cases. Here's the link to the [second part](/journal/devto/understanding-the-javascript-spread-operator-from-beginner-to-expert-part-2-24ff/).

Thank you very much for reading :) If you have any doubts or comments don't hesitate to reach out to me, here's a link to my [Twitter page](https://twitter.com/nyablk).
