---
title: "The Art of Refactoring: 5 tips to Write Better Code"
description: "Five refactoring tips to write better code"
date: "2019-10-10T20:16:16Z"
category: "JavaScript"
tags: ["javascript", "codenewbie", "beginners", "webdev"]
minutes: 8
lang: "en"
art: "types"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/the-art-of-refactoring-5-tips-to-write-better-code-12if"
coverImage: "/images/articles/devto/2caac6d9cc567590.jpg"
---

---



Bad code works. We all know this. Developers have been writing code for years without giving a single thought to whether they were doing it right or not. It's understandable, isn't it? After all, we already have to deal with the stress of keeping up with the industry and the demands of our job… 

The answer is **no**. Writing bad code comes at a **price**. Have you ever faced the issue of **not understanding your own code** after a couple of weeks, and having to spend hours, or even days figuring out what was going on? 


The solution to this (extremely) common problem is to make your code as **clear** and **informative** as possible. I will go as far as to say that your code should be understood even by a non-technical person. It's time to drop our excuses, and improve the quality of your code. 

Writing clean code isn't that complicated. This tutorial will show you 5 simple techniques to improve your code, with practical examples:

1. Get rid of switch statements
2. Make your conditionals descriptive
3. Use guard clauses to avoid nested if statements
4. Avoid code duplication
5. Functions should only do one thing



---

## Get rid of switch statements
We normally use switch statements to avoid large if else if statements. However, switch statements are very **verbose**, hard to **maintain** and even harder to **debug**. They clutter up our code, and, in my humble opinion, have an odd, uncomfortable syntax. When adding more cases, we have to **manually add each case and break statement**, which is quite error-prone. 

Let's take a look at an example of a switch statement:

```javascript
function getPokemon(type) {
  let pokemon;
  switch (type) {
    case 'Water':
      pokemon = 'Squirtle';
      break;
    case 'Fire':
      pokemon = 'Charmander';
      break;
    case 'Plant':
      pokemon = 'Bulbasur';
      break;
    case 'Electric':
      pokemon = 'Pikachu';
      break;
    default:
      pokemon = 'Mew';
  }
  return pokemon;
}

console.log(getPokemon('Fire')); // Result: Charmander
```

