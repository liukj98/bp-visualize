# Neural Tech Dark 设计报告

## 概述

基于 **superdesign** 技能的 **Modern Dark Mode** 设计模式,为 BP 反向传播算法可视化项目打造了全新的**暗黑系 + 科技风 + 神经网络主题**风格。

---

## 设计系统

### 色彩方案

采用 **oklch()** 现代色彩定义,确保色彩感知一致性和现代感:

| 颜色角色 | 值 | 用途 |
|---------|-----|------|
| **主背景** | `oklch(0.08 0 0)` | 深邃太空黑,营造科技氛围 |
| **次背景** | `oklch(0.12 0.01 250)` | 带微蓝调的次级背景 |
| **玻璃态** | `oklch(0.12 0.01 250 / 0.7)` | 毛玻璃效果背景 |
| **主文字** | `oklch(0.95 0 0)` | 高对比度白色 |
| **次文字** | `oklch(0.7 0.02 250)` | 微蓝灰辅助文字 |
| **电光蓝** | `oklch(0.6 0.2 250)` | 主色调,神经网络激活 |
| **霓虹青** | `oklch(0.7 0.15 180)` | 强调色,数据流动 |
| **紫罗兰** | `oklch(0.55 0.18 300)` | 辅助色,梯度传播 |
| **荧光绿** | `oklch(0.65 0.2 140)` | 成功色,收敛状态 |
| **能量橙** | `oklch(0.65 0.18 50)` | 警告色,反向传播 |

### 发光效果系统

```css
--glow-blue: 0 0 20px oklch(0.6 0.2 250 / 0.4);
--glow-cyan: 0 0 20px oklch(0.7 0.15 180 / 0.4);
--glow-violet: 0 0 20px oklch(0.55 0.18 300 / 0.4);
--glow-green: 0 0 20px oklch(0.65 0.2 140 / 0.4);
```

### 字体系统

- **主字体**: Inter (Google Fonts)
- **代码字体**: JetBrains Mono
- **字重**: 300-700

---

## 核心设计元素

### 1. 神经网络网格背景

```css
body::before {
  background-image: 
    linear-gradient(oklch(0.15 0.02 250 / 0.3) 1px, transparent 1px),
    linear-gradient(90deg, oklch(0.15 0.02 250 / 0.3) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

- 50px 网格线
- 微蓝灰色调
- 40% 透明度
- 营造电路板/神经网络视觉

### 2. 动态 Logo 图标

SVG 神经网络图标,包含:
- 5 个发光节点 (输入层×2 + 隐藏层×1 + 输出层×2)
- 4 条连接线
- 脉冲动画效果 (2s 循环)
- 蓝-青-紫渐变配色

### 3. Glassmorphism 玻璃态

```css
.header, .sidebar, .edu-sidebar {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
}
```

- 70% 透明度背景
- 20px 模糊半径
- 科技感半透明效果

### 4. 渐变边框装饰

Header 底部动态渐变线:
```css
background: linear-gradient(90deg, 
  transparent 0%, 
  var(--accent-blue) 20%, 
  var(--accent-cyan) 50%, 
  var(--accent-violet) 80%, 
  transparent 100%
);
```

### 5. 阶段指示器发光效果

每个训练阶段都有独特的霓虹发光:
- **Forward**: 电光蓝发光
- **Loss**: 霓虹青发光
- **Backward**: 能量橙发光
- **Update**: 荧光绿发光

---

## 动画系统

### 微交互 (superdesign 推荐)

| 元素 | 动画 | 时长 | 效果 |
|------|------|------|------|
| Button Hover | translateY + shadow | 150ms | 上浮 + 发光 |
| Button Active | scale(0.97) | 100ms | 按压反馈 |
| Tab Switch | gradient fade | 150ms | 渐变过渡 |
| Slider Thumb | scale + glow | 150ms | 放大发光 |
| Card Hover | translateY(-2px) + shadow | 250ms | 悬浮效果 |

### 关键帧动画

```css
@keyframes neural-pulse {
  0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 5px var(--accent-cyan)); }
  50% { opacity: 1; filter: drop-shadow(0 0 15px var(--accent-cyan)); }
}
```

---

## 布局结构

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  BP 反向传播算法    [Stats]    [Tab1] [Tab2] [Tab3] │  ← Header (Glassmorphism)
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐  ┌──────────────┐  │
│  │ Phase: [FORWARD]                    │  │ 训练控制      │  │
│  │ Network: 2-2-1                      │  │ ━━━━━━━━━━   │  │
│  │                                     │  │ [Step][Auto]  │  │
│  │    ╱╲        ╱╲                     │  │ [Reset]       │  │
│  │   ○  ○ ──── ○                       │  │ ━━━━━━━━━━   │  │
│  │    ╲╱        ╲╱                     │  │ η = 0.10      │  │
│  │                                     │  │ Speed: 500ms  │  │
│  │  [Neural Network Visualization]     │  │ ━━━━━━━━━━   │  │
│  │                                     │  │ 训练信息      │  │
│  ├─────────────────────────────────────┤  │ Iter: 0       │  │
│  │                                     │  │ Loss: —       │  │
│  │  [Loss Chart]                       │  │ LR: 0.1       │  │
│  │                                     │  │ ━━━━━━━━━━   │  │
│  └─────────────────────────────────────┘  │ 公式推导 🔍   │  │
│                                           └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 响应式设计

### 断点

- **Desktop** (≥1024px): 完整布局,侧边栏 360px
- **Tablet** (768px-1023px): 隐藏统计信息,侧边栏 320px
- **Mobile** (<768px): 垂直堆叠,全宽侧边栏

### 移动端适配

- Header 换行显示
- Tabs 底部全宽
- Sidebar 改为底部面板 (max-height: 40vh)
- 教育页面侧边栏宽度缩减至 180px

---

## 技术实现

### CSS 特性使用

- **oklch()**: 现代色彩空间,更好的感知一致性
- **backdrop-filter**: 毛玻璃效果
- **CSS Variables**: 完整的设计令牌系统
- **Gradient Borders**: 渐变边框装饰
- **Text Shadow**: 霓虹发光文字效果
- **Box Shadow**: 多层次发光阴影

### 性能优化

- 使用 `transform` 和 `opacity` 进行动画 (GPU 加速)
- 网格背景使用 `pointer-events: none` 避免重绘
- 滚动条自定义样式,保持主题一致
- 压缩后 CSS 仅 11.91 KB (gzip)

---

## 设计亮点

1. **神经网络视觉语言**: Logo、网格背景、发光节点统一主题
2. **科技感发光系统**: 每个交互元素都有精心设计的霓虹发光
3. **玻璃态层次**: Header、Sidebar 使用毛玻璃效果增加深度
4. **动态反馈**: 阶段指示器、按钮、滑块都有即时视觉反馈
5. **专业配色**: oklch() 确保色彩在暗黑模式下依然鲜艳

---

## 在线预览

🔗 **http://4db660d1678d4ea58f913da0db2b20cc.ap-singapore.myide.io**

---

*基于 SuperDesign Modern Dark Mode 设计模式*
*Design System: Neural Tech Dark v1.0*
