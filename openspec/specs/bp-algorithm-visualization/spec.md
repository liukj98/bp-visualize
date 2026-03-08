# bp-algorithm-visualization Specification

## Purpose
TBD - created by archiving change enhance-visualization-detail. Update Purpose after archive.
## Requirements
### Requirement: Phase Indicator Display
The phase indicator SHALL display the current sub-step name and progress within the overall training step sequence for a simplified 2-2-1 linear network (no activation functions, no biases).

#### Scenario: Sub-step indication
- **WHEN** a training sub-step is active
- **THEN** the phase indicator SHALL show the sub-step name (e.g., "前向传播 — 隐藏层计算")
- **AND** a step counter SHALL display current position (e.g., "步骤 2/6")
- **AND** all sub-steps SHALL reflect the simplified linear network without Sigmoid activation or bias terms

### Requirement: Simplified Network Rendering
The network visualization SHALL render a 2-2-1 architecture with 5 nodes (x₁, x₂, h₁, h₂, y) and 6 weighted connections (w₁~w₆), without bias nodes or activation function indicators.

#### Scenario: Network structure display
- **WHEN** the visualization page is loaded
- **THEN** the canvas SHALL display 2 input nodes (x₁, x₂), 2 hidden nodes (h₁, h₂), and 1 output node (y)
- **AND** 6 weighted connections SHALL be drawn: w₁ (x₁→h₁), w₂ (x₁→h₂), w₃ (x₂→h₁), w₄ (x₂→h₂), w₅ (h₁→y), w₆ (h₂→y)
- **AND** no bias nodes or E_total diamond node SHALL be rendered

#### Scenario: Linear forward propagation display
- **WHEN** the forward propagation step is active
- **THEN** the hidden node values SHALL show pure weighted sums: h₁ = w₁·x₁ + w₃·x₂
- **AND** the output node value SHALL show: y = w₅·h₁ + w₆·h₂
- **AND** no activation function transformation SHALL be displayed

#### Scenario: Single-output loss display
- **WHEN** the loss computation step is active
- **THEN** the loss SHALL be displayed as: Loss = ½(y - target)²
- **AND** only one output node's loss SHALL be shown (single output y)

### Requirement: Neuron Node Drag Interaction
The network visualization SHALL allow users to drag neuron nodes to custom positions on the canvas, with all connections and labels updating in real-time.

#### Scenario: Dragging a node
- **WHEN** the user presses and holds a neuron node on the canvas
- **THEN** the cursor SHALL change to a grabbing indicator
- **AND** the node SHALL follow the cursor as the user drags
- **AND** all connection lines and weight labels attached to that node SHALL update in real-time to reflect the new position

#### Scenario: Hover feedback
- **WHEN** the user hovers the cursor over a neuron node without clicking
- **THEN** the cursor SHALL change to a grab indicator to signal that the node is draggable

#### Scenario: Drag does not affect training
- **WHEN** a node has been dragged to a custom position
- **AND** the user advances a training step or runs auto-training
- **THEN** the animation particles SHALL travel along paths based on the current (dragged) node positions
- **AND** all training computations SHALL remain unaffected

#### Scenario: Reset restores default layout
- **WHEN** the user clicks the reset button after dragging nodes
- **THEN** all nodes SHALL return to their default auto-layout positions