[View switch-statement.js on GitHub Gist](https://gist.github.com/NyaGarcia/f3f9b055298880d05616c25eaaf84a1c) 

Imagine that we need to add more cases to the switch statement. The amount of code that we would have to write is **considerable**. We would probably end up copy-pasting code, and we all know how that ends. 

So, how do we avoid switch statements? By using an **object literal**. Object literals are simple, easy to write, read and maintain. We are all used to handling objects in JavaScript, and the syntax is a lot fresher than that of the switch statement. Here is an example:

```javascript
const pokemon = {
    Water: 'Squirtle',
    Fire: 'Charmander',
    Plant: 'Bulbasur',
    Electric: 'Pikachu'
  };

function getPokemon(type) {
  return pokemon[type] || 'Mew';
}
console.log(getPokemon('Fire')); // Result: Charmander

// If the type isn't found in the pokemon object, the function will return the default value 'Mew'
console.log(getPokemon('unknown')); // Result: Mew
```

[View replace-switch-object.js on GitHub Gist](https://gist.github.com/NyaGarcia/7acbeb0c738932c38114a9bab9261af6) 

As you can see, we can add a **default** value by using the **|| operator**. If the type isn't found in the *pokemon object*, the *getPokemon* function will return 'Mew' as a default value.

> **Note:** As you will probably have noticed, we declare the pokemon object **outside the function**, instead of inside. We do this to prevent it from being created each time we execute the function. 

We can also use a **map** to achieve the same result. A map is a collection of key value pairs, just like an object. The difference is that map allows **keys of any type**, while objects only allow strings as keys. Also, map has an interesting series of properties and methods. You can read more about the map structure [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

Here's how to use map:

```javascript
const pokemon = new Map([
    ['Water', 'Squirtle'],
    ['Fire', 'Charmander'],
    ['Plant', 'Bulbasur'],
    ['Electric', 'Pikachu']
  ]);

function getPokemon(type) {
  return pokemon.get(type) || 'Mew';
}

console.log(getPokemon('Fire')); // Result: Charmander
console.log(getPokemon('unknown')); // Result: Mew
```

[View replace-switch-map.js on GitHub Gist](https://gist.github.com/NyaGarcia/fd8f782a1ad85322f9c9a20f771e93c2) 


As you can see, our code looks a lot cleaner and straightforward when replacing switch statements with an object literal or map. 


---

## Make your conditionals descriptive
Conditional statements are an absolute necessity when writing code. However, they can quickly get out of hand, and end up being impossible to understand. This leads to either having to **write comments** explaining what the statement does, or having to spend valuable time tracing back our own code to understand what's going on. **This is bad.**

Take a look at the following statement:

```javascript
function checkGameStatus() {
  if (
    remaining === 0 ||
    (remaining === 1 && remainingPlayers === 1) ||
    remainingPlayers === 0
  ) {
    quitGame();
  }
}
```

[View complex-conditional.js on GitHub Gist](https://gist.github.com/NyaGarcia/9b39efabb3bc913c953719cc60f28d66) 

If we only look at the code inside the if statement in the previous function, it's difficult to understand what's going on. Our code isn't clear, and **unclear code leads only to technical debt, bugs,** and **significant headaches.**
 
How can we improve our conditional? By **extracting it into a function.** Here's how:

```javascript
function isGameLost() {
  return (
    remaining === 0 ||
    (remaining === 1 && remainingPlayers === 1) ||
    remainingPlayers === 0
  );
}

// Our function is now much easier to understand:
function checkGameStatus() {
  if (isGameLost()) {
    quitGame();
  }
}
```

[View extracting-conditional.js on GitHub Gist](https://gist.github.com/NyaGarcia/4f93b44dcee6980d113413c2efc681a6) 

By extracting the conditional into a function with a descriptive name: isGameLost(), our checkGameStatus function is now understandable at a glance. Why? Because our code is informative, it tells us what is going on, which is what we should always strive for. 


---

## Use guard clauses to avoid nested if statements
Nested if statements are one of the worst things we can encounter in code. I've seen nested ifs 10 levels deep… Believe me when I tell you that it was an absolute nightmare to be able to fully grasp what was going on in that code. Here's an example of a nested if statement (only three levels deep though, I'm not a monster):

```javascript
function publishTweet(tweet) {
  if (isLoggedIn()) {
    if (tweet) {
      if (isTweetDoubleChecked()) {
        tweetIt(tweet);
      } else {
        throw new Error('Dont publish without double checking your tweet');
      }
    } else {
      throw new Error("Your tweet is empty, can't publish it");
    }
  } else {
    throw new Error('You need to log in before tweeting');
  }
}
```

[View nested-if.js on GitHub Gist](https://gist.github.com/NyaGarcia/f7eb0f30d93011ce2d52771daf3dd3ce) 

You probably have to take a couple of minutes, and read up and down to follow the flow of the function. Nested if statements are hard to both read and understand. So, how do we get rid of the nasty nested if statement? By reversing the logic and using what we call a **guard clause.**

> In computer programming, a **guard** is a boolean expression that must evaluate to true if the program execution is to continue in the branch in question. - **Wikipedia**

By reversing the logic of our function, and placing the conditions that cause an **early exit** in the **beginning** of the function, they will act as **guards**, and only allow our function to continue executing if all the **conditions are met**. This way, we can avoid else statements. Here's how to refactor our previous function to use guard clauses:

```javascript
function publishTweet(tweet) {

  if (!isLoggedIn()) {
    throw new Error('You need to log in before tweeting');
  }
  if (!tweet) {
    throw new Error("Your tweet is empty, can't publish it");
  }
  if (!isTweetDoubleChecked()) {
    throw new Error('Dont publish without double checking your tweet');
  }

  tweetIt(tweet);
}
```

[View guard-clauses.js on GitHub Gist](https://gist.github.com/NyaGarcia/eff7c4d3e918111b346a268e9185c2ae)

As you can see, the code is a lot cleaner and easier to understand. We can see what the function does simply by reading down, following the **natural flow** of the function, unlike before, where we had to read up and down. 


---

## Avoid code duplication
Duplicating code **always** ends badly. It leads to situations such as: "I fixed this bug here, but forgot to do it there" or "I need to make a change/add a new feature, and have to do it in five different places". 
Just as the [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself) (don't repeat yourself) principle states: 

**Every piece of knowledge or logic must have a single, unambiguous representation within a system.**

Therefore, having **less code is good**: It saves us both **time** and **effort**, is easier to maintain, and reduces the chances of bugs appearing.

So, how do we get rid of duplicated code? The answer is not always simple, but **extracting logic to functions/variables** usually works just fine. Let's take a look at the following code, which I ran across when refactoring an application:

```javascript
function getJavascriptNews() {
    const allNews = getNewsFromWeb();
    const news = [];
 
    for (let i = allNews.length - 1; i >= 0; i--){
        if (allNews[i].type === "javascript") {
            news.push(allNews[i]);
        }
    }
 
    return news;
}
 
function getRustNews() {
    const allNews = getNewsFromWeb();
    const news = [];
 
    for (let i = allNews.length - 1; i >= 0; i--){
        if (allNews[i].type === "rust") {
            news.push(allNews[i]);
        }
    }
 
    return news;
}

function getGolangNews() {
  const news = [];
  const allNews = getNewsFromWeb();

  for (let i = allNews.length - 1; i >= 0; i--) {
    if (allNews[i].type === 'golang') {
      news.push(allNews[i]);
    }
  }

  return news;
}
```

[View duplication.js on GitHub Gist](https://gist.github.com/NyaGarcia/7f19fcd5211dc9b99fa1a957c9219f68)

You'll probably have noticed that the for loop is **exactly the same in both functions**, except for one little detail: the type of news that we want, which is either *JavaScript* or *Rust* news. To avoid this duplication, we can **extract the for loop into a function**, which we then call from the *getJavascriptNews*, *getRustNews* and *getGolangNews* functions. Here's how:

```javascript
function getJavascriptNews() {
  const allNews = getNewsFromWeb();
  return getNewsContent(allNews, 'javascript');
}

function getRustNews() {
  const allNews = getNewsFromWeb();
  return getNewsContent(allNews, 'rust');
}

function getGolangNews() {
  const allNews = getNewsFromWeb();
  return getNewsContent(allNews, 'golang');
}

function getNewsContent(newsList, type) {
  const news = [];
  for (let i = newsList.length - 1; i >= 0; i--) {
    if (newsList[i].type === type) {
      news.push(newsList[i].content);
    }
  }
  return news;
}
```

[View fixing-duplication.js on GitHub Gist](https://gist.github.com/NyaGarcia/efe7a11350dea16fe673615b99c93c48)

After extracting the for loop into the getNewsContent function, our *getJavascriptNews*, *getRustNews* and *getGolangNews* functions have turned into **simple, clear one liners**.

#### Further refactoring
However, have you realized that, once again, both functions are **exactly the same except for the type string** that we pass into the *getNewsContent* function? This is something that usually happens when we refactor our code. More often than not, one change leads to another change, and so on, until our refactored code ends up being half the size of the original. **Let your code tell you what it needs:**

```javascript
function getNews(type) {
  const allNews = getNewsFromWeb();
  return getNewsContent(allNews, type);
}

function getNewsContent(newsList, type) {
  const news = [];
  for (let i = newsList.length - 1; i >= 0; i--) {
    if (newsList[i].type === type) {
      news.push(newsList[i].content);
    }
  }
  return news;
}
```

[View fixing-duplication.js on GitHub Gist](https://gist.github.com/NyaGarcia/b529b5ab8f7bbc8473a73e92243eb1cb)

Further refactoringWhere did our *getJavascriptNews*, *getRustNews* and *getGolangNews* functions go? We substituted them for a getNews function, which **receives the type of news** as an argument. This way, no matter how many more types of news we add, we always use the same function. This is called **abstraction**, and allows us to **reuse functions**, thus being incredibly useful. Abstraction is  one of the techniques I use most frequently in my code.

#### Bonus: Make the for loop more readable with ES6 features
This is the last refactoring, I swear. 
For loops aren't precisely readable. With the introduction of ES6 Array functions, we can avoid using them 95% of the time. In our case, we can use **Array.filter** combined with **Array.map** to substitute the original loop:

```javascript
function getNews(type) {
  const allNews = getNewsFromWeb();
  return getNewsContent(allNews, type);
}

function getNewsContent(newsList, type) {
  return newsList
    .filter(newsItem => newsItem.type === type)
    .map(newsItem => newsItem.content);
}
```

[View substitute-for.js on GitHub Gist](https://gist.github.com/NyaGarcia/157254f4d9be381134bf62698c0a2df0)


- With Array.filter we return only the elements whose **type equals the type passed as an argument.**
 
- With Array.map, we return only the **content** property of the item object, instead of the whole item. 

Congratulations, after three simple refactorings, our initial three functions have been reduced to two, which are much easier to understand and maintain. Also, by using abstraction, we made the *getNews* function **reusable.**


---

## Functions should only do one thing
Functions should only do one thing, and one thing only. Functions that do more than one thing are the **root of all evil**, and one of the worst things we can encounter in code (together with nested ifs). They are **messy**, and make our code **hard to understand**. Here's an example of a complex function from a real application:

```javascript
function startProgram() {
  if (!window.indexedDB) {
    window.alert("Browser not support indexeDB");
  } else {
    let openRequest = indexedDB.open("store", 1);
 
    openRequest.onupgradeneeded = () => {};
 
    openRequest.onerror = () => {
      console.error("Error", openRequest.error);
    };
 
    openRequest.onsuccess = () => {
      let db = openRequest.result;
    };
 
    document.getElementById('stat-op').addEventListener('click', () => {});
    document.getElementById('pre2456').addEventListener('click', () => {});
    document.getElementById('cpTagList100').addEventListener('change', () => {});
    document.getElementById('cpTagList101').addEventListener('click', () => {});
    document.getElementById('gototop').addEventListener('click', () => {});
    document.getElementById('asp10').addEventListener('click', () => {});
 
    fetch("employeList.json")
      .then(res => res.json())
      .then(employes => {
        document.getElementById("employesSelect").innerHTML = employes.reduce(
          (content, employe) => employe.name + "<br>",
          ""
        );
      });
 
    document.getElementById("usernameLoged").innerHTML = `Welcome, ${username}`;
  }
}
```

[View complex-function.js on GitHub Gist](https://gist.github.com/NyaGarcia/9f3cb0310d808fe2dde1ab993d913e3a)

> **Note:** Since the handlers for the event listeners were not needed for this example, I chose to remove them.

As you can see, it's confusing, and hard to understand what's going on in there. If any bugs come up, it will be quite difficult to find and fix them. How can we improve our *startProgram* function? By **extracting common logic into functions.** Here's how:

```javascript
function startProgram() {
  if (!window.indexedDB) {
    throw new Error("Browser doesn't support indexedDB");
  }

  initDatabase();
  setListeners();
  printEmployeeList();
}

function initDatabase() {
  let openRequest = indexedDB.open('store', 1);

  openRequest.onerror = () => {
    console.error('Error', openRequest.error);
  };
  openRequest.onsuccess = () => {
    let db = openRequest.result;
  };
}

function setListeners() {
  document.getElementById('stat-op').addEventListener('click', () => {});
  document.getElementById('pre2456').addEventListener('click', () => {});
  document.getElementById('cpTagList100').addEventListener('change', () => {});
  document.getElementById('cpTagList101').addEventListener('click', () => {});
  document.getElementById('gototop').addEventListener('click', () => {});
  document.getElementById('asp10').addEventListener('click', () => {});
}

async function printEmployeeList() {
  const employees = await getEmployeeList();

  document.getElementById('employeeSelect').innerHTML = formatEmployeeList(employees);
}

function formatEmployeeList(employees) {
  return employees.reduce(
    (content, employee) => content + employee.name + '<br>',
    ''
  );
}

function getEmployeeList() {
  return fetch('employeeList.json').then(res => res.json());
}
```

[View extracting-function-logic.js on GitHub Gist](https://gist.github.com/NyaGarcia/d6a7fd9980af4957decd36bc341d1e33)

Let's go through the changes made to the *startProgram* function:

First, we got rid of the if else statement by using a **guard clause**. Then, we extracted the logic needed to **start the database** into an *initDatabase* function and  the logic to **add event listeners** to a *setListeners* function.

The logic for printing the employee list is slightly more complex, so we created three functions: *printEmployeeList*, *formatEmployeeList*, and *getEmployeeList*.

The *getEmployeeList* is responsible for making a **GET request** to *employeeList.json*, and returning the response in json format. 

It is then called by the *printEmployeeList* function, which takes the list of employees, and passes it to the *formatEmployeeList* function, which formats and returns it. Then, the list is printed. 

As you can see, every function is responsible **for doing only one thing.**

We could still make a few more changes to the function, and honestly, the application is begging for the **separation of the view from the controller**, but on the whole, our *startProgram* function is now more **informative**, and there is absolutely no difficulty in understanding what it does. We would have no problem at all if we had to come back to this code after a couple of months.


---

## Conclusion
Programmers are the only ones responsible for writing good, quality code. We should all make it a habit to write good code from the very first line. Writing clean code **isn't complicated**, and doing so will help both you and your colleagues.

By applying the 5 simple techniques shown in this tutorial, your code quality should **improve considerably**, and so will your productivity. 

If you have any questions, don't hesitate to ask. Thank you for reading.
