export class TrainingState {
  constructor() {
    this.epoch = 0;
    this.phase = 'idle'; // idle, forward, loss, backward, update
    this.lossHistory = [];
    this.currentLoss = null;
    this.currentPerOutputLoss = null;
    this.isAutoTraining = false;
    this.autoTrainSpeed = 500; // ms per iteration
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

  nextPhase() {
    const phases = ['idle', 'forward', 'loss', 'backward', 'update'];
    const idx = phases.indexOf(this.phase);
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
