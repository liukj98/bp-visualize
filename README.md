# BP 反向传播算法 — 交互式可视化教学平台

<div align="center">

![BP Visualization](https://img.shields.io/badge/BP-Visualization-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![KaTeX](https://img.shields.io/badge/KaTeX-0.16.33-339966)

**一个零框架依赖的神经网络反向传播算法交互式可视化教学工具**

[在线演示](http://eb01374724824f8c8361014ff7f41f28.ap-singapore.myide.io) | [算法详解](#核心特性) | [快速开始](#快速开始)

</div>

---

## 📖 项目简介

通过 Canvas 动画逐步演示数据在神经网络中的流动、损失计算、梯度回传及权重更新过程，帮助初学者直观理解 BP 算法的完整工作流程。

**教学特色**：
- 🎯 **简化模型**：采用 2-2-1 纯线性网络（无激活函数、无偏置），专注于 BP 算法核心原理
- 📐 **数学一致**：损失函数统一使用符号 $E$，所有公式符合数学标准记法
- 🎬 **六步拆解**：前向传播（隐藏层→输出层）→ 损失计算 → 反向传播（输出层→隐藏层）→ 权重更新
- 📊 **实时可视化**：粒子动画、梯度热力图、损失曲线、动态公式展示

---

## ✨ 核心特性

### 🎨 交互式可视化

#### 1. 神经网络结构渲染
- Canvas 绘制 2-2-1 三层网络（输入层 2 节点、隐藏层 2 节点、输出层 1 节点）
- 6 条权重连线（$w_1$ ~ $w_6$）带实时数值标注
- 节点可拖拽重新布局，连线自动跟随更新
- 鼠标悬停节点显示抓手光标

#### 2. 逐步动画演示
- **前向传播**：
  - 隐藏层计算：$h_1 = w_1 \cdot x_1 + w_3 \cdot x_2$，$h_2 = w_2 \cdot x_1 + w_4 \cdot x_2$
  - 输出层计算：$y = w_5 \cdot h_1 + w_6 \cdot h_2$
  - 粒子从输入节点流向输出节点，节点实时显示计算值
  
- **损失计算**：
  - 平方误差：$E = \frac{1}{2}(y - \text{target})^2$
  - 损失值高亮显示在输出节点旁

- **反向传播**：
  - 输出层梯度：$\frac{\partial E}{\partial w_5}$、$\frac{\partial E}{\partial w_6}$
  - 隐藏层梯度：$\frac{\partial E}{\partial w_1}$ ~ $\frac{\partial E}{\partial w_4}$
  - 连线颜色渐变表示梯度大小（橙色→深橙）

- **权重更新**：
  - 梯度下降：$w_{\text{new}} = w_{\text{old}} - \eta \cdot \frac{\partial E}{\partial w}$
  - 权重标签平滑过渡到新值

#### 3. 训练损失曲线
- 实时绘制损失-轮次曲线图
- 支持多轮训练历史记录
- 当前损失值置顶显示

### 📚 三大教学模块

#### 📖 算法原理页面
完整的 BP 算法推导教学内容，包含：
- **网络结构说明**：2-2-1 线性网络参数表
- **简化公式速查**：前向传播、损失函数、梯度下降、链式法则展开
- **六步详细推导**：
  1. 前向传播（隐藏层 + 输出层）
  2. 损失计算（MSE 公式及数值代入）
  3. 反向传播 - 输出层（链式法则求 $\frac{\partial E}{\partial w_5}$、$\frac{\partial E}{\partial w_6}$）
  4. 反向传播 - 隐藏层（链式法则求 $\frac{\partial E}{\partial w_1}$ ~ $\frac{\partial E}{\partial w_4}$）
  5. 权重更新（梯度下降公式及数值计算）
  6. 训练收敛对比（第 1 轮 vs 第 10 轮 vs 第 100 轮）
- **关键概念解析**：链式法则、纯线性网络的优势、梯度下降原理
- **侧边栏导航**：快速跳转到各章节，滚动高亮当前位置

#### 🎯 可视化演示页面
- 左侧：Canvas 网络渲染 + 损失曲线图表
- 右侧：动态公式面板（随训练步骤实时切换公式）
- 底部：训练控制面板
  - 单步执行 / 自动训练 / 快速训练
  - 学习率滑块调节（0.01 ~ 2.0）
  - 重置网络 / 暂停继续

#### 💡 梯度下降详解页面
基于 `BP-FAQ.md` 渲染的 FAQ 问答页面，包含：
- 梯度下降的直观理解
- 学习率对训练的影响
- 局部最优与全局最优
- 常见优化器对比（SGD、Momentum、Adam）
- 收敛与发散的数学定义
- KaTeX 支持行内公式和块公式渲染

---

## 🚀 快速开始

### 环境要求
- Node.js >= 14
- 现代浏览器（支持 ES Modules 和 Canvas 2D）

### 本地运行

```bash
# 1. 克隆项目
git clone <repository-url>
cd bp-visualize

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000

# 4. 生产构建
npm run build

# 5. 预览构建产物
npm run preview
```

### 在线体验
🌐 **演示地址**: http://eb01374724824f8c8361014ff7f41f28.ap-singapore.myide.io

---

## 🎓 默认演示参数

为了教学简化，本项目使用 **2-2-1 纯线性网络**（无激活函数、无偏置）：

| 参数 | 值 | 说明 |
|------|------|------|
| **网络结构** | 2-2-1 | 输入层 2 节点、隐藏层 2 节点、输出层 1 节点 |
| **输入** | $x_1 = 1.0$, $x_2 = 0.5$ | 固定输入值 |
| **目标输出** | $\text{target} = 4.0$ | 期望网络输出 |
| **初始权重** | $w_1 = 0.5$, $w_2 = 2.3$, $w_3 = 1.5$, $w_4 = 3.0$ | 输入层→隐藏层 |
| | $w_5 = 1.0$, $w_6 = 1.0$ | 隐藏层→输出层 |
| **学习率** | $\eta = 0.1$ | 可在界面实时调节 |
| **损失函数** | $E = \frac{1}{2}(y - \text{target})^2$ | MSE（均方误差） |

**收敛效果**：
- 初始输出：$y = 5.05$，损失 $E = 0.5513$
- 第 1 轮后：$y = 3.1768$，损失 $E = 0.3388$
- 第 10 轮后：$y = 4.0257$，损失 $E = 0.0003$
- 第 100 轮后：$y \approx 4.0$，损失 $E \approx 0$

---

## 📦 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **构建工具** | Vite | 7.3.1 |
| **数学公式** | KaTeX | 0.16.33 |
| **可视化** | Canvas 2D API | 原生 |
| **开发语言** | JavaScript | ES Modules |
| **样式** | CSS3 | 原生 + CSS 变量 |

**特点**：
- ✅ 零前端框架依赖（无 React/Vue/Angular）
- ✅ 纯静态部署（仅需 HTTP 服务器）
- ✅ 模块化代码组织（MVC 架构）
- ✅ 响应式设计（适配桌面浏览器）


---

## 📂 项目结构

```
bp-visualize/
├── index.html                      # 应用入口 HTML
├── vite.config.js                  # Vite 构建配置
├── package.json                    # 项目依赖
├── BP-FAQ.md                       # 梯度下降 FAQ 内容源
├── 深度学习调参指南.md              # 超参数调优指南
├── 项目完善建议报告.md              # 功能改进建议
│
├── src/                            # 源代码目录
│   ├── main.js                     # 应用入口（初始化 MVC）
│   │
│   ├── controller/                 # 控制器层
│   │   ├── event-bus.js            # 事件总线（解耦组件通信）
│   │   ├── training-controller.js  # 训练流程控制器
│   │   └── ui-controller.js        # UI 交互控制器
│   │
│   ├── model/                      # 模型层
│   │   ├── activations.js          # 激活函数（Sigmoid/ReLU）
│   │   ├── loss-functions.js       # 损失函数（MSE）
│   │   ├── neural-network.js       # 神经网络核心模型
│   │   └── training-state.js       # 训练状态管理
│   │
│   ├── view/                       # 视图层
│   │   ├── animation-engine.js     # 粒子动画引擎
│   │   ├── chart-renderer.js       # 损失曲线图表渲染
│   │   ├── formula-display.js      # KaTeX 公式动态展示
│   │   └── network-renderer.js     # Canvas 网络结构渲染
│   │
│   ├── pages/                      # 页面模块
│   │   ├── education.js            # 算法原理教育页面
│   │   └── faq.js                  # 梯度下降详解页面
│   │
│   ├── utils/                      # 工具函数
│   │   ├── color-utils.js          # 颜色映射（梯度热力图）
│   │   └── math-utils.js           # 数学工具函数
│   │
│   └── styles/                     # 样式
│       └── main.css                # 全局样式（CSS 变量主题）
│
├── openspec/                       # OpenSpec 规范管理
│   ├── project.md                  # 项目约定
│   ├── specs/                      # 功能规范
│   │   ├── bp-algorithm-education/
│   │   ├── bp-algorithm-visualization/
│   │   ├── neural-network-interactive-controls/
│   │   └── static-deployment/
│   └── changes/archive/            # 已归档的变更历史
│
└── dist/                           # 构建产物（npm run build 生成）
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── assets/[KaTeX fonts]
```

---

## 🛠️ 开发指南

### 代码架构

采用 **MVC 架构模式**：

```
┌─────────────────┐
│  View（视图层）   │  Canvas 渲染、图表、公式展示
└────────┬────────┘
         │ 事件通知
         ↓
┌─────────────────┐
│ Controller（控制） │  训练流程控制、UI 交互响应
└────────┬────────┘
         │ 调用模型
         ↓
┌─────────────────┐
│  Model（模型层）  │  神经网络计算、训练状态管理
└─────────────────┘
```

**事件驱动设计**：
- 使用 `EventBus` 解耦组件通信
- 主要事件：
  - `phase-changed`: 训练阶段切换
  - `network-updated`: 网络权重更新
  - `animation-complete`: 动画播放完成

### 添加新功能

#### 1. 添加新的激活函数
```javascript
// src/model/activations.js
export function newActivation(x) {
  // 实现新激活函数
  return ...;
}

export function newActivationDerivative(x) {
  // 实现导数
  return ...;
}
```

#### 2. 支持自定义网络结构
修改 `src/model/neural-network.js` 的构造函数参数，在 UI 添加配置选项。

#### 3. 扩展可视化效果
在 `src/view/animation-engine.js` 中添加新的粒子类型或动画效果。

### 代码规范

- **命名约定**：
  - 变量/函数：驼峰命名法 `camelCase`
  - 类：帕斯卡命名法 `PascalCase`
  - 常量：大写下划线 `UPPER_SNAKE_CASE`
  
- **注释规范**：
  - 复杂算法必须添加数学公式注释
  - 使用 JSDoc 格式注释公开 API

- **数学符号一致性**：
  - 损失函数统一使用 $E$ 而非 `Loss`
  - 学习率使用 $\eta$ (eta)
  - 偏导数使用 $\frac{\partial E}{\partial w}$ 格式

---

## 🎨 自定义主题

项目使用 CSS 变量定义主题色：

```css
:root {
  --bg-primary: #0f172a;        /* 主背景色 */
  --bg-secondary: #1e293b;      /* 次要背景色 */
  --text-primary: #e2e8f0;      /* 主文本色 */
  --accent-cyan: #22d3ee;       /* 强调色（青色）*/
  --accent-orange: #fb923c;     /* 梯度色（橙色）*/
  --border: #334155;            /* 边框色 */
}
```

修改 `src/styles/main.css` 中的变量即可更换主题。

---

## 📊 性能优化

- **Canvas 优化**：
  - 使用 `requestAnimationFrame` 控制渲染帧率
  - 脏区域重绘（仅更新变化部分）
  - 离屏 Canvas 缓存复杂图形
  
- **动画优化**：
  - 限制同时运行的粒子数量
  - 使用缓动函数（easing）平滑过渡

- **计算优化**：
  - 前向/反向传播使用矩阵运算
  - 避免重复计算梯度

---

## 🧪 测试与验证

### 手动验证步骤

1. **前向传播验证**：
   - 输入 $x_1 = 1, x_2 = 0.5$
   - 初始权重：$w_1 = 0.5, w_2 = 2.3, w_3 = 1.5, w_4 = 3, w_5 = 1, w_6 = 1$
   - 预期输出：$y = 5.05$

2. **损失计算验证**：
   - 目标值：$\text{target} = 4$
   - 预期损失：$E = 0.55125$

3. **梯度计算验证**：
   - $\frac{\partial E}{\partial w_5} = 1.3125$
   - $\frac{\partial E}{\partial w_6} = 3.99$

4. **权重更新验证**：
   - 学习率 $\eta = 0.1$
   - 第 1 轮后 $w_5 = 0.86875$

### 对照参考文档

教学内容与 [一文搞懂反向传播算法](https://zhuanlan.zhihu.com/p/40378224) 的数学推导保持一致（但使用了简化的 2-2-1 线性网络）。

---

## 📚 相关文档

- **算法详解**: 查看项目中的「算法原理」标签页
- **调参指南**: [`深度学习调参指南.md`](./深度学习调参指南.md)
- **FAQ**: 查看项目中的「梯度下降详解」标签页
- **改进建议**: [`项目完善建议报告.md`](./项目完善建议报告.md)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

**开发流程**：
1. Fork 项目
2. 创建特性分支：`git checkout -b feature/新功能`
3. 提交更改：`git commit -m 'Add: 新功能描述'`
4. 推送分支：`git push origin feature/新功能`
5. 提交 Pull Request

**建议改进方向**：
- 支持自定义输入/目标/权重
- 添加更多激活函数（Tanh、Leaky ReLU、GELU）
- 移动端响应式适配
- 训练历史导出/导入
- 支持多层网络配置

---

## 📝 更新日志

### v1.0.0 (2026-03-14)
- ✅ 完成 2-2-1 线性网络可视化
- ✅ 六步骤动画演示（前向→损失→反向→更新）
- ✅ 算法原理教学页面（完整推导）
- ✅ 梯度下降 FAQ 页面
- ✅ 损失函数符号统一为 $E$
- ✅ 节点拖拽交互
- ✅ 损失曲线图表
- ✅ CloudStudio 在线部署

---

## 📄 许可证

MIT License

Copyright (c) 2026 BP Visualize

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🌟 致谢

- 参考教程：[一文搞懂反向传播算法 - 知乎](https://zhuanlan.zhihu.com/p/40378224)
- 数学公式渲染：[KaTeX](https://katex.org/)
- 构建工具：[Vite](https://vitejs.dev/)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎 Star！**

Made with ❤️ for Deep Learning Education

</div>
