# bp-algorithm-education Specification

## Purpose
TBD - created by archiving change enhance-visualization-detail. Update Purpose after archive.
## Requirements
### Requirement: Dynamic Formula Display
The formula display panel SHALL render phase-specific mathematical formulas synchronized with each training sub-step, showing detailed intermediate computation terms.

#### Scenario: Forward hidden layer sub-step formula
- **WHEN** the phase is `forward-hidden`
- **THEN** the formula panel SHALL display the hidden layer weighted sum formula and Sigmoid activation
- **AND** SHALL show expanded computation with actual values for each hidden neuron (h₁, h₂)

#### Scenario: Forward output layer sub-step formula
- **WHEN** the phase is `forward-output`
- **THEN** the formula panel SHALL display the output layer weighted sum formula using hidden layer outputs
- **AND** SHALL show expanded computation with actual values for each output neuron (o₁, o₂)
- **AND** each term (w × out_h) SHALL be shown individually before summation

#### Scenario: Per-output loss sub-step formula
- **WHEN** the phase is `loss-per-output`
- **THEN** the formula panel SHALL display the MSE formula
- **AND** SHALL show the individual error computation for each output: E_oᵢ = ½(target - output)²
- **AND** each computation SHALL show the substituted values and result

#### Scenario: Total loss sub-step formula
- **WHEN** the phase is `loss-total`
- **THEN** the formula panel SHALL display the total error aggregation: E_total = E_o₁ + E_o₂
- **AND** SHALL show the numerical values being summed

#### Scenario: Backward output sub-step formula
- **WHEN** the phase is `backward-output`
- **THEN** the formula panel SHALL display the chain rule decomposition for output layer weight gradients
- **AND** SHALL show each of the three partial derivative terms with expanded computation
- **AND** SHALL display δ_oⱼ = (outⱼ - targetⱼ) × σ'(netⱼ) with values

#### Scenario: Backward hidden sub-step formula
- **WHEN** the phase is `backward-hidden`
- **THEN** the formula panel SHALL display the hidden layer error signal formula
- **AND** SHALL show how errors from multiple output nodes are aggregated: δ_hⱼ = (Σ δ_oₖ × w_jk) × σ'(net_hⱼ)
- **AND** SHALL display the hidden layer weight gradient computation

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

