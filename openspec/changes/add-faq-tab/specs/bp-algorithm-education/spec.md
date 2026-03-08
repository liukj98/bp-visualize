## ADDED Requirements

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
