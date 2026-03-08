## Context
Canvas 当前是纯渲染用途，`computeLayout()` 每帧重新计算固定网格坐标，没有任何鼠标/触摸事件。需要新增拖拽交互，同时不干扰现有的训练动画流程。

## Goals / Non-Goals
- Goals: 用户可拖拽任意神经元节点，连线/标签/动画自动跟随新位置；重置恢复默认布局
- Non-Goals: 不支持拖拽连线、不支持拖拽创建新节点、不改变网络拓扑

## Decisions

### 1. 自定义位置存储：`customPositions` Map
- **What**: 在 `NetworkRenderer` 中新增 `customPositions = new Map()`，key 为 `"layerIdx-nodeIdx"` 字符串，value 为 `{ x, y }`
- **Why**: Map 查找 O(1)，key 用字符串拼接最简单；只存储被拖拽过的节点，未拖拽的继续使用自动布局
- **Alternative**: 在 `nodePositions` 数组上加 `pinned` 标记 → 会污染现有数据结构，改动面更大

### 2. 布局改造：`computeLayout()` 末尾覆盖
- **What**: `computeLayout()` 先按原逻辑计算所有默认位置，然后遍历 `customPositions` 覆盖对应节点的 `{ x, y }`
- **Why**: 最小改动，保留原始布局逻辑不变；resize 时未拖拽的节点自动适应新尺寸，已拖拽的保持绝对位置
- **Alternative**: 将位置存为比例坐标（百分比）→ 增加复杂度，且拖拽体验不如绝对坐标直观

### 3. 事件绑定位置：`NetworkRenderer` 构造函数内
- **What**: 在 `NetworkRenderer` 的 `constructor` 中直接绑定 canvas 的 mouse/touch 事件
- **Why**: renderer 拥有 canvas 引用和 `nodePositions` 数据，是最自然的事件宿主；避免在 `UIController` 中增加跨层耦合
- **Alternative**: 在 `UIController` 中绑定事件再调用 renderer 方法 → 增加不必要的间接层

### 4. 拖拽中的重绘策略
- **What**: `mousemove` 时直接调用 `this.render(network, state, animState)` 全量重绘；需要将最后一次的 `network` 和 `state` 缓存为实例属性
- **Why**: Canvas 没有局部更新能力，全量重绘是唯一方案；2-2-1 网络仅 5 个节点 + 6 条线，渲染开销极低（< 1ms），60fps 无压力
- **Alternative**: requestAnimationFrame 节流 → 对 5 节点网络来说过度优化

### 5. DPR 坐标转换
- **What**: 鼠标事件的 `offsetX/offsetY` 需要除以 CSS 像素比（`canvas.style.width / canvas.width`）转为逻辑坐标，而非直接使用
- **Why**: Canvas 使用 `dpr` 缩放（`canvas.width = rect.width * dpr`），`offsetX` 是 CSS 像素，而 `nodePositions` 是逻辑坐标空间，两者不一致会导致拖拽偏移。实际上由于 `ctx.setTransform(dpr,...)` 的存在，逻辑坐标 = CSS 像素坐标，所以 `offsetX/offsetY` 可以直接使用

## Risks / Trade-offs
- Resize 后已拖拽节点位置不变（绝对坐标），可能出现节点溢出画布边界 → 接受，重置可恢复
- 动画过程中拖拽节点会导致粒子终点突变 → 可接受，因为动画粒子起终点在动画启动时已固定

## Open Questions
- 无
