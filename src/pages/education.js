import katex from 'katex';

function renderFormula(latex) {
  const span = document.createElement('span');
  try {
    katex.render(latex, span, { throwOnError: false, displayMode: true });
  } catch (e) {
    span.textContent = latex;
  }
  return span.outerHTML;
}

function inlineMath(latex) {
  const span = document.createElement('span');
  try {
    katex.render(latex, span, { throwOnError: false, displayMode: false });
  } catch (e) {
    span.textContent = latex;
  }
  return span.outerHTML;
}

export function renderEducationPage(container) {
  container.innerHTML = `
    <h2>BP 反向传播算法详解</h2>
    <p>反向传播算法（Backpropagation）是训练神经网络最核心的算法之一。它通过计算损失函数对各权重的梯度，利用梯度下降法更新权重，使网络输出逐步逼近期望输出。</p>
    <p>本演示使用最简化的 <strong>2-2-1 纯线性网络</strong>（无激活函数、无偏置），让你更直观地理解 BP 算法的核心原理。</p>
    <p>参考：<a href="https://zhuanlan.zhihu.com/p/40378224" target="_blank" style="color: var(--accent-cyan);">一文搞懂反向传播算法</a>。</p>

    <h3 id="sec-params">网络结构与初始参数</h3>
    <div class="edu-step-card">
      <h4>三层线性网络（2-2-1）</h4>
      <p>输入层 2 个节点（${inlineMath('x_1, x_2')}），隐藏层 2 个节点（${inlineMath('h_1, h_2')}），输出层 1 个节点（${inlineMath('y')}）。共 6 个权重，<strong>无激活函数、无偏置</strong>。</p>
      <table class="edu-data-table">
        <tr><th>参数</th><th>值</th></tr>
        <tr><td>输入</td><td>${inlineMath('x_1 = 1,\\; x_2 = 0.5')}</td></tr>
        <tr><td>目标输出</td><td>${inlineMath('\\text{target} = 4')}</td></tr>
        <tr><td>权重（输入→隐藏）</td><td>${inlineMath('w_1 = 0.5,\\; w_2 = 2.3,\\; w_3 = 1.5,\\; w_4 = 3')}</td></tr>
        <tr><td>权重（隐藏→输出）</td><td>${inlineMath('w_5 = 1,\\; w_6 = 1')}</td></tr>
        <tr><td>学习率</td><td>${inlineMath('\\eta = 0.1')}</td></tr>
      </table>
      <p><em>权重含义：${inlineMath('w_1')} 连接 ${inlineMath('x_1 \\to h_1')}，${inlineMath('w_2')} 连接 ${inlineMath('x_1 \\to h_2')}，${inlineMath('w_3')} 连接 ${inlineMath('x_2 \\to h_1')}，${inlineMath('w_4')} 连接 ${inlineMath('x_2 \\to h_2')}，${inlineMath('w_5')} 连接 ${inlineMath('h_1 \\to y')}，${inlineMath('w_6')} 连接 ${inlineMath('h_2 \\to y')}</em></p>
    </div>

    <h3 id="sec-formulas">简化公式</h3>
    <div class="edu-step-card">
      <h4>前向传播公式</h4>
      <div class="edu-formula">${renderFormula('h_1 = w_1 \\cdot x_1 + w_3 \\cdot x_2')}</div>
      <div class="edu-formula">${renderFormula('h_2 = w_2 \\cdot x_1 + w_4 \\cdot x_2')}</div>
      <div class="edu-formula">${renderFormula('y = w_5 \\cdot h_1 + w_6 \\cdot h_2')}</div>

      <h4>损失函数</h4>
      <div class="edu-formula">${renderFormula('E = \\frac{1}{2}(y - \\text{target})^2')}</div>

      <h4>梯度下降公式</h4>
      <div class="edu-formula">${renderFormula('w_{\\text{new}} = w_{\\text{old}} - \\eta \\times \\frac{\\partial E}{\\partial w}')}</div>
    </div>

    <h3 id="sec-forward">步骤一：前向传播</h3>
    <div class="edu-step-card">
      <h4>隐藏层计算（纯线性）</h4>
      <p>每个隐藏层神经元直接计算加权和，没有激活函数：</p>
      <div class="edu-formula">${renderFormula('h_j = \\sum_i w_{ij} \\cdot x_i')}</div>

      <p><strong>计算 h₁：</strong></p>
      <div class="edu-formula">${renderFormula('h_1 = w_1 \\times x_1 + w_3 \\times x_2')}</div>
      <div class="edu-formula">${renderFormula('= 0.5 \\times 1 + 1.5 \\times 0.5')}</div>
      <div class="edu-formula">${renderFormula('= 0.5 + 0.75 = 1.25')}</div>

      <p><strong>计算 h₂：</strong></p>
      <div class="edu-formula">${renderFormula('h_2 = w_2 \\times x_1 + w_4 \\times x_2')}</div>
      <div class="edu-formula">${renderFormula('= 2.3 \\times 1 + 3 \\times 0.5')}</div>
      <div class="edu-formula">${renderFormula('= 2.3 + 1.5 = 3.8')}</div>
    </div>

    <div class="edu-step-card">
      <h4>输出层计算</h4>
      <p>输出层同样直接计算加权和：</p>
      <div class="edu-formula">${renderFormula('y = w_5 \\times h_1 + w_6 \\times h_2')}</div>
      <div class="edu-formula">${renderFormula('= 1 \\times 1.25 + 1 \\times 3.8')}</div>
      <div class="edu-formula">${renderFormula('= 1.25 + 3.8 = 5.05')}</div>
    </div>

    <h3 id="sec-loss">步骤二：损失计算</h3>
    <div class="edu-step-card">
      <h4>平方误差损失函数</h4>
      <div class="edu-formula">${renderFormula('Loss = \\frac{1}{2}(y - target)^2')}</div>
      <div class="edu-formula">${renderFormula('= \\frac{1}{2}(5.05 - 4)^2')}</div>
      <div class="edu-formula">${renderFormula('= \\frac{1}{2} \\times 1.05^2 = \\frac{1}{2} \\times 1.1025 = 0.55125')}</div>
      <p>当前误差为 0.55125，我们的目标是通过调整权重让它尽可能接近 0。</p>
    </div>

    <h3 id="sec-bp-output">步骤三：反向传播（输出层）</h3>
    <div class="edu-step-card">
      <h4>链式法则求解输出层权重梯度</h4>
      <p>对于线性网络，链式法则更加简洁（没有激活函数的导数项）：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_k} = \\frac{\\partial Loss}{\\partial y} \\cdot \\frac{\\partial y}{\\partial w_k}')}</div>

      <p><strong>第一项</strong>：损失对输出的偏导</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial y} = y - target = 5.05 - 4 = 1.05')}</div>

      <p><strong>求 ∂Loss/∂w₅</strong>：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial y}{\\partial w_5} = h_1 = 1.25')}</div>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_5} = 1.05 \\times 1.25 = 1.3125')}</div>

      <p><strong>求 ∂Loss/∂w₆</strong>：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial y}{\\partial w_6} = h_2 = 3.8')}</div>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_6} = 1.05 \\times 3.8 = 3.99')}</div>
    </div>

    <h3 id="sec-bp-hidden">步骤四：反向传播（隐藏层）</h3>
    <div class="edu-step-card">
      <h4>隐藏层权重的梯度 — 链式法则继续传递</h4>
      <p>误差信号从输出层反向传播到隐藏层：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_{ij}} = \\frac{\\partial Loss}{\\partial y} \\cdot \\frac{\\partial y}{\\partial h_j} \\cdot \\frac{\\partial h_j}{\\partial w_{ij}}')}</div>

      <p><strong>计算 ∂Loss/∂h₁ 和 ∂Loss/∂h₂</strong>：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial h_1} = \\frac{\\partial Loss}{\\partial y} \\times w_5 = 1.05 \\times 1 = 1.05')}</div>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial h_2} = \\frac{\\partial Loss}{\\partial y} \\times w_6 = 1.05 \\times 1 = 1.05')}</div>

      <p><strong>隐藏层权重梯度</strong>（∂h_j/∂w_ij = x_i）：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_1} = \\frac{\\partial Loss}{\\partial h_1} \\times x_1 = 1.05 \\times 1 = 1.05')}</div>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_2} = \\frac{\\partial Loss}{\\partial h_2} \\times x_1 = 1.05 \\times 1 = 1.05')}</div>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_3} = \\frac{\\partial Loss}{\\partial h_1} \\times x_2 = 1.05 \\times 0.5 = 0.525')}</div>
      <div class="edu-formula">${renderFormula('\\frac{\\partial Loss}{\\partial w_4} = \\frac{\\partial Loss}{\\partial h_2} \\times x_2 = 1.05 \\times 0.5 = 0.525')}</div>
    </div>

    <h3 id="sec-update">步骤五：权重更新</h3>
    <div class="edu-step-card">
      <h4>梯度下降</h4>
      <p>使用计算出的梯度更新每个权重：</p>
      <div class="edu-formula">${renderFormula('w_{new} = w_{old} - \\eta \\cdot \\frac{\\partial Loss}{\\partial w}')}</div>

      <p><strong>隐藏层权重更新</strong>（η = 0.1）：</p>
      <div class="edu-formula">${renderFormula("w_1' = 0.5 - 0.1 \\times 1.05 = 0.395")}</div>
      <div class="edu-formula">${renderFormula("w_2' = 2.3 - 0.1 \\times 1.05 = 2.195")}</div>
      <div class="edu-formula">${renderFormula("w_3' = 1.5 - 0.1 \\times 0.525 = 1.4475")}</div>
      <div class="edu-formula">${renderFormula("w_4' = 3 - 0.1 \\times 0.525 = 2.9475")}</div>

      <p><strong>输出层权重更新</strong>：</p>
      <div class="edu-formula">${renderFormula("w_5' = 1 - 0.1 \\times 1.3125 = 0.86875")}</div>
      <div class="edu-formula">${renderFormula("w_6' = 1 - 0.1 \\times 3.99 = 0.601")}</div>

      <p>更新后重新前向传播，误差将从 <strong>0.55125</strong> 下降。经过多次迭代，网络输出会逐渐逼近目标值 4。</p>
    </div>

    <h3 id="sec-concepts">关键概念</h3>
    <div class="edu-step-card">
      <h4>链式法则</h4>
      <p>链式法则是反向传播的数学基础。对于复合函数 ${inlineMath('f(g(x))')}，其导数为 ${inlineMath("f'(g(x)) \\cdot g'(x)")}。在神经网络中，误差通过多层函数嵌套，链式法则将复杂的求导分解为逐层可计算的简单乘积。</p>
    </div>

    <div class="edu-step-card">
      <h4>为什么使用纯线性网络？</h4>
      <p>本演示去掉了激活函数和偏置参数，目的是让你<strong>专注于反向传播算法本身</strong>：</p>
      <p>· 线性网络的偏导数更直观：${inlineMath('\\partial h / \\partial w = x')}（而非 ${inlineMath("\\sigma'(net) \\times x")}）</p>
      <p>· 没有激活函数导数的干扰，链式法则的传递过程一目了然</p>
      <p>· 理解了线性情况后，加上激活函数和偏置只是多乘一个导数项</p>
    </div>

    <div class="edu-step-card">
      <h4>梯度下降</h4>
      <p>梯度下降是沿着损失函数下降最快的方向更新参数。更新公式 ${inlineMath('w_{new} = w_{old} - \\eta \\times \\frac{\\partial Loss}{\\partial w}')} 保证了每一步更新都在减小误差（当学习率 ${inlineMath('\\eta')} 足够小时）。</p>
    </div>
  `;

  // Build sidebar navigation
  buildSidebarNav(container);
}

