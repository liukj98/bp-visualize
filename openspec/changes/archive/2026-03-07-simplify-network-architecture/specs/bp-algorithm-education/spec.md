## MODIFIED Requirements
### Requirement: Dynamic Formula Display
The formula display panel SHALL render phase-specific mathematical formulas synchronized with each training sub-step for a simplified 2-2-1 linear network (no activation functions, no biases), showing detailed intermediate computation terms.

#### Scenario: Forward hidden layer sub-step formula
- **WHEN** the phase is `forward-hidden`
- **THEN** the formula panel SHALL display the linear weighted sum formula: h₁ = w₁·x₁ + w₃·x₂, h₂ = w₂·x₁ + w₄·x₂
- **AND** SHALL show expanded computation with actual values for each hidden neuron

#### Scenario: Forward output layer sub-step formula
- **WHEN** the phase is `forward-output`
- **THEN** the formula panel SHALL display the output linear combination: y = w₅·h₁ + w₆·h₂
- **AND** SHALL show expanded computation with actual values

#### Scenario: Loss computation sub-step formula
- **WHEN** the phase is `loss`
- **THEN** the formula panel SHALL display: Loss = ½(y - target)²
- **AND** SHALL show the substituted values and result

#### Scenario: Backward output sub-step formula
- **WHEN** the phase is `backward-output`
- **THEN** the formula panel SHALL display the chain rule for output weights: ∂Loss/∂w₅ = ∂Loss/∂y × ∂y/∂w₅
- **AND** SHALL show each partial derivative term with values (no Sigmoid derivative)

#### Scenario: Backward hidden sub-step formula
- **WHEN** the phase is `backward-hidden`
- **THEN** the formula panel SHALL display the chain rule for hidden weights: ∂Loss/∂w₁ = ∂Loss/∂y × ∂y/∂h₁ × ∂h₁/∂w₁
- **AND** SHALL show the linear derivative terms (∂y/∂h₁ = w₅, ∂h₁/∂w₁ = x₁)

### Requirement: Education Page Sidebar Navigation
The education page SHALL provide a fixed sidebar navigation on the left side, listing all section headings as clickable navigation items for quick access.

#### Scenario: Sidebar displays all sections
- **WHEN** the education page is rendered
- **THEN** a sidebar navigation SHALL appear on the left side
- **AND** it SHALL list all section headings (e.g., "网络结构与初始参数", "步骤一：前向传播", "步骤二：损失计算" etc.)
- **AND** the sidebar SHALL remain fixed while the content scrolls

#### Scenario: Click to navigate
- **WHEN** the user clicks a navigation item in the sidebar
- **THEN** the content area SHALL smoothly scroll to the corresponding section

#### Scenario: Active section highlighting
- **WHEN** the user scrolls through the content
- **THEN** the navigation item corresponding to the currently visible section SHALL be visually highlighted
- **AND** the highlight SHALL update automatically as the user scrolls

## ADDED Requirements
### Requirement: Simplified BP Algorithm Education Content
The education page SHALL present a step-by-step walkthrough of the BP algorithm using a simplified 2-2-1 linear network (no activation functions, no biases), with concrete numerical examples.

#### Scenario: Network structure explanation
- **WHEN** the education page is displayed
- **THEN** it SHALL describe a 2-input, 2-hidden, 1-output network with 6 weights (w₁~w₆)
- **AND** it SHALL explicitly state that no activation functions or biases are used
- **AND** it SHALL show a parameter table with initial weights, inputs, target output, and learning rate

#### Scenario: Forward propagation walkthrough
- **WHEN** the forward propagation section is displayed
- **THEN** it SHALL show step-by-step linear computation: h₁ = w₁·x₁ + w₃·x₂, h₂ = w₂·x₁ + w₄·x₂, y = w₅·h₁ + w₆·h₂
- **AND** each step SHALL include substituted numerical values and results

#### Scenario: Backpropagation walkthrough
- **WHEN** the backpropagation section is displayed
- **THEN** it SHALL demonstrate the chain rule applied to each weight without Sigmoid derivatives
- **AND** it SHALL show ∂Loss/∂wᵢ for all 6 weights with numerical values
