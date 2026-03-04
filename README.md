# BP 反向传播算法 — 交互式可视化演示

一个基于 Canvas 的神经网络反向传播（Backpropagation）算法交互式可视化教学工具。通过逐步动画演示数据在网络中的流动、损失计算、梯度回传及权重更新，帮助理解 BP 算法的完整工作流程。

## 功能特性

**可视化演示**
- Canvas 绘制神经网络结构（默认 2-2-2 三层网络）
- 前向传播逐层流动动画，节点实时显示 net/out 值
- 反向传播梯度回传动画，连线梯度热力图着色
- 权重更新前后对比，平滑过渡动画
- 训练损失曲线实时图表

**交互控制**
- 单步执行：逐阶段观察前向传播 → 损失计算 → 反向传播 → 权重更新
- 自动训练 / 快速批量训练（自定义迭代次数）
- 学习率实时调节（0.01 ~ 2.0）
- 激活函数切换（Sigmoid / ReLU）
- 动画速度控制

**公式推导**
- 右侧面板随训练阶段动态展示对应的数学公式（KaTeX 渲染）
- 独立的「算法原理」页面，包含完整 BP 算法推导过程

## 默认演示参数

参考经典 Matt Mazur BP 教程（[一文搞懂反向传播算法](https://zhuanlan.zhihu.com/p/40378224)）：

| 参数 | 值 |
|------|------|
| 输入 | i₁ = 0.05, i₂ = 0.10 |
| 目标输出 | o₁ = 0.01, o₂ = 0.99 |
| 权重（输入→隐藏） | w₁ = 0.15, w₂ = 0.20, w₃ = 0.25, w₄ = 0.30 |
| 权重（隐藏→输出） | w₅ = 0.40, w₆ = 0.45, w₇ = 0.50, w₈ = 0.55 |
| 偏置 | b₁ = 0.35, b₂ = 0.60 |
| 学习率 | η = 0.5 |

10000 次迭代后误差可降至 ≈ 0.000035。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 技术栈

- **构建工具**：Vite
- **公式渲染**：KaTeX
- **可视化**：Canvas 2D API
- **语言**：原生 JavaScript（ES Modules）
- 零框架依赖，纯前端应用

## 项目结构

```
src/
├── main.js                    # 应用入口
├── controller/
│   ├── event-bus.js           # 事件总线
│   ├── training-controller.js # 训练流程控制
│   └── ui-controller.js       # UI 交互控制
├── model/
│   ├── activations.js         # 激活函数（Sigmoid/ReLU）
│   ├── loss-functions.js      # 损失函数（MSE）
│   ├── neural-network.js      # 神经网络核心模型
│   └── training-state.js      # 训练状态管理
├── pages/
│   └── education.js           # 算法原理教育页面
├── styles/
│   └── main.css               # 全局样式
├── utils/
│   ├── color-utils.js         # 颜色映射工具
│   └── math-utils.js          # 数学工具函数
└── view/
    ├── animation-engine.js    # 动画引擎
    ├── chart-renderer.js      # 损失曲线图表
    ├── formula-display.js     # KaTeX 公式动态展示
    └── network-renderer.js    # Canvas 网络结构渲染
```

## License

MIT
