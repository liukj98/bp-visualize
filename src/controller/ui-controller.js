import { eventBus } from './event-bus.js';
import { formatNum } from '../utils/math-utils.js';
import { PHASE_LABELS, MAJOR_PHASES } from '../model/training-state.js';

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

    // Skip to next phase button
    const skipBtn = document.getElementById('btn-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (this.isAnimating || this.tc.state.isAutoTraining) return;
        this.executeSkip();
      });
    }

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

    // Formula zoom modal
    const formulaPanel = document.getElementById('formula-panel');
    const formulaModal = document.getElementById('formula-modal');
    const formulaModalBody = document.getElementById('formula-modal-body');
    const formulaModalClose = document.getElementById('formula-modal-close');

    if (formulaPanel && formulaModal) {
      formulaPanel.addEventListener('click', () => {
        const container = document.getElementById('formula-container');
        if (container) {
          formulaModalBody.innerHTML = container.innerHTML;
        }
        formulaModal.style.display = 'flex';
      });

      formulaModalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        formulaModal.style.display = 'none';
      });

      formulaModal.addEventListener('click', (e) => {
        if (e.target === formulaModal) {
          formulaModal.style.display = 'none';
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && formulaModal.style.display === 'flex') {
          formulaModal.style.display = 'none';
        }
      });
    }
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
      this.updatePhaseIndicator();
    });

    eventBus.on('fast:complete', () => {
      this.renderNetwork();
      this.chart.render(this.tc.state.lossHistory);
      this.updateInfoPanel();
      this.formula.renderPhase('idle', this.tc.network, this.tc.targets);
      this.updatePhaseIndicator();
    });
  }

  executeStep() {
    const phase = this.tc.state.phase;
    const animDuration = 800;

    switch (phase) {
      case 'idle':
        // Forward hidden with animation
        this.isAnimating = true;
        this.tc.stepForwardHidden();
        this.updatePhaseIndicator();
        this.animEngine.animateForwardHidden(this.tc.network, this.tc.state, animDuration, () => {
          this.isAnimating = false;
          this.renderNetwork();
          this.formula.renderPhase('forward-hidden', this.tc.network, this.tc.targets);
          this.updatePhaseIndicator();
        });
        break;

      case 'forward-hidden':
        // Forward output with animation
        this.isAnimating = true;
        this.tc.stepForwardOutput();
        this.updatePhaseIndicator();
        this.animEngine.animateForwardOutput(this.tc.network, this.tc.state, animDuration, () => {
          this.isAnimating = false;
          this.renderNetwork();
          this.formula.renderPhase('forward-output', this.tc.network, this.tc.targets);
          this.updatePhaseIndicator();
        });
        break;

      case 'forward-output':
        // Loss per output with animation
        this.isAnimating = true;
        this.tc.stepLossPerOutput();
        this.updatePhaseIndicator();
        this.animEngine.animateLossFlow(this.tc.network, this.tc.state, animDuration, () => {
          this.isAnimating = false;
          this.renderNetwork();
          this.formula.renderPhase('loss-per-output', this.tc.network, this.tc.targets);
          this.updateInfoPanel();
          this.updatePhaseIndicator();
        });
        break;

      case 'loss-per-output':
        // Loss total (no animation, just display)
        this.tc.stepLossTotal();
        this.renderNetwork();
        this.formula.renderPhase('loss-total', this.tc.network, this.tc.targets);
        this.updateInfoPanel();
        this.updatePhaseIndicator();
        break;

      case 'loss-total':
        // Backward output with animation
        this.isAnimating = true;
        this.tc.stepBackwardOutput();
        this.updatePhaseIndicator();
        this.animEngine.animateBackwardOutput(this.tc.network, this.tc.state, animDuration, () => {
          this.isAnimating = false;
          this.renderNetwork();
          this.formula.renderPhase('backward-output', this.tc.network, this.tc.targets);
          this.updatePhaseIndicator();
        });
        break;

      case 'backward-output':
        // Backward hidden with animation
        this.isAnimating = true;
        this.tc.stepBackwardHidden();
        this.updatePhaseIndicator();
        this.animEngine.animateBackwardHidden(this.tc.network, this.tc.state, animDuration, () => {
          this.isAnimating = false;
          this.renderNetwork();
          this.formula.renderPhase('backward-hidden', this.tc.network, this.tc.targets);
          this.updatePhaseIndicator();
        });
        break;

      case 'backward-hidden':
        // Weight update
        this.tc.stepUpdate();
        this.renderNetwork();
        this.chart.render(this.tc.state.lossHistory);
        this.formula.renderPhase('update', this.tc.network, this.tc.targets);
        this.updateInfoPanel();
        this.updatePhaseIndicator();
        break;

      case 'update':
        // Back to idle
        this.tc.state.setPhase('idle');
        this.renderNetwork();
        this.formula.renderPhase('idle', this.tc.network, this.tc.targets);
        this.updatePhaseIndicator();
        break;
    }
  }

  executeSkip() {
    const currentMajor = MAJOR_PHASES[this.tc.state.phase];
    if (!currentMajor || currentMajor === 'idle') return;

    // Execute remaining sub-steps of current major phase without animation
    while (true) {
      const phase = this.tc.state.phase;
      const major = MAJOR_PHASES[phase];
      if (major !== currentMajor || phase === 'idle') break;
      this.tc.nextStep();
    }

    this.renderNetwork();
    this.chart.render(this.tc.state.lossHistory);
    this.formula.renderPhase(this.tc.state.phase, this.tc.network, this.tc.targets);
    this.updateInfoPanel();
    this.updatePhaseIndicator();
  }

  renderNetwork() {
    this.renderer.render(this.tc.network, this.tc.state, { particles: [] });
  }

  updateInfoPanel() {
    const info = document.getElementById('info-panel');
    if (!info) return;

    const epoch = this.tc.state.epoch;
    const loss = this.tc.state.currentLoss;
    const step = this.tc.state.stepNumber;
    const total = this.tc.state.totalSteps;

    info.innerHTML = `
      <div class="info-row"><span>迭代次数</span><strong>${epoch}</strong></div>
      <div class="info-row"><span>当前损失</span><strong>${loss !== null ? formatNum(loss, 6) : '—'}</strong></div>
      <div class="info-row"><span>学习率</span><strong>${this.tc.network.learningRate}</strong></div>
      <div class="info-row"><span>激活函数</span><strong>${this.tc.network.activationName}</strong></div>
      <div class="info-row"><span>当前步骤</span><strong>${step > 0 ? `${step} / ${total}` : '—'}</strong></div>
    `;
  }

  updatePhaseIndicator() {
    const phase = this.tc.state.phase;
    const label = PHASE_LABELS[phase] || '就绪';
    const major = MAJOR_PHASES[phase] || 'idle';
    const step = this.tc.state.stepNumber;
    const total = this.tc.state.totalSteps;

    const el = document.getElementById('phase-indicator');
    if (el) {
      el.textContent = step > 0 ? `${label}  (${step}/${total})` : label;
      el.className = 'phase-indicator phase-' + major;
    }

    // Show/hide skip button
    const skipBtn = document.getElementById('btn-skip');
    if (skipBtn) {
      skipBtn.style.display = phase !== 'idle' ? 'inline-block' : 'none';
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
