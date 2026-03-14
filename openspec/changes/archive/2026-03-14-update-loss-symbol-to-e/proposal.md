# Change: 统一损失函数符号为 E

## Why

当前项目在教学内容和代码实现中混用了 `Loss` 和 `E` 两种符号表示损失函数，导致教学一致性不足。在数学公式和梯度推导中使用 `E`（如 `∂E/∂w`），而在代码注释、UI 显示和图表标签中使用 `Loss`，这可能让学习者在公式与实现之间产生理解障碍。

## What Changes

- 将所有代码中的 `Loss` 字符串替换为 `E`（包括注释、UI 文本、图表标签）
- 更新教学页面（`education.js`）中的公式展示，将 `Loss` 统一改为 `E`
- 更新可视化页面（`formula-display.js`）中的公式渲染，将 `Loss` 统一改为 `E`
- 更新图表渲染器（`chart-renderer.js`）的 Y 轴标签，将 `Loss` 改为 `E`
- 更新网络渲染器（`network-renderer.js`）的损失显示文本，将 `Loss =` 改为 `E =`
- 保持数学符号一致性：所有损失函数公式使用 `E = \frac{1}{2}(y - \text{target})^2`
- 保持梯度公式一致性：所有偏导数使用 `∂E/∂w` 格式

## Impact

- **Affected specs**: `bp-algorithm-education`, `bp-algorithm-visualization`
- **Affected code**: 
  - `src/pages/education.js` - 教学内容中的公式文本
  - `src/view/formula-display.js` - 动态公式渲染
  - `src/view/chart-renderer.js` - 损失曲线图表标签
  - `src/view/network-renderer.js` - 网络可视化中的损失显示
  - 可能涉及其他包含 "Loss" 字符串的文件
- **Breaking**: 无，仅为文本和符号变更，不影响算法逻辑
- **User benefit**: 提升教学一致性，降低学习者的认知负担
