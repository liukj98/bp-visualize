# bp-algorithm-visualization Specification

## Purpose
TBD - created by archiving change enhance-visualization-detail. Update Purpose after archive.
## Requirements
### Requirement: Phase Indicator Display
The phase indicator SHALL display the current sub-step name and progress within the overall training step sequence.

#### Scenario: Sub-step indication
- **WHEN** a training sub-step is active
- **THEN** the phase indicator SHALL show the sub-step name (e.g., "前向传播 — 隐藏层计算")
- **AND** a step counter SHALL display current position (e.g., "步骤 2/7")

