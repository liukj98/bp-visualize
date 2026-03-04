# Change: 增强可视化演示细节——添加总误差节点与详细流程展示

## Why
当前的可视化演示在讲解 BP 算法时，输出层计算完毕后直接进入反向传播阶段，缺少"总误差"这一关键概念的可视化呈现。对于初学者（尤其是作为教学演示的观众），无法直观理解"误差是如何从输出层汇聚并反向传播回去的"。需要在网络图中增加一个 **总误差节点（E_total）**，并在整体流程中补充更详细的中间步骤展示，使每一步的数据流转都清晰可见。

## What Changes
- **新增总误差节点**：在输出层右侧新增一个特殊的 "E_total" 节点，连接所有输出节点，实时显示总误差值
- **新增各输出节点的单独误差**：每个输出节点（o₁, o₂）上方/下方显示各自的分误差 E_o₁, E_o₂
- **细化前向传播流程**：将前向传播拆分为"隐藏层计算"和"输出层计算"两个可视子步骤，每步暂停展示中间结果
- **细化损失计算流程**：逐步显示每个输出节点的误差计算过程，最后汇聚到总误差节点，并配合数据流动动画
- **细化反向传播流程**：从总误差节点出发，先展示误差信号回传到输出层，再展示传递到隐藏层，每步暂停
- **增强公式面板同步**：公式推导面板在每个子步骤显示对应的详细计算公式，包括中间乘积项展开
- **增强偏置可视化**：在网络图中直观展示偏置节点（b₁, b₂），而非仅在公式中出现

## Impact
- Affected specs: `bp-algorithm-visualization`, `bp-algorithm-education`
- Affected code:
  - `src/model/neural-network.js` — 增加分步前向/反向传播接口
  - `src/model/training-state.js` — 增加子阶段状态（如 `forward-hidden`, `forward-output`, `loss-per-output`, `loss-total`, `backward-output`, `backward-hidden`）
  - `src/view/network-renderer.js` — 绘制总误差节点、偏置节点、分误差标注
  - `src/view/animation-engine.js` — 增加误差汇聚动画、分步动画编排
  - `src/view/formula-display.js` — 每个子阶段配套公式展示
  - `src/controller/training-controller.js` — 支持细分步骤的步进控制
  - `src/controller/ui-controller.js` — 阶段指示器显示子步骤信息
