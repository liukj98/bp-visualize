## ADDED Requirements
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
