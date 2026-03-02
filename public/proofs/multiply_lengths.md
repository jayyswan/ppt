# Proof: Multiplying Lengths (Multiplication)

**Proposition**: Given two constructible `Segments` $x$ and $y$, construct a `Segment` of length $x \cdot y$.

## 1. Formal Signature
- **Inputs**: `Segment(1)`, `Segment(x)`, `Segment(y)`
- **Intermediates**: `Group(1, y)`, `Scale(Group, 1 -> x)`
- **Output**: `Segment(x \cdot y)`

## 2. Mathematical Basis
Multiplication relies on **Similarity Invariance** (Thales's Theorem). If we have a group of objects and scale that group so that a unit segment becomes length $x$, then every other segment $y$ in that group will scale by the same factor $x$, resulting in length $x \cdot y$.

## 3. PowerPoint Procedure (Typed)
1. **`Segment(1), Segment(y)`**: Align them side-by-side or orthogonally. 
2. **`Group(1, y)`**: Select both and press `CTRL+G` to group them.
3. **`Scale(Group, 1 -> x)`**: Holding SHIFT, resize the group until the unit segment's length snaps to match `Segment(x)`.
4. **`Segment(x \cdot y)`**: The second segment in the group now has length $x \cdot y$.

## 4. Invariants
- **Aspect Ratio Locking**: Holding SHIFT while resizing a group ensures that the ratio of all lengths within the group remains perfectly constant.
- **Snapping**: Snapping the unit segment's edge to the target $x$ segment ensures the scale factor is exactly $x/1$.
