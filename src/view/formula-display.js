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
      case 'loss-per-output': this.renderLossPerOutput(network, targets); break;
      case 'loss-total': this.renderLossTotal(network, targets); break;
      case 'backward-output': this.renderBackwardOutput(network, targets); break;
      case 'backward-hidden': this.renderBackwardHidden(network, targets); break;
      case 'update': this.renderUpdate(network); break;
      // Legacy phases
      case 'forward': this.renderForwardHidden(network); this.renderForwardOutput(network); break;
      case 'loss': this.renderLossPerOutput(network, targets); this.renderLossTotal(network, targets); break;
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
          <div class="step-item">③ 损失计算 — 各输出误差</div>
          <div class="step-item">④ 损失计算 — 总误差汇总</div>
          <div class="step-item">⑤ 反向传播 — 输出层梯度</div>
          <div class="step-item">⑥ 反向传播 — 隐藏层梯度</div>
          <div class="step-item">⑦ 权重更新 — 梯度下降</div>
        </div>
      </div>`;
  }

  renderForwardHidden(network) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>① 前向传播 — 隐藏层计算</h3>';

    this.addFormula(section, '隐藏层加权和通用公式：', 'net_{h_j} = \\sum_i w_{ij} \\cdot x_i + b_1');
    this.addFormula(section, 'Sigmoid 激活：', 'out_{h_j} = \\sigma(net_{h_j}) = \\frac{1}{1+e^{-net_{h_j}}}');

    if (network.netValues[0]) {
      const w = network.weights[0];
      const inp = network.outValues[0];
      const b = network.biases[0];

      for (let j = 0; j < network.layers[1]; j++) {
        const hNet = network.netValues[0][j];
        const hOut = network.outValues[1][j];

        // Build expanded terms
        const terms = [];
        for (let i = 0; i < inp.length; i++) {
          terms.push(`${formatNum(w[i][j], 2)} \\times ${formatNum(inp[i], 2)}`);
        }
        terms.push(formatNum(b[j], 2));

        // Step-by-step computation
        const products = [];
        for (let i = 0; i < inp.length; i++) {
          products.push(formatNum(w[i][j] * inp[i], 6));
        }
        products.push(formatNum(b[j], 2));

        this.addFormula(section, `计算 h${j + 1}：`,
          `net_{h_${j + 1}} = ${terms.join(' + ')}`);
        this.addFormula(section, '',
          `= ${products.join(' + ')} = ${formatNum(hNet, 6)}`);
        this.addFormula(section, '',
          `out_{h_${j + 1}} = \\sigma(${formatNum(hNet, 6)}) = \\frac{1}{1+e^{-${formatNum(hNet, 6)}}} = ${formatNum(hOut, 6)}`);
      }
    }

    this.container.appendChild(section);
  }

  renderForwardOutput(network) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>② 前向传播 — 输出层计算</h3>';

    this.addFormula(section, '输出层加权和通用公式：', 'net_{o_j} = \\sum_i w_{ij} \\cdot out_{h_i} + b_2');

    if (network.netValues[1]) {
      const hiddenOut = network.outValues[1];
      const wOut = network.weights[1];
      const bOut = network.biases[1];

      for (let j = 0; j < network.layers[2]; j++) {
        const oNet = network.netValues[1][j];
        const oOut = network.outValues[2][j];

        const terms = [];
        for (let i = 0; i < hiddenOut.length; i++) {
          terms.push(`${formatNum(wOut[i][j], 2)} \\times ${formatNum(hiddenOut[i], 6)}`);
        }
        terms.push(formatNum(bOut[j], 2));

        const products = [];
        for (let i = 0; i < hiddenOut.length; i++) {
          products.push(formatNum(wOut[i][j] * hiddenOut[i], 6));
        }
        products.push(formatNum(bOut[j], 2));

        this.addFormula(section, `计算 o${j + 1}：`,
          `net_{o_${j + 1}} = ${terms.join(' + ')}`);
        this.addFormula(section, '',
          `= ${products.join(' + ')} = ${formatNum(oNet, 6)}`);
        this.addFormula(section, 'Sigmoid 激活：',
          `out_{o_${j + 1}} = \\sigma(${formatNum(oNet, 6)}) = \\frac{1}{1+e^{-${formatNum(oNet, 6)}}} = ${formatNum(oOut, 6)}`);
      }
    }

    this.container.appendChild(section);
  }

  renderLossPerOutput(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>③ 损失计算 — 各输出误差</h3>';

    this.addFormula(section, 'MSE 损失函数：', 'E_{o_j} = \\frac{1}{2}(target_j - output_j)^2');

    const output = network.outValues[network.outValues.length - 1];
    if (output && targets) {
      for (let j = 0; j < output.length; j++) {
        const diff = targets[j] - output[j];
        const e = 0.5 * diff * diff;
        this.addFormula(section, `计算 E_o${j + 1}：`,
          `E_{o_${j + 1}} = \\frac{1}{2}(${formatNum(targets[j], 2)} - ${formatNum(output[j], 6)})^2`);
        this.addFormula(section, '',
          `= \\frac{1}{2} \\times (${formatNum(diff, 6)})^2 = \\frac{1}{2} \\times ${formatNum(diff * diff, 6)} = ${formatNum(e, 6)}`);
      }
    }

    this.container.appendChild(section);
  }

  renderLossTotal(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>④ 损失计算 — 总误差汇总</h3>';

    this.addFormula(section, '总误差公式：', 'E_{total} = \\sum_j E_{o_j}');

    const output = network.outValues[network.outValues.length - 1];
    if (output && targets) {
      const errors = [];
      let total = 0;
      for (let j = 0; j < output.length; j++) {
        const e = 0.5 * Math.pow(targets[j] - output[j], 2);
        errors.push(e);
        total += e;
      }
      const errorTerms = errors.map((e, j) => `E_{o_${j + 1}}`).join(' + ');
      const errorValues = errors.map(e => formatNum(e, 6)).join(' + ');

      this.addFormula(section, '代入各项误差：',
        `E_{total} = ${errorTerms}`);
      this.addFormula(section, '',
        `= ${errorValues} = ${formatNum(total, 6)}`);
    }

    this.container.appendChild(section);
  }

  renderBackwardOutput(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>⑤ 反向传播 — 输出层梯度</h3>';

    this.addFormula(section, '链式法则：',
      '\\frac{\\partial E}{\\partial w_{jk}} = \\frac{\\partial E}{\\partial out_{o_k}} \\cdot \\frac{\\partial out_{o_k}}{\\partial net_{o_k}} \\cdot \\frac{\\partial net_{o_k}}{\\partial w_{jk}}');

    this.addFormula(section, '输出层误差信号：',
      '\\delta_{o_k} = (out_{o_k} - target_k) \\cdot \\sigma\'(net_{o_k})');

    const output = network.outValues[network.outValues.length - 1];
    if (output && targets && network.deltas.length > 0) {
      const lastDeltas = network.deltas[network.deltas.length - 1];
      if (lastDeltas) {
        for (let j = 0; j < output.length; j++) {
          const dE_dout = output[j] - targets[j];
          const dout_dnet = output[j] * (1 - output[j]);

          this.addFormula(section, `计算 δ_o${j + 1}：`,
            `\\delta_{o_${j + 1}} = (${formatNum(output[j], 6)} - ${formatNum(targets[j], 2)}) \\times ${formatNum(output[j], 6)} \\times (1 - ${formatNum(output[j], 6)})`);
          this.addFormula(section, '',
            `= ${formatNum(dE_dout, 6)} \\times ${formatNum(dout_dnet, 6)} = ${formatNum(lastDeltas[j], 6)}`);
        }

        // Show weight gradients
        const hiddenOut = network.outValues[network.outValues.length - 2];
        const lastGrads = network.gradients[network.gradients.length - 1];
        if (hiddenOut && lastGrads) {
          this.addFormula(section, '输出层权重梯度：',
            '\\frac{\\partial E}{\\partial w_{jk}} = \\delta_{o_k} \\times out_{h_j}');

          for (let i = 0; i < hiddenOut.length; i++) {
            for (let j = 0; j < lastDeltas.length; j++) {
              const wIdx = i * lastDeltas.length + j + 5; // w5,w6,w7,w8
              this.addFormula(section, '',
                `\\frac{\\partial E}{\\partial w_${wIdx}} = ${formatNum(lastDeltas[j], 6)} \\times ${formatNum(hiddenOut[i], 6)} = ${formatNum(lastGrads[i][j], 6)}`);
            }
          }
        }
      }
    }

    this.container.appendChild(section);
  }

  renderBackwardHidden(network, targets) {
    const section = document.createElement('div');
    section.className = 'formula-section';
    section.innerHTML = '<h3>⑥ 反向传播 — 隐藏层梯度</h3>';

    this.addFormula(section, '隐藏层误差信号（多输出累加）：',
      '\\delta_{h_j} = \\left(\\sum_k \\delta_{o_k} \\cdot w_{jk}\\right) \\cdot \\sigma\'(net_{h_j})');

    if (network.deltas[0] && network.deltas[1]) {
      const outputDeltas = network.deltas[1];
      const hiddenOut = network.outValues[1];
      const w = network.weights[1]; // hidden→output weights

      for (let j = 0; j < network.deltas[0].length; j++) {
        // Show the summation of error contributions
        const terms = [];
        let sumVal = 0;
        for (let k = 0; k < outputDeltas.length; k++) {
          terms.push(`\\delta_{o_${k + 1}} \\times w_{${j + 1}${k + 1}}`);
          sumVal += outputDeltas[k] * w[j][k];
        }

        const valueTerms = [];
        for (let k = 0; k < outputDeltas.length; k++) {
          valueTerms.push(`${formatNum(outputDeltas[k], 6)} \\times ${formatNum(w[j][k], 4)}`);
        }

        const dout_dnet = hiddenOut[j] * (1 - hiddenOut[j]);

        this.addFormula(section, `计算 δ_h${j + 1}：`,
          `\\delta_{h_${j + 1}} = (${terms.join(' + ')}) \\times \\sigma'(net_{h_${j + 1}})`);
        this.addFormula(section, '',
          `= (${valueTerms.join(' + ')}) \\times ${formatNum(dout_dnet, 6)}`);
        this.addFormula(section, '',
          `= ${formatNum(sumVal, 6)} \\times ${formatNum(dout_dnet, 6)} = ${formatNum(network.deltas[0][j], 6)}`);
      }

      // Show hidden layer weight gradients
      if (network.gradients[0]) {
        this.addFormula(section, '隐藏层权重梯度：',
          '\\frac{\\partial E}{\\partial w_{ij}} = \\delta_{h_j} \\times x_i');

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
    section.innerHTML = '<h3>⑦ 权重更新（梯度下降）</h3>';

    this.addFormula(section, '更新公式：', 'w_{new} = w_{old} - \\eta \\cdot \\frac{\\partial E}{\\partial w}');
    this.addFormula(section, '', `\\eta = ${network.learningRate}`);

    // Show updates for all weights
    for (let l = 0; l < network.gradients.length; l++) {
      if (!network.gradients[l]) continue;
      const layerName = l === 0 ? '隐藏层' : '输出层';
      this.addFormula(section, `${layerName}权重更新：`, '');

      for (let i = 0; i < network.gradients[l].length; i++) {
        for (let j = 0; j < network.gradients[l][i].length; j++) {
          const wIdx = l === 0 ? i * network.gradients[l][i].length + j + 1 : i * network.gradients[l][i].length + j + 5;
          const grad = network.gradients[l][i][j];
          const newW = network.weights[l][i][j];
          const oldW = newW + network.learningRate * grad;
          this.addFormula(section, '',
            `w_${wIdx}' = ${formatNum(oldW, 6)} - ${network.learningRate} \\times ${formatNum(grad, 6)} = ${formatNum(newW, 6)}`);
        }
      }
    }

    // Bias updates
    this.addFormula(section, '偏置更新：', 'b_{new} = b_{old} - \\eta \\cdot \\delta');
    for (let l = 0; l < network.deltas.length; l++) {
      if (!network.deltas[l]) continue;
      for (let j = 0; j < network.deltas[l].length; j++) {
        const delta = network.deltas[l][j];
        const newB = network.biases[l][j];
        const oldB = newB + network.learningRate * delta;
        this.addFormula(section, '',
          `b_{${l + 1},${j + 1}}' = ${formatNum(oldB, 6)} - ${network.learningRate} \\times ${formatNum(delta, 6)} = ${formatNum(newB, 6)}`);
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
