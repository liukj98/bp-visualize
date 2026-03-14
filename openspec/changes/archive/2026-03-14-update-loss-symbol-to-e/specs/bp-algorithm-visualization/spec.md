## MODIFIED Requirements

### Requirement: 动态公式渲染符号一致性
可视化页面的动态公式渲染器 SHALL 使用统一的数学符号 `E` 表示损失函数，与教学页面保持一致。

#### Scenario: 损失计算阶段公式
- **WHEN** 训练进入损失计算阶段（Loss 阶段）
- **THEN** 公式显示区域应渲染 `E = \frac{1}{2}(y - \text{target})^2`
- **AND** 代入数值的公式应显示 `E = \frac{1}{2}(...) = ...`

#### Scenario: 输出层反向传播公式
- **WHEN** 训练进入输出层反向传播阶段
- **THEN** 链式法则公式应显示 `\frac{\partial E}{\partial w_k} = \frac{\partial E}{\partial y} \cdot \frac{\partial y}{\partial w_k}`
- **AND** 所有偏导数标记应使用 `\frac{\partial E}{\partial ...}` 格式

#### Scenario: 隐藏层反向传播公式
- **WHEN** 训练进入隐藏层反向传播阶段
- **THEN** 链式法则公式应显示 `\frac{\partial E}{\partial w_{ij}} = \frac{\partial E}{\partial y} \cdot \frac{\partial y}{\partial h_j} \cdot \frac{\partial h_j}{\partial w_{ij}}`
- **AND** 中间变量的偏导数（如 `\frac{\partial E}{\partial h_j}`）应使用 `E` 符号

#### Scenario: 权重更新阶段公式
- **WHEN** 训练进入权重更新阶段
- **THEN** 梯度下降公式应显示 `w_{\text{new}} = w_{\text{old}} - \eta \cdot \frac{\partial E}{\partial w}`

### Requirement: 损失值 UI 显示
可视化页面的损失值显示 SHALL 使用符号 `E` 而非英文单词 "Loss"。

#### Scenario: 网络画布损失值
- **WHEN** 用户查看网络拓扑图
- **THEN** 损失值显示框应显示 `E = [数值]`，而非 `Loss = [数值]`

#### Scenario: 损失曲线图表
- **WHEN** 用户查看损失曲线图表
- **THEN** Y 轴标签应显示 `E`，而非 `Loss`
- **AND** 鼠标悬停或数值提示应显示 `E: [数值]`，而非 `Loss: [数值]`

### Requirement: 代码注释一致性
可视化相关模块的代码注释 SHALL 在涉及数学符号引用时使用 `E` 表示损失函数。

#### Scenario: 函数注释中的数学表达式
- **WHEN** 开发者阅读渲染函数的注释
- **THEN** 注释中提及数学公式时 SHALL 使用 `E`（如："计算 ∂E/∂w"）
- **AND** 变量名可保持 `loss`（如：`const loss = ...`），但面向用户的显示文本 SHALL 使用 `E`
