# Change: 新增神经元节点拖拽交互

## Why
当前可视化页面的神经网络 Canvas 是纯展示用途，节点位置由固定网格算法自动布局，用户无法与节点直接交互。增加拖拽能力可以让学习者自由调整网络布局、更直观地感受节点间的连接关系，提升交互体验。

## What Changes
- 在 `NetworkRenderer` 中新增 Canvas 鼠标/触摸事件监听（mousedown/mousemove/mouseup + 对应 touch 事件）
- 实现 hit-test 逻辑：根据 `nodePositions` 和 `nodeRadius`（34px）判断点击是否落在某个节点上
- 拖拽过程中更新被拖拽节点在 `nodePositions` 中的坐标，实时重绘 Canvas（节点 + 连线 + 标签同步移动）
- 修改 `computeLayout()` 逻辑：区分「已被用户拖拽的节点」和「自动布局的节点」，被拖拽过的节点保持用户设定的位置
- 拖拽时显示视觉反馈（如光标变为 grab/grabbing、节点高亮）
- 重置按钮恢复所有节点到自动布局位置
- 动画引擎（`AnimationEngine`）无需修改，因为它读取 `renderer.nodePositions` 获取当前坐标，拖拽后的位置会自动反映到动画路径中

## Impact
- Affected specs: `bp-algorithm-visualization`（新增拖拽交互需求）
- Affected code:
  - `src/view/network-renderer.js`：新增事件监听、hit-test、拖拽位置更新、`computeLayout` 改造
  - `src/controller/ui-controller.js`：重置时清除拖拽状态
- 无破坏性变更，现有渲染和动画功能不受影响
