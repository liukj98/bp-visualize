import { formatNum } from '../utils/math-utils.js';
import { gradientHeatColor } from '../utils/color-utils.js';
import { MAJOR_PHASES } from '../model/training-state.js';

export class NetworkRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodePositions = [];
    this.padding = { top: 80, right: 80, bottom: 60, left: 80 };
    this.nodeRadius = 34;
    this.animState = null;
    this.dpr = window.devicePixelRatio || 1;

    // Drag interaction state
    this.customPositions = new Map();
    this.dragState = { dragging: false, layerIdx: -1, nodeIdx: -1, offsetX: 0, offsetY: 0 };
    this.hoveredNode = null;
    this._lastNetwork = null;
    this._lastState = null;
    this._lastAnimState = null;

    this.resize();
    this._bindDragEvents();
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
    const usableWidth = this.width - this.padding.left - this.padding.right;
    const usableHeight = this.height - this.padding.top - this.padding.bottom;
    const layerSpacing = usableWidth / (numLayers - 1 + 1);

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

    // Override with user-dragged positions
    for (const [key, pos] of this.customPositions) {
      const [l, n] = key.split('-').map(Number);
      if (this.nodePositions[l] && this.nodePositions[l][n]) {
        this.nodePositions[l][n] = { x: pos.x, y: pos.y };
      }
    }
  }

  render(network, state, animState) {
    this._lastNetwork = network;
    this._lastState = state;
    this._lastAnimState = animState;
    this.animState = animState;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.computeLayout(network.layers);

    this.drawConnections(network, state);
    this.drawNodes(network, state);
    this.drawLabels(network);
    this.drawLossDisplay(network, state);

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

      const isActiveForward = (phase === 'forward-hidden' && l === 0) || (phase === 'forward-output' && l === 1);
      const isActiveBackward = (phase === 'backward-output' && l === 1) || (phase === 'backward-hidden' && l === 0);
      const showGradients = isActiveBackward || (this._isBackward(phase) && network.gradients[l] && network.gradients[l][0]);

      for (let i = 0; i < fromLayer.length; i++) {
        for (let j = 0; j < toLayer.length; j++) {
          const w = network.weights[l][i][j];
          const from = fromLayer[i];
          const to = toLayer[j];

          let color = 'rgba(148,163,184,0.7)';
          let lineWidth = 1.5;

          if (showGradients && network.gradients[l] && network.gradients[l][i]) {
            color = gradientHeatColor(network.gradients[l][i][j]);
            lineWidth = 2;
          }

          if (isActiveForward) {
            color = '#22d3ee';
            lineWidth = 2;
          }

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.globalAlpha = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Weight label
          const connIdx = i * toLayer.length + j;
          const isStraight = (i === j);
          const t = isStraight ? 0.5 : (totalConns === 1 ? 0.5 : 0.2 + (connIdx / (totalConns - 1)) * 0.6);
          const lx = from.x + (to.x - from.x) * t;
          const ly = from.y + (to.y - from.y) * t;

          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          const offsetX = Math.sin(angle) * 14;
          const offsetY = -Math.cos(angle) * 14;

          ctx.save();
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

  drawLossDisplay(network, state) {
    const ctx = this.ctx;
    const phase = state.phase;
    const hasLoss = state.currentLoss !== null && state.currentLoss !== undefined;
    const showLoss = this._isLoss(phase) || this._isBackward(phase) || phase === 'update' || (phase === 'idle' && hasLoss);
    if (!showLoss) return;

    // Display loss value near the output node
    const outputLayer = this.nodePositions[this.nodePositions.length - 1];
    if (!outputLayer || !outputLayer[0]) return;

    const pos = outputLayer[0];
    const lossX = pos.x + this.nodeRadius + 60;
    const lossY = pos.y;

    ctx.save();
    // Draw loss box
    const lossText = `Loss = ${hasLoss ? formatNum(state.currentLoss, 6) : '—'}`;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(lossText).width;
    const boxPad = 10;

    ctx.fillStyle = this._isLoss(phase) ? 'rgba(59,130,246,0.15)' :
                    this._isBackward(phase) ? 'rgba(249,115,22,0.15)' :
                    'rgba(30,41,59,0.8)';
    ctx.strokeStyle = this._isLoss(phase) ? '#3b82f6' :
                      this._isBackward(phase) ? '#f97316' :
                      '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(lossX - textWidth / 2 - boxPad, lossY - 12 - boxPad, textWidth + boxPad * 2, 24 + boxPad * 2, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillStyle = hasLoss ? '#60a5fa' : '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lossText, lossX, lossY);
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
          fillColor = '#1e3a5f';
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

        // Highlight dragged or hovered node
        const isDragTarget = this.dragState.dragging && this.dragState.layerIdx === l && this.dragState.nodeIdx === n;
        const isHoverTarget = !this.dragState.dragging && this.hoveredNode && this.hoveredNode.layerIdx === l && this.hoveredNode.nodeIdx === n;
        if (isDragTarget) {
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 3.5;
        } else if (isHoverTarget) {
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2.5;
        }
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

        // Net value above node (for linear network, net = out, so skip for clarity)

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
    // Input layer: x₁, x₂
    const inputNames = [];
    for (let i = 0; i < layers[0]; i++) inputNames.push(`x${i + 1}`);
    names.push(inputNames);

    // Hidden layers: h₁, h₂
    for (let l = 1; l < layers.length - 1; l++) {
      const hiddenNames = [];
      for (let i = 0; i < layers[l]; i++) hiddenNames.push(`h${i + 1}`);
      names.push(hiddenNames);
    }

    // Output layer: y
    const outputNames = [];
    for (let i = 0; i < layers[layers.length - 1]; i++) {
      outputNames.push(layers[layers.length - 1] === 1 ? 'y' : `y${i + 1}`);
    }
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

  hitTestNode(cx, cy) {
    for (let l = 0; l < this.nodePositions.length; l++) {
      for (let n = 0; n < this.nodePositions[l].length; n++) {
        const pos = this.nodePositions[l][n];
        const dx = cx - pos.x;
        const dy = cy - pos.y;
        if (dx * dx + dy * dy <= this.nodeRadius * this.nodeRadius) {
          return { layerIdx: l, nodeIdx: n };
        }
      }
    }
    return null;
  }

  _rerender() {
    if (this._lastNetwork && this._lastState) {
      this.render(this._lastNetwork, this._lastState, this._lastAnimState || { particles: [] });
    }
  }

  _bindDragEvents() {
    const canvas = this.canvas;

    const onDown = (cx, cy) => {
      const hit = this.hitTestNode(cx, cy);
      if (hit) {
        const pos = this.nodePositions[hit.layerIdx][hit.nodeIdx];
        this.dragState = {
          dragging: true,
          layerIdx: hit.layerIdx,
          nodeIdx: hit.nodeIdx,
          offsetX: cx - pos.x,
          offsetY: cy - pos.y,
        };
        canvas.style.cursor = 'grabbing';
        this._rerender();
      }
    };

    const onMove = (cx, cy) => {
      if (this.dragState.dragging) {
        const key = `${this.dragState.layerIdx}-${this.dragState.nodeIdx}`;
        this.customPositions.set(key, {
          x: cx - this.dragState.offsetX,
          y: cy - this.dragState.offsetY,
        });
        this._rerender();
      } else {
        // Hover detection
        const hit = this.hitTestNode(cx, cy);
        const prev = this.hoveredNode;
        this.hoveredNode = hit;
        canvas.style.cursor = hit ? 'grab' : 'default';
        // Re-render only if hover state changed
        if ((hit && !prev) || (!hit && prev) ||
            (hit && prev && (hit.layerIdx !== prev.layerIdx || hit.nodeIdx !== prev.nodeIdx))) {
          this._rerender();
        }
      }
    };

    const onUp = () => {
      if (this.dragState.dragging) {
        this.dragState = { dragging: false, layerIdx: -1, nodeIdx: -1, offsetX: 0, offsetY: 0 };
        canvas.style.cursor = this.hoveredNode ? 'grab' : 'default';
        this._rerender();
      }
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      onDown(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mousemove', (e) => {
      onMove(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', () => {
      onUp();
      this.hoveredNode = null;
      canvas.style.cursor = 'default';
    });

    // Touch events
    const touchCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };
    canvas.addEventListener('touchstart', (e) => {
      const { x, y } = touchCoords(e);
      onDown(x, y);
      if (this.dragState.dragging) e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      if (this.dragState.dragging) {
        e.preventDefault();
        const { x, y } = touchCoords(e);
        onMove(x, y);
      }
    }, { passive: false });
    canvas.addEventListener('touchend', onUp);
  }

  clearCustomPositions() {
    this.customPositions.clear();
    this.hoveredNode = null;
    this.dragState = { dragging: false, layerIdx: -1, nodeIdx: -1, offsetX: 0, offsetY: 0 };
    this.canvas.style.cursor = 'default';
  }
}
