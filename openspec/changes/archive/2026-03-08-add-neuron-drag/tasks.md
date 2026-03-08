## 1. Hit-test 与拖拽状态管理
- [x] 1.1 在 `NetworkRenderer` 中新增 `dragState` 属性（`{ dragging: boolean, layerIdx, nodeIdx, offsetX, offsetY }`）和 `customPositions` Map（存储被用户拖拽过的节点坐标）
- [x] 1.2 实现 `hitTestNode(canvasX, canvasY)` 方法：遍历 `nodePositions`，返回鼠标坐标落在的节点索引 `{ layerIdx, nodeIdx }`，判定半径为 `nodeRadius`

## 2. 鼠标与触摸事件
- [x] 2.1 在 Canvas 上绑定 `mousedown`/`mousemove`/`mouseup`/`mouseleave` 事件
- [x] 2.2 在 Canvas 上绑定对应的 `touchstart`/`touchmove`/`touchend` 事件以支持触屏
- [x] 2.3 `mousedown`/`touchstart`：调用 `hitTestNode`，命中时记录拖拽状态，阻止默认行为
- [x] 2.4 `mousemove`/`touchmove`：拖拽中更新 `customPositions` 中对应节点坐标，触发重绘
- [x] 2.5 `mouseup`/`mouseleave`/`touchend`：结束拖拽状态

## 3. 布局与渲染适配
- [x] 3.1 修改 `computeLayout()`：计算完默认位置后，用 `customPositions` 中的坐标覆盖被拖拽过的节点
- [x] 3.2 确保连接线、权重标签、节点标签在拖拽后正确跟随新位置

## 4. 视觉反馈
- [x] 4.1 鼠标悬停在节点上时 Canvas 光标变为 `grab`，拖拽中变为 `grabbing`
- [x] 4.2 拖拽中的节点显示高亮边框（如更亮的描边色或增大描边宽度）

## 5. 重置集成
- [x] 5.1 重置按钮点击时清除 `customPositions`，恢复所有节点到自动布局位置

## 6. 验证
- [x] 6.1 可拖拽任意节点到画布内任意位置，连线和标签实时跟随
- [x] 6.2 拖拽后执行训练步骤，动画粒子沿新位置正确运动
- [x] 6.3 重置后节点恢复原始布局
- [x] 6.4 触屏设备可正常拖拽
- [x] 6.5 拖拽不影响训练控制按钮的正常功能
