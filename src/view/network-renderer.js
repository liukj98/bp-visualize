import { formatNum } from '../utils/math-utils.js';
import { weightColor, activationColor, gradientHeatColor } from '../utils/color-utils.js';
import { MAJOR_PHASES } from '../model/training-state.js';

export class NetworkRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodePositions = [];
    this.errorNodePos = null;    // E_total node position
    this.biasNodePositions = []; // bias nodes per non-input layer
    this.padding = { top: 80, right: 80, bottom: 60, left: 40 };
    this.nodeRadius = 34;
    this.biasRadius = 18;
    this.errorRadius = 30;
    this.animState = null;
    this.dpr = window.devicePixelRatio || 1;
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
  }

  _majorPhase(phase) {
    return MAJOR_PHASES[phase] || phase;
  }

  _isForward(phase) {
    const m = this._majorPhase(phase);
    return m === 'forward';
  }

  _isBackward(phase) {
    const m = this._majorPhase(phase);
    return m === 'backward';
  }

  _isLoss(phase) {
    const m = this._majorPhase(phase);
    return m === 'loss';
  }

  computeLayout(layers) {
    this.nodePositions = [];
    const numLayers = layers.length;
    // Reserve extra column space on right for E_total
    const totalColumns = numLayers + 1;
    const usableWidth = this.width - this.padding.left - this.padding.right;
    const usableHeight = this.height - this.padding.top - this.padding.bottom;
    const layerSpacing = usableWidth / totalColumns;

    for (let l = 0; l < numLayers; l++) {
      const x = this.padding.left + (l + 0.5) * layerSpacing;
      const numNodes = layers[l];
      const nodeSpacing = usableHeight / (numNodes + 1);
      const layerPositions = [];
      for (let n = 0; n < numNodes; n++) {
        const y = this.padding.top + (n + 1) * nodeSpacing;
        layerPositions.push({ x, y });
      }
      this.nodePositions.push(layerPositions);
    }

    // E_total node: right of output layer, vertically centered
    const errorX = this.padding.left + (numLayers + 0.5) * layerSpacing;
    const outputLayer = this.nodePositions[numLayers - 1];
    const centerY = (outputLayer[0].y + outputLayer[outputLayer.length - 1].y) / 2;
    this.errorNodePos = { x: errorX, y: centerY };

    // Bias nodes: one above each non-input layer
    this.biasNodePositions = [];
    for (let l = 1; l < numLayers; l++) {
      const layerX = this.nodePositions[l][0].x;
      const topNodeY = this.nodePositions[l][0].y;
      this.biasNodePositions.push({ x: layerX + 60, y: topNodeY - 80 });
    }
  }

  render(network, state, animState) {
    this.animState = animState;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.computeLayout(network.layers);

    this.drawConnections(network, state);
    this.drawBiasConnections(network, state);
    this.drawErrorConnections(network, state);
    this.drawNodes(network, state);
    this.drawBiasNodes(network, state);
    this.drawErrorNode(network, state);
    this.drawLabels(network);

    if (animState && animState.particles) {
      this.drawParticles(animState.particles);
    }
  }

  drawConnections(network, state) {
    const ctx = this.ctx;
    const phase = state.phase;

    for (let l = 0; l < network.weights.length; l++) {
      const fromLayer = this.nodePositions[l];
      const toLayer = this.nodePositions[l + 1];
      const totalConns = fromLayer.length * toLayer.length;

      // Determine if this layer's connections should be highlighted
      const isActiveForward = (phase === 'forward-hidden' && l === 0) || (phase === 'forward-output' && l === 1);
      const isActiveBackward = (phase === 'backward-output' && l === 1) || (phase === 'backward-hidden' && l === 0);
      const showGradients = isActiveBackward || (this._isBackward(phase) && network.gradients[l] && network.gradients[l][0]);

      for (let i = 0; i < fromLayer.length; i++) {
        for (let j = 0; j < toLayer.length; j++) {
          const w = network.weights[l][i][j];
          const from = fromLayer[i];
          const to = toLayer[j];

          let color = weightColor(w);
          let lineWidth = 1 + Math.abs(w) * 1.5;

          if (showGradients && network.gradients[l] && network.gradients[l][i]) {
            const grad = network.gradients[l][i][j];
            color = gradientHeatColor(grad);
            lineWidth = 1.5 + Math.abs(grad) * 15;
          }

          if (isActiveForward) {
            color = '#22d3ee';
            lineWidth = 2;
          }

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.min(lineWidth, 5);
          ctx.globalAlpha = isActiveForward || isActiveBackward ? 1 : 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Weight label
          const connIdx = i * toLayer.length + j;
          const t = totalConns === 1 ? 0.5 : 0.2 + (connIdx / (totalConns - 1)) * 0.6;
          const lx = from.x + (to.x - from.x) * t;
          const ly = from.y + (to.y - from.y) * t;

          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          const offsetX = Math.sin(angle) * 14;
          const offsetY = -Math.cos(angle) * 14;

          ctx.save();
          // Compute global weight index: w1, w2, ...
          let wGlobalIdx = 0;
          for (let pl = 0; pl < l; pl++) {
            wGlobalIdx += network.weights[pl].length * network.weights[pl][0].length;
          }
          wGlobalIdx += i * toLayer.length + j + 1;
          const weightLabel = `w${wGlobalIdx}=${formatNum(w, 4)}`;
          const hasGrad = showGradients && network.gradients[l] && network.gradients[l][i];
          const gradLabel = hasGrad ? `∂=${formatNum(network.gradients[l][i][j], 4)}` : '';

          ctx.font = '10px "JetBrains Mono", monospace';
          const weightW = ctx.measureText(weightLabel).width;
          let textW = weightW;
          if (hasGrad) {
            ctx.font = '9px "JetBrains Mono", monospace';
            const gradW = ctx.measureText(gradLabel).width;
            textW = Math.max(weightW, gradW);
          }
          const bgX = lx + offsetX;
          const bgY = ly + offsetY;
          const bgPad = 6;

          ctx.fillStyle = 'rgba(15,23,42,0.85)';
          ctx.beginPath();
          ctx.roundRect(bgX - textW / 2 - bgPad, bgY - 7 - bgPad, textW + bgPad * 2, (hasGrad ? 26 : 14) + bgPad * 2, 3);
          ctx.fill();

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(200,210,230,0.95)';
          ctx.fillText(weightLabel, bgX, bgY);

          if (hasGrad) {
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = 'rgba(255,160,80,0.95)';
            ctx.fillText(gradLabel, bgX, bgY + 13);
          }
          ctx.restore();
        }
      }
    }
  }

  drawBiasConnections(network, state) {
    const ctx = this.ctx;
    for (let bl = 0; bl < this.biasNodePositions.length; bl++) {
      const biasPos = this.biasNodePositions[bl];
      const layerIdx = bl + 1; // non-input layer index
      const layerNodes = this.nodePositions[layerIdx];

      for (let n = 0; n < layerNodes.length; n++) {
        const to = layerNodes[n];
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(biasPos.x, biasPos.y + this.biasRadius);
        ctx.lineTo(to.x, to.y - this.nodeRadius);
        ctx.strokeStyle = 'rgba(148,163,184,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Bias value label on connection
        const mx = (biasPos.x + to.x) / 2;
        const my = (biasPos.y + this.biasRadius + to.y - this.nodeRadius) / 2;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(148,163,184,0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(formatNum(network.biases[bl][n], 2), mx + 15, my);
        ctx.restore();
      }
    }
  }

  drawErrorConnections(network, state) {
    const ctx = this.ctx;
    if (!this.errorNodePos) return;

    const phase = state.phase;
    const showError = this._isLoss(phase) || this._isBackward(phase) || phase === 'update';
    if (!showError && phase !== 'idle') return;
    // Show in idle only if we have loss data
    if (phase === 'idle' && !state.currentPerOutputLoss) return;

    const outputLayer = this.nodePositions[this.nodePositions.length - 1];
    const perLoss = state.currentPerOutputLoss;

    for (let j = 0; j < outputLayer.length; j++) {
      const from = outputLayer[j];
      const to = this.errorNodePos;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.moveTo(from.x + this.nodeRadius, from.y);
      ctx.lineTo(to.x - this.errorRadius, to.y);

      if (this._isLoss(phase)) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
      } else if (this._isBackward(phase)) {
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(148,163,184,0.4)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Per-output error label
      if (perLoss && perLoss[j] !== undefined) {
        const mx = (from.x + this.nodeRadius + to.x - this.errorRadius) / 2;
        const my = (from.y + to.y) / 2;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#60a5fa';
        ctx.textAlign = 'center';
        ctx.fillText(`E_o${j + 1}=${formatNum(perLoss[j], 4)}`, mx, my - 8);
      }
      ctx.restore();
    }
  }

  drawBiasNodes(network, state) {
    const ctx = this.ctx;
    for (let bl = 0; bl < this.biasNodePositions.length; bl++) {
      const pos = this.biasNodePositions[bl];
      const biasVal = network.biases[bl][0]; // display first bias value

      // Draw bias node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.biasRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#374151';
      ctx.fill();
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+1', pos.x, pos.y - 3);

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`b${bl + 1}`, pos.x, pos.y + 10);
    }
  }

  drawErrorNode(network, state) {
    const ctx = this.ctx;
    if (!this.errorNodePos) return;

    const phase = state.phase;
    const hasLoss = state.currentLoss !== null && state.currentLoss !== undefined;

    // Show error node in loss, backward, update phases, or idle if loss data exists
    const showError = this._isLoss(phase) || this._isBackward(phase) || phase === 'update' || (phase === 'idle' && hasLoss);
    if (!showError) return;

    const pos = this.errorNodePos;

    // Draw diamond shape
    ctx.save();
    ctx.beginPath();
    const r = this.errorRadius;
    ctx.moveTo(pos.x, pos.y - r);
    ctx.lineTo(pos.x + r, pos.y);
    ctx.lineTo(pos.x, pos.y + r);
    ctx.lineTo(pos.x - r, pos.y);
    ctx.closePath();

    if (this._isLoss(phase)) {
      ctx.fillStyle = 'rgba(59,130,246,0.2)';
      ctx.strokeStyle = '#3b82f6';
    } else if (this._isBackward(phase)) {
      ctx.fillStyle = 'rgba(249,115,22,0.2)';
      ctx.strokeStyle = '#f97316';
    } else {
      ctx.fillStyle = 'rgba(30,41,59,0.8)';
      ctx.strokeStyle = '#475569';
    }
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();

    // Label
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E_total', pos.x, pos.y - 6);

    if (hasLoss) {
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(formatNum(state.currentLoss, 6), pos.x, pos.y + 9);
    }
    ctx.restore();
  }

  drawNodes(network, state) {
    const ctx = this.ctx;
    const layerNames = this.getLayerNames(network.layers);
    const phase = state.phase;

    for (let l = 0; l < this.nodePositions.length; l++) {
      for (let n = 0; n < this.nodePositions[l].length; n++) {
        const pos = this.nodePositions[l][n];

        let outVal = null;
        let netVal = null;
        if (network.outValues[l]) outVal = network.outValues[l][n];
        if (l > 0 && network.netValues[l - 1]) netVal = network.netValues[l - 1][n];

        let fillColor = '#1e293b';
        let strokeColor = '#475569';

        if (outVal !== null && outVal !== undefined) {
          fillColor = activationColor(outVal);
          strokeColor = '#60a5fa';
        }

        // Highlight based on sub-phase
        if (phase === 'forward-hidden' && l === 1 && outVal !== null) {
          strokeColor = '#22d3ee';
        } else if (phase === 'forward-output' && l === 2 && outVal !== null) {
          strokeColor = '#22d3ee';
        } else if (this._isForward(phase) && outVal !== null) {
          strokeColor = '#60a5fa';
        }

        if (phase === 'backward-output' && l === 2 && network.deltas[1]) {
          strokeColor = '#f97316';
        } else if (phase === 'backward-hidden' && l === 1 && network.deltas[0]) {
          strokeColor = '#f97316';
        } else if (this._isBackward(phase) && l > 0 && network.deltas[l - 1]) {
          strokeColor = '#f97316';
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        const isDarkBg = this._isColorDark(fillColor);
        const labelColor = isDarkBg ? '#e2e8f0' : '#1e293b';
        const valueColor = isDarkBg ? '#93c5fd' : '#1e3a5f';

        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.fillStyle = labelColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.save();
        if (!isDarkBg) {
          ctx.shadowColor = 'rgba(255,255,255,0.5)';
          ctx.shadowBlur = 2;
        } else {
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 3;
        }

        const nodeLabel = layerNames[l][n];
        ctx.fillText(nodeLabel, pos.x, pos.y - 8);

        if (outVal !== null && outVal !== undefined) {
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillStyle = valueColor;
          ctx.fillText(formatNum(outVal, 4), pos.x, pos.y + 10);
        }
        ctx.restore();

        // Net value above node
        if (netVal !== null && netVal !== undefined && phase !== 'idle') {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(148,163,184,0.8)';
          ctx.textAlign = 'center';
          ctx.fillText(`net=${formatNum(netVal, 4)}`, pos.x - 40, pos.y - this.nodeRadius - 6);
        }

        // Delta below node
        const showDelta = this._isBackward(phase) || phase === 'update';
        if (showDelta && l > 0 && network.deltas[l - 1] && network.deltas[l - 1][n] !== undefined) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(251,146,60,0.9)';
          ctx.textAlign = 'center';
          ctx.fillText(`δ=${formatNum(network.deltas[l - 1][n], 6)}`, pos.x, pos.y + this.nodeRadius + 14);
        }
      }
    }
  }

  drawLabels(network) {
    const ctx = this.ctx;
    const labels = ['输入层', ...Array(network.layers.length - 2).fill(0).map((_, i) => `隐藏层${network.layers.length > 3 ? i + 1 : ''}`), '输出层'];

    ctx.font = '13px "Inter", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';

    for (let l = 0; l < this.nodePositions.length; l++) {
      const x = this.nodePositions[l][0].x;
      ctx.fillText(labels[l], x, this.padding.top - 30);
    }

    // Error node label
    if (this.errorNodePos) {
      ctx.fillText('误差', this.errorNodePos.x, this.padding.top - 30);
    }
  }

  drawParticles(particles) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius || 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color || '#22d3ee';
      ctx.shadowColor = p.color || '#22d3ee';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  getLayerNames(layers) {
    const names = [];
    const inputNames = [];
    for (let i = 0; i < layers[0]; i++) inputNames.push(`i${i + 1}`);
    names.push(inputNames);

    for (let l = 1; l < layers.length - 1; l++) {
      const hiddenNames = [];
      for (let i = 0; i < layers[l]; i++) hiddenNames.push(`h${i + 1}`);
      names.push(hiddenNames);
    }

    const outputNames = [];
    for (let i = 0; i < layers[layers.length - 1]; i++) outputNames.push(`o${i + 1}`);
    names.push(outputNames);

    return names;
  }

  getNodePosition(layerIdx, nodeIdx) {
    if (this.nodePositions[layerIdx] && this.nodePositions[layerIdx][nodeIdx]) {
      return this.nodePositions[layerIdx][nodeIdx];
    }
    return null;
  }

  _isColorDark(color) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return true;
    const [r, g, b] = match.map(Number);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.55;
  }
}
