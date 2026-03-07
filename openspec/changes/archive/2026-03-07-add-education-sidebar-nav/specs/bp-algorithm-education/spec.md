## ADDED Requirements

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
