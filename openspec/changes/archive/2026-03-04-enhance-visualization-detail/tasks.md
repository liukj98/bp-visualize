## 1. 训练状态与模型层改造
- [ ] 1.1 扩展 `TrainingState` phase 枚举，新增子阶段：`forward-hidden`, `forward-output`, `loss-per-output`, `loss-total`, `backward-output`, `backward-hidden`
- [ ] 1.2 在 `NeuralNetwork` 中新增分步前向传播接口：`forwardHidden()` 和 `forwardOutput()`，分别只计算隐藏层/输出层
- [ ] 1.3 在 `NeuralNetwork` 中新增分步反向传播接口：`backwardOutput()` 和 `backwardHidden()`
- [ ] 1.4 新增 `perOutputLoss` 属性，存储各输出节点的单独误差值（E_o₁, E_o₂）

## 2. 总误差节点与偏置节点渲染
- [ ] 2.1 在 `NetworkRenderer.computeLayout()` 中增加误差节点列（输出层右侧），计算 E_total 节点位置
- [ ] 2.2 实现 E_total 节点的绘制（特殊样式：菱形或双圆，区别于普通节点）
- [ ] 2.3 绘制输出节点到 E_total 的虚线连线，线上标注分误差值 E_oᵢ
- [ ] 2.4 实现偏置节点（b₁, b₂）的绘制，位于隐藏层和输出层上方，用虚线连接到对应层节点
- [ ] 2.5 偏置节点显示当前偏置值，连线标注偏置权重

## 3. 细化步进控制逻辑
- [ ] 3.1 改造 `TrainingController.nextStep()` 支持子阶段步进：按顺序推进 `forward-hidden` → `forward-output` → `loss-per-output` → `loss-total` → `backward-output` → `backward-hidden` → `update`
- [ ] 3.2 新增"跳到下一阶段"功能按钮，可跳过当前大阶段的剩余子步骤
- [ ] 3.3 自动训练模式下子步骤间隔由动画速度滑块控制
- [ ] 3.4 快速训练模式跳过所有子步骤动画，直接完成整轮迭代

## 4. 细化动画系统
- [ ] 4.1 前向传播动画拆分：先播放输入层→隐藏层的粒子流动，暂停后再播放隐藏层→输出层的粒子流动
- [ ] 4.2 损失计算动画：输出节点到 E_total 节点的数据汇聚动画（粒子从 o₁, o₂ 流向 E_total）
- [ ] 4.3 反向传播动画拆分：先播放 E_total→输出层的梯度回传，再播放输出层→隐藏层的梯度回传
- [ ] 4.4 权重更新动画：保持现有的插值动画，增加偏置节点连线的同步更新

## 5. 公式面板子步骤同步
- [ ] 5.1 `FormulaDisplay` 新增子阶段渲染方法：`renderForwardHidden()`, `renderForwardOutput()`, `renderLossPerOutput()`, `renderLossTotal()`, `renderBackwardOutput()`, `renderBackwardHidden()`
- [ ] 5.2 每个子阶段方法只展示当前步骤的计算公式，包含完整的中间项展开
- [ ] 5.3 `loss-per-output` 阶段逐个展示 E_o₁, E_o₂ 的计算
- [ ] 5.4 `loss-total` 阶段展示汇总公式 E_total = E_o₁ + E_o₂

## 6. UI 与阶段指示器更新
- [ ] 6.1 更新阶段指示器（phase-indicator），显示当前子步骤名称（如"前向传播 — 隐藏层计算"）
- [ ] 6.2 在控制面板中添加"跳到下一阶段"按钮
- [ ] 6.3 信息面板显示当前子步骤编号（如"步骤 2/7"）
