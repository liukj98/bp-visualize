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
      case 'forward-hidden': this.renderForwardHidden(network); break;
      case 'forward-output': this.renderForwardOutput(network); break;
      case 'loss': this.renderLoss(network, targets); break;
      case 'backward-output': this.renderBackwardOutput(network, targets); break;
      case 'backward-hidden': this.renderBackwardHidden(network, targets); break;
      case 'update': this.renderUpdate(network); break;
      // Legacy phases
      case 'forward': this.renderForwardHidden(network); this.renderForwardOutput(network); break;
      case 'backward': this.renderBackwardOutput(network, targets); this.renderBackwardHidden(network, targets); break;
      default: this.renderIdle(); break;
    }
  }

  renderIdle() {
    this.container.innerHTML = `
      <div class="formula-section">
        <h3>BP 反向传播算法</h3>
        <p class="formula-hint">点击"下一步"开始前向传播，逐步观察 BP 算法的完整流程。</p>
        <div class="formula-steps">
          <div class="step-item">① 前向传播 — 隐藏层计算</div>
          <div class="step-item">② 前向传播 — 输出层计算</div>
          <div class="step-item">③ 损失计算</div>
          <div class="step-item">④ 反向传播 — 输出层梯度</div>
          <div class="step-item">⑤ 反向传播 — 隐藏层梯度</div>
          <div class="step-item">⑥ 权重更新 — 梯度下降</div>
        </div>
      </div>`;
  }

  renderForwardHidden(network) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>① 前向传播 — 隐藏层计算</h3>';

    this.addFormula(section, '隐藏层线性计算（无激活函数、无偏置）：', 'h_j = \\sum_i w_{ij} \\cdot x_i');

    if (network.netValues[0]) {
      const w = network.weights[0];
      const inp = network.outValues[0];

      for (let j = 0; j < network.layers[1]; j++) {
        const hVal = network.outValues[1][j];

        const terms = [];
        for (let i = 0; i < inp.length; i++) {
          terms.push(`${formatNum(w[i][j], 2)} \\times ${formatNum(inp[i], 2)}`);
        }

        const products = [];
        for (let i = 0; i < inp.length; i++) {
          products.push(formatNum(w[i][j] * inp[i], 6));
        }

        this.addFormula(section, `计算 h${j + 1}：`,
          `h_${j + 1} = ${terms.join(' + ')}`);
        this.addFormula(section, '',
          `= ${products.join(' + ')} = ${formatNum(hVal, 6)}`);
      }
    }

    this.container.appendChild(section);
  }

  renderForwardOutput(network) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>② 前向传播 — 输出层计算</h3>';

    this.addFormula(section, '输出层线性计算：', 'y = \\sum_i w_{i} \\cdot h_i');

    if (network.netValues[1]) {
      const hiddenOut = network.outValues[1];
      const wOut = network.weights[1];

      for (let j = 0; j < network.layers[2]; j++) {
        const yVal = network.outValues[2][j];

        const terms = [];
        for (let i = 0; i < hiddenOut.length; i++) {
          terms.push(`${formatNum(wOut[i][j], 2)} \\times ${formatNum(hiddenOut[i], 6)}`);
        }

        const products = [];
        for (let i = 0; i < hiddenOut.length; i++) {
          products.push(formatNum(wOut[i][j] * hiddenOut[i], 6));
        }

        this.addFormula(section, '计算 y：',
          `y = ${terms.join(' + ')}`);
        this.addFormula(section, '',
          `= ${products.join(' + ')} = ${formatNum(yVal, 6)}`);
      }
    }

    this.container.appendChild(section);
  }

  renderLoss(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>③ 损失计算</h3>';

    this.addFormula(section, '平方误差损失函数：', 'E = \\frac{1}{2}(y - target)^2');

    const output = network.outValues[network.outValues.length - 1];
    if (output && targets) {
      const y = output[0];
      const t = targets[0];
      const diff = y - t;
      const loss = 0.5 * diff * diff;
      this.addFormula(section, '代入数值：',
        `E = \\frac{1}{2}(${formatNum(y, 6)} - ${formatNum(t, 2)})^2`);
      this.addFormula(section, '',
        `= \\frac{1}{2} \\times (${formatNum(diff, 6)})^2 = \\frac{1}{2} \\times ${formatNum(diff * diff, 6)} = ${formatNum(loss, 6)}`);
    }

    this.container.appendChild(section);
  }

  renderBackwardOutput(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>④ 反向传播 — 输出层梯度</h3>';

    this.addFormula(section, '链式法则（线性网络，无激活函数）：',
      '\\frac{\\partial E}{\\partial w_k} = \\frac{\\partial E}{\\partial y} \\cdot \\frac{\\partial y}{\\partial w_k}');

    this.addFormula(section, '损失对输出的偏导：',
      '\\frac{\\partial E}{\\partial y} = y - target');

    const output = network.outValues[network.outValues.length - 1];
    if (output && targets && network.deltas.length > 0) {
      const lastDeltas = network.deltas[network.deltas.length - 1];
      if (lastDeltas) {
        const y = output[0];
        const t = targets[0];
        const dL_dy = y - t;

        this.addFormula(section, '代入数值：',
          `\\frac{\\partial E}{\\partial y} = ${formatNum(y, 6)} - ${formatNum(t, 2)} = ${formatNum(dL_dy, 6)}`);

        // Show weight gradients for output layer
        const hiddenOut = network.outValues[network.outValues.length - 2];
        const lastGrads = network.gradients[network.gradients.length - 1];
        if (hiddenOut && lastGrads) {
          this.addFormula(section, '输出层权重梯度：',
            '\\frac{\\partial E}{\\partial w_k} = \\frac{\\partial E}{\\partial y} \\times h_i');

          for (let i = 0; i < hiddenOut.length; i++) {
            const wIdx = i + 5; // w5, w6
            this.addFormula(section, '',
              `\\frac{\\partial E}{\\partial w_${wIdx}} = ${formatNum(dL_dy, 6)} \\times ${formatNum(hiddenOut[i], 6)} = ${formatNum(lastGrads[i][0], 6)}`);
          }
        }
      }
    }

    this.container.appendChild(section);
  }

  renderBackwardHidden(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>⑤ 反向传播 — 隐藏层梯度</h3>';

    this.addFormula(section, '隐藏层链式法则（线性）：',
      '\\frac{\\partial E}{\\partial w_{ij}} = \\frac{\\partial E}{\\partial y} \\cdot \\frac{\\partial y}{\\partial h_j} \\cdot \\frac{\\partial h_j}{\\partial w_{ij}}');

    if (network.deltas[0] && network.deltas[1]) {
      const outputDeltas = network.deltas[1]; // dL/dy
      const w = network.weights[1]; // hidden→output weights

      for (let j = 0; j < network.deltas[0].length; j++) {
        // For single output, the sum collapses to one term
        const dL_dy = outputDeltas[0];
        const dy_dhj = w[j][0];
        const dL_dhj = dL_dy * dy_dhj;

        this.addFormula(section, `计算 ∂E/∂h${j + 1}：`,
          `\\frac{\\partial E}{\\partial h_${j + 1}} = \\frac{\\partial E}{\\partial y} \\times w_${j + 5}`);
        this.addFormula(section, '',
          `= ${formatNum(dL_dy, 6)} \\times ${formatNum(dy_dhj, 4)} = ${formatNum(dL_dhj, 6)}`);
      }

      // Show hidden layer weight gradients
      if (network.gradients[0]) {
        this.addFormula(section, '隐藏层权重梯度：',
          '\\frac{\\partial E}{\\partial w_{ij}} = \\frac{\\partial E}{\\partial h_j} \\times x_i');

        const inputs = network.outValues[0];
        for (let i = 0; i < inputs.length; i++) {
          for (let j = 0; j < network.deltas[0].length; j++) {
            const wIdx = i * network.deltas[0].length + j + 1;
            this.addFormula(section, '',
              `\\frac{\\partial E}{\\partial w_${wIdx}} = ${formatNum(network.deltas[0][j], 6)} \\times ${formatNum(inputs[i], 2)} = ${formatNum(network.gradients[0][i][j], 6)}`);
          }
        }
      }
    }

    this.container.appendChild(section);
  }

  renderUpdate(network) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>⑥ 权重更新（梯度下降）</h3>';

    this.addFormula(section, '更新公式：', 'w_{new} = w_{old} - \\eta \\cdot \\frac{\\partial E}{\\partial w}');
    this.addFormula(section, '', `\\eta = ${network.learningRate}`);

    // Show updates for all weights
    for (let l = 0; l < network.gradients.length; l++) {
      if (!network.gradients[l]) continue;
      const layerName = l === 0 ? '隐藏层' : '输出层';
      this.addFormula(section, `${layerName}权重更新：`, '');

      for (let i = 0; i < network.gradients[l].length; i++) {
        for (let j = 0; j < network.gradients[l][i].length; j++) {
          let wGlobalIdx = 0;
          for (let pl = 0; pl < l; pl++) {
            wGlobalIdx += network.weights[pl].length * network.weights[pl][0].length;
          }
          wGlobalIdx += i * network.gradients[l][i].length + j + 1;

          const grad = network.gradients[l][i][j];
          const newW = network.weights[l][i][j];
          const oldW = newW + network.learningRate * grad;
          this.addFormula(section, '',
            `w_${wGlobalIdx}' = ${formatNum(oldW, 6)} - ${network.learningRate} \\times ${formatNum(grad, 6)} = ${formatNum(newW, 6)}`);
        }
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
    if (latex) {
      const mathEl = document.createElement('span');
      mathEl.className = 'formula-math';
      try {
        katex.render(latex, mathEl, { throwOnError: false, displayMode: false });
      } catch (e) {
        mathEl.textContent = latex;
      }
      div.appendChild(mathEl);
    }
    container.appendChild(div);
  }
}
