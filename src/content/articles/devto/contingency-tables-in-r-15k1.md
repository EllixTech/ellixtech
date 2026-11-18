---
title: "Contingency tables in R"
description: "An overview of contingency tables in R"
date: "2020-03-23T19:07:14Z"
category: "Data Science"
tags: ["datascience", "r", "statistics", "programming"]
minutes: 11
lang: "en"
art: "orbit"
author: "Nya"
sourceUrl: "https://dev.to/nyagarcia/contingency-tables-in-r-15k1"
coverImage: "/images/articles/devto/8b03a9b6a877d941.png"
---

---


## Introduction
Contingency tables are very useful when we need to **condense** a large amount of data into a smaller format, to make it easier to gain an **overall view** of our original data.

To create contingency tables in R we will be making use of the *table()* function. Since *table()* is so versatile, we can build contingency tables from something as simple as character strings, to something as complex as data frame objects. 

Something that we have to keep in mind is the fact that as we add more data, or as the complexity of our data increases, our contingency table will grow more complex too.

As well as the creation of contingency tables, we will cover the calculation of **marginal distributions**, creating a **frequency or percentage** contingency table, and selecting fragments of our table. We will also learn three of the most popular techniques that are used to **test for independence between variables**, and how to calculate the **measures of association** between these same variables.

Here is the index for this tutorial:

**Getting started - Loading data**
**Creating a table object**
**Contingency tables**
- **Selecting parts of a contingency table**
- **Frequencies in contingency tables**
- **Calculating marginal distributions**

**Testing for Independence**
- **The Chi-Square test**
- **Fisher's Exact test**
- **The G-Test**

**Measures of Association**
- **The Phi Coefficient**
- **Cramer's V and Tschuprow's T**

**Conclusion**

---

## Getting started - Loading data

Before we begin with contingency tables, I would like to briefly discuss creating table objects in R. This way, we will be able to truly appreciate the advantages that contingency tables have (when our goal is overall legibility) over traditional tables. 

In order for us to be on the same page, I would propose using the following built-in R dataset: **mtcars**, although you can use a different one if you wish to. 

> **Tip:** To load a built-in R dataset, you can use data(), as follows: data(mtcars). To check if the data has been loaded correctly, simply type the name of the dataset, and you should see a preview on your console.

```r
> data("mtcars")
> mtcars
                     mpg cyl  disp  hp drat    wt  qsec vs am gear carb
Mazda RX4           21.0   6 160.0 110 3.90 2.620 16.46  0  1    4    4
Mazda RX4 Wag       21.0   6 160.0 110 3.90 2.875 17.02  0  1    4    4
Datsun 710          22.8   4 108.0  93 3.85 2.320 18.61  1  1    4    1
Hornet 4 Drive      21.4   6 258.0 110 3.08 3.215 19.44  1  0    3    1
Hornet Sportabout   18.7   8 360.0 175 3.15 3.440 17.02  0  0    3    2
Valiant             18.1   6 225.0 105 2.76 3.460 20.22  1  0    3    1
Duster 360          14.3   8 360.0 245 3.21 3.570 15.84  0  0    3    4
Merc 240D           24.4   4 146.7  62 3.69 3.190 20.00  1  0    4    2
Merc 230            22.8   4 140.8  95 3.92 3.150 22.90  1  0    4    2
Merc 280            19.2   6 167.6 123 3.92 3.440 18.30  1  0    4    4
Merc 280C           17.8   6 167.6 123 3.92 3.440 18.90  1  0    4    4
Merc 450SE          16.4   8 275.8 180 3.07 4.070 17.40  0  0    3    3
Merc 450SL          17.3   8 275.8 180 3.07 3.730 17.60  0  0    3    3
Merc 450SLC         15.2   8 275.8 180 3.07 3.780 18.00  0  0    3    3
Cadillac Fleetwood  10.4   8 472.0 205 2.93 5.250 17.98  0  0    3    4
Lincoln Continental 10.4   8 460.0 215 3.00 5.424 17.82  0  0    3    4
Chrysler Imperial   14.7   8 440.0 230 3.23 5.345 17.42  0  0    3    4
Fiat 128            32.4   4  78.7  66 4.08 2.200 19.47  1  1    4    1
Honda Civic         30.4   4  75.7  52 4.93 1.615 18.52  1  1    4    2
Toyota Corolla      33.9   4  71.1  65 4.22 1.835 19.90  1  1    4    1
Toyota Corona       21.5   4 120.1  97 3.70 2.465 20.01  1  0    3    1
Dodge Challenger    15.5   8 318.0 150 2.76 3.520 16.87  0  0    3    2
AMC Javelin         15.2   8 304.0 150 3.15 3.435 17.30  0  0    3    2
Camaro Z28          13.3   8 350.0 245 3.73 3.840 15.41  0  0    3    4
Pontiac Firebird    19.2   8 400.0 175 3.08 3.845 17.05  0  0    3    2
Fiat X1-9           27.3   4  79.0  66 4.08 1.935 18.90  1  1    4    1
Porsche 914-2       26.0   4 120.3  91 4.43 2.140 16.70  0  1    5    2
Lotus Europa        30.4   4  95.1 113 3.77 1.513 16.90  1  1    5    2
Ford Pantera L      15.8   8 351.0 264 4.22 3.170 14.50  0  1    5    4
Ferrari Dino        19.7   6 145.0 175 3.62 2.770 15.50  0  1    5    6
Maserati Bora       15.0   8 301.0 335 3.54 3.570 14.60  0  1    5    8
Volvo 142E          21.4   4 121.0 109 4.11 2.780 18.60  1  1    4    2
```

