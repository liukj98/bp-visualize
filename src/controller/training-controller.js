import { createDefaultNetwork, DEFAULT_INPUTS, DEFAULT_TARGETS } from '../model/neural-network.js';
import { TrainingState, SUB_PHASES, MAJOR_PHASES } from '../model/training-state.js';
import { eventBus } from './event-bus.js';

export class TrainingController {
  constructor() {
    this.network = createDefaultNetwork();
    this.state = new TrainingState();
    this.inputs = DEFAULT_INPUTS.slice();
    this.targets = DEFAULT_TARGETS.slice();
    this.animDuration = 800;
  }

  // --- Sub-step methods ---

  stepForwardHidden() {
    this.state.setPhase('forward-hidden');
    this.network.forwardHidden(this.inputs);
    eventBus.emit('phase:forward-hidden', { network: this.network, state: this.state });
  }

  stepForwardOutput() {
    this.state.setPhase('forward-output');
    this.network.forwardOutput();
    eventBus.emit('phase:forward-output', { network: this.network, state: this.state });
  }

  stepLoss() {
    this.state.setPhase('loss');
    const { totalLoss, perOutput } = this.network.computeLoss(this.targets);
    this.state.currentLoss = totalLoss;
    this.state.currentPerOutputLoss = perOutput;
    eventBus.emit('phase:loss', { totalLoss, perOutput, network: this.network, state: this.state });
  }

  stepBackwardOutput() {
    this.state.setPhase('backward-output');
    this.network.backwardOutput(this.targets);
    eventBus.emit('phase:backward-output', { network: this.network, state: this.state });
  }

  stepBackwardHidden() {
    this.state.setPhase('backward-hidden');
    this.network.backwardHidden();
    eventBus.emit('phase:backward-hidden', { network: this.network, state: this.state });
  }

  stepUpdate() {
    this.state.setPhase('update');
    this.state.snapshotBeforeUpdate = this.network.getState();
    const oldWeights = this.network.updateWeights();
    this.state.oldWeights = oldWeights;
    this.state.recordLoss(this.state.currentLoss);
    this.state.epoch++;
    eventBus.emit('phase:update', { oldWeights, network: this.network, state: this.state });
    return oldWeights;
  }

  /** Execute the next sub-step based on current phase */
  nextStep() {
    switch (this.state.phase) {
      case 'idle':
        return this.stepForwardHidden();
      case 'forward-hidden':
        return this.stepForwardOutput();
      case 'forward-output':
        return this.stepLoss();
      case 'loss':
        return this.stepBackwardOutput();
      case 'backward-output':
        return this.stepBackwardHidden();
      case 'backward-hidden':
        return this.stepUpdate();
      case 'update':
        this.state.setPhase('idle');
        eventBus.emit('phase:idle', { network: this.network, state: this.state });
        return null;
    }
  }

  /** Skip remaining sub-steps of current major phase */
  skipToNextMajorPhase() {
    const currentMajor = MAJOR_PHASES[this.state.phase];
    while (MAJOR_PHASES[this.state.phase] === currentMajor && this.state.phase !== 'idle') {
      this.nextStep();
    }
    return this.state.phase;
  }

  /** Legacy: full forward + loss + backward + update */
  stepForward() {
    this.state.setPhase('forward-hidden');
    this.network.forwardHidden(this.inputs);
    this.state.setPhase('forward-output');
    this.network.forwardOutput();
    this.state.setPhase('forward-output');
    eventBus.emit('phase:forward-output', { network: this.network, state: this.state });
  }

  stepLossLegacy() {
    this.state.setPhase('loss');
    const { totalLoss, perOutput } = this.network.computeLoss(this.targets);
    this.state.currentLoss = totalLoss;
    this.state.currentPerOutputLoss = perOutput;
    eventBus.emit('phase:loss', { totalLoss, perOutput, network: this.network, state: this.state });
  }

  stepBackward() {
    this.state.setPhase('backward-output');
    this.network.backwardOutput(this.targets);
    this.state.setPhase('backward-hidden');
    this.network.backwardHidden();
    eventBus.emit('phase:backward-hidden', { network: this.network, state: this.state });
  }

  runFullIteration() {
    this.network.forwardHidden(this.inputs);
    this.network.forwardOutput();
    this.network.computeLoss(this.targets);
    this.network.backwardOutput(this.targets);
    this.network.backwardHidden();
    const oldW = this.network.updateWeights();
    const { totalLoss, perOutput } = this.network.computeLoss(this.targets);
    this.state.currentLoss = totalLoss;
    this.state.currentPerOutputLoss = perOutput;
    this.state.recordLoss(totalLoss);
    this.state.epoch++;
    this.state.setPhase('idle');
  }

  startAutoTrain(speed) {
    if (this.state.isAutoTraining) return;
    this.state.isAutoTraining = true;
    this.state.autoTrainSpeed = speed || this.state.autoTrainSpeed;

    const runStep = () => {
      if (!this.state.isAutoTraining) return;
      this.runFullIteration();
      eventBus.emit('auto:step', { network: this.network, state: this.state });
      this.state.autoTrainTimer = setTimeout(runStep, this.state.autoTrainSpeed);
    };

    runStep();
    eventBus.emit('auto:start', {});
  }

  stopAutoTrain() {
    this.state.isAutoTraining = false;
    if (this.state.autoTrainTimer) {
      clearTimeout(this.state.autoTrainTimer);
      this.state.autoTrainTimer = null;
    }
    eventBus.emit('auto:stop', {});
  }

  reset(keepStructure = true) {
    this.stopAutoTrain();
    if (keepStructure) {
      this.network = createDefaultNetwork();
    }
    this.inputs = DEFAULT_INPUTS.slice();
    this.targets = DEFAULT_TARGETS.slice();
    this.state.reset();
    eventBus.emit('reset', { network: this.network, state: this.state });
  }

  setLearningRate(lr) {
    this.network.learningRate = lr;
    eventBus.emit('param:learningRate', { value: lr });
  }

  setInputs(inputs) {
    this.inputs = inputs;
  }

  setTargets(targets) {
    this.targets = targets;
  }

  fastTrain(iterations) {
    this.stopAutoTrain();
    for (let i = 0; i < iterations; i++) {
      this.network.forwardHidden(this.inputs);
      this.network.forwardOutput();
      this.network.computeLoss(this.targets);
      this.network.backwardOutput(this.targets);
      this.network.backwardHidden();
      this.network.updateWeights();
      const { totalLoss } = this.network.computeLoss(this.targets);
      this.state.recordLoss(totalLoss);
      this.state.epoch++;
    }
    this.state.setPhase('idle');
    // One more forward for display
    this.network.forwardHidden(this.inputs);
    this.network.forwardOutput();
    const { totalLoss, perOutput } = this.network.computeLoss(this.targets);
    this.state.currentLoss = totalLoss;
    this.state.currentPerOutputLoss = perOutput;
    eventBus.emit('fast:complete', { network: this.network, state: this.state });
  }
}
