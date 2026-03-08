## ADDED Requirements

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
