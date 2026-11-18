---
title: "How to Lint Commit Messages with Husky and CommitLint"
description: "Take your commits to the next level with CommitLint"
date: "2022-07-16"
category: "Developer tools"
tags: ["Programming", "Github", "Vscode", "Git", "Coding"]
minutes: 4
lang: "en"
art: "terminal"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/better-programming/how-to-lint-commit-messages-with-husky-and-commitlint-b51d20a5e514"
sourceName: "Medium"
coverImage: "/images/articles/medium/9f21d8bf7057d301.jpg"
---

Photo by [Brett Jordan](https://unsplash.com/@brett_jordan?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

## Introduction

How many times have you come across a git log that looks like this?

![git log — oneline](/images/articles/medium/3a29e1e39765c282.png)

git log — oneline

More than you’d like, right? We developers have a tendency to become lazy, and not put much effort into things we don’t consider important (which is mostly everything outside of our code). However, it is absolutely impossible to understand what is going on in our repository from these undecipherable commits. This makes it very difficult for teams to work together effectively.

So, if maintaining a clean git log is so important, how do we do it? How can we force ourselves to write better, cleaner and semantic commits which are easy to understand at a glance?

Behold, the ultimate commit linting tool: [CommitLint](https://commitlint.js.org/#/).

This tutorial will show you how to install and configure CommitLint, together with [Husky](https://typicode.github.io/husky/#/).

### Index

- Installing CommitLint
- Installing Husky
- Testing

## Installing CommitLint

CommitLint is a commit linting tool that will force us to write beautiful commits. How does it do this?

CommitLint works with something called conventions, which are basically a series of rules that our commits need to follow. If we try to make a commit that doesn’t follow the convention that we choose, it will fail. You can find a list of all of the available conventions [here](https://github.com/conventional-changelog/commitlint#shared-configuration). For this tutorial, I’ll use the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/), which is based on the [angular convention.](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines) It looks like this:

```text
type(scope?): message
```

To install both CommitLint and config-conventional, let’s run the following command:

```bash
npm i -D @commitlint/{cli,config-conventional}
```

To use the config-conventional rules with CommitLint, we have two options:

1. Create a `.commitlintrc.json` file in your app root, which will extend the config-conventional rules.

2. Create a `commitlint.config.js` file, which will export the config-conventional rules.

*Note: I usually go with the first option, but either one is fine, as long as you don’t do both!*

### Option 1: creating a .commitlintrc.json file

First, we create the file in the root of our application:

```text
touch .commitlintrc.json
```

Then, we extend the config-conventional rules:

```text
{
  "extends": ["@commitlint/config-conventional"]
}
```

Your `.commitlintrc.json` file should look like this:

![.commitlintrc.json file](/images/articles/medium/fd241e0534ce6534.png)

.commitlintrc.json file

### Option 2: creating a commitlint.config.js file

First, we create the file in the root of our app:

```text
touch commitlint.config.js
```

We export the config-conventional rules:

```text
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

That’s all! CommitLint is all set up. It’s time to install husky.

## Installing Husky

Git provides us with a little something called hooks, which we can use to tap into the different stages of the git workflow. Since we want CommitLint to lint our commit messages, we can use the commit-msg hook, which will run every time we try to add a commit message. If the message doesn’t follow the convention, CommitLint will error out, and we’ll have to try again.

The first thing we’re going to do is install husky. We can do so by running the following command:

```bash
npm i -D husky
```

Next, we need to enable Husky’s git hooks, which we can do with this command:

```bash
npx husky install
```

Or, if you have Husky installed globally:

```text
husky install
```

*Tip: If you get the following error:* `fatal: not a git repository (or any parent up to mount point '')`*, it means that you haven’t initialized git, and you have to do so by running the* `git init` *command.*

If all goes well, you’ll see the following message in your terminal:

![Husky installed correctly](/images/articles/medium/bb6ea60c55bb3724.png)

Husky installed correctly

After running the command, you should have a new hidden directory in the app root, named `.husky`, which contains Husky’s config. Once we’ve made sure it’s there, we can forget all about it, since we won’t need to edit it ourselves.

Finally, we need to add the commit-msg hook:

```bash
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

*Note: It’s very important that you use single quotes to specify the command, because if you use double quotes the* `$1` *will be escaped.*

If all went well, you should have the following output in your terminal:

![Husky’s commit-msg hook added correctly](/images/articles/medium/0b9465880c2f552d.png)

Husky’s commit-msg hook added correctly

We’re done! It’s time to test if it works.

## Testing

Let’s try and commit something without following the convention:

![Failing commit](/images/articles/medium/e22de4714809929c.png)

Failing commit

As you can see, our commit fails. Let’s try again with a commit that does follow the convention:

![Passing commit](/images/articles/medium/6e3ce7de8edfdabb.png)

Passing commit

Well done! You’ve successfully added CommitLint and Husky to your project!

## Conclusion

That’s all folks! If all went well while following this tutorial, your git log is about to become beautiful and sparkling clean (and your team members will love you for it).

You can find the source code for this repo [here](https://github.com/puntotech/husky-commitlint-setup).

Thanks for reading.
