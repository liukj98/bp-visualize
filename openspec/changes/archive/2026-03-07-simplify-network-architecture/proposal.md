# Change: 简化网络架构为无激活函数、无偏置的 2-2-1 网络

## Why
当前可视化演示使用 2-2-2 网络结构，包含 Sigmoid 激活函数、偏置参数、MSE 损失，对初学者来说概念太多，难以聚焦于反向传播的核心原理。参考知乎文章《一文搞懂反向传播算法》(https://zhuanlan.zhihu.com/p/40378224) 中的极简案例，将网络精简为 2-2-1 结构（5 个神经元），去除激活函数和偏置参数，使用最简单的平方误差损失，让用户可以专注于"前向传播 → 计算误差 → 链式法则求梯度 → 权重更新"这条核心链路。

## Reference
参考文章：https://zhuanlan.zhihu.com/p/40378224

该文章使用一个极简的 2-2-1 网络（共 5 个神经元，6 个权重，无激活函数，无偏置）演示 BP 算法：

- **网络结构**：2 输入 (x₁, x₂) → 2 隐藏 (h₁, h₂) → 1 输出 (y)，共 6 个权重 (w₁~w₆)
- **无激活函数**：所有神经元直接输出加权和，h₁ = w₁·x₁ + w₃·x₂，y = w₅·h₁ + w₆·h₂
- **无偏置**：所有偏置项去掉，进一步降低复杂度
- **损失函数**：简单平方误差 Loss = ½(y - target)²
- **前向传播**：纯线性加权求和
- **反向传播**：链式法则求 ∂Loss/∂wᵢ，无需处理 Sigmoid 导数
- **权重更新**：wᵢ_new = wᵢ_old - η × ∂Loss/∂wᵢ

## What Changes
- **网络模型**：将默认网络从 2-2-2（8 权重 + 2 偏置 + Sigmoid）简化为 2-2-1（6 权重，无偏置，无激活函数）
- **前向传播**：纯线性计算，h = w·x 加权求和，无 Sigmoid 激活
- **损失函数**：使用 Loss = ½(y - target)²（单输出），替代双输出 MSE
- **反向传播**：链式法则直接求偏导，无需 Sigmoid 导数项
- **Canvas 渲染**：更新网络结构图，5 个节点（x₁, x₂, h₁, h₂, y）和 6 条连线（w₁~w₆），去除偏置节点和 E_total 菱形节点
- **控制面板**：移除激活函数选择器，保留学习率滑块和训练控制按钮
- **公式面板**：更新所有子步骤的公式展示，去除 Sigmoid 相关公式
- **教育页面**：重写算法原理详解，以 2-2-1 无激活无偏置网络为例逐步演示
- **训练信息面板**：移除激活函数显示行

## Impact
- Affected specs: bp-algorithm-visualization, bp-algorithm-education
- Affected code:
  - `src/model/neural-network.js` — 网络结构、前向/反向传播、权重更新逻辑
  - `src/model/activations.js` — 不再使用（可保留但默认不启用）
  - `src/model/loss-functions.js` — 简化为单输出平方误差
  - `src/view/network-renderer.js` — 渲染 5 节点 6 连线的网络图
  - `src/view/formula-display.js` — 更新所有子步骤的公式
  - `src/controller/ui-controller.js` — 移除激活函数选择器逻辑
  - `src/pages/education.js` — 重写教育页面内容
  - `index.html` — 移除激活函数选择器，更新默认参数
- **BREAKING**：网络结构从 2-2-2 变为 2-2-1，所有数值和公式都将变化
