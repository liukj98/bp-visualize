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

export function renderEducationPage(container) {
  container.innerHTML = `
    <h2>BP 反向传播算法详解</h2>
    <p>反向传播算法（Backpropagation）是训练神经网络最核心的算法之一。它通过计算损失函数对各权重的梯度，利用梯度下降法更新权重，使网络输出逐步逼近期望输出。</p>
    <p>本演示参考经典的 Matt Mazur BP 教程（<a href="https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/" target="_blank" style="color: var(--accent-cyan);">一文搞懂反向传播算法</a>），使用具体数值逐步演示完整流程。</p>
    <p>更简内容：<a href="https://zhuanlan.zhihu.com/p/40378224" target="_blank" style="color: var(--accent-cyan);">一文搞懂反向传播算法</a>。</p>
    <h3 id="sec-params">网络结构与初始参数</h3>
    <div class="edu-step-card">
      <h4>三层前馈网络（2-2-2）</h4>
      <p>输入层 2 个节点，隐藏层 2 个节点，输出层 2 个节点。激活函数使用 Sigmoid。</p>
      <table class="edu-data-table">
        <tr><th>参数</th><th>值</th></tr>
        <tr><td>输入</td><td>i₁ = 0.05, i₂ = 0.10</td></tr>
        <tr><td>目标输出</td><td>o₁ = 0.01, o₂ = 0.99</td></tr>
        <tr><td>权重（输入→隐藏）</td><td>w₁ = 0.15, w₂ = 0.20, w₃ = 0.25, w₄ = 0.30</td></tr>
        <tr><td>权重（隐藏→输出）</td><td>w₅ = 0.40, w₆ = 0.45, w₇ = 0.50, w₈ = 0.55</td></tr>
        <tr><td>偏置</td><td>b₁ = 0.35（隐藏层）, b₂ = 0.60（输出层）</td></tr>
        <tr><td>学习率</td><td>η = 0.5</td></tr>
      </table>
    </div>

    <h3 id="sec-forward">步骤一：前向传播</h3>
    <div class="edu-step-card">
      <h4>隐藏层计算</h4>
      <p>每个隐藏层神经元计算加权和，再通过 Sigmoid 激活：</p>
      <div class="edu-formula">${renderFormula('net_{h_j} = \\sum_i w_{ij} \\cdot x_i + b_1')}</div>
      <div class="edu-formula">${renderFormula('out_{h_j} = \\sigma(net_{h_j}) = \\frac{1}{1+e^{-net_{h_j}}}')}</div>

      <p><strong>计算 h₁：</strong></p>
      <div class="edu-formula">${renderFormula('net_{h_1} = w_1 \\times i_1 + w_2 \\times i_2 + b_1')}</div>
      <div class="edu-formula">${renderFormula('= 0.15 \\times 0.05 + 0.20 \\times 0.10 + 0.35')}</div>
      <div class="edu-formula">${renderFormula('= 0.0075 + 0.0200 + 0.35 = 0.3775')}</div>
      <div class="edu-formula">${renderFormula('out_{h_1} = \\sigma(0.3775) = \\frac{1}{1+e^{-0.3775}} = 0.593269992')}</div>

      <p><strong>计算 h₂：</strong></p>
      <div class="edu-formula">${renderFormula('net_{h_2} = w_3 \\times i_1 + w_4 \\times i_2 + b_1')}</div>
      <div class="edu-formula">${renderFormula('= 0.25 \\times 0.05 + 0.30 \\times 0.10 + 0.35')}</div>
      <div class="edu-formula">${renderFormula('= 0.0125 + 0.0300 + 0.35 = 0.3925')}</div>
      <div class="edu-formula">${renderFormula('out_{h_2} = \\sigma(0.3925) = \\frac{1}{1+e^{-0.3925}} = 0.596884378')}</div>
    </div>

    <div class="edu-step-card">
      <h4>输出层计算</h4>
      <p>输出层神经元接收隐藏层的输出作为输入，同样先计算加权和，再通过 Sigmoid 激活：</p>
      <div class="edu-formula">${renderFormula('net_{o_j} = \\sum_i w_{ij} \\cdot out_{h_i} + b_2')}</div>

      <p><strong>计算 o₁ 的加权和：</strong></p>
      <div class="edu-formula">${renderFormula('net_{o_1} = w_5 \\times out_{h_1} + w_6 \\times out_{h_2} + b_2')}</div>
      <div class="edu-formula">${renderFormula('= 0.40 \\times 0.593269992 + 0.45 \\times 0.596884378 + 0.60')}</div>
      <div class="edu-formula">${renderFormula('= 0.237307997 + 0.268597970 + 0.60')}</div>
      <div class="edu-formula">${renderFormula('= 1.105905967')}</div>

      <p>Sigmoid 激活：</p>
      <div class="edu-formula">${renderFormula('out_{o_1} = \\sigma(net_{o_1}) = \\frac{1}{1+e^{-1.105905967}} = 0.75136507')}</div>

      <p><strong>计算 o₂ 的加权和：</strong></p>
      <div class="edu-formula">${renderFormula('net_{o_2} = w_7 \\times out_{h_1} + w_8 \\times out_{h_2} + b_2')}</div>
      <div class="edu-formula">${renderFormula('= 0.50 \\times 0.593269992 + 0.55 \\times 0.596884378 + 0.60')}</div>
      <div class="edu-formula">${renderFormula('= 0.296634996 + 0.328286408 + 0.60')}</div>
      <div class="edu-formula">${renderFormula('= 1.224921404')}</div>

      <p>Sigmoid 激活：</p>
      <div class="edu-formula">${renderFormula('out_{o_2} = \\sigma(net_{o_2}) = \\frac{1}{1+e^{-1.224921404}} = 0.772928465')}</div>
    </div>

    <h3 id="sec-loss">步骤二：损失计算（MSE）</h3>
    <div class="edu-step-card">
      <h4>均方误差损失函数</h4>
      <div class="edu-formula">${renderFormula('E_{total} = \\frac{1}{2}\\sum(target - output)^2')}</div>
      <div class="edu-formula">${renderFormula('E_{o_1} = \\frac{1}{2}(0.01 - 0.75136507)^2 = 0.274811083')}</div>
      <div class="edu-formula">${renderFormula('E_{o_2} = \\frac{1}{2}(0.99 - 0.772928465)^2 = 0.023560026')}</div>
      <div class="edu-formula">${renderFormula('E_{total} = E_{o_1} + E_{o_2} = 0.298371109')}</div>
    </div>

    <h3 id="sec-bp-output">步骤三：反向传播（输出层）</h3>
    <div class="edu-step-card">
      <h4>链式法则求解 ∂E/∂w₅</h4>
      <p>应用链式法则，将复杂的偏导分解为三个可计算的部分：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial E_{total}}{\\partial w_5} = \\frac{\\partial E_{total}}{\\partial out_{o_1}} \\cdot \\frac{\\partial out_{o_1}}{\\partial net_{o_1}} \\cdot \\frac{\\partial net_{o_1}}{\\partial w_5}')}</div>
      <p><strong>第一项</strong>：损失对输出的偏导</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial E_{total}}{\\partial out_{o_1}} = out_{o_1} - target_{o_1} = 0.75136507 - 0.01 = 0.74136507')}</div>
      <p><strong>第二项</strong>：Sigmoid 导数</p>
      <div class="edu-formula">${renderFormula("\\frac{\\partial out_{o_1}}{\\partial net_{o_1}} = out_{o_1}(1 - out_{o_1}) = 0.75136507 \\times 0.24863 = 0.186815602")}</div>
      <p><strong>第三项</strong>：加权和对权重的偏导</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial net_{o_1}}{\\partial w_5} = out_{h_1} = 0.593269992')}</div>
      <p><strong>综合</strong>：</p>
      <div class="edu-formula">${renderFormula('\\frac{\\partial E_{total}}{\\partial w_5} = 0.74136507 \\times 0.186815602 \\times 0.593269992 = 0.082167041')}</div>
    </div>

    <h3 id="sec-bp-hidden">步骤四：反向传播（隐藏层）</h3>
    <div class="edu-step-card">
      <h4>隐藏层权重的梯度需要累加来自多个输出节点的贡献</h4>
      <div class="edu-formula">${renderFormula('\\frac{\\partial E_{total}}{\\partial out_{h_1}} = \\frac{\\partial E_{o_1}}{\\partial out_{h_1}} + \\frac{\\partial E_{o_2}}{\\partial out_{h_1}}')}</div>
      <p>每个输出节点的误差信号都会通过对应连线回传到隐藏层节点。</p>
      <div class="edu-formula">${renderFormula('\\delta_{h_1} = \\left(\\sum_k \\delta_{o_k} \\cdot w_{h_1 \\to o_k}\\right) \\cdot out_{h_1}(1 - out_{h_1})')}</div>
    </div>

    <h3 id="sec-update">步骤五：权重更新</h3>
    <div class="edu-step-card">
      <h4>梯度下降</h4>
      <p>使用计算出的梯度更新每个权重：</p>
      <div class="edu-formula">${renderFormula('w_{new} = w_{old} - \\eta \\cdot \\frac{\\partial E}{\\partial w}')}</div>
      <div class="edu-formula">${renderFormula("w_5' = 0.40 - 0.5 \\times 0.082167041 = 0.358916480")}</div>
      <div class="edu-formula">${renderFormula("w_1' = 0.15 - 0.5 \\times 0.000438568 = 0.149780716")}</div>
      <p>更新后的网络再次前向传播，总误差从 <strong>0.298371109</strong> 降低到 <strong>0.280471447</strong>。</p>
      <p>经过 <strong>10000 次迭代</strong>后，误差可降低至 <strong>≈ 0.0000024</strong>，网络几乎完美拟合目标输出。</p>
    </div>

    <h3 id="sec-concepts">关键概念</h3>
    <div class="edu-step-card">
      <h4>Sigmoid 激活函数</h4>
      <div class="edu-formula">${renderFormula('\\sigma(x) = \\frac{1}{1+e^{-x}}, \\quad \\sigma\'(x) = \\sigma(x)(1-\\sigma(x))')}</div>
      <p>Sigmoid 将任意实数映射到 (0, 1) 区间，其导数有简洁的表达式，非常适合反向传播计算。</p>
    </div>

    <div class="edu-step-card">
      <h4>链式法则</h4>
      <p>链式法则是反向传播的数学基础。对于复合函数 f(g(x))，其导数为 f'(g(x)) · g'(x)。在神经网络中，误差通过多层函数嵌套，链式法则将复杂的求导分解为逐层可计算的简单乘积。</p>
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

  // Click to scroll — contentEl is the scrollable .education-page
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

  // Scroll spy — listen on the actual scrolling element
  const navItems = sidebar.querySelectorAll('.edu-nav-item');
  const sectionEls = Array.from(sections);

  function updateActive() {
    const scrollTop = contentEl.scrollTop;
    const scrollHeight = contentEl.scrollHeight;
    const clientHeight = contentEl.clientHeight;

    // If scrolled to bottom, highlight last section
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

  // Defer initial update until tab is visible (offsetTop is 0 when hidden)
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

  // Also update when tab becomes visible via click
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      requestAnimationFrame(() => updateActive());
    });
  });
}
