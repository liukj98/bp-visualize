# Project Context

## Purpose
构建一个交互式网站，用于可视化展示BP（反向传播）算法的完整流程。用户可以直观地观察神经网络的前向传播、损失计算、反向传播（梯度计算）和权重更新的全过程，并通过交互控制训练参数，加深对BP算法的理解。

## Tech Stack
- HTML5 / CSS3 / JavaScript (ES6+)
- Canvas API 或 SVG 用于神经网络结构绘制与动画
- 纯前端实现，无需后端服务
- Vite 作为构建工具
- 响应式设计，支持桌面端浏览

## Project Conventions

### Code Style
- 使用 ES6+ 模块化语法
- 文件命名采用 kebab-case（如 `neural-network.js`）
- 类命名采用 PascalCase，函数和变量采用 camelCase
- 使用 JSDoc 注释关键函数和类

### Architecture Patterns
- MVC 模式：Model（神经网络数学模型）、View（Canvas/SVG 可视化渲染）、Controller（用户交互控制）
- 模块化设计：算法核心、渲染引擎、UI 控制分离
- 事件驱动：用户操作通过事件系统驱动视图更新

### Testing Strategy
- 手动测试为主，验证可视化效果和交互逻辑
- 算法核心模块可编写单元测试验证数值正确性

### Git Workflow
- main 分支为稳定分支
- feature/* 分支用于功能开发
- 提交信息格式：`type: description`（如 `feat: add forward propagation animation`）

## Domain Context
BP（Backpropagation）算法是神经网络中最核心的训练算法，其流程包括：
1. **前向传播**：输入数据逐层通过网络，每层计算加权和并经过激活函数
2. **损失计算**：将网络输出与期望输出对比，计算损失函数值（如均方误差）
3. **反向传播**：从输出层开始，利用链式法则逐层计算损失函数对各权重的偏导数（梯度）
4. **权重更新**：使用梯度下降法，按学习率更新各层权重和偏置

关键数学概念：激活函数（Sigmoid/ReLU）、损失函数（MSE/交叉熵）、链式法则、梯度下降

## Important Constraints
- 纯前端实现，所有计算在浏览器中完成
- 网络规模限制在可视化可读范围内（建议最多 3-4 层，每层最多 6-8 个节点）
- 需要支持主流现代浏览器（Chrome、Firefox、Safari、Edge）
- 动画需流畅，帧率不低于 30fps

## External Dependencies
- 无外部 API 依赖
- 可选使用轻量级动画库（如 anime.js）或数学渲染库（如 KaTeX）展示公式
