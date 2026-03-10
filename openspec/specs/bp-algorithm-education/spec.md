# bp-algorithm-education Specification

## Purpose
TBD - created by archiving change enhance-visualization-detail. Update Purpose after archive.
## Requirements
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

### Requirement: FAQ Tab Page
The application SHALL provide a third tab labeled "梯度下降详解" in the top navigation, which displays the gradient descent FAQ content rendered from `BP-FAQ.md` with full KaTeX math formula support and sidebar navigation.

#### Scenario: Tab button is visible
- **WHEN** the page loads
- **THEN** three tab buttons SHALL be displayed: "可视化", "算法原理", "梯度下降详解"
- **AND** the "梯度下降详解" tab button SHALL follow the same styling as the existing tab buttons

#### Scenario: Switching to FAQ tab
- **WHEN** the user clicks the "梯度下降详解" tab button
- **THEN** the FAQ content SHALL be displayed
- **AND** the visualization and education content SHALL be hidden
- **AND** the "梯度下降详解" button SHALL show the active state

#### Scenario: FAQ content rendering
- **WHEN** the FAQ tab is active
- **THEN** all 7 sections from `BP-FAQ.md` SHALL be rendered as formatted HTML
- **AND** block math expressions (`$$...$$`) SHALL be rendered via KaTeX in display mode
- **AND** inline math expressions (`$...$`) SHALL be rendered via KaTeX in inline mode
- **AND** tables, code blocks, blockquotes, and lists SHALL be rendered with proper styling consistent with the education page

#### Scenario: FAQ sidebar navigation
- **WHEN** the FAQ tab is active
- **THEN** a sidebar navigation SHALL appear on the left listing all section headings
- **AND** clicking a navigation item SHALL smoothly scroll to the corresponding section
- **AND** the currently visible section SHALL be highlighted in the sidebar as the user scrolls

### Requirement: Simplified Formulas Overview Section
The education page SHALL include a "简化公式" (Simplified Formulas) section between "网络结构与初始参数" and "步骤一：前向传播", presenting the core mathematical model of the 2-2-1 linear network as a formula overview before detailed step-by-step derivations.

#### Scenario: Section placement and visibility
- **WHEN** the education page is rendered
- **THEN** a section titled "简化公式" with id `sec-formulas` SHALL appear between the "网络结构与初始参数" section and the "步骤一：前向传播" section
- **AND** it SHALL be included in the sidebar navigation

#### Scenario: Forward propagation formulas displayed
- **WHEN** the "简化公式" section is visible
- **THEN** it SHALL display the hidden layer linear formulas:
  - h₁ = w₁·x₁ + w₃·x₂
  - h₂ = w₂·x₁ + w₄·x₂
- **AND** it SHALL display the output layer formula:
  - y = w₅·h₁ + w₆·h₂
- **AND** all formulas SHALL be rendered using KaTeX in display mode

#### Scenario: Loss function formula displayed
- **WHEN** the "简化公式" section is visible
- **THEN** it SHALL display the squared error loss formula:
  - E = ½(y − target)²
- **AND** the formula SHALL be rendered using KaTeX in display mode

#### Scenario: Gradient descent update formula displayed
- **WHEN** the "简化公式" section is visible
- **THEN** it SHALL display the gradient descent weight update formula:
  - w_new = w_old − η × ∂E/∂w
- **AND** the formula SHALL be rendered using KaTeX in display mode

