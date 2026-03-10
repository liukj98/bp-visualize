## MODIFIED Requirements
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

#### Scenario: Partial derivative formulas displayed
- **WHEN** the "简化公式" section is visible
- **THEN** it SHALL display basic partial derivatives:
  - ∂h₁/∂w₁ = x₁
  - ∂y/∂w₅ = h₁
  - ∂E/∂y = y − target
- **AND** all formulas SHALL be rendered using KaTeX in display mode

#### Scenario: Chain rule expansion formulas displayed
- **WHEN** the "简化公式" section is visible
- **THEN** it SHALL display the chain rule expansion for an output layer weight:
  - ∂E/∂w₅ = (∂E/∂y) · (∂y/∂w₅) = (y − target) · h₁
- **AND** it SHALL display the chain rule expansion for a hidden layer weight:
  - ∂E/∂w₁ = (∂E/∂y) · (∂y/∂h₁) · (∂h₁/∂w₁) = (y − target) · w₅ · x₁
- **AND** all formulas SHALL be rendered using KaTeX in display mode

#### Scenario: Gradient descent update formula displayed
- **WHEN** the "简化公式" section is visible
- **THEN** it SHALL display the gradient descent weight update formula:
  - w_new = w_old − η × ∂E/∂w
- **AND** the formula SHALL be rendered using KaTeX in display mode

## ADDED Requirements
### Requirement: Training Convergence Comparison Section
The education page SHALL include a "训练收敛对比" (Training Convergence Comparison) section between "步骤五：权重更新" and "关键概念", showing how the network progressively improves across multiple training epochs with a concrete numerical comparison table.

#### Scenario: Section placement and visibility
- **WHEN** the education page is rendered
- **THEN** a section titled "训练收敛对比" with id `sec-convergence` SHALL appear between the "步骤五：权重更新" section and the "关键概念" section
- **AND** it SHALL be included in the sidebar navigation

#### Scenario: Convergence comparison table displayed
- **WHEN** the "训练收敛对比" section is visible
- **THEN** it SHALL display a comparison table with at least three training milestones (e.g., epoch 1, epoch 10, epoch 100)
- **AND** each row SHALL show the epoch number, network output y, loss value, and all 6 weight values
- **AND** the data SHALL be consistent with the actual computation results of the 2-2-1 linear network using the documented initial parameters and learning rate

#### Scenario: Convergence summary explanation
- **WHEN** the "训练收敛对比" section is visible
- **THEN** it SHALL include a summary paragraph explaining that loss decreases with each iteration and the network output converges toward the target value
