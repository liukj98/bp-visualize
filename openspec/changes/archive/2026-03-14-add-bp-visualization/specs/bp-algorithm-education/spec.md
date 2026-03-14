## ADDED Requirements

### Requirement: Algorithm Overview Page
系统 SHALL 提供 BP 算法概述页面，包含算法历史、核心思想、应用场景的介绍文字。

#### Scenario: View algorithm introduction
- **WHEN** 用户导航到"算法介绍"页面
- **THEN** 系统显示 BP 算法的概述内容，包括历史背景、核心思想（误差反向传播 + 梯度下降）和典型应用场景

### Requirement: Mathematical Formula Display
系统 SHALL 使用 KaTeX 渲染 BP 算法的核心数学公式，与参考文章（zhihu p/40378224）的推导过程保持一致，包括前向传播公式、MSE 损失函数、链式法则梯度推导和权重更新公式。

#### Scenario: Display forward propagation formula
- **WHEN** 用户查看前向传播说明区域
- **THEN** 系统以 KaTeX 渲染展示：(1) 加权和公式 net_h = Σ(w_i × x_i) + b；(2) Sigmoid 激活函数 out_h = 1/(1+e^(-net_h))；并以参考文章数值代入演示：net_h1 = 0.15×0.05 + 0.20×0.10 + 0.35 = 0.3775

#### Scenario: Display backpropagation derivation
- **WHEN** 用户查看反向传播说明区域
- **THEN** 系统以 KaTeX 渲染展示完整的链式法则三步分解：∂E_total/∂w5 = ∂E_total/∂out_o1 × ∂out_o1/∂net_o1 × ∂net_o1/∂w5，逐项说明每个偏导数的物理含义和计算方法（Sigmoid 导数 σ'(x) = σ(x)(1-σ(x))），并展示隐藏层误差需要累加来自多个输出节点的梯度贡献

### Requirement: Guided Learning Mode
系统 SHALL 提供引导学习模式，按顺序带领用户了解 BP 算法的每个步骤，并在可视化面板中同步演示。

#### Scenario: Start guided mode
- **WHEN** 用户点击"引导学习"按钮
- **THEN** 系统进入引导模式，左侧显示步骤说明文字和公式，右侧可视化面板同步演示对应步骤，用户可通过"下一步"/"上一步"按钮控制进度

#### Scenario: Guided mode step synchronization
- **WHEN** 用户在引导模式中点击"下一步"
- **THEN** 文字说明更新到下一个步骤，可视化面板自动执行对应的动画（如从"前向传播说明"切换到"损失计算说明"时，可视化面板播放损失计算动画）
