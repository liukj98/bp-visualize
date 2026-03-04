import { createDefaultNetwork, DEFAULT_INPUTS, DEFAULT_TARGETS } from '../model/neural-network.js';
import { TrainingState } from '../model/training-state.js';
import { eventBus } from './event-bus.js';

export class TrainingController {
  constructor() {
    this.network = createDefaultNetwork();
    this.state = new TrainingState();
    this.inputs = DEFAULT_INPUTS.slice();
    this.targets = DEFAULT_TARGETS.slice();
    this.animDuration = 800;
  }

  stepForward() {
    this.state.setPhase('forward');
    const output = this.network.forward(this.inputs);
    eventBus.emit('phase:forward', { output, network: this.network, state: this.state });
    return output;
  }

  stepLoss() {
    this.state.setPhase('loss');
    const { totalLoss, perOutput } = this.network.computeLoss(this.targets);
    this.state.currentLoss = totalLoss;
    this.state.currentPerOutputLoss = perOutput;
    eventBus.emit('phase:loss', { totalLoss, perOutput, network: this.network, state: this.state });
    return { totalLoss, perOutput };
  }

  stepBackward() {
    this.state.setPhase('backward');
    const result = this.network.backward(this.targets);
    eventBus.emit('phase:backward', { ...result, network: this.network, state: this.state });
    return result;
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

  nextStep() {
    switch (this.state.phase) {
      case 'idle':
        return this.stepForward();
      case 'forward':
        return this.stepLoss();
      case 'loss':
        return this.stepBackward();
      case 'backward':
        return this.stepUpdate();
      case 'update':
        this.state.setPhase('idle');
        eventBus.emit('phase:idle', { network: this.network, state: this.state });
        return null;
    }
  }

  runFullIteration() {
    this.stepForward();
    this.stepLoss();
    this.stepBackward();
    this.stepUpdate();
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

  setActivation(name) {
    this.network.setActivation(name);
    eventBus.emit('param:activation', { value: name });
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
      this.network.forward(this.inputs);
      this.network.computeLoss(this.targets);
      this.network.backward(this.targets);
      const oldW = this.network.updateWeights();
      const { totalLoss } = this.network.computeLoss(this.targets);
      this.state.recordLoss(totalLoss);
      this.state.epoch++;
    }
    this.state.setPhase('idle');
    // Do one more forward for display
    this.network.forward(this.inputs);
    this.network.computeLoss(this.targets);
    eventBus.emit('fast:complete', { network: this.network, state: this.state });
  }
}
