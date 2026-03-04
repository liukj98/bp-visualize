import { eventBus } from './event-bus.js';
import { formatNum } from '../utils/math-utils.js';

export class UIController {
  constructor(trainingController, renderer, animEngine, chartRenderer, formulaDisplay) {
    this.tc = trainingController;
    this.renderer = renderer;
    this.animEngine = animEngine;
    this.chart = chartRenderer;
    this.formula = formulaDisplay;
    this.isAnimating = false;

    this.bindEvents();
    this.bindBusEvents();
    this.initialRender();
  }

  bindEvents() {
    // Step button
    document.getElementById('btn-step').addEventListener('click', () => {
      if (this.isAnimating || this.tc.state.isAutoTraining) return;
      this.executeStep();
    });

    // Auto train
    document.getElementById('btn-auto').addEventListener('click', () => {
      if (this.tc.state.isAutoTraining) {
        this.tc.stopAutoTrain();
      } else {
        const speed = parseInt(document.getElementById('speed-slider').value);
        this.tc.startAutoTrain(speed);
      }
    });

    // Reset
    document.getElementById('btn-reset').addEventListener('click', () => {
      this.tc.reset();
    });

    // Fast train
    document.getElementById('btn-fast').addEventListener('click', () => {
      const iters = parseInt(document.getElementById('fast-iters').value) || 1000;
      this.tc.fastTrain(iters);
    });

    // Learning rate
    document.getElementById('lr-slider').addEventListener('input', (e) => {
      const lr = parseFloat(e.target.value);
      this.tc.setLearningRate(lr);
      document.getElementById('lr-value').textContent = lr.toFixed(2);
    });

    // Speed
    document.getElementById('speed-slider').addEventListener('input', (e) => {
      const speed = parseInt(e.target.value);
      if (this.tc.state.isAutoTraining) {
        this.tc.state.autoTrainSpeed = speed;
      }
      document.getElementById('speed-value').textContent = speed + 'ms';
    });

    // Activation function
    document.getElementById('activation-select').addEventListener('change', (e) => {
      this.tc.setActivation(e.target.value);
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
      });
    });

    // Resize
    window.addEventListener('resize', () => {
      this.renderer.resize();
      this.chart.resize();
      this.renderNetwork();
      this.chart.render(this.tc.state.lossHistory);
    });
  }

  bindBusEvents() {
    eventBus.on('reset', () => {
      this.isAnimating = false;
      this.initialRender();
    });

    eventBus.on('auto:start', () => {
      document.getElementById('btn-auto').textContent = '⏸ 暂停';
      document.getElementById('btn-auto').classList.add('active');
    });

    eventBus.on('auto:stop', () => {
      document.getElementById('btn-auto').textContent = '▶ 自动训练';
      document.getElementById('btn-auto').classList.remove('active');
    });

    eventBus.on('auto:step', () => {
      this.renderNetwork();
      this.chart.render(this.tc.state.lossHistory);
      this.updateInfoPanel();
      this.formula.renderPhase('idle', this.tc.network, this.tc.targets);
    });

    eventBus.on('fast:complete', () => {
      this.renderNetwork();
      this.chart.render(this.tc.state.lossHistory);
      this.updateInfoPanel();
      this.formula.renderPhase('idle', this.tc.network, this.tc.targets);
    });
  }

  executeStep() {
    const phase = this.tc.state.phase;

    if (phase === 'idle') {
      // Forward propagation with animation
      this.isAnimating = true;
      this.tc.stepForward();
      this.animEngine.animateForward(this.tc.network, this.tc.state, 1200, () => {
        this.isAnimating = false;
        this.renderNetwork();
        this.formula.renderPhase('forward', this.tc.network, this.tc.targets);
        this.updatePhaseIndicator();
      });
      this.updatePhaseIndicator();
    } else if (phase === 'forward') {
      this.tc.stepLoss();
      this.renderNetwork();
      this.formula.renderPhase('loss', this.tc.network, this.tc.targets);
      this.updateInfoPanel();
      this.updatePhaseIndicator();
    } else if (phase === 'loss') {
      this.isAnimating = true;
      this.tc.stepBackward();
      this.animEngine.animateBackward(this.tc.network, this.tc.state, 1200, () => {
        this.isAnimating = false;
        this.renderNetwork();
        this.formula.renderPhase('backward', this.tc.network, this.tc.targets);
        this.updatePhaseIndicator();
      });
      this.updatePhaseIndicator();
    } else if (phase === 'backward') {
      const oldWeights = this.tc.stepUpdate();
      this.renderNetwork();
      this.chart.render(this.tc.state.lossHistory);
      this.formula.renderPhase('update', this.tc.network, this.tc.targets);
      this.updateInfoPanel();
      this.updatePhaseIndicator();
    } else if (phase === 'update') {
      this.tc.state.setPhase('idle');
      this.renderNetwork();
      this.formula.renderPhase('idle', this.tc.network, this.tc.targets);
      this.updatePhaseIndicator();
    }
  }

  renderNetwork() {
    this.renderer.render(this.tc.network, this.tc.state, { particles: [] });
  }

  updateInfoPanel() {
    const info = document.getElementById('info-panel');
    if (!info) return;

    const epoch = this.tc.state.epoch;
    const loss = this.tc.state.currentLoss;
    const phase = this.tc.state.phase;

    info.innerHTML = `
      <div class="info-row"><span>迭代次数</span><strong>${epoch}</strong></div>
      <div class="info-row"><span>当前损失</span><strong>${loss !== null ? formatNum(loss, 6) : '—'}</strong></div>
      <div class="info-row"><span>学习率</span><strong>${this.tc.network.learningRate}</strong></div>
      <div class="info-row"><span>激活函数</span><strong>${this.tc.network.activationName}</strong></div>
    `;
  }

  updatePhaseIndicator() {
    const phaseMap = {
      idle: '就绪',
      forward: '前向传播',
      loss: '损失计算',
      backward: '反向传播',
      update: '权重更新',
    };
    const el = document.getElementById('phase-indicator');
    if (el) {
      el.textContent = phaseMap[this.tc.state.phase] || '就绪';
      el.className = 'phase-indicator phase-' + this.tc.state.phase;
    }
  }

  initialRender() {
    this.renderNetwork();
    this.chart.render([]);
    this.formula.renderPhase('idle', this.tc.network, this.tc.targets);
    this.updateInfoPanel();
    this.updatePhaseIndicator();
  }
}
