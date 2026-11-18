---
title: "Understanding the JavaScript Spread Operator - From Beginner to Expert Part 2"
description: "Introduction   The spread operator, …, was  first introduced in ES6. It quickly became one o..."
date: "2019-09-25T17:18:11Z"
category: "Tutorials"
tags: ["javascript", "beginners", "webdev", "codenewbie"]
minutes: 7
lang: "en"
art: "types"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/understanding-the-javascript-spread-operator-from-beginner-to-expert-part-2-24ff"
series: "JavaScript spread operator"
part: 2
coverImage: "/images/articles/devto/d706fd0c3be858e0.png"
---

## Introduction
The spread operator, …, was  first introduced in ES6. It quickly became one of the most popular  features. So much so that despite the fact it only worked on arrays, a  proposal was made to extend its functionalities to objects. This feature  was finally introduced in ES9.

The goal of this tutorial, which is divided into two parts, is to show you why the spread operator should be used, how it works, and to deep dive into its uses, from the most basic to the most advanced. If you haven't read the first part of this tutorial, I encourage you to do so! Here is the link:

[Understanding the JavaScript Spread Operator - From Beginner to Expert](/journal/devto/understanding-the-javascript-spread-operator-from-beginner-to-expert-5bdb/)

Here is a short summary of the contents of this tutorial:

#### Part 1
1. Why the spread operator should be used
2. Cloning arrays/objects
3. Converting array-like structures to array
4. The spread operator as an argument
5. Adding elements to arrays/objects
6. Merging arrays/objects

#### Part 2
1. Destructuring nested elements
2. Adding conditional properties
3. Short circuiting
4. The rest parameter (…)
5. Default destructuring values
6. Default properties


---

## Cloning arrays/objects with nested elements
In the first part of this article, we learnt about reference data types, accidental variable mutation, and how we could solve this problem by cloning arrays/objects **immutably**, with the spread operator. 

However, there's a slight problem with this approach, when it comes to nested reference data types: The spread operator only performs a **shallow clone**. What does this mean? If we attempt to clone an object that contains an array, for example, the array inside the cloned object will contain a reference to the memory address where the original array is stored… This means that, while our object is immutable, the **array inside it isn't**. Here's an example to illustrate this:

```javascript
const pokemon = {
  name: 'Squirtle',
  type: 'Water',
  abilities: ['Torrent', 'Rain Dish']
};

const squirtleClone = { ...pokemon };
pokemon.name = 'Charmander';
pokemon.abilities.push('Surf');

console.log(squirtleClone); //Result: { name: 'Squirtle', type: 'Water', abilities: [ 'Torrent', 'Rain Dish', 'Surf' ] }
```

[View nested-object-mutation.js on GitHub Gist](https://gist.github.com/NyaGarcia/9e803ebb4d22d3da8b3efcc7e424584e)

As you can see, our *squirtleClone* has been cloned **immutably**. When we change the name property of the original *pokemon* object to 'Charmander', our *squirtleClone* isn't affected, its *name* property **isn't mutated**. 

However, when we add a new ability to the *abilities* property of the original *pokemon* object… Our *squirtleClone*'s abilities **are affected by the change**. Because the abilities property is a **reference data type**, it isn't cloned immutably.  Welcome to the reality of JavaScript :)

One of the solutions to this problem would be to use the spread operator to clone the nested properties, as shown in the following example:

```javascript
const pokemon = {
  name: 'Squirtle',
  type: 'Water',
  abilities: ['Torrent', 'Rain Dish']
};

const squirtleClone = { ...pokemon, abilities: [...pokemon.abilities] };
pokemon.name = 'Charmander';
pokemon.abilities.push('Surf');

console.log(squirtleClone); //Result: { name: 'Squirtle', type: 'Water', abilities: [ 'Torrent', 'Rain Dish' ] }
```

