## ADDED Requirements

### Requirement: Neural Network Structure Rendering
系统 SHALL 在 Canvas 上绘制完整的神经网络结构图，包括输入层、隐藏层和输出层的节点及层间连线，并在连线上标注当前权重值。

#### Scenario: Default network rendering
- **WHEN** 用户首次打开可视化页面
- **THEN** 系统显示一个默认的 3 层神经网络结构（2-3-1），所有节点和连线清晰可见，权重值随机初始化并标注在连线上

#### Scenario: Custom network structure
- **WHEN** 用户通过控制面板修改网络层数或节点数
- **THEN** Canvas 重新绘制对应结构的网络图，权重重新随机初始化

### Requirement: Forward Propagation Animation
系统 SHALL 以动画形式展示前向传播过程，数据从输入层逐层流向输出层，每个节点在被激活时高亮显示其计算过程（加权和 + 激活函数）。

#### Scenario: Step-by-step forward propagation
- **WHEN** 用户点击"前向传播"按钮
- **THEN** 系统以动画形式逐层展示数据流动：输入值沿连线传递，经过加权求和，通过激活函数，节点依次亮起显示激活值

#### Scenario: Forward propagation with value display
- **WHEN** 前向传播动画进行中
- **THEN** 每个节点旁显示当前的加权和值和激活输出值

### Requirement: Loss Calculation Display
系统 SHALL 在前向传播完成后，展示网络输出与期望输出的对比以及损失函数值的计算过程。

#### Scenario: Loss value display
- **WHEN** 前向传播动画完成
- **THEN** 系统显示实际输出值、期望输出值、以及 MSE 损失值，并以视觉方式突出误差大小

### Requirement: Backpropagation Animation
系统 SHALL 以动画形式展示反向传播过程，梯度从输出层逐层回传至输入层，连线颜色和粗细反映梯度大小。

#### Scenario: Step-by-step backpropagation
- **WHEN** 用户点击"反向传播"按钮（或损失计算完成后自动进入）
- **THEN** 系统以动画形式分步展示链式法则：(1) 输出层误差信号 δ_o1 = ∂E/∂out_o1 × ∂out_o1/∂net_o1，逐项展示每个偏导数的含义和数值；(2) 计算 ∂E/∂w5 = δ_o1 × out_h1；(3) 隐藏层误差 δ_h1 的计算（需累加来自 o1 和 o2 的误差贡献）。连线以颜色热力图表示梯度大小

#### Scenario: Gradient values display
- **WHEN** 反向传播动画进行中
- **THEN** 每条连线旁显示 ∂E/∂w 梯度值，节点旁显示 δ 误差信号值。同时在侧边面板展示完整的链式法则分解公式

### Requirement: Weight Update Visualization
系统 SHALL 在反向传播完成后，以可视化方式展示权重更新过程，显示更新前后的权重值变化。

#### Scenario: Weight update animation
- **WHEN** 反向传播动画完成，进入权重更新阶段
- **THEN** 系统以动画形式展示每条连线的权重从旧值变化到新值，变化幅度以颜色深浅表示

### Requirement: Training Loss Chart
系统 SHALL 实时显示训练损失曲线，横轴为迭代次数，纵轴为损失值。

#### Scenario: Loss curve update
- **WHEN** 每次权重更新完成后
- **THEN** 损失曲线图表新增一个数据点，曲线实时更新
