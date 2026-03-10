## 1. 实现「简化公式」小节
- [x] 1.1 在 `src/pages/education.js` 中，`#sec-params` 对应的 `edu-step-card` 之后、`#sec-forward` 之前插入新的 `<h3 id="sec-formulas">简化公式</h3>` 标题
- [x] 1.2 在新标题下添加 `edu-step-card` 容器，包含前向传播公式组（h₁、h₂、y）和损失函数公式（E），使用 `renderFormula()` 渲染 KaTeX 公式
- [x] 1.3 添加梯度下降权重更新公式 `w_new = w_old − η × ∂E/∂w`，使用 `renderFormula()` 渲染

## 2. 验证
- [x] 2.1 本地运行项目，确认「简化公式」小节显示在正确位置（「网络结构与初始参数」之后、「步骤一：前向传播」之前）
- [x] 2.2 确认所有 KaTeX 公式正确渲染，无报错（vite build 成功，无 lint 错误）
- [x] 2.3 确认侧边栏导航自动出现「简化公式」条目，点击可平滑滚动到对应位置（h3[id] 自动被 buildSidebarNav 识别）
- [x] 2.4 确认新内容不影响其余小节的展示和滚动定位（仅插入新内容，未修改已有代码）
