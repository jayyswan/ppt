# PowerPoint Flag Challenge --- Detailed Project Summary

## 1. Core Project

The challenge asks:

**Can every flag in a fixed list of 197 world flags be constructed in
PowerPoint (or Google Slides) under strict geometric rules?**

-   The 197 flags are taken from a specific Sporcle quiz ("Flags of the
    World") to avoid political ambiguity.
-   Each flag must match its official construction sheet when one
    exists.
-   If no precise geometric construction is specified (e.g., complex
    emblems), a sufficiently accurate approximation is acceptable.

The project becomes a mathematical investigation of what lengths and
shapes are *constructible inside PowerPoint*.

------------------------------------------------------------------------

## 2. Governing Philosophy (Straightedge-and-Compass Analog)

The challenge mirrors classical straightedge-and-compass geometry, but
translated into PowerPoint.

### Three Core Rules

1.  **Perfect tools**
    -   PowerPoint shapes are treated as mathematically exact.
    -   Snapping is considered exact.
    -   Pixel limitations are ignored.
2.  **No eyeballing**
    -   You cannot "draw something that looks right."
    -   All proportions must follow geometric construction logic.
3.  **No measuring**
    -   You cannot type in numerical dimensions (width, height,
        rotation).
    -   No manually entering pixel values.
    -   All lengths must arise from construction operations.

------------------------------------------------------------------------

## 3. What Counts as "Constructible"?

A number `x` is **constructible in PowerPoint** if:

> Given a unit square (side length = 1), you can construct a square with
> side length `x` using only allowed operations.

This defines the set of "PowerPoint-constructible numbers."

The challenge reduces to:

> Are all numerical quantities required by official flag construction
> sheets constructible in PowerPoint?

------------------------------------------------------------------------

## 4. Mathematical Progression of the Challenge

The video develops the constructible number system step by step.

### Stage 1 --- Natural Numbers

Using copying and snapping:

-   Any integer multiple of a unit square can be created.
-   Therefore, all **natural numbers** are constructible.

This allows construction of: - Horizontal/vertical stripe flags -
Rectangular grids - Many simple tricolor flags

\~45 flags cleared.

------------------------------------------------------------------------

### Stage 2 --- Rational Numbers

Using grouping and proportional resizing:

-   Any fraction `m/n` can be constructed.
-   Therefore, all **positive rational numbers** are constructible.
-   Negative numbers are handled via subtraction constructions.

Now the system includes:

`Q` (the rational numbers)

This enables: - Decimal-based proportions - Precise circular flag ratios
(e.g., Japan)

------------------------------------------------------------------------

### Stage 3 --- Square Roots (Irrational Numbers Begin)

Using geometric facts:

-   Diagonal of unit square → `sqrt(2)`
-   30° rotation geometry → `sqrt(3)`

Closure under multiplication and division is established:

If `a` and `b` are constructible, then:

-   `a + b`
-   `a - b`
-   `ab`
-   `a/b`

are constructible.

Thus the constructible set becomes a **field**:

`Q(sqrt(2), sqrt(3))`

This enables: - Equilateral triangles (√3) - Complex crescents (Libya) -
Star positioning (Cuba) - Many triangle-based flags

\~108 flags cleared.

------------------------------------------------------------------------

## 5. Emblems and Approximation

For coats of arms and complex designs (Spain, Albania, etc.):

-   If no strict geometric construction exists,
-   The flag may be approximated arbitrarily closely.
-   The argument uses a calculus-style limit:

> As "work" increases (more small squares), the constructed image
> converges to the original.

Thus:

-   Emblems are allowed via arbitrarily fine geometric approximation.
-   The challenge focuses mainly on **exact geometric constraints**, not
    artistic detail.

------------------------------------------------------------------------

## 6. The Major Obstruction: √5

The Union Jack requires:

-   Diagonal ratios producing `sqrt(5)`

Problem:

-   Rotations snap only to multiples of 15°.
-   These rotations generate coordinates involving √2 and √3.
-   √5 cannot be formed from rational numbers, √2, and √3 using field
    operations.

So:

`sqrt(5)` is not in `Q(sqrt(2), sqrt(3))`

This creates a serious barrier:

-   \~50--60 flags require √5.
-   Current construction system is insufficient.

The episode ends by revealing:

> There exists a built-in PowerPoint shape that secretly contains √5.

Part 2 continues from there.

------------------------------------------------------------------------

## 7. Nature of the Challenge

The project is simultaneously:

-   A geometry challenge
-   A constructive field theory exploration
-   A study of PowerPoint's hidden geometric constraints
-   A parody of formal mathematical proof
-   A computational constructibility experiment

It transforms:

> "Can you draw all flags?"

into

> "What numbers are constructible in PowerPoint under strict geometric
> rules?"

------------------------------------------------------------------------

## 8. Core Constraints Summary

You may use:

-   Built-in shapes
-   Snapping
-   Grouping
-   Resizing
-   Rotations (with snapping)
-   Boolean shape operations

You may NOT:

-   Input numerical dimensions
-   Freely rotate to arbitrary angles
-   Eyeball proportions
-   Use external measurement tools

Everything must arise from geometric construction.

------------------------------------------------------------------------

## 9. Final Framing

The PowerPoint Flag Challenge is fundamentally:

> A study of which real numbers are constructible under PowerPoint's
> geometry engine.

Part 1 establishes:

-   Constructibility of integers
-   Constructibility of rationals
-   Constructibility of √2 and √3
-   Closure under field operations
-   A hard obstruction at √5

The remaining challenge is determining whether PowerPoint's default
shapes expand the constructible field enough to complete all 197 flags.