[View nested-object-clone.js on GitHub Gist](https://gist.github.com/NyaGarcia/d5b120da2dd99740cd69f3ca7a58f17a)

For obvious reasons, this **isn't an ideal approach** to solving our problem. We would need to use the spread operator for every single reference type property, which is why this approach is only valid for small objects. So, which is the optimal solution? **Deep cloning**. 

Since there is plenty to say about deep cloning, I won't be going into too much detail. I'd just like to say that the correct of deep cloning is either using an external library (for example, [Lodash](https://lodash.com)), or writing ourselves a function that does it. 


---

## Adding conditional properties
Sometimes we need to add properties to an object, but we don't know whether or not those properties exist. This doesn't pose much of a problem, we can always check if the property exists with an if statement:

```javascript
const pokemon = {
  name: 'Squirtle',
  type: 'Water'
};

const abilities = ['Torrent', 'Rain dish'];
const fullPokemon = abilities ? { ...pokemon, abilities } : pokemon;

console.log(fullPokemon);
```

[View conditional-property-if.js on GitHub Gist](https://gist.github.com/NyaGarcia/68dff90e0504c417e1c6aea2f9b186f3)

There is, however, a much simpler way of achieving the same result, by using **short circuiting conditionals with the && operator**. A brief explanation:

#### Short circuiting
When we evaluate an expression with &&, if the first operand **is false**, JavaScript will short-circuit and **ignore the second operand**. 

Let's take a look at the following code:

```javascript
const starterPokemon = ['Squirtle', 'Charmander', 'Bulbasur'];

function choosePokemon(pokemon) {
  return pokemon[Math.floor(Math.random() * pokemon.length)];
}
//Checks if the starterPokemon array has any elements and runs the choosePokemon function
console.log(starterPokemon.length > 0 && choosePokemon(starterPokemon));

//It's equivalent to doing this:
if (starterPokemon.length > 0) {
  choosePokemon(starterPokemon);
}
```

[View short-circuiting-&&.js on GitHub Gist](https://gist.github.com/NyaGarcia/910f634e9b7b63af592d8ebcd408fdd5)

If *starterPokemon.length > 0* is false (the array is empty), the statement will short circuit, and our *choosePokemon* function **will never be executed**. This is why the previous code is equivalent to using the traditional if statement.

Going back to our original problem, we can take advantage of the logical AND operator to add conditional properties to an object. Here's how:

```javascript
const pokemon = {
  name: 'Squirtle',
  type: 'Water'
};

const abilities = ['Torrent', 'Rain dish'];
const fullPokemon = {
  ...pokemon,
  ...(abilities && { abilities })
};

console.log(fullPokemon);
```

[View conditional-property-spread.js on GitHub Gist](https://gist.github.com/NyaGarcia/d1fbf34a251cfd5466f9b5a27f781576)

What's going on here? Allow me to explain:

As we already know, by using the && operator, the second part of the statement will only be executed if the **first operand is true**. Therefore, only if the abilities variable is true (if the variable exists), will the second half of the statement be executed. What does this second half do? It **creates an object containing the abilities variable**, which is then **destructured with the spread operator placed in front of the statement**, thus adding the existent abilities variable into our fullPokemon object **immutably**. 


---

Before we can introduce our final advanced spreading use, adding default properties to objects, we must first dive into two new concepts: **default destructuring values**, and the **rest parameter**. Once we are familiar with these techniques, we will be able to combine them to **add default properties to objects**.

## Default destructuring values
If we try to destructure an array element or object property that doesn't exist, we will get an undefined variable. How can we avoid undefined values? By using **defaults**. How does this work?

We can assign default values to the variables we destructure, inside the actual destructuring statement. Here's an example:

```javascript
const pokemon = {
  id: 1,
  name: 'Squirtle'
};

const { type, name } = pokemon;
console.log(name); //Result: Squirtle
console.log(type); //Result: undefined

//Assigning default value to the type variable
const { type = 'Water', name } = pokemon;
console.log(type); //Result: Water
```

[View destructure-defaults.js on GitHub Gist](https://gist.github.com/NyaGarcia/6783e6686c4e2ae5ea69f4001bdeb363)

As you can see, by adding the default value 'Water' to the *type* variable in the destructuring statement, we avoid an undefined variable in the case of the *pokemon* object not having the *type* property.

## The rest parameter (…)
You may be surprised to hear that the spread operator is **overloaded**. This means that it has more than one function. It's second function is to act as the **rest parameter**.

> **From the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters):** A function's last parameter can be prefixed with ... which  will cause all remaining (user supplied) arguments to be placed within a  "standard" javascript array. Only the last parameter can be a "rest  parameter".

Simply put, the rest operator takes all remaining elements (this is the reason it's named rest, as in the **rest of the elements :p** ) and places them into an array. Here's an example:

```javascript
function printPokemon(name, type, ...abilities) {
  console.log(
    `${name} is a ${type} type Pokemon. ${name}'s abilities are: ${abilities.join(
      ', '
    )}`
  );
}

printPokemon('Squirtle', 'Water', 'Torrent'); 
//Squirtle is a Water type Pokemon. Squirtle's abilities are: Torrent
printPokemon('Squirtle', 'Water', 'Torrent', 'Rain Dish'); 
//Squirtle is a Water type Pokemon. Squirtle's abilities are: Torrent, Rain Dish
printPokemon('Squirtle', 'Water', 'Torrent', 'Rain Dish', 'Surf', 'Secret Ability', 'And so on...'); 
//Squirtle is a Water type Pokemon. Squirtle's abilities are: Torrent, Rain Dish, Surf, Secret Ability, And so on...
```

[View rest-parameter.js on GitHub Gist](https://gist.github.com/NyaGarcia/d284de4a5c37a20cc0bbb98713d0c8c3)

As you can see, we can pass as many abilities as we want to the *printPokemon* function. Every single value we introduce after the type parameter (the **rest** of the parameters) will be **collected into an array**, which we then turn into a string with the join function, and print out.

> **Note:** Remember that the rest parameter **must be the last parameter**, or an error will occur.

The rest parameter can also be used when **destructuring**, which is the part that interests us. It allows us to obtain the **remaining properties in an object**, and store them in an array. Here's an example of the rest parameter used in a destructuring assignment:

```javascript
const pokemon = {
  id: 1,
  name: 'Squirtle',
  type: 'Water'
};

const { id, ...rest } = pokemon;
console.log(rest); //Result: { name: 'Squirtle', type: 'Water' }
```

[View rest-parameter-destructuring.js on GitHub Gist](https://gist.github.com/NyaGarcia/db89365577f15673d8dd20370547ca52)

As shown above, we can use the rest operator to destructure the remaining properties in the *pokemon* object. Like in the previous example, our *pokemon* object can have as many properties as we want defined after the *id* property, they will all be collected by the rest parameter.

Now that we know how the rest parameter works, and how to apply it in destructuring assignments, let's return to dealing with **default properties**.


---

## Adding default properties
Sometimes, we have a large amount of similar objects, that aren't quite exactly the same. Some of them lack properties that the other objects do have. However, we need all of our objects to **have the same properties**, simply for the sake of order and coherence. How can we achieve this? 

By setting **default properties**. These are properties with a **default value** that will be added to our object, if it doesn't already have that property. By using the **rest parameter** combined with **default values** and the **spread operator**, we can add default properties to an object.  It may sound a bit daunting, but it's actually quite simple. Here's an example of how to do it:

```javascript
const pokemon = {
  name: 'Squirtle',
  type: 'Water',
  abilities: ['Torrent', 'Rain Dish']
};

const { abilities = [], ...rest } = pokemon;
const fullSquirtle = { ...rest, abilities };

console.log(rest); //Result: { name: 'Squirtle', type: 'Water' }
//Since the pokemon object already has the abilities property, it isn't modified:
console.log({ fullSquirtle }); //Result: { name: 'Squirtle', type: 'Water', abilities: ['Torrent', 'Rain Dish'] }
```

[View default-property.js on GitHub Gist](https://gist.github.com/NyaGarcia/e9c37542f261d1ee6357a4e15fdf9ce8)

What's going on in the previous code fragment? Let's break it down:

As you can see, when we destructure the abilities property, we are adding a default value (**[]**). As we already know, the default value **will only be assigned to the abilities variable if it doesn't exist in the pokemon object**. In the same line, we are gathering the **remaining properties** (name and type) of the *pokemon* object into a variable named rest, by making use of the awesome **rest parameter**. 

On line 7, we are **spreading** the rest variable (which, as you can see, is an object containing the name and type properties) inside an object literal, to generate a new object. We are also adding the *abilities* variable, which in this case, is an **empty array**, since that is what we specified as its default value on the previous line.

In the case of our original *pokemon* object already having an *abilities* property, the previous code **would not have modified it**, and it would **maintain its original value**.

So, this is how we add default properties to an object. Let's place the previous code into a function, and apply it to a large collection of objects:

```javascript
const pokemon = [
  {
    name: 'Charmander',
    type: 'Fire'
  },
  { name: 'Squirtle', type: 'Water', abilities: ['Torrent', 'Rain Dish'] },
  {
    name: 'Bulbasur',
    type: 'Plant'
  }
];

function setDefaultAbilities(object) {
  const { abilities = [], ...rest } = object;
  return { ...rest, abilities };
}

// Applying the setDefaultAbilities function to all the pokemon in the array:
const normalizedPokemon = pokemon.map(pokemon => setDefaultAbilities(pokemon));

console.log(normalizedPokemon);
//Result: [ { name: 'Charmander', type: 'Fire', abilities: [] },   { name: 'Squirtle', type: 'Water', abilities: [ 'Torrent', 'Rain Dish' ] }, { name: 'Bulbasur', type: 'Plant', abilities: [] } ]
```

[View default-property-function.js on GitHub Gist](https://gist.github.com/NyaGarcia/01e0bbe488f8bdaf76b77857d7a4216c)

As you can see, all the pokemon in the array now have an abilities property. In the case of *charmander* and *bulbasur*, they have an empty array, since that is the default value we assigned. However, the *squirtle* object **maintains its original array of abilities**. 

There are, of course, other ways of adding default properties to an object, mainly by using if statements. However, I wanted to show an interesting new way of doing it, by using a combination of default values, the rest parameter, and the spread operator. You can then choose which approach suits you best :)


---

## Conclusion
This is the second and final part of the **Understanding the JavaScript Spread Operator - From Beginner to Expert** tutorial. Here's a link to the [first part](/journal/devto/understanding-the-javascript-spread-operator-from-beginner-to-expert-5bdb/).

In this second part of the tutorial we have learnt some more advanced uses of the spread operator, which include destructuring nested elements, adding conditional properties and adding default properties. We have also learnt three interesting JS concepts: short-circuiting, default destructuring values and the rest parameter. 

I sincerely hope you've found this piece useful, thank you for reading :) If you can think of any more uses of the spread operator or would like to comment something, don't hesitate to reach out, here's a link to my [Twitter page](https://twitter.com/nyablk).