[View loaddataset.r on GitHub Gist](https://gist.github.com/NyaGarcia/57f46bd43fac1d9ad6c4b304c6e53da8) 

Once we have loaded our data, we can start building tables.

---

## Creating a table object
Let us begin by taking a look at the number of gears that each car model has. To do this, we will use the $ syntax:

```r
> mtcars$gear
 [1] 4 4 4 3 3 3 3 4 4 4 4 3 3 3 3 3 3 4 4 4 3 3 3 3 3 4 5 5 5 5 5 4
```

[View gears.r on GitHub Gist](https://gist.github.com/NyaGarcia/af272cb1f2d6dd5c5ae4d63690cbb2d7)

It's a bit difficult to read, isn't it? If we use *table()*, the information will be much more readable:

```r
> table(mtcars$gear)

 3  4  5 
15 12  5
```

[View gearsTable.r on GitHub Gist](https://gist.github.com/NyaGarcia/d39daa8c658d20d61310cd9b671d4d2e)

It looks a lot better this way, doesn't it? We can now tell, at a glance, that there are 15 cars with 3 gears, 12 cars with 4 gears and 5 cars with 5 gears. 

Now let's take a look at the number of cylinders for each car. As previously, we will first show all the data at once, and then use *table()* to summarize it:

```r
> mtcars$cyl
 [1] 6 6 4 6 8 6 8 4 4 6 6 8 8 8 8 8 8 4 4 4 4 8 8 8 8 4 4 4 8 6 8 4

> table(mtcars$cyl)

 4  6  8 
11  7 14 
```

[View cylinders.r on GitHub Gist](https://gist.github.com/NyaGarcia/b09a975cc15e41fc75d5b3a21c9947cd)

Simple enough, right? Let's take it one step further. What if we want to see the number of gears that each car has, **in relation to the number of cylinders?** Here is where contingency tables come in. 

---

## Contingency tables
Following the previous examples, we will create a contingency table showing the number of gears of each car, related to their number of cylinders. How do we do this? By once again, using *table()*, this time with two arguments: The first argument will correspond to the **rows**, and the second to the **columns**:

```r
table(mtcars$gear, mtcars$cyl)
   
     4  6  8
  3  1  2 12
  4  8  4  0
  5  2  1  2
```

[View contingency.r on GitHub Gist](https://gist.github.com/NyaGarcia/f506c2b019224cef987b922facd6d5e3)

As you can see, each **row** corresponds to each of the *gear* values, which are 3,4 and 5. Each **column** corresponds to each of the *cyl* values, which are 4, 6 and 8. We can now easily know that there are 12 cars with 3 gears and 8 cylinders, or that there are no cars that have 4 gears and 8 cylinders (this can lead us to ask ourselves if perhaps this combination is mechanically incompatible?)

## Selecting parts of a contingency table
Have you ever tried to select a table property by using the $ notation? Then you'll be familiar with the **$ operator is invalid for atomic vectors** error. Why does this happen? Well, objects of class table  are essentially vectors (arrays) which means that we can't use the $ syntax. This syntax **is only valid for recursive objects**, and vectors are **atomic objects**, hence the error.

How do we interact with tables then? Here are several useful techniques to select and interact with tables:

**str()** - Examines and outputs the structure of a table object. The only drawback to this useful little function is that the output it provides us with is hard to interpret when you see it for the first time, which is why we are going to analyze what is going on with *str()* output. 

```r
> myCars<-table(mtcars$gear, mtcars$cyl)
> str(myCars)
 'table' int [1:3, 1:3] 1 8 2 2 4 1 12 0 2
 - attr(*, "dimnames")=List of 2
  ..$ : chr [1:3] "3" "4" "5"
  ..$ : chr [1:3] "4" "6" "8"
```

[View str.r on GitHub Gist](https://gist.github.com/NyaGarcia/29d77cead44533a969361174f6817308)

Let's break down that nasty output, to be able to understand what's going on:

- In the first line, *str()* is telling us that we have an object of type table: *'table'*, which is a matrix of integers, with three rows and three columns: *int [1:3, 1:3]*, and finally shows us all the values contained in our matrix, grouped by columns *1 8 2 2 4...*

- The strange-looking *attr(*, "dimnames")* code fragment in the second line is there because R stores the names of the columns and rows in an attribute called *dimnames* (dimension names). It also tells us that this *dimnames* attribute is a list of two components: *= List of 2*.

- The *..$ :* in the beginning of the fourth line indicates the beginning of a component, which is a character vector containing three values: *chr [1:3]*, and ends with a list of the three values contained in the vector: *"3" "4" "5"*, which you may have noticed, are the names of the three rows in our table.

- The fifth row is exactly the same as the fourth, save for the values contained in the vector, which are *"4" "6" "8"* and correspond with the names of the three columns of our table.

**length()** - Returns the length of the table object.

**table[x,]** - Returns the xᵗʰ row:

```r
> myCars[1,]
 4  6  8 
 1  2 12 
```

[View row.r on GitHub Gist](https://gist.github.com/NyaGarcia/18a39beee10f8a8a0d1ecd52b1dd4854)

**table[1:x,]** - Returns the first x rows of the table:

```r
> myCars[1:2,]
   
     4  6  8
  3  1  2 12
  4  8  4  0
```

[View rows.r on GitHub Gist](https://gist.github.com/NyaGarcia/2fd326030fe867826cb989c2609ee27c)

**table[1:x,1:y]** - Returns the first x rows of the first y columns:

```r
> myCars[1:2,1:2]
   
    4 6
  3 1 2
  4 8 4
```

[View rows-cols.r on GitHub Gist](https://gist.github.com/NyaGarcia/e1cc029b7d608fd80e0cbd9ef5fb0f37)

**table["3",]** - Returns the row named 3:

```r
> myCars["3",]
 4  6  8 
 1  2 12 
```

[View named-row.r on GitHub Gist](https://gist.github.com/NyaGarcia/653175581b2277051d995e543cec7c9a)

**table[,"8"]** - Returns the column named 8:

```r
> myCars[,"8"]
 3  4  5 
12  0  2 
```

[View named-col.r on GitHub Gist](https://gist.github.com/NyaGarcia/83737b999f13c35fd65acb55499bd300)

## Frequencies in contingency tables
Sometimes, we would prefer to display frequencies. By using *prop.table()* together with *table()*, we can create a contingency table of **frequencies**:

```r
prop.table(table(mtcars$gear, mtcars$cyl))
   
          4       6       8
  3 0.03125 0.06250 0.37500
  4 0.25000 0.12500 0.00000
  5 0.06250 0.03125 0.06250
```

[View prop-table.r on GitHub Gist](https://gist.github.com/NyaGarcia/dd4037d8790d15cbdc962aa2f0f55d88)

Would you like to display percentages instead of frequencies? It's as simple as multiplying by 100, like this:

```r
> prop.table(table(mtcars$gear, mtcars$cyl))*100
   
         4      6      8
  3  3.125  6.250 37.500
  4 25.000 12.500  0.000
  5  6.250  3.125  6.250
```

[View percentages.r on GitHub Gist](https://gist.github.com/NyaGarcia/1fdf11b014fd58f655fe4be6e223f596)

## Calculating marginal distributions
Here are several useful functions for calculating marginal distributions in contingency tables:

**addmargins()** -  Will calculate the total values of both columns and rows:  

```r
> addmargins(table(mtcars$gear, mtcars$cyl))
     
       4  6  8 Sum
  3    1  2 12  15
  4    8  4  0  12
  5    2  1  2   5
  Sum 11  7 14  32
```

[View addmargins.r on GitHub Gist](https://gist.github.com/NyaGarcia/949fa4d18ac49f090375384cab1b5720)

**rowSums()** -  Will calculate the total values of each row:

```r
> rowSums(table(mtcars$gear, mtcars$cyl))
 3  4  5 
15 12  5 
```

[View rowSums.r on GitHub Gist](https://gist.github.com/NyaGarcia/cbbf287c49d8fc1838f72ef0f40acc0b)

**colSums()** -  Will calculate the total values of each column:

```r
> colSums(table(mtcars$gear, mtcars$cyl))
 4  6  8 
11  7 14 
```

[View colSums.r on GitHub Gist](https://gist.github.com/NyaGarcia/faf54a1e82016628c54387f72bff481e)

---

## Three-way contingency tables
So far we've worked with a two-way contingency table, but, what if we need to work with three variables? Is it possible? The answer is yes, it is. Let's create a **three-way table** based on the *cyl* and *carb* and *gear* variables:

```r
> table(mtcars$cyl, mtcars$carb, mtcars$gear)
, ,  = 3

   
    1 2 3 4 6 8
  4 1 0 0 0 0 0
  6 2 0 0 0 0 0
  8 0 4 3 5 0 0

, ,  = 4

   
    1 2 3 4 6 8
  4 4 4 0 0 0 0
  6 0 0 0 4 0 0
  8 0 0 0 0 0 0

, ,  = 5

   
    1 2 3 4 6 8
  4 0 2 0 0 0 0
  6 0 0 0 0 1 0
  8 0 0 0 1 0 1
```

[View 3way.r on GitHub Gist](https://gist.github.com/NyaGarcia/445bf40f5474f833174f324301c7b7b4)

As you can see, what is really going on is that we have **three separate two-way contingency tables**, one for each of the gear values. This third *gear* variable is known as a **layer variable**, or as a **control variable**.

> **Hint:** Instead of using *table()*, we could use *ftable()*, for a more concise view of our data.

```r
> ftable(mtcars$cyl, mtcars$carb, mtcars$gear)
     3 4 5
          
4 1  1 4 0
  2  0 4 2
  3  0 0 0
  4  0 0 0
  6  0 0 0
  8  0 0 0
6 1  2 0 0
  2  0 0 0
  3  0 0 0
  4  0 4 0
  6  0 0 1
  8  0 0 0
8 1  0 0 0
  2  4 0 0
  3  3 0 0
  4  5 0 1
  6  0 0 0
  8  0 0 1
```

[View threeway.r on GitHub Gist](https://gist.github.com/NyaGarcia/6594736ec384532945ed1755c48d00bc)

As you can see, at the leftmost of our three-way contingency table, we have our *cyl* rows, followed by the *carb* rows, and on top, we have our *gear* columns. Is it possible to create contingency tables with more variables? The answer is yes, but the complexity will increase as we add more and more variables. Here is an example of a four-way contingency table:

```r
> ftable(mtcars$cyl, mtcars$carb, mtcars$gear, mtcars$vs)
       0 1
          
4 1 3  0 1
    4  0 4
    5  0 0
  2 3  0 0
    4  0 4
    5  1 1
  3 3  0 0
    4  0 0
    5  0 0
  4 3  0 0
    4  0 0
    5  0 0
  6 3  0 0
    4  0 0
    5  0 0
  8 3  0 0
    4  0 0
    5  0 0
6 1 3  0 2
    4  0 0
    5  0 0
  2 3  0 0
    4  0 0
    5  0 0
  3 3  0 0
    4  0 0
    5  0 0
  4 3  0 0
    4  2 2
    5  0 0
  6 3  0 0
    4  0 0
    5  1 0
  8 3  0 0
    4  0 0
    5  0 0
8 1 3  0 0
    4  0 0
    5  0 0
  2 3  4 0
    4  0 0
    5  0 0
  3 3  3 0
    4  0 0
    5  0 0
  4 3  5 0
    4  0 0
    5  1 0
  6 3  0 0
    4  0 0
    5  0 0
  8 3  0 0
    4  0 0
    5  1 0
```

[View fourway.r on GitHub Gist](https://gist.github.com/NyaGarcia/30ee83046daa011ec4c0c70551b93570)

As you can see, it grows more **complex** as we increase the number of variables, and loses legibility in the process. 

---

## Testing for independence
We may want to test the independence of the row and column variables of our contingency table. To achieve this, there are several tests we can perform on our table:

### The Chi-Square test
One of the simplest ways to test for independence is to use the Chi-Square test function: *chisq.test()*

```r
> chisq.test(mtcars$gear, mtcars$cyl)

	Pearson's Chi-squared test

data:  mtcars$gear and mtcars$cyl
X-squared = 18.036, df = 4, p-value = 0.001214

Warning message:
In chisq.test(mtcars$gear, mtcars$cyl) :
  Chi-squared approximation may be incorrect
```

[View chisquare.r on GitHub Gist](https://gist.github.com/NyaGarcia/caa3376f68e6fda491d5ba3a17de618d)

The important value of this test is the **p-value**, which, as you can see, equals 0.001214. Since p-value is below the significance level (which is 5%, or 0.05), it looks like the variables are **not independent**. However…

You may have noticed the warning. This is because the value of at least one of the **expected values** in the contingency table **is below 5**.

> **Important:** please bear in mind that expected values **are not** the values that appear in each cell, they are the result of calculating (row total*column total)/overall total). You can have low cell values in your table, yet have perfectly fine expected values, if you have a large enough sample. 

Therefore, we **shouldn't trust the result of this test**, and should look for a different way to test for independence: in this case, we should use the **Fisher test instead of the Chi-Square test**. Before diving into the Fisher test, I'd like to introduce:

**The Monte Carlo simulation**

What happens if the expected values of our contingency table are below 5, but **we can't use a different test** and have to stick with the Chi-Square test? In these cases, the Monte Carlo simulation is a great alternative. It allows us to perform the Chi-Square test with **simulated values**, that attempt to make up for the low expected values of our table.To achieve this, all we need to do is set the simulate.p.value to true when calling *chisq.test()*:

```r
> chisq.test(mtcars$gear, mtcars$cyl, simulate.p.value = TRUE)

	Pearson's Chi-squared test with simulated p-value (based on 2000
	replicates)

data:  mtcars$gear and mtcars$cyl
X-squared = 18.036, df = NA, p-value = 0.0004998
```

[View montecarlo.r on GitHub Gist](https://gist.github.com/NyaGarcia/2201b14464e7af9f52943f2246d9cf8c)

As you can see, the warning no longer appears, and the test has been performed with simulated p-value based on 2000 replicates, which is the default. 

### The Fisher Exact test

The general rule of thumb is, when at least one expected value is lower than five, use the Fisher test rather than the Chi-Square test. There are some who think that it may perhaps be time to retire this rule of 'no expected values lower than five' and use some other method to calculate whether or not a sample size is too small for the Chi-Square test.  

> **Tip:** You can find a great post talking about small numbers in Chi-square tests [here](http://www.biostathandbook.com/small.html).

Regardless of the debate, our *mtcars* sample is definitely **too small** for the Chi-Square test. Therefore, we will use the Fisher test. To perform this test in R, we can use the *fisher.test()* function:

```r
> fisher.test(mtcars$gear, mtcars$cyl)

	Fisher's Exact Test for Count Data

data:  mtcars$gear and mtcars$cyl
p-value = 8.26e-05
alternative hypothesis: two.sided
```

[View fisher-test.r on GitHub Gist](https://gist.github.com/NyaGarcia/45e310d5ddc76f03df1f1672c3a8f54d)

Once again, the p-value is below the significance level (0.05). Therefore, we can conclude that the variables are **not independent.**
 
### The G-test 
There is yet another method we can use to test for independence, and that is the G-test. Once again, just like the Chi-Square test, it is only reliable when used with **large samples**. To be able to use the G-Test function in R, we must first import the *DescTools* package, and then use the *GTest()* function:

```r
> library(DescTools)
> GTest(mtcars$gear, mtcars$cyl)

  Log likelihood ratio (G-test) test of independence without
  correction

data:  mtcars$gear and mtcars$cyl
G = 23.26, X-squared df = 4, p-value = 0.0001123
```

[View gtest.r on GitHub Gist](https://gist.github.com/NyaGarcia/d2f0f3e52f73322e594f7201069d7873)

> **Tip:** Remember, for small samples, use the Fisher test. For large samples, use the Chi-Square test or the G-Test

---

## Measures of association
We now know how to test for independence between contingency table variables. However, how can we know how strong this independence is? **By calculating association measures.**
 
### Phi Coefficient
The simplest way to calculate the strength of association in a **2x2** contingency table is by using the **Phi Coefficient**. This measure is related to the Chi-Square test for a two-way contingency table in the following way:

![Phi Coefficient ](/images/articles/devto/9d9b9f473e2d1dff.png)

Where:
- **ϕ** is the Phi Coefficient.
- **x²** is the chi-squared statistic from the Chi-Square test.
- **n** is the total number of observations.

The range of the Phi Coefficient is [-1, 1], and its interpretation is the following:

- 0 means there is **no association** between variables. They are **independent.**
- 1 means a perfect positive association. This is when most of the data **falls along the diagonal cells.**
- -1 means a perfect negative relationship. This is when most of the data **falls away from the diagonal cells.**

Since we need a 2x2 table to perform this test, we will calculate the Phi Coefficient for the following contingency table:

![2x2 contingency table](/images/articles/devto/4d34a72ed1208f66.png)

To calculate the Phi Coefficient in R, we can use the *phi()* function in the *psych* package:

```r
> jobhappiness<-matrix(c(5,7,13,10), ncol = 2)
> rownames(jobhappiness)<-c("Developers", "Mathematicians")
> colnames(jobhappiness)<-c("Happy", "Unhappy")
> phi(jobhappiness)
[1] -0.14
```

[View phi.r on GitHub Gist](https://gist.github.com/NyaGarcia/f9e1cd845c591af82588f0887a233cb7)

Since the result is negative, we know that we have a **negative relationship.** Since the result is close to 0, we know that the **strength of the relationship is very weak**, which translates to there being **next to no relationship.**

> **Tip:** Remember that the Phi Coefficient can only be used for **2x2** contingency tables. For larger tables, we should use *Cramer's V* or *Tschuprow's T*.

### Cramer's V and Tschuprow's T
Both *Cramer's V* and *Tschuprow's T* are closely related to the Chi-Square test. Because the latter is dependent on the **size of the sample**, it's a **poor reflection** of the strength of association. Here is where *Cramer's V* and *Tschuprow's* T come in:

![Cramer's V](/images/articles/devto/9176bbedfff9e39b.png)

Where:
- **φ** is the Phi Coefficient.
- **x²** is the chi-squared statistic from the Chi-Square test.
- **n** is the total number of observations.
- **k** is the number of columns.
- **r** is the number of rows.

And here is Tschuprow's T:

![Tschuprow's T](/images/articles/devto/76f91fc836de8b17.png)

Where:
- **x²** is the chi-squared statistic from the Chi-Square test.
- **n** is the total number of observations.
- **k** is the number of rows.
- **c** is the number of columns.

Both *Cramer's V* and *Tschuprow's T*, produce a value in the [0,1] range. The interpretation of this value is the following:

- 0 means there is no association between variables. They are **independent.**

- 1>x>0 (any number larger than 0, smaller than 1) means that **there exists a relationship of association.** The only problem with both *Cramer's V* and *Tschuprow's T* is that we have no way of knowing whether the obtained value represents a weak, intermediate or strong association.

- 1 means **perfect dependency** in the case of *Tschuprow's T*, but not in the case of *Cramer's V*, where it only means that there exists a **high dependency.**

To calculate *Cramer's V* in R, we need to use the *CramerV()* function from the *DescTools* package (since we already imported *DescTools* previously, for the G-Test, we don't need to do so again):

```r
> CramerV(mtcars$gear, mtcars$cyl)
[1] 0.5308655
```

[View cramerv.r on GitHub Gist](https://gist.github.com/NyaGarcia/460aaa9df975498413514e423192845d)

Since the value is larger than 0, we know that the variables are **associated**. However, we can't know whether or not that association is weak or strong…
To calculate Tschuprow's T in R, we can use the TschuprowT() function, once again from the DescTools package:

```r
> TschuprowT(mtcars$gear, mtcars$cyl)
[1] 0.5308655
```

[View tschuprow.r on GitHub Gist](https://gist.github.com/NyaGarcia/5057d0aa8f21a6df32b0aa6991a4b9af)

Bias correction
> **[From A bias-correction for Cramér's V and Tschuprow's T:](https://www.sciencedirect.com/science/article/abs/pii/S1226319212001032?via%3Dihub)** It's important to know that both *Cramer's V* and *Tschuprow's T* are considerably biased, and tend to overestimate the strength of association.

How do we avoid this? By applying a **bias correction**. Here is an example of *Cramer's V* with a bias correction applied in R:

```r
> CramerV(mtcars$gear, mtcars$cyl, correct = TRUE)
[1] 0.4819631
```

[View cramerv-correct.r on GitHub Gist](https://gist.github.com/NyaGarcia/e6b6081ac2bcd4e8d51aa4b1a270915a)

And an example of *Tschuprow's T* with an applied bias correction in R:

```r
> TschuprowT(mtcars$gear, mtcars$cyl, correct = TRUE)
[1] 0.4819631
```

[View tschuprow-correct.r on GitHub Gist](https://gist.github.com/NyaGarcia/ed76563c27582847bcda8676b8314318)

---

## Conclusion
And that's all for today, folks. We covered everything from the concept of a contingency table to independence tests and calculations of association measures. There are some widely used tests, like the Cochran-Mantel-Haenszel test for conditional independence or the Breslow-Day test for homogeneous association that we didn't mention, perhaps we could talk about them in another tutorial. 

As always, I hope you enjoyed this tutorial and/or found it useful. Don't forget to let me know your thoughts in the comments below! 

**P.S.** *I am a full stack web developer with an interest in R. I initially wrote most of this material as part of my own learning process, and decided to publish it in case it helped others who are also learning R. Comments, tips and advice are welcome!*
