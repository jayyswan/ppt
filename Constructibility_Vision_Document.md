# PowerPoint Constructibility Framework
## Vision Document

## 1. Core Goal

Create an interactive, shareable, and extensible web-based system that formally documents
PowerPoint constructibility as a composable dependency graph.

The system should make it possible to:

- See exactly how any constructible object (number, curve, color, constant) is derived
- Trace every construction back to explicit PowerPoint primitives
- Attach proof documentation to every step
- Distinguish between different computational engines (geometric, regression, spline, etc.)
- Allow easy contribution from the community

This is effectively a structured proof assistant for PowerPoint constructibility.

---

## 2. Conceptual Model

The framework treats constructibility as a directed acyclic graph (DAG).

- Nodes represent constructible objects or methods.
- Edges represent dependency relationships.
- Primitives are atomic operations available in PowerPoint.
- Derived constructions are compositions of primitives or previously established methods.

Every constructible object must ultimately reduce to primitives.

---

## 3. Functional Abstraction

Each construction is modeled as a typed function:

    f : (Constructible Inputs) → Constructible Output

For example:

- UnitSquare() → Length
- Copy_n(x: Length, n: Natural) → Length
- Multiply(a: Length, b: Length) → Length
- ArcLength(curve: Curve) → Length
- RegressionRoot(polynomial) → Scalar

Constructibility is preserved under composition.
If all inputs are constructible and the function is valid, the output is constructible.

---

## 4. Types

To prevent ambiguity and invalid compositions, constructions are typed.

Example types:

- Length
- Angle
- Curve
- Color
- Scalar
- Function

Each method must declare:

- Input types
- Output type
- Engine category
- Rounding behavior (if applicable)

---

## 5. Engine Taxonomy

The system must distinguish between different computational substrates inside PowerPoint.

Proposed engine categories:

- Pure Geometric
- SmartArt Engine
- Bezier Engine
- Spline Engine
- Chart Regression Engine
- Rendering / Arc-Length Engine
- Color Quantization Engine
- ACE
- Cross-Platform Extensions (Google Slides, Impress, etc.)

This allows filtering and clarity about which constructions rely on which underlying systems.

---

## 6. Primitive Layer

Primitives are operations that require no prior constructibility.

Examples:

- Insert unit square
- Copy shape
- Snap alignment
- Group shapes
- Rotate (snapped)
- SmartArt subdivision
- Insert Bezier curve
- Apply regression
- Measure arc length
- Extract perimeter
- Assign color channel

Every derived construction must reduce to these primitives.

---

## 7. Derived Layer

Derived constructions are compositions of primitives or other derived constructions.

Examples:

- sqrt(a² + b²)
- General nth root
- Angle n-section
- Polynomial root via regression
- π via circumference
- e via exponential construction
- a^b via logarithmic construction
- Gamma(n/4)
- Lemniscate constant

Each derived node must clearly list dependencies and documentation.

---

## 8. Documentation Model

Each node should contain:

- ID
- Name
- Type
- Input list
- Output type
- Engine category
- Description
- Link to proof documentation
- Rounding status
- Known limitations

Proof documentation should be written in Markdown and linked directly.

---

## 9. Web App Vision

The framework will be implemented as a static web application hosted on GitHub Pages.

Goals:

- Interactive graph visualization
- Click-to-expand dependency chains
- Filter by engine type
- Toggle rounding vs no-rounding
- Trace any node back to primitives
- Community contributions via pull requests

All constructions should be stored as structured data (e.g., JSON).
Proofs should be stored as Markdown files.

---

## 10. Example Use Case: π

In the system, π would not simply be marked as “constructible.”

Instead, it would expand as:

π  
→ Circumference  
→ Arc Length  
→ Spline Flattening  
→ Bezier Construction  
→ Polynomial Interpolation  
→ Regression Engine  
→ PowerPoint Primitive Layer  

Every step visible. Every dependency inspectable.

---

## 11. Long-Term Vision

This framework aims to:

- Formalize PowerPoint constructibility
- Prevent undocumented assumptions
- Clarify engine dependencies
- Provide a standard library of constructible methods
- Enable reproducible, verifiable constructions
- Support collaborative mathematical exploration

Ultimately, this becomes:

A formal dependency explorer for constructive computational geometry in presentation software.

The explosion of constructibility methods demands structure.
This framework provides it.