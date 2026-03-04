## ADDED Requirements

### Requirement: Total Error Node Visualization
The system SHALL render a special "E_total" node to the right of the output layer, visually representing the total loss value of the network.

#### Scenario: Total error node display during loss calculation
- **WHEN** the training phase enters `loss-per-output` or `loss-total`
- **THEN** the E_total node SHALL be rendered with the current total loss value displayed inside
- **AND** dashed lines SHALL connect each output node (o₁, o₂) to the E_total node
- **AND** each dashed line SHALL display the per-output error value (E_o₁, E_o₂)

#### Scenario: Total error node during backward propagation
- **WHEN** the training phase is `backward-output`
- **THEN** gradient flow animation SHALL originate from the E_total node back to output nodes
- **AND** the E_total node border SHALL be highlighted in the backward-propagation color

### Requirement: Bias Node Visualization
The system SHALL render bias nodes (b₁, b₂) in the network diagram, positioned above the hidden layer and output layer respectively.

#### Scenario: Bias nodes display
- **WHEN** the network is rendered
- **THEN** a bias node labeled "+1" SHALL appear above each non-input layer
- **AND** dashed lines SHALL connect the bias node to every neuron in that layer
- **AND** each dashed line SHALL display the bias weight value
- **AND** bias nodes SHALL use a distinct visual style (smaller radius, gray color)

### Requirement: Sub-step Forward Propagation
The system SHALL split forward propagation into two visible sub-steps: hidden layer computation and output layer computation.

#### Scenario: Step through forward propagation sub-steps
- **WHEN** the user clicks "Next Step" during forward propagation
- **THEN** the first click SHALL compute and animate only the hidden layer (input → hidden)
- **AND** the second click SHALL compute and animate only the output layer (hidden → output)
- **AND** each sub-step SHALL pause to display intermediate values before proceeding

### Requirement: Sub-step Loss Calculation
The system SHALL split loss calculation into two visible sub-steps: per-output error and total error aggregation.

#### Scenario: Step through loss calculation sub-steps
- **WHEN** the user clicks "Next Step" during loss calculation
- **THEN** the first click SHALL compute and display individual errors (E_o₁, E_o₂) with animation from output nodes to E_total
- **AND** the second click SHALL display the total error E_total = E_o₁ + E_o₂ with aggregation animation

### Requirement: Sub-step Backward Propagation
The system SHALL split backward propagation into two visible sub-steps: output layer gradients and hidden layer gradients.

#### Scenario: Step through backward propagation sub-steps
- **WHEN** the user clicks "Next Step" during backward propagation
- **THEN** the first click SHALL compute and animate gradient flow from E_total through output layer (computing δ_o₁, δ_o₂ and output weight gradients)
- **AND** the second click SHALL compute and animate gradient flow from output layer through hidden layer (computing δ_h₁, δ_h₂ and hidden weight gradients)

### Requirement: Skip to Next Phase
The system SHALL provide a "Skip to Next Phase" button that advances past remaining sub-steps of the current major phase.

#### Scenario: Skip remaining sub-steps
- **WHEN** the user clicks "Skip to Next Phase" during any sub-step
- **THEN** all remaining sub-steps in the current major phase SHALL be computed instantly without animation
- **AND** the system SHALL advance to the first sub-step of the next major phase

## ADDED Requirements

### Requirement: Phase Indicator Display
The phase indicator SHALL display the current sub-step name and progress within the overall training step sequence.

#### Scenario: Sub-step indication
- **WHEN** a training sub-step is active
- **THEN** the phase indicator SHALL show the sub-step name (e.g., "前向传播 — 隐藏层计算")
- **AND** a step counter SHALL display current position (e.g., "步骤 2/7")
