// Sub-phase order for detailed step-through (simplified for 2-2-1 single-output)
export const SUB_PHASES = [
  'idle',
  'forward-hidden',
  'forward-output',
  'loss',
  'backward-output',
  'backward-hidden',
  'update',
];

// Major phase grouping for "skip to next phase"
export const MAJOR_PHASES = {
  'forward-hidden': 'forward',
  'forward-output': 'forward',
  'loss': 'loss',
  'backward-output': 'backward',
  'backward-hidden': 'backward',
  'update': 'update',
  'idle': 'idle',
};

export const PHASE_LABELS = {
  'idle': '就绪',
  'forward-hidden': '前向传播 — 隐藏层计算',
  'forward-output': '前向传播 — 输出层计算',
  'loss': '损失计算',
  'backward-output': '反向传播 — 输出层梯度',
  'backward-hidden': '反向传播 — 隐藏层梯度',
  'update': '权重更新',
};

export class TrainingState {
  constructor() {
    this.epoch = 0;
    this.phase = 'idle';
    this.lossHistory = [];
    this.currentLoss = null;
    this.currentPerOutputLoss = null;
    this.isAutoTraining = false;
    this.autoTrainSpeed = 500;
    this.autoTrainTimer = null;
    this.oldWeights = null;
    this.snapshotBeforeUpdate = null;
  }

  reset() {
    this.epoch = 0;
    this.phase = 'idle';
    this.lossHistory = [];
    this.currentLoss = null;
    this.currentPerOutputLoss = null;
    this.isAutoTraining = false;
    this.oldWeights = null;
    this.snapshotBeforeUpdate = null;
    if (this.autoTrainTimer) {
      clearInterval(this.autoTrainTimer);
      this.autoTrainTimer = null;
    }
  }

  recordLoss(loss) {
    this.currentLoss = loss;
    this.lossHistory.push({ epoch: this.epoch, loss });
  }

  /** Get current sub-phase index in SUB_PHASES */
  get subPhaseIndex() {
    return SUB_PHASES.indexOf(this.phase);
  }

  /** Get current step number (1-based, out of total sub-steps) */
  get stepNumber() {
    const idx = this.subPhaseIndex;
    return idx <= 0 ? 0 : idx; // 1..7
  }

  get totalSteps() {
    return SUB_PHASES.length - 1; // 7 (excluding idle)
  }

  /** Advance to next sub-phase */
  nextSubPhase() {
    const idx = this.subPhaseIndex;
    if (idx === SUB_PHASES.length - 1) {
      // After 'update', go back to idle and increment epoch
      this.epoch++;
      this.phase = 'idle';
      return 'complete';
    }
    this.phase = SUB_PHASES[idx + 1];
    return this.phase;
  }

  /** Skip to the first sub-phase of the next major phase */
  skipToNextMajorPhase() {
    const currentMajor = MAJOR_PHASES[this.phase];
    let idx = this.subPhaseIndex;
    while (idx < SUB_PHASES.length - 1) {
      idx++;
      if (MAJOR_PHASES[SUB_PHASES[idx]] !== currentMajor) {
        this.phase = SUB_PHASES[idx];
        return this.phase;
      }
    }
    // If we reach the end, wrap to idle
    this.epoch++;
    this.phase = 'idle';
    return 'complete';
  }

  /** Legacy: still works for auto-train */
  nextPhase() {
    const phases = ['idle', 'forward', 'loss', 'backward', 'update'];
    const majorPhaseMap = { idle: 'idle', forward: 'forward', loss: 'loss', backward: 'backward', update: 'update' };
    // Map current sub-phase to major phase for compatibility
    const currentMajor = MAJOR_PHASES[this.phase] || this.phase;
    const idx = phases.indexOf(currentMajor);
    if (idx === phases.length - 1) {
      this.epoch++;
      this.phase = 'idle';
      return 'complete';
    }
    this.phase = phases[idx + 1];
    return this.phase;
  }

  setPhase(phase) {
    this.phase = phase;
  }
}
