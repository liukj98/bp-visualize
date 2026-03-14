## MODIFIED Requirements

### Requirement: 损失函数公式展示
教学页面 SHALL 使用统一的数学符号 `E` 表示损失函数，在所有公式和文字说明中保持一致。

#### Scenario: 损失函数定义公式
- **WHEN** 用户查看"简化公式"章节中的损失函数定义
- **THEN** 公式应显示为 `E = \frac{1}{2}(y - \text{target})^2`，而非 `Loss = ...`

#### Scenario: 梯度下降公式
- **WHEN** 用户查看"简化公式"章节中的梯度下降公式
- **THEN** 公式应显示为 `w_{\text{new}} = w_{\text{old}} - \eta \times \frac{\partial E}{\partial w}`

#### Scenario: 损失计算步骤
- **WHEN** 用户查看"步骤二：损失计算"章节
- **THEN** 标题公式应使用 `E = \frac{1}{2}(y - target)^2`
- **AND** 数值代入应使用 `E = \frac{1}{2}(5.05 - 4)^2 = ...`

#### Scenario: 反向传播梯度公式
- **WHEN** 用户查看输出层或隐藏层反向传播章节
- **THEN** 所有偏导数公式应使用 `\frac{\partial E}{\partial w_k}`、`\frac{\partial E}{\partial y}`、`\frac{\partial E}{\partial h_j}` 等形式
- **AND** 链式法则公式应使用 `E` 作为损失符号

#### Scenario: 训练对比表格
- **WHEN** 用户查看"步骤五：迭代优化"中的训练对比表格
- **THEN** 表格的损失列标题应使用 KaTeX 渲染的 `E` 符号
- **AND** 表头应显示为 "损失 E" 或仅显示符号 `E`

### Requirement: 术语一致性
教学内容中 SHALL 在公式中使用符号 `E`，在中文叙述中使用"损失"或"误差"，避免混用英文单词 "Loss"。

#### Scenario: 中文说明文本
- **WHEN** 用户阅读公式周围的中文解释
- **THEN** 文本应使用"损失"、"误差"等中文词汇，而非 "Loss"
- **AND** 引用公式中的符号时使用 `E`（如："当前误差 E 为 0.55125"）
