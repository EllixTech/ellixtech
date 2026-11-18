---
title: "Parameterized tests with Jasmine"
description: "Use parameterized tests to cover different inputs and edge cases with Jasmine"
date: "2018-12-27"
category: "JavaScript"
tags: ["JavaScript", "Jasmine", "Unit Testing", "Parameterized Tests", "Tests"]
minutes: 4
lang: "en"
art: "types"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/@nyablk97/parameterized-tests-with-jasmine-ecadb2856980"
sourceName: "Medium"
---

> **From the Jasmine docs:** Jasmine is a behavior-driven development framework for testing JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. And it has a clean, obvious syntax so that you can easily write tests.

If you’ve found your way into this article, you’re probably a JavaScript developer fed up with writing tests. Unit testing is, after all, very time consuming, and so, so redundant. So, how can we make writing tests easier and less arduous?

## Parameterized tests

What exactly are parameterized tests and why should we be using them? Well, basically they allow us to execute one test as many times as we want, each with a set of different input and output values (parameters), without having to rewrite our test a million times. Very, very useful, people.

The best part is that parameterized tests allow us to handle edge cases so easily. After first testing your code with a set of normal variables, you can then add all the edge cases, such as empty strings, negative values, uncommon unicode characters, nulls, 0’s etc.

So, now that we know what they are and why they are such an advantage to us when testing, let’s get coding.

## Let the coding begin

For example, let us consider the following Jasmine test, where we want to test our function “isValidName” with three different input values:

![Why so redundant](/images/articles/medium/a065688383713e5f.png)

Why so redundant

As you can see in the above, we’ve had to write the same test three times, one for each of the values we wanted to test. Very laborious. Plus, in this example, we only happen to be testing three different input values, but what if we wanted to test ten values? Or twenty?

This approach leads to redundancy, with the same test written again and again for each case scenario. Highly inefficient, we could be spending our time on more important tasks. Here’s where our parameterized tests come in.

## Adding parameters

If you, like me, began your testing journey with JUnit and its wonderful “@ParameterizedTest” you will be disappointed to find out that Jasmine has no such thing. However, there is a pretty simple solution to this problem. Take the following code:

![Looking good](/images/articles/medium/0391ffe2df0d119f.png)

Looking good

As you can see, we have merely taken our previous (large, redundant and time consuming) test and rewritten it as a list comprising a description, input and output parameters.

**Tip:** **Writing a proper description is very important. We must be able to tell which one of our test cases is being executed, and its expected result, just by reading the description.**

By using a simple forEach loop, we can execute the same number of test cases as before, without the bother of having to write out an individual test for each input value, like so:

![Looking better](/images/articles/medium/f715b439c3975c27.png)

Looking better

With this approach, we can add as many test cases as we need, simply by adding a new line to our list of parameters:

![Parameterized tests FTW](/images/articles/medium/4c1d747924b76658.png)

Parameterized tests FTW

In just ten lines of code, we’re testing five different sets of values. This is especially useful when we have to test functions that handle a large range of inputs. Just imagine if he had to write individual tests for a set of 20 input values, we’d end up with over 100 lines of code, and plenty of valuable time spent.

## Conclusion

That’s all folks! As I hope you’ve been able to see, parameterizing tests with jasmine is simple, efficient, and most importantly, it’s pretty easy. For more info on Jasmine testing framework, check [this](https://jasmine.github.io/) out.

You can also read up on Jest, which is a Jasmine fork, and if I remember correctly, it incorporates test parameterization. Read more about Jest [here](https://jestjs.io).

P.S. This has been my first ever article! Hopefully, the first of many. I hope you’ve enjoyed it, and if you’ve found it useful, please feel free to share with others or leave a comment. :) Oh, and you can also check out my [twitter](https://twitter.com/NyaBlk) page.
