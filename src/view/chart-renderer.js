import { formatNum } from '../utils/math-utils.js';

export class ChartRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.padding = { top: 30, right: 20, bottom: 35, left: 55 };
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

  render(lossHistory) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (!lossHistory || lossHistory.length === 0) {
      ctx.font = '13px "Inter", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('开始训练后显示损失曲线', this.width / 2, this.height / 2);
      return;
    }

    const plotW = this.width - this.padding.left - this.padding.right;
    const plotH = this.height - this.padding.top - this.padding.bottom;
    const maxLoss = Math.max(...lossHistory.map(d => d.loss)) * 1.1;
    const minLoss = 0;
    const maxEpoch = lossHistory[lossHistory.length - 1].epoch;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.padding.left, this.padding.top);
    ctx.lineTo(this.padding.left, this.padding.top + plotH);
    ctx.lineTo(this.padding.left + plotW, this.padding.top + plotH);
    ctx.stroke();

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 4; i++) {
      const y = this.padding.top + plotH - (plotH * i / 4);
      ctx.beginPath();
      ctx.moveTo(this.padding.left, y);
      ctx.lineTo(this.padding.left + plotW, y);
      ctx.stroke();

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.fillText(formatNum(minLoss + (maxLoss - minLoss) * i / 4, 4), this.padding.left - 5, y + 3);
    }

    // Y-axis label
    ctx.save();
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.translate(14, this.padding.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('E', 0, 0);
    ctx.restore();

    // X-axis label
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('Epoch', this.padding.left + plotW / 2, this.height - 5);

    // X-axis ticks
    const xTicks = Math.min(5, maxEpoch);
    for (let i = 0; i <= xTicks; i++) {
      const epochVal = Math.round(maxEpoch * i / xTicks);
      const x = this.padding.left + (plotW * i / xTicks);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(epochVal.toString(), x, this.padding.top + plotH + 15);
    }

    // Loss curve
    if (lossHistory.length > 1) {
      const gradient = ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + plotH);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      // Fill area
      ctx.beginPath();
      for (let i = 0; i < lossHistory.length; i++) {
        const x = this.padding.left + (lossHistory[i].epoch / Math.max(maxEpoch, 1)) * plotW;
        const y = this.padding.top + plotH - ((lossHistory[i].loss - minLoss) / (maxLoss - minLoss)) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const lastX = this.padding.left + plotW;
      ctx.lineTo(lastX, this.padding.top + plotH);
      ctx.lineTo(this.padding.left, this.padding.top + plotH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Line
      ctx.beginPath();
      for (let i = 0; i < lossHistory.length; i++) {
        const x = this.padding.left + (lossHistory[i].epoch / Math.max(maxEpoch, 1)) * plotW;
        const y = this.padding.top + plotH - ((lossHistory[i].loss - minLoss) / (maxLoss - minLoss)) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Current loss dot
    if (lossHistory.length > 0) {
      const last = lossHistory[lossHistory.length - 1];
      const x = this.padding.left + (last.epoch / Math.max(maxEpoch, 1)) * plotW;
      const y = this.padding.top + plotH - ((last.loss - minLoss) / (maxLoss - minLoss)) * plotH;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#60a5fa';
      ctx.fill();

      // Title
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'left';
      ctx.fillText(`E: ${formatNum(last.loss, 6)}`, this.padding.left + 5, this.padding.top - 10);
    }
  }
}
