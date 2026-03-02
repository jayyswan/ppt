# The Philosophy of PowerPoint Constructibility

## What Does "Constructibility" Mean?

In classical mathematics, a number is considered **constructible** if it can be represented as a line segment using only a finite number of operations with a compass and straightedge, starting from a given unit length. 

This project asks a similar, but modern question: **What numbers, shapes, and constants can be constructed using only the native, primitive tools available within Microsoft PowerPoint?**

PowerPoint is not a CAD software, nor is it a graphing calculator. It is a presentation tool. Yet, through clever exploitation of its alignment tools, shape combining features, and curve fitting algorithms, an astonishing array of rigorous mathematical operations can be performed purely graphically. 

This framework exists to formally document these methods, proving that PowerPoint is a Turing-complete (or at least mathematically robust) canvas.

---

## 1. The Core Rules of Construction

To qualify as a valid "constructible" object within this framework, the construction must adhere to strict rules:

1. **No Approximations:** "Eyeballing" is forbidden. If a point needs to intersect a line, it must be proven to intersect exactly using PowerPoint's native snapping, intersection, or mathematical derivations.
2. **Native Tools Only:** No external plugins, scripts (VBA), or imported SVGs. Everything must be drawn using PowerPoint's built-in shapes, lines, curves, and alignment tools.
3. **Traceability:** Every complex construction must be traceable back to a foundational **Primitive Step** (e.g., drawing a straight line, placing a unit square).

---

## 2. The Data Model: A Mathematical DAG

The core of this project is a **Directed Acyclic Graph (DAG)** that tracks how complex mathematical concepts are built from simpler ones. We categorize our graph nodes into three strict types:

### A. Number
A specific, concrete value that can be represented as a geometric length or angle (e.g., `Euler's Number (e)`, `√2`, `Unit square`).

### B. Operation
A mathematical function or procedure that takes inputs and produces an output (e.g., `Addition of lengths`, `Exponentiation`, `Natural Logarithm`).

### C. Class
A theoretical grouping of numbers that are universally constructible via a shared algorithm (e.g., `Any Rational Number (Q)`). If we can prove how to construct *any* rational number, we don't need a separate node for `1.5` and `2.75`—we simply cite the `Rational Number` class.

---

## 3. The Double-Tiered Construction Method

How do we actually *build* these things? Every node in our framework explicitly defines its `construction` method as one of two types:

### Tier 1: Primitive Steps
These are the foundational recipes. They contain a literal `steps` array explaining exactly where to click and what to draw in PowerPoint. 
*Example: **Addition of lengths***
1. Draw an infinite reference line.
2. Copy line segment 'A' and align it to the start.
3. Copy line segment 'B' and align it to the end of 'A'.

### Tier 2: Composition
These are higher-order constructs. They do not require manual PowerPoint steps because they are simply applications of existing *Operations* to existing *Arguments*.
*Example: **Euler's Number (e)***
- **Method:** Composition
- **Applied Operation:** `Exponentiation`
- **Argument 1 (Base):** `Addition of lengths` (specifically, 1+1=2)
- **Argument 2 (Exponent):** `Natural Logarithm` (specifically, the inverse of ln(2))

By separating physical drawing steps from mathematical compositions, we create a graph that is both a theoretical proof of concept and a literal instruction manual!

---

## 4. The End Goal

By traversing this dependency graph, a user can start from a simple "Unit Square" and follow the edges all the way up to constructing a geometrically perfect visual representation of `e^1234.654342`. 

This project transforms PowerPoint from a slideshow app into a rigorous geometry engine, documenting the limits of presentation software mathematics.

---

## 5. Origins: The PowerPoint Flag Challenge

This entire conceptual framework was born from a seemingly simple internet challenge posed in November 2025: **Can every flag in a fixed list of 197 world flags be constructed in PowerPoint under strict geometric rules?**

The rules were clear: no eyeballing, no entering numerical pixel dimensions. If a flag had an official geometry (like a circle positioned at exactly 1/3 the width), you had to mathematically *derive* that position using only PowerPoint shapes and snapping.

### The Progression of PowerPoint Math

- **The Basics (Q):** It was quickly established that integer grids and rational fractions (Q) were trivial to build via snapping and proportional resizing. This cleared simple tricolors.
- **The First Square Roots:** Using the diagonals of unit squares, `√2` was constructed. Using 30° snap-rotations, `√3` was constructed. This allowed precise stars and equilateral triangles, moving the geometry into the field `Q(√2, √3)`.
- **The √5 Obstruction:** Around 60 flags, including the Union Jack, require `√5`. Because PowerPoint only natively snap-rotates in 15° increments, it was initially believed that `√5` was impossible to construct, acting as a hard mathematical ceiling to the challenge.

### The Detonation of Constructibility

In late 2025 and early 2026, the community surrounding the challenge broke the software wide open. It was discovered that by exploiting hidden depths of PowerPoint's feature set—like spline flattening, chart power regressions, and bezier intersections—the constructible universe expanded violently:

- **November 2025:** General square, cubic, and quartic roots are constructed. 
- **December 2025:** Transcendentals fall. `π` is built via circumference scaling, and arbitrary colors (using 255 RGB channels) are derived.
- **February 2026:** Curve calculus is achieved. `e`, natural logarithms, arbitrary powers (`a^b`), and inverse trig functions are proven constructible.

What began as an attempt to draw flags mutated into a computational field theory experiment. The constructible set expanded from `Q(√2, √3)` to arbitrary radicals, polynomials, transcendentals, and arc lengths. 

This framework you are looking at is the formal documentation of that explosion. It is the repository where we record exactly *how* a presentation software was weaponized to do higher algebra.
