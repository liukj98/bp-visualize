import katex from 'katex';
import { formatNum } from '../utils/math-utils.js';

export class FormulaDisplay {
  constructor(container) {
    this.container = container;
  }

  clear() {
    this.container.innerHTML = '';
  }

  renderPhase(phase, network, targets) {
    this.clear();
    switch (phase) {
      case 'forward': this.renderForward(network); break;
      case 'loss': this.renderLoss(network, targets); break;
      case 'backward': this.renderBackward(network, targets); break;
      case 'update': this.renderUpdate(network); break;
      default: this.renderIdle(); break;
    }
  }

  renderIdle() {
    this.container.innerHTML = `
      <div class="formula-section">
        <h3>BP 反向传播算法</h3>
        <p class="formula-hint">点击"下一步"开始前向传播，逐步观察 BP 算法的完整流程。</p>
        <div class="formula-steps">
          <div class="step-item">① 前向传播：计算各层输出</div>
          <div class="step-item">② 损失计算：计算预测误差</div>
          <div class="step-item">③ 反向传播：计算梯度</div>
          <div class="step-item">④ 权重更新：梯度下降优化</div>
        </div>
      </div>`;
  }

  renderForward(network) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>① 前向传播</h3>';

    // Hidden layer
    const h1Net = network.netValues[0] ? network.netValues[0][0] : null;
    const h1Out = network.outValues[1] ? network.outValues[1][0] : null;

    this.addFormula(section, '隐藏层加权和：', 'net_{h_j} = \\sum_i w_{ij} \\cdot x_i + b');

    if (h1Net !== null) {
      const w = network.weights[0];
      const inp = network.outValues[0];
      const b = network.biases[0][0];
      this.addFormula(section, '',
        `net_{h_1} = ${formatNum(w[0][0],2)} \\times ${formatNum(inp[0],2)} + ${formatNum(w[1][0],2)} \\times ${formatNum(inp[1],2)} + ${formatNum(b,2)} = ${formatNum(h1Net,4)}`);
    }

    this.addFormula(section, 'Sigmoid 激活：', 'out_{h_j} = \\sigma(net_{h_j}) = \\frac{1}{1+e^{-net_{h_j}}}');

    if (h1Out !== null) {
      this.addFormula(section, '', `out_{h_1} = \\sigma(${formatNum(h1Net,4)}) = ${formatNum(h1Out,6)}`);
    }

    // Output layer
    if (network.netValues[1]) {
      const hiddenOut = network.outValues[1];
      const wOut = network.weights[1];
      const bOut = network.biases[1][0];
      const outputCount = network.layers[network.layers.length - 1];
      const hiddenCount = network.layers[1];

      this.addFormula(section, '输出层加权和：', 'net_{o_j} = \\sum_i w_{ij} \\cdot out_{h_i} + b_2');

      for (let j = 0; j < outputCount; j++) {
        const oNet = network.netValues[1][j];
        const oOut = network.outValues[2][j];

        // Build the expanded calculation string
        const terms = [];
        for (let i = 0; i < hiddenCount; i++) {
          terms.push(`${formatNum(wOut[i][j],2)} \\times ${formatNum(hiddenOut[i],6)}`);
        }
        terms.push(formatNum(bOut, 2));

        this.addFormula(section, '',
          `net_{o_${j+1}} = ${terms.join(' + ')} = ${formatNum(oNet,6)}`);

        this.addFormula(section, 'Sigmoid 激活：',
          `out_{o_${j+1}} = \\sigma(${formatNum(oNet,6)}) = \\frac{1}{1+e^{-${formatNum(oNet,6)}}} = ${formatNum(oOut,6)}`);
      }
    }

