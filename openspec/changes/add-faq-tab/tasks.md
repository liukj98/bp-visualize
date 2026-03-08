## 1. HTML 结构
- [x] 1.1 在 `index.html` 的 `.tabs` 容器中新增按钮 `<button class="tab-btn" data-tab="faq">梯度下降详解</button>`
- [x] 1.2 在 `index.html` 中新增 `#tab-faq` 内容容器，结构与 `#tab-education` 一致（侧边栏 `#faq-sidebar` + 内容区 `#faq-content`）

## 2. FAQ 页面模块
- [x] 2.1 新建 `src/pages/faq.js`，导出 `renderFaqPage(container)` 函数
- [x] 2.2 将 `BP-FAQ.md` 内容转换为 HTML 模板字符串，保留完整的 7 节内容
- [x] 2.3 Markdown 中的 `$$...$$` 块级公式使用 KaTeX `displayMode: true` 渲染
- [x] 2.4 Markdown 中的 `$...$` 内联公式使用 KaTeX `displayMode: false` 渲染
- [x] 2.5 表格、代码块、引用块等 Markdown 元素转换为语义化 HTML，复用现有 CSS 类名（如 `edu-data-table`、`edu-step-card`）
- [x] 2.6 实现侧边栏导航与 scroll spy 高亮（参考 education 页面的 `buildSidebarNav` 模式）

## 3. 集成
- [x] 3.1 在 `src/main.js` 中导入 `renderFaqPage` 并在初始化时调用，传入 `#faq-content` 容器
- [x] 3.2 验证 Tab 切换功能正常（`ui-controller.js` 的通用逻辑应自动生效）

## 4. 样式适配
- [x] 4.1 确认 FAQ 页面复用 education 页面的 CSS 样式（`.education-layout`、`.edu-sidebar`、`.education-page` 等）
- [x] 4.2 如有需要，为 FAQ 特有元素（如 ASCII 代码块图示）补充样式

## 5. 验证
- [x] 5.1 三个 Tab 可正常切换，内容互不干扰
- [x] 5.2 FAQ 页面所有数学公式正确渲染
- [x] 5.3 侧边栏导航可点击跳转，scroll spy 高亮正常
- [x] 5.4 页面首次加载性能无明显退化