function buildSidebarNav(contentEl) {
  const sidebar = document.getElementById('edu-sidebar');
  if (!sidebar) return;

  const sections = contentEl.querySelectorAll('h3[id]');
  if (!sections.length) return;

  let navHTML = '<div class="edu-nav-title">目录</div><ul class="edu-nav-list">';
  sections.forEach((h3) => {
    navHTML += `<li><a class="edu-nav-item" href="#${h3.id}" data-target="${h3.id}">${h3.textContent}</a></li>`;
  });
  navHTML += '</ul>';
  sidebar.innerHTML = navHTML;

  // Click to scroll
  sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('.edu-nav-item');
    if (!link) return;
    e.preventDefault();
    const targetId = link.dataset.target;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      contentEl.scrollTo({
        top: targetEl.offsetTop - contentEl.offsetTop,
        behavior: 'smooth'
      });
    }
  });

  // Scroll spy
  const navItems = sidebar.querySelectorAll('.edu-nav-item');
  const sectionEls = Array.from(sections);

  function updateActive() {
    const scrollTop = contentEl.scrollTop;
    const scrollHeight = contentEl.scrollHeight;
    const clientHeight = contentEl.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      navItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === sectionEls.length - 1);
      });
      return;
    }

    let activeIdx = 0;
    for (let i = sectionEls.length - 1; i >= 0; i--) {
      const sectionTop = sectionEls[i].offsetTop - contentEl.offsetTop;
      if (sectionTop <= scrollTop + 100) {
        activeIdx = i;
        break;
      }
    }
    navItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === activeIdx);
    });
  }

  contentEl.addEventListener('scroll', updateActive);

  const observer = new MutationObserver(() => {
    const tabContent = contentEl.closest('.tab-content');
    if (tabContent && tabContent.classList.contains('active')) {
      updateActive();
      observer.disconnect();
    }
  });
  const tabContent = contentEl.closest('.tab-content');
  if (tabContent && tabContent.classList.contains('active')) {
    updateActive();
  } else if (tabContent) {
    observer.observe(tabContent, { attributes: true, attributeFilter: ['class'] });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      requestAnimationFrame(() => updateActive());
    });
  });
}
