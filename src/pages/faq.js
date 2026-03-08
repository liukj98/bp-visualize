import katex from 'katex';

function renderBlockFormula(latex) {
  const span = document.createElement('span');
  try {
    katex.render(latex, span, { throwOnError: false, displayMode: true });
  } catch (e) {
    span.textContent = latex;
  }
  return span.outerHTML;
}

function renderInlineFormula(latex) {
  const span = document.createElement('span');
  try {
    katex.render(latex, span, { throwOnError: false, displayMode: false });
  } catch (e) {
    span.textContent = latex;
  }
  return span.outerHTML;
}

const K = renderBlockFormula;
const I = renderInlineFormula;

export function renderFaqPage(container) {
  container.innerHTML = `
    <h2>从零理解梯度下降法</h2>
    <p class="faq-intro">本文面向零基础读者，通过 7 个递进式问题，带你一步步吃透梯度下降法的核心原理。</p>

    <h3 id="faq-1">1. 我们到底在解决什么问题？</h3>
    <div class="edu-step-card">
      <p>在聊梯度下降之前，先明确我们的目标。</p>
      <p>神经网络有很多<strong>权重</strong>（w₁、w₂、w₃……），它们决定了网络的行为。训练的本质就是一个问题：</p>
      <blockquote><strong>找到一组权重，让网络的输出尽可能接近期望输出。</strong></blockquote>
      <p>"接近程度"用<strong>误差（损失）</strong> E 来衡量——E 越小，网络表现越好。</p>
      <p>所以，训练神经网络 = <strong>调整权重，让误差 E 尽可能小</strong>。</p>
      <p>问题是：权重那么多，怎么知道往哪个方向调、调多少？这就是梯度下降法要解决的事情。</p>
    </div>

    <h3 id="faq-2">2. 什么是梯度下降法？</h3>
    <div class="edu-step-card">
      <h4>一句话定义</h4>
      <p><strong>沿着误差下降最快的方向，一小步一小步地调整权重。</strong></p>

      <h4>直观类比</h4>
      <p>想象你<strong>蒙着眼睛站在一座山上</strong>，目标是走到最低的山谷：</p>
      <p>1. 你用脚<strong>试探周围地面的倾斜方向</strong> —— 这就是"求梯度"</p>
      <p>2. 然后<strong>朝着最陡的下坡方向迈一步</strong> —— 这就是"沿梯度反方向下降"</p>
      <p>3. 到了新位置，再试探、再迈步，<strong>不断重复</strong>直到走到谷底</p>

      <h4>对应到神经网络</h4>
      <table class="edu-data-table">
        <tr><th>下山类比</th><th>神经网络中的含义</th></tr>
        <tr><td>山的高度</td><td>误差 E 的大小</td></tr>
        <tr><td>你站的位置</td><td>当前的权重值</td></tr>
        <tr><td>用脚试探坡度</td><td>对权重求偏导（求梯度）</td></tr>
        <tr><td>迈一步的大小</td><td>学习率 η</td></tr>
        <tr><td>走到山谷</td><td>误差降到最小</td></tr>
      </table>

      <p>这个过程写成公式就是：</p>
      <div class="edu-formula">${K('w_{\\text{new}} = w_{\\text{old}} - \\eta \\times \\frac{\\partial E}{\\partial w}')}</div>
      <p>先别急着理解公式的每一项，接下来我们逐个拆解。</p>
    </div>

    <h3 id="faq-3">3.「梯度」到底是什么？和导数有什么区别？</h3>
    <div class="edu-step-card">
      <p>公式里的 ${I('\\dfrac{\\partial E}{\\partial w}')} 就是梯度（的一个分量）。它到底是什么意思？</p>

      <h4>先从导数说起</h4>
      <p>如果只有<strong>一个</strong>权重 w，那 ${I('\\dfrac{dE}{dw}')} 就是普通的<strong>导数</strong>，含义是：</p>
      <blockquote><strong>w 变化一点点时，E 会变化多少。</strong></blockquote>
      <p>· 导数 > 0：w 增大 → E 也增大（上坡）</p>
      <p>· 导数 < 0：w 增大 → E 反而减小（下坡）</p>
      <p>· 导数 = 0：到达平坦处（可能是谷底）</p>
      <p>导数是一个<strong>标量</strong>（一个数），只有大小。</p>

      <h4>再看梯度</h4>
      <p>神经网络有<strong>很多个</strong>权重，我们需要对每个权重都求偏导，然后把它们打包成一个<strong>向量</strong>：</p>
      <div class="edu-formula">${K('\\text{梯度} = \\nabla E = \\left(\\frac{\\partial E}{\\partial w_1},\\ \\frac{\\partial E}{\\partial w_2},\\ \\frac{\\partial E}{\\partial w_3},\\ \\cdots\\right)')}</div>
      <p>这个向量就叫<strong>梯度</strong>。它不仅有大小，还有<strong>方向</strong>——指向误差增长最快的方向。</p>

      <h4>对比总结</h4>
      <table class="edu-data-table">
        <tr><th></th><th>导数</th><th>梯度</th></tr>
        <tr><td>变量个数</td><td>1 个</td><td>多个</td></tr>
        <tr><td>结果类型</td><td>标量（只有大小）</td><td>向量（有大小 + <strong>方向</strong>）</td></tr>
        <tr><td>告诉你什么</td><td>函数变化的快慢</td><td>在多维空间中<strong>哪个方向</strong>上坡最陡</td></tr>
      </table>

      <p>所以叫"梯度下降"而非"导数下降"，是因为我们同时对<strong>所有权重</strong>求偏导并更新，需要一个有方向的向量来指引。</p>
      <blockquote>教程中单独写的 ${I('\\dfrac{\\partial E}{\\partial w_5}')} 其实是梯度向量的<strong>一个分量</strong>，把所有权重的偏导放在一起，才是完整的梯度。</blockquote>
    </div>

    <h3 id="faq-4">4. 为什么要沿梯度的「反方向」走？</h3>
    <div class="edu-step-card">
      <p>回到公式：</p>
      <div class="edu-formula">${K('w_{\\text{new}} = w_{\\text{old}} \\underbrace{-}_{\\text{取反}} \\eta \\times \\frac{\\partial E}{\\partial w}')}</div>
      <p>注意中间有个<strong>减号</strong>。为什么要减，而不是加？</p>

      <h4>因为梯度指向「上坡」</h4>
      <p>梯度的数学定义决定了：<strong>它指向函数值增大最快的方向</strong>。</p>
      <p>我们要让误差<strong>减小</strong>，当然要往<strong>反方向</strong>走——背对上坡，就是下坡。</p>

<pre class="faq-ascii-art">  E(误差)
  │        /
  │       / ← 梯度方向（上坡）
  │      /
  │     · ← 你在这
  │    /
  │   / → 梯度反方向（下坡）✓
  └──────────── w</pre>

      <h4>减号自动处理了方向</h4>
      <table class="edu-data-table">
        <tr><th>梯度符号</th><th>坡度方向</th><th>减号的效果</th><th>权重变化</th></tr>
        <tr><td>正（> 0）</td><td>往右是上坡</td><td>减去正数</td><td>w <strong>减小</strong>（往左走）✓</td></tr>
        <tr><td>负（< 0）</td><td>往左是上坡</td><td>减去负数 = 加正数</td><td>w <strong>增大</strong>（往右走）✓</td></tr>
      </table>
      <p>两种情况下，减号都自动帮我们选择了正确的下坡方向。</p>

      <h4>所以权重不一定变小</h4>
      <p>这引出一个常见疑问：<strong>权重更新后可能变大吗？</strong> 答案是<strong>完全可以</strong>。</p>
      <p>当梯度为负时：</p>
      <div class="edu-formula">${K('w_{\\text{new}} = w_{\\text{old}} - \\eta \\times (\\text{负数}) = w_{\\text{old}} + \\text{正数}')}</div>
      <p>权重变大了，但这恰恰是正确的——因为在这个方向上，增大权重能让误差减小。</p>
      <blockquote><strong>记住</strong>：公式的目标是让<strong>误差下降</strong>，不是让权重下降。权重该大就大，该小就小，一切服务于减小误差。</blockquote>
    </div>

    <h3 id="faq-5">5. 学习率有什么用？大了小了会怎样？</h3>
    <div class="edu-step-card">
      <p>公式中的 η（eta）就是学习率，控制每一步<strong>迈多大</strong>：</p>
      <div class="edu-formula">${K('w_{\\text{new}} = w_{\\text{old}} - \\underbrace{\\eta}_{\\text{步长}} \\times \\frac{\\partial E}{\\partial w}')}</div>

      <h4>学习率太大</h4>
      <p>· 步子太大，直接<strong>跨过谷底</strong>，跳到对面山坡上</p>
      <p>· 然后又跳回来，来回<strong>震荡</strong>，甚至越跳越高（<strong>发散</strong>）</p>
      <p>· 就像下山时狂奔，一脚踩过头冲到对面山上去了</p>

      <h4>学习率太小</h4>
      <p>· 步子太小，每次只挪一点点</p>
      <p>· 训练<strong>极慢</strong>，可能要几十万步才到谷底</p>
      <p>· 而且更容易<strong>卡在局部最小值</strong>里出不来（没有"冲劲"翻过小山丘）</p>

      <h4>学习率合适</h4>
      <p>· 稳步下降，既不震荡也不太慢</p>
      <p>· 能较快收敛到一个好的最小值</p>

      <h4>直观对比</h4>
      <table class="edu-data-table">
        <tr><th>学习率</th><th>表现</th><th>风险</th></tr>
        <tr><td>太大（如 1.5 ~ 2.0）</td><td>损失剧烈震荡甚至爆炸</td><td>无法收敛</td></tr>
        <tr><td>太小（如 0.01）</td><td>损失下降极其缓慢</td><td>耗时过长、易陷入局部最优</td></tr>
        <tr><td>合适（如 0.5）</td><td>损失稳步下降</td><td>—</td></tr>
      </table>

      <blockquote><strong>动手试试</strong>：在可视化页面中拖动学习率滑块到不同值，观察损失曲线的变化，直观体会上述三种情况。</blockquote>
    </div>

    <h3 id="faq-6">6. 这个公式凭什么能让误差下降？（数学证明）</h3>
    <div class="edu-step-card">
      <p>前面用直觉解释了"沿下坡方向走，误差自然减小"。这里用数学严格证明。</p>

      <h4>一、推导</h4>
      <p>设更新量为 ${I('\\Delta w = -\\eta \\cdot \\dfrac{\\partial E}{\\partial w}')}，更新后的误差用<strong>一阶泰勒展开</strong>近似：</p>
      <div class="edu-formula">${K('E(w + \\Delta w) \\approx E(w) + \\frac{\\partial E}{\\partial w} \\cdot \\Delta w')}</div>
      <p>把 ${I('\\Delta w')} 代入：</p>
      <div class="edu-formula">${K('E(w + \\Delta w) \\approx E(w) + \\frac{\\partial E}{\\partial w} \\cdot \\left(-\\eta \\cdot \\frac{\\partial E}{\\partial w}\\right) = E(w) - \\eta \\cdot \\left(\\frac{\\partial E}{\\partial w}\\right)^2')}</div>

      <h4>二、结论</h4>
      <div class="edu-formula">${K('E_{\\text{new}} - E_{\\text{old}} \\approx -\\eta \\cdot \\left(\\frac{\\partial E}{\\partial w}\\right)^2')}</div>
      <p>看右边：</p>
      <p>· ${I('\\eta > 0')}（学习率是正数）</p>
      <p>· ${I('\\left(\\dfrac{\\partial E}{\\partial w}\\right)^2 \\geq 0')}（任何数的平方都非负）</p>
      <p>所以：</p>
      <div class="edu-formula">${K('\\boxed{E_{\\text{new}} - E_{\\text{old}} \\leq 0}')}</div>
      <p><strong>更新后的误差一定不大于更新前。</strong> 证毕。</p>

      <h4>三、推广到多个权重</h4>
      <p>多维情况下，更新量为 ${I('\\Delta \\mathbf{w} = -\\eta \\cdot \\nabla E')}，同理：</p>
      <div class="edu-formula">${K('E(\\mathbf{w} + \\Delta \\mathbf{w}) \\approx E(\\mathbf{w}) - \\eta \\|\\nabla E\\|^2')}</div>
      <p>${I('\\|\\nabla E\\|^2')} 是梯度向量模的平方，同样非负，结论不变。</p>

      <h4>四、为什么学习率太大会失效？</h4>
      <p>上面的证明基于一阶泰勒<strong>近似</strong>，它在 <strong>η 足够小</strong>时才准确。η 太大时，高阶项不可忽略，近似就不成立了——这正好从数学上解释了第 5 节的现象。</p>
      <blockquote><strong>一句话总结</strong>：沿梯度反方向走一小步，数学上保证误差下降；但步子迈太大就没有这个保证了。</blockquote>
    </div>

    <h3 id="faq-7">7. 梯度下降一定能找到最优解吗？</h3>
    <div class="edu-step-card">
      <p><strong>不一定。</strong> 这是梯度下降法的经典局限——<strong>局部最优 vs 全局最优</strong>。</p>

      <h4>什么是局部最优？</h4>
      <p>想象一条有多个山谷的曲线：</p>
<pre class="faq-ascii-art">    /\\          /\\
   /  \\   /\\  /  \\
  /    \\ /  \\/    \\
 /      V    V     \\___
        ↑    ↑
       局部  全局
       最小  最小</pre>

      <p>· <strong>局部最小值（Local Minimum）</strong>：比周围都低，但不是整体最低的点</p>
      <p>· <strong>全局最小值（Global Minimum）</strong>：整条曲线上真正最低的点</p>
      <p>如果起点在左边山坡，梯度下降会滑到左边浅谷就停下来——它"看"到四周都比自己高，就认为到底了，<strong>无法感知</strong>山背后还有更深的谷。</p>

      <h4>常见的缓解方法</h4>
      <table class="edu-data-table">
        <tr><th>方法</th><th>原理</th></tr>
        <tr><td><strong>随机初始化多次</strong></td><td>从不同起点出发多跑几次，取最好的结果</td></tr>
        <tr><td><strong>适当增大学习率</strong></td><td>步子大一点有可能"跨过"小山丘（但太大会发散）</td></tr>
        <tr><td><strong>动量优化器（Momentum）</strong></td><td>给下坡加"惯性"，像球攒了速度能冲过小山包</td></tr>
        <tr><td><strong>随机梯度下降（SGD）</strong></td><td>每次只用部分数据算梯度，引入随机噪声帮助跳出浅谷</td></tr>
      </table>

      <h4>实际中没那么悲观</h4>
      <p>在神经网络的<strong>高维空间</strong>（成百上千个权重）中，真正的局部最小值其实没那么常见。大部分"看起来是谷底"的地方是<strong>鞍点</strong>——在某些方向是谷底，但在另一些方向还能继续下降。因此实际训练中，这个问题远没有二维图看起来那么严重。</p>
    </div>

    <h3 id="faq-review">全文回顾</h3>
    <div class="edu-step-card">
      <table class="edu-data-table">
        <tr><th>步骤</th><th>你学到了什么</th></tr>
        <tr><td><strong>第 1 节</strong></td><td>训练的本质：调整权重让误差最小</td></tr>
        <tr><td><strong>第 2 节</strong></td><td>梯度下降法：沿下坡方向一小步一小步走</td></tr>
        <tr><td><strong>第 3 节</strong></td><td>梯度 = 所有偏导打包成的向量，指向上坡最陡方向</td></tr>
        <tr><td><strong>第 4 节</strong></td><td>公式里的减号 = 取反方向 = 走下坡；权重可大可小，目标是误差下降</td></tr>
        <tr><td><strong>第 5 节</strong></td><td>学习率控制步长：太大震荡、太小太慢、合适刚好</td></tr>
        <tr><td><strong>第 6 节</strong></td><td>数学证明：η 足够小时，每一步都保证误差不增</td></tr>
        <tr><td><strong>第 7 节</strong></td><td>局限性：可能陷入局部最优，但实际中有多种缓解手段</td></tr>
      </table>
      <blockquote>现在切换到「可视化」页面，点击"下一步"逐步执行，结合本文理解每一步背后的数学原理吧！</blockquote>
    </div>
  `;

  buildFaqSidebarNav(container);
}

function buildFaqSidebarNav(contentEl) {
  const sidebar = document.getElementById('faq-sidebar');
  if (!sidebar) return;

  const sections = contentEl.querySelectorAll('h3[id]');
  if (!sections.length) return;

  let navHTML = '<div class="edu-nav-title">目录</div><ul class="edu-nav-list">';
  sections.forEach((h3) => {
    navHTML += `<li><a class="edu-nav-item" href="#${h3.id}" data-target="${h3.id}">${h3.textContent}</a></li>`;
  });
  navHTML += '</ul>';
  sidebar.innerHTML = navHTML;

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