    this.container.appendChild(section);
  }

  renderLoss(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>② 损失计算（MSE）</h3>';

    this.addFormula(section, 'MSE 损失函数：', 'E_{total} = \\frac{1}{2}\\sum(target - output)^2');

    const output = network.outValues[network.outValues.length - 1];
    if (output && targets) {
      for (let i = 0; i < output.length; i++) {
        const e = 0.5 * Math.pow(targets[i] - output[i], 2);
        this.addFormula(section, '',
          `E_{o_${i+1}} = \\frac{1}{2}(${formatNum(targets[i],2)} - ${formatNum(output[i],6)})^2 = ${formatNum(e,6)}`);
      }
      const total = output.reduce((sum, o, i) => sum + 0.5 * Math.pow(targets[i] - o, 2), 0);
      this.addFormula(section, '总误差：', `E_{total} = ${formatNum(total,6)}`);
    }

    this.container.appendChild(section);
  }

  renderBackward(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>③ 反向传播（链式法则）</h3>';

    this.addFormula(section, '输出层权重梯度：',
      '\\frac{\\partial E}{\\partial w_5} = \\frac{\\partial E}{\\partial out_{o_1}} \\cdot \\frac{\\partial out_{o_1}}{\\partial net_{o_1}} \\cdot \\frac{\\partial net_{o_1}}{\\partial w_5}');

    const output = network.outValues[network.outValues.length - 1];
    if (output && targets && network.deltas.length > 0) {
      const lastDeltas = network.deltas[network.deltas.length - 1];
      if (lastDeltas) {
        for (let j = 0; j < output.length; j++) {
          const dE_dout = output[j] - targets[j];
          const dout_dnet = output[j] * (1 - output[j]);
          this.addFormula(section, '',
            `\\delta_{o_${j+1}} = (${formatNum(output[j],6)} - ${formatNum(targets[j],2)}) \\times ${formatNum(dout_dnet,6)} = ${formatNum(lastDeltas[j],6)}`);
        }

        const hiddenOut = network.outValues[network.outValues.length - 2];
        if (hiddenOut && network.gradients[network.gradients.length - 1]) {
          const grad = network.gradients[network.gradients.length - 1][0][0];
          this.addFormula(section, '',
            `\\frac{\\partial E}{\\partial w_5} = \\delta_{o_1} \\times out_{h_1} = ${formatNum(lastDeltas[0],6)} \\times ${formatNum(hiddenOut[0],6)} = ${formatNum(grad,6)}`);
        }
      }

      // Hidden layer
      this.addFormula(section, '隐藏层误差（累加贡献）：',
        '\\delta_{h_j} = \\sum_k \\delta_{o_k} \\cdot w_{jk} \\cdot \\sigma\'(net_{h_j})');

      if (network.deltas[0]) {
        this.addFormula(section, '', `\\delta_{h_1} = ${formatNum(network.deltas[0][0],6)}`);
        if (network.deltas[0].length > 1) {
          this.addFormula(section, '', `\\delta_{h_2} = ${formatNum(network.deltas[0][1],6)}`);
        }
      }
    }

    this.container.appendChild(section);
  }

  renderUpdate(network) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>④ 权重更新（梯度下降）</h3>';

    this.addFormula(section, '更新公式：', 'w_{new} = w_{old} - \\eta \\cdot \\frac{\\partial E}{\\partial w}');
    this.addFormula(section, '', `\\eta = ${network.learningRate}`);

    if (network.gradients.length > 0 && network.gradients[network.gradients.length - 1]) {
      const lastGrads = network.gradients[network.gradients.length - 1];
      if (lastGrads[0]) {
        this.addFormula(section, '输出层权重更新示例：',
          `w_5' = w_5 - ${network.learningRate} \\times ${formatNum(lastGrads[0][0],6)}`);
      }
    }

    this.container.appendChild(section);
  }

  addFormula(container, label, latex) {
    const div = document.createElement('div');
    div.className = 'formula-item';
    if (label) {
      const labelEl = document.createElement('span');
      labelEl.className = 'formula-label';
      labelEl.textContent = label;
      div.appendChild(labelEl);
    }
    const mathEl = document.createElement('span');
    mathEl.className = 'formula-math';
    try {
      katex.render(latex, mathEl, { throwOnError: false, displayMode: false });
    } catch (e) {
      mathEl.textContent = latex;
    }
    div.appendChild(mathEl);
    container.appendChild(div);
  }
}
