import { formatNum } from '../utils/math-utils.js';
import { weightColor, activationColor, gradientHeatColor } from '../utils/color-utils.js';

export class NetworkRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodePositions = [];
    this.padding = { top: 60, right: 40, bottom: 60, left: 40 };
    this.nodeRadius = 34;
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

  computeLayout(layers) {
    this.nodePositions = [];
    const numLayers = layers.length;
    const usableWidth = this.width - this.padding.left - this.padding.right;
    const usableHeight = this.height - this.padding.top - this.padding.bottom;
    const layerSpacing = usableWidth / (numLayers - 1);

    for (let l = 0; l < numLayers; l++) {
      const x = this.padding.left + l * layerSpacing;
      const numNodes = layers[l];
      const nodeSpacing = usableHeight / (numNodes + 1);
      const layerPositions = [];

      for (let n = 0; n < numNodes; n++) {
        const y = this.padding.top + (n + 1) * nodeSpacing;
        layerPositions.push({ x, y });
      }
      this.nodePositions.push(layerPositions);
    }
  }

  render(network, state, animState) {
    this.animState = animState;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.computeLayout(network.layers);

    this.drawConnections(network, state);
    this.drawNodes(network, state);
    this.drawLabels(network);

    if (animState && animState.particles) {
      this.drawParticles(animState.particles);
    }
  }

  drawConnections(network, state) {
    const ctx = this.ctx;

    for (let l = 0; l < network.weights.length; l++) {
      const fromLayer = this.nodePositions[l];
      const toLayer = this.nodePositions[l + 1];
      const totalConns = fromLayer.length * toLayer.length;

      for (let i = 0; i < fromLayer.length; i++) {
        for (let j = 0; j < toLayer.length; j++) {
          const w = network.weights[l][i][j];
          const from = fromLayer[i];
          const to = toLayer[j];

          // Line style based on phase
          let color = weightColor(w);
          let lineWidth = 1 + Math.abs(w) * 1.5;

          if (state.phase === 'backward' && network.gradients[l] && network.gradients[l][i]) {
            const grad = network.gradients[l][i][j];
            color = gradientHeatColor(grad);
            lineWidth = 1.5 + Math.abs(grad) * 15;
          }

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.min(lineWidth, 5);
          ctx.stroke();

          // Weight label — spread labels along the line to avoid overlap
          // Each connection gets a unique t position between 0.2 and 0.8
          const connIdx = i * toLayer.length + j;
          const t = totalConns === 1 ? 0.5 : 0.2 + (connIdx / (totalConns - 1)) * 0.6;
          const lx = from.x + (to.x - from.x) * t;
          const ly = from.y + (to.y - from.y) * t;

          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          const offsetX = Math.sin(angle) * 14;
          const offsetY = -Math.cos(angle) * 14;

          ctx.save();

          // Draw background pill for readability
          const weightLabel = formatNum(w, 4);
          const hasGrad = state.phase === 'backward' && network.gradients[l] && network.gradients[l][i];
          const gradLabel = hasGrad ? `∂=${formatNum(network.gradients[l][i][j], 4)}` : '';

          ctx.font = '10px "JetBrains Mono", monospace';
          const textW = ctx.measureText(hasGrad ? `${weightLabel}  ${gradLabel}` : weightLabel).width;
          const bgX = lx + offsetX;
          const bgY = ly + offsetY;
          const bgPad = 3;

          ctx.fillStyle = 'rgba(15,23,42,0.85)';
          ctx.beginPath();
          ctx.roundRect(bgX - textW / 2 - bgPad, bgY - 7 - bgPad, textW + bgPad * 2, (hasGrad ? 26 : 14) + bgPad * 2, 3);
          ctx.fill();

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

  drawNodes(network, state) {
    const ctx = this.ctx;
    const layerNames = this.getLayerNames(network.layers);

    for (let l = 0; l < this.nodePositions.length; l++) {
      for (let n = 0; n < this.nodePositions[l].length; n++) {
        const pos = this.nodePositions[l][n];
        const isInput = l === 0;
        const isOutput = l === this.nodePositions.length - 1;

        // Node value
        let outVal = null;
        let netVal = null;
        if (network.outValues[l]) outVal = network.outValues[l][n];
        if (l > 0 && network.netValues[l - 1]) netVal = network.netValues[l - 1][n];

        // Node color
        let fillColor = '#1e293b';
        let strokeColor = '#475569';

        if (outVal !== null && outVal !== undefined) {
          fillColor = activationColor(outVal);
          strokeColor = '#60a5fa';
        }

        if (state.phase === 'forward' && outVal !== null) {
          strokeColor = '#22d3ee';
        }
        if (state.phase === 'backward' && l > 0 && network.deltas[l - 1]) {
          strokeColor = '#f97316';
        }

        // Draw node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Determine text color based on background brightness
        const isDarkBg = this._isColorDark(fillColor);
        const labelColor = isDarkBg ? '#e2e8f0' : '#1e293b';
        const valueColor = isDarkBg ? '#93c5fd' : '#1e3a5f';

        // Node label inside
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.fillStyle = labelColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text shadow for readability
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

        // Value inside node
        if (outVal !== null && outVal !== undefined) {
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillStyle = valueColor;
          ctx.fillText(formatNum(outVal, 4), pos.x, pos.y + 10);
        }
        ctx.restore();

        // Net value above node (for hidden and output layers)
        if (netVal !== null && netVal !== undefined && state.phase !== 'idle') {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(148,163,184,0.8)';
          ctx.textAlign = 'center';
          ctx.fillText(`net=${formatNum(netVal, 4)}`, pos.x, pos.y - this.nodeRadius - 10);
        }

        // Delta below node (during backward)
        if (state.phase === 'backward' && l > 0 && network.deltas[l - 1] && network.deltas[l - 1][n] !== undefined) {
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
      ctx.fillText(labels[l], x, this.padding.top - 20);
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
    // Input layer
    const inputNames = [];
    for (let i = 0; i < layers[0]; i++) inputNames.push(`i${i + 1}`);
    names.push(inputNames);

    // Hidden layers
    for (let l = 1; l < layers.length - 1; l++) {
      const hiddenNames = [];
      for (let i = 0; i < layers[l]; i++) hiddenNames.push(`h${i + 1}`);
      names.push(hiddenNames);
    }

    // Output layer
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
    // Parse rgb/rgba string to get brightness
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return true;
    const [r, g, b] = match.map(Number);
    // Relative luminance approximation
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.55;
  }
}
