# PowerPoint Constructibility — Data Schema Specification

This document is the authoritative schema for `nodes.json` and `types.json`. Any agent or contributor editing these files must follow this spec exactly.

---

## `types.json`

The complete, exhaustive list of valid output types. No other values are permitted.

```json
["Number", "Angle", "Curve", "Color", "Function", "Set"]
```

### Type Definitions

| Type | Meaning |
|------|---------|
| `Number` | A constructible real number, defined as: a value `x` is constructible iff a square of side length `x` can be constructed in PowerPoint from a unit square using only allowed operations. Replaces the old `Length` and `Scalar` types. |
| `Angle` | A constructible angle (in radians or as a geometric rotation). |
| `Curve` | A constructible curve (e.g. a Bézier, parabola, or arc) placed on the canvas. |
| `Color` | A constructible RGB color value (one or more channels). |
| `Function` | A constructible function mapping constructible inputs to constructible outputs (e.g. `ln`, `sin`). |
| `Set` | An infinite class of constructible numbers proven reachable by a shared algorithm (e.g. ℚ, 𝕂). Used only for `class` nodes. |

---

## `nodes.json`

### Top-Level Structure

```json
{
  "nodes": [ ...NodeObject ]
}
```

---

### Node Types

Every node must have `"type"` equal to one of: `"number"`, `"operation"`, `"class"`.

| Node type | Meaning |
|-----------|---------|
| `number` | A specific, concrete constructible value (e.g. `e`, `√2`, `π`). |
| `operation` | A procedure that takes typed inputs and produces an output (e.g. `addition`, `square_root`). |
| `class` | A proven-infinite set of constructible numbers reachable by a shared algorithm (e.g. ℚ, 𝕂). |

---

### Common Fields (all nodes)

```jsonc
{
  "id": "snake_case_unique_string",       // required, unique across all nodes
  "name": "Human-readable display name",  // required
  "type": "number | operation | class",   // required
  "output_type": "Number | Angle | Curve | Color | Function | Set", // required
  "description": "string",               // required — mathematical meaning, who discovered it, key insight
  "dependencies": ["id", "id", ...],     // required — ALL upstream node IDs this node depends on (the DAG edges)
  "construction": ConstructionObject,    // required — see below; use null if unknown
  "proofDoc": "proofs/filename.md | null" // optional
}
```

**Important on `dependencies`:** This flat array is the single source of truth for graph edges. It must list every node that this node directly depends on. For composition nodes, this will match the `inputs` map. For primitive nodes, it lists any foundational nodes required (e.g. a `number` node that needs the unit square).

---

### The `construction` Object

The `construction` field must be either a `ConstructionObject` or `null`. Use `null` only when the construction is not yet documented — **never invent or approximate steps**.

#### Method: `"primitive_steps"`

Used when the node requires direct manipulation in PowerPoint.

```jsonc
{
  "method": "primitive_steps",
  "ppt_features": ["string", ...],  // required — PPT tools/features used (e.g. "Snapping", "Merge Shapes > Intersect", "SmartArt")
  "steps": ["1. ...", "2. ...", ...] // required — exact step-by-step instructions
}
```

#### Method: `"composition"`

Used when a node is produced purely by applying an existing operation to existing nodes — no new PPT steps required.

```jsonc
{
  "method": "composition",
  "operation": "operation_node_id",  // required — the operation being applied
  "inputs": {
    // required — keys must exactly match the parameter names declared in the operation's `signature`
    "param_name": "dependency_node_id",
    "param_name": "dependency_node_id"
  }
}
```

---

### Additional Field: `signature` (Operation nodes only)

Operation nodes must declare a `signature` field describing their typed parameters and return type.

```jsonc
{
  "signature": {
    "params": [
      { "name": "param_name", "type": "Number | Angle | Curve | Color | Function | Set" },
      ...
    ],
    "returns": "Number | Angle | Curve | Color | Function | Set"
  }
}
```

The parameter names declared here are the canonical names. They must be used as keys in any `composition` node's `inputs` map that uses this operation.

---

## Full Node Examples

### Example: `number` node with primitive construction

```json
{
  "id": "unit_square",
  "name": "Unit Square",
  "type": "number",
  "output_type": "Number",
  "description": "The base unit of measure. A square of side length 1, defined as the starting primitive from which all other constructions derive.",
  "dependencies": [],
  "construction": {
    "method": "primitive_steps",
    "ppt_features": ["Shift-Constrain"],
    "steps": [
      "1. Draw a rectangle while holding SHIFT to constrain it to a perfect square.",
      "2. Define the side length of this square as 1."
    ]
  },
  "proofDoc": null
}
```

### Example: `operation` node

```json
{
  "id": "exponentiation",
  "name": "Exponentiation (a^b)",
  "type": "operation",
  "output_type": "Number",
  "description": "Construct a raised to the power of b, for any constructible a and b.",
  "dependencies": [],
  "signature": {
    "params": [
      { "name": "base", "type": "Number" },
      { "name": "exponent", "type": "Number" }
    ],
    "returns": "Number"
  },
  "construction": null,
  "proofDoc": null
}
```

### Example: `number` node with composition

```json
{
  "id": "e_constant",
  "name": "Euler's Number (e)",
  "type": "number",
  "output_type": "Number",
  "description": "Construct e via 2^(1/ln 2). Since 2^(1/ln 2) = e^(ln 2 / ln 2) = e.",
  "dependencies": ["exponentiation", "rational_numbers", "natural_logarithm", "division"],
  "construction": {
    "method": "composition",
    "operation": "exponentiation",
    "inputs": {
      "base": "rational_numbers",
      "exponent": "division"
    }
  },
  "proofDoc": "proofs/e.md"
}
```

### Example: `class` node

```json
{
  "id": "rational_numbers",
  "name": "Rational Numbers (ℚ)",
  "type": "class",
  "output_type": "Set",
  "description": "All positive rationals are constructible. Integers via repeated addition of the unit square; fractions via division. Since the constructible numbers are closed under +, −, ×, ÷, we have ℚ ⊆ C.",
  "dependencies": ["unit_square", "addition", "subtraction", "multiplication", "division"],
  "construction": {
    "method": "composition",
    "operation": "division",
    "inputs": {
      "numerator": "addition",
      "denominator": "addition"
    }
  },
  "proofDoc": "proofs/rational_numbers.md"
}
```

---

## Rules for Agents

1. **Never invent construction steps.** If you do not know the exact PowerPoint procedure, set `construction: null`.
2. **Never add new `output_type` values.** Only use the six types defined in `types.json`.
3. **`dependencies` must be complete.** Every node ID referenced anywhere in the node object must appear in `dependencies`.
4. **`inputs` keys must match `signature` params.** Do not use role names that aren't declared in the operation's `signature`.
5. **`id` is snake_case and永久 unique.** Never reuse or rename an existing ID.
6. **Do not add fields not defined in this spec.** No `construction_chain`, `invariants`, `construction_signature`, or other legacy fields.
