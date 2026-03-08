# Change: 新增「梯度下降详解」Tab 页，展示 BP-FAQ 学习内容

## Why
目前页面右上角只有「可视化」和「算法原理」两个 Tab。项目中已有一份面向零基础读者的梯度下降法详解文档（`BP-FAQ.md`），包含 7 个递进式问题、数学推导、直观类比和交互引导，是很好的辅助学习材料。但该文件以 Markdown 形式存在于仓库中，学习者无法在页面内直接阅读。新增一个 Tab 将其内容呈现到页面中，方便学习者在可视化操作、算法原理和基础概念之间无缝切换。

## What Changes
- 在 `index.html` 的 `.tabs` 容器中新增第三个 Tab 按钮（`data-tab="faq"`），文案为「梯度下降详解」
- 在 `index.html` 中新增对应的 `#tab-faq` 内容容器（`.tab-content`），包含与 education 页面一致的侧边栏 + 内容区布局
- 新建 `src/pages/faq.js` 页面模块，负责将 `BP-FAQ.md` 的内容渲染为 HTML：
  - Markdown 标题、段落、列表、表格、代码块等转换为语义化 HTML
  - `$$...$$` 和 `$...$` 数学公式通过 KaTeX 渲染
  - 侧边栏导航与 scroll spy 高亮（复用或参考 education 页面的 `buildSidebarNav` 模式）
- 在 `src/main.js` 中导入并调用 `renderFaqPage()`，在应用初始化时渲染 FAQ 内容
- 现有的 Tab 切换逻辑（`ui-controller.js`）基于 `data-tab` → `#tab-{tab}` 的通用映射，无需修改即可自动支持新 Tab

## Impact
- Affected specs: `bp-algorithm-education`（新增 FAQ Tab 相关需求）
- Affected code:
  - `index.html`：新增 Tab 按钮和内容容器
  - `src/pages/faq.js`（新建）：FAQ 页面渲染逻辑
  - `src/main.js`：导入并调用 FAQ 页面渲染
- 无破坏性变更，现有可视化和算法原理功能不受影响
