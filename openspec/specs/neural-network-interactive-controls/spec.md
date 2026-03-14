# neural-network-interactive-controls Specification

## Purpose
TBD - created by archiving change add-bp-visualization. Update Purpose after archive.
## Requirements
### Requirement: Network Architecture Configuration
系统 SHALL 提供控制面板，允许用户配置神经网络的层数（2-4层）和每层节点数（1-8个）。

#### Scenario: Add hidden layer
- **WHEN** 用户增加隐藏层数量
- **THEN** 网络结构实时更新，新增的层使用随机初始化权重，可视化画面重新绘制

#### Scenario: Modify layer size
- **WHEN** 用户调整某一层的节点数
- **THEN** 该层节点数更新，相关连线和权重重新生成，网络结构图重新渲染

### Requirement: Training Parameter Controls
系统 SHALL 提供学习率调节滑块和激活函数选择器，允许用户实时调整训练参数。

#### Scenario: Adjust learning rate
- **WHEN** 用户拖动学习率滑块
- **THEN** 学习率值实时更新并显示当前值，后续训练迭代使用新的学习率

#### Scenario: Switch activation function
- **WHEN** 用户在 Sigmoid 和 ReLU 之间切换激活函数
- **THEN** 网络的激活函数立即切换，下次前向传播使用新的激活函数

### Requirement: Step-by-Step Training Control
系统 SHALL 支持单步执行模式，将一次完整训练迭代分解为四个可独立触发的阶段：前向传播、损失计算、反向传播、权重更新。

#### Scenario: Single step execution
- **WHEN** 用户点击"下一步"按钮
- **THEN** 系统执行当前阶段的动画（按顺序：前向传播→损失计算→反向传播→权重更新），完成后停留等待下一步操作

#### Scenario: Auto training mode
- **WHEN** 用户点击"自动训练"按钮
- **THEN** 系统以可调速度自动连续执行训练迭代，动画持续播放直到用户暂停或达到预设迭代次数

### Requirement: Training Reset
系统 SHALL 提供重置功能，允许用户重新初始化网络权重并清空训练历史。

#### Scenario: Reset training
- **WHEN** 用户点击"重置"按钮
- **THEN** 所有权重重新随机初始化，训练迭代次数归零，损失曲线清空，网络结构保持不变

### Requirement: Input Data Selection
系统 SHALL 提供预设的训练数据集选择（如 XOR、AND、OR 逻辑门）和自定义输入功能。

#### Scenario: Select preset dataset
- **WHEN** 用户从下拉菜单选择一个预设数据集（如 XOR）
- **THEN** 系统加载对应的输入输出数据对，重置训练状态，准备开始新的训练

#### Scenario: Custom input values
- **WHEN** 用户手动输入自定义的输入值
- **THEN** 系统使用用户提供的输入值进行前向传播和可视化

