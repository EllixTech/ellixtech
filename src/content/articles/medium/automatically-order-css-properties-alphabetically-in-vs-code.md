---
title: "Automatically Order CSS Properties Alphabetically in VS Code"
description: "Keep your CSS rules in order"
date: "2022-05-13"
category: "Developer tools"
tags: ["Vscode", "CSS", "Programming", "Coding", "Web Development"]
minutes: 3
lang: "en"
art: "terminal"
author: "Estefanía García Gallardo"
sourceUrl: "https://medium.com/better-programming/automatically-order-css-properties-alphabetically-in-vs-code-ec52392e5237"
sourceName: "Medium"
coverImage: "/images/articles/medium/4947591611413db7.jpg"
---

Photo by [Sven Brandsma](https://unsplash.com/@seffen99?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com?utm_source=medium&utm_medium=referral)

## Introduction

One of the most important things when working with a team of developers is to maintain consistency throughout the project. Following conventions and applying best practices makes it much easier for you to work effectively as a team. In my experience, stylesheets are often neglected when it comes to applying best practices.

I’ve seen plenty of projects where CSS properties are randomly ordered. This may seem like something unimportant, but it is in fact very much so. Following a particular ordering system improves legibility, development speed and most importantly, avoids absurd, time-consuming merge conflicts.

However, sorting our CSS properties by hand is obviously not a maintainable solution, it should be done automatically. That is exactly what you will learn in this tutorial: how to automatically sort CSS, SCSS, LESS and PostCSS properties on save.

### Index

- VS Code PostCSS sorting extension
- Formatting on save
- Supporting several languages
- Conclusion

## VS Code PostCSS Sorting extension

VS Code PostCSS is a VS Code plugin that allows us to sort CSS rules content according to the specified order. It supports CSS, PostCSS, Less, and SCSS.

To set it up, follow these steps:

1. Open the `settings.json` file.

*Tip: To open files quickly in VS Code, you can press F1 and search for whatever you’re looking for. In this case, search for settings, and select the ‘Preferences: Open Settings (JSON)’ option, to open the* `settings.json` *file.*

2. Paste the following code into the file:

```text
"postcssSorting.config": {
  "properties-order": "alphabetical",
}
```

Et voilà, we’re done. To test if it works, we can open a CSS file that contains unordered properties, press F1, and run the `PostCSS Sorting: Run` command, like this:

![Automatically Order CSS Properties Alphabetically in VS Code illustration](/images/articles/medium/ba4aa820c07fd4ce.gif)

Awesome! Our CSS properties are now sorted alphabetically. However…

## Formatting on save

What we have so far is pretty good, but it would be even better if the files were automatically formatted on save. Sadly, this feature isn’t supported by the extension.

But we’re developers, aren’t we? We can always find a solution! To solve this issue, we can use [ryuta46’s VS Code multi-command extension](https://github.com/ryuta46/vscode-multi-command), which allows us to create a command sequence as a single command and bind it to a key.

To set it up:

1. Open the `keybindings.json` file.

Tip: Press F1, search for keyboard shortcuts, and select the ‘Preferences: Open Keyboard Shortcuts (JSON)’ option to open the `keybindings.json` file.

2. Add the following configuration object to the existing array (don’t forget to save the file!):

```jsonc
 {
    "key": "ctrl+s",
    "command": "extension.multiCommand.execute",
    "args": {
      "sequence": ["postcssSorting.execute", "workbench.action.files.save"]
    },
    "when": "editorLangId == css"
  },
  {
    "key": "ctrl+meta+s",
    "command": "workbench.action.files.saveFiles"
  }
```

[View keybindings.json on GitHub Gist](https://gist.github.com/NyaGarcia/e82fde47a697467d76b12240d13078c8)

keybindings.json file

We’re done! It’s time to test and see if it works. Let’s go back to our unordered CSS file, and save it:

![Sorting CSS file on save](/images/articles/medium/d4b7c82129df8435.gif)

Sorting CSS file on save

Awesome! We now have automatic alphabetical sorting on save, on our CSS files. But what if we have different projects with SASS or LESS and we also want to implement automatic sorting?

## Supporting several languages

Easy peasy lemon squeezy! All we have to do is add an `||` statement to the when clause, and add the language identifier.

You can find a list of all the VS Code language identifiers [here](https://code.visualstudio.com/docs/languages/identifiers). So, if we want to also enable automatic sorting for SCSS files, our file should look like this:

```jsonc
 {
    "key": "ctrl+s",
    "command": "extension.multiCommand.execute",
    "args": {
      "sequence": ["postcssSorting.execute", "workbench.action.files.save"]
    },
    "when": "editorLangId == css || editorLangId == scss"
  },
  {
    "key": "ctrl+meta+s",
    "command": "workbench.action.files.saveFiles"
  }
```

[View keybindings.json on GitHub Gist](https://gist.github.com/NyaGarcia/2ddfb71eefe62a53f67258d8b1e4e53e)

keybindings.json

Let’s test it:

![Sorting SCSS file on save](/images/articles/medium/79f4cc5d828436e4.gif)

Sorting SCSS file on save

## Conclusion

That’s all folks! Hopefully, your VS Code is all set up to automatically order any kind of stylesheet files alphabetically, and your teammates will appreciate you very much for leveling up the consistency in your project.

I hope you both enjoyed this tutorial and found it useful. Thank you for reading.
