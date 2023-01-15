---
id: f1c4cf8d86b65dac53cde0d5a24a07b8
title: What is the difference between switch-case and pattern matching?
date: "2022-11-20"
tags: [programming]
slug: switch-case-and-pattern-matching
---

Both switch-case and pattern matching are flow control mechanisms used to check if a variable matches a certain pattern or case. However, there are some important differences between the two.

## switch-case

The switch-case typically only supports primitive types and equality operations.

For example:

```js
const x = 5;

switch (x) {
  case 5:
    console.log("x is equal to 5");
    break;
  default:
    console.log("x is not equal to 5");
}
```

```js
const x = 5;

if (x === 5) {
  console.log("x is equal to 5");
} else {
  console.log("x is not equal to 5");
}
```

Both examples above only check if the variable `x` is equal to 5. In the case of the if statement, this is done using the equality operator `===` and in the case of the switch-case statement, this is done by comparing the variable `x` to the specific value `5`. In both cases, if the equality is true, the code inside the corresponding `if` block or `case` block will be executed.

## Pattern Matching

While pattern matching offers several other features such as exhaustiveness checking, destructuring and match expressions.

#### Exhaustive check

An Exhaustiveness checker for pattern matching is used to ensure that all possible cases of structured data have been considered in the pattern matching.

For example, we have the following data constructor:

```hs
data Color
  = Red
  | Green
  | Blue
```

And we want to do a function for printing these constructors.

```hs
printColor :: Color -> IO ()
printColor color =
  case color of
    Red -> putStrLn "Red"
    Green -> putStrLn "Green"
```

We forgot the `Blue` pattern.

![image](https://user-images.githubusercontent.com/44513615/202954800-f8c59e3d-6790-4dd4-8483-79f06106e0df.png)

This is important to prevent bugs and ensure that the code is complete and correct.

#### Destructuring

Destructuring allows extracting and binding specific parts of a data structure to variables while matching patterns. This is often used to extract specific fields or values from a data structure, making it easier to work with and manipulate the data.

For example:

```hs
data Nat
  = Z
  | S Nat
  deriving (Show)

even :: Nat -> Bool
even Z = True
even (S Z) = False
even (S (S Z)) = True
even (S (S (S n))) = even (S n)
```

In this example, the even function is using pattern matching to extract the values inside the `S` constructor.
