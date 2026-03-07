import { activations } from './activations.js';
import { mse, msePerOutput, mseDerivative } from './loss-functions.js';

export class NeuralNetwork {
  constructor(config = {}) {
    this.layers = config.layers || [2, 2, 2];
    this.learningRate = config.learningRate || 0.1;
    this.activationName = config.activation || 'sigmoid';
    this.activation = activations[this.activationName];

    this.weights = [];
    this.biases = [];

    // Per-layer values (filled during forward/backward)
    this.netValues = [];  // net (pre-activation)
    this.outValues = [];  // out (post-activation)
    this.deltas = [];     // error signals
    this.gradients = [];  // ∂E/∂w for each weight

    this.initWeights(config.initialWeights, config.initialBiases);
  }

  initWeights(initialWeights, initialBiases) {
    this.weights = [];
    this.biases = [];

    for (let l = 0; l < this.layers.length - 1; l++) {
      const rows = this.layers[l];
      const cols = this.layers[l + 1];
      const w = [];

      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          if (initialWeights && initialWeights[l]) {
            row.push(initialWeights[l][i][j]);
          } else {
            row.push(Math.random() * 0.8 - 0.4);
          }
        }
        w.push(row);
      }
      this.weights.push(w);

      const b = [];
      for (let j = 0; j < cols; j++) {
        if (initialBiases && initialBiases[l] !== undefined) {
          b.push(typeof initialBiases[l] === 'number' ? initialBiases[l] : initialBiases[l][j]);
        } else {
          b.push(Math.random() * 0.6 - 0.3);
        }
      }
      this.biases.push(b);
    }
  }

  forward(inputs) {
    this.netValues = [];
    this.outValues = [inputs.slice()];

    let currentInput = inputs.slice();

    for (let l = 0; l < this.weights.length; l++) {
      const nets = [];
      const outs = [];
      const numNeurons = this.layers[l + 1];

      for (let j = 0; j < numNeurons; j++) {
        let net = this.biases[l][j];
        for (let i = 0; i < currentInput.length; i++) {
          net += currentInput[i] * this.weights[l][i][j];
        }
        nets.push(net);
        outs.push(this.activation.fn(net));
      }

      this.netValues.push(nets);
      this.outValues.push(outs);
      currentInput = outs;
    }

    return currentInput;
  }

  /** Forward pass: hidden layer only (layer 0 weights) */
  forwardHidden(inputs) {
    this.netValues = [];
    this.outValues = [inputs.slice()];

    const nets = [];
    const outs = [];
    const numNeurons = this.layers[1];
    for (let j = 0; j < numNeurons; j++) {
      let net = this.biases[0][j];
      for (let i = 0; i < inputs.length; i++) {
        net += inputs[i] * this.weights[0][i][j];
      }
      nets.push(net);
      outs.push(this.activation.fn(net));
    }
    this.netValues.push(nets);
    this.outValues.push(outs);
    return outs;
  }

  /** Forward pass: output layer only (assumes hidden already computed) */
  forwardOutput() {
    const hiddenOut = this.outValues[1];
    const nets = [];
    const outs = [];
    const numNeurons = this.layers[2];
    for (let j = 0; j < numNeurons; j++) {
      let net = this.biases[1][j];
      for (let i = 0; i < hiddenOut.length; i++) {
        net += hiddenOut[i] * this.weights[1][i][j];
      }
      nets.push(net);
      outs.push(this.activation.fn(net));
    }
    this.netValues.push(nets);
    this.outValues.push(outs);
    return outs;
  }

  /** Backward pass: output layer only */
  backwardOutput(targets) {
    const numLayers = this.weights.length;
    this.deltas = new Array(numLayers);
    this.gradients = new Array(numLayers);

    const outputIdx = numLayers;
    const outputOut = this.outValues[outputIdx];
    const outputDeltas = [];
    for (let j = 0; j < outputOut.length; j++) {
      const dE_dout = mseDerivative(outputOut[j], targets[j]);
      const dout_dnet = this.activation.derivative(outputOut[j]);
      outputDeltas.push(dE_dout * dout_dnet);
    }
    this.deltas[numLayers - 1] = outputDeltas;

    const hiddenOut = this.outValues[outputIdx - 1];
    const outputGrads = [];
    for (let i = 0; i < hiddenOut.length; i++) {
      const row = [];
      for (let j = 0; j < outputDeltas.length; j++) {
        row.push(outputDeltas[j] * hiddenOut[i]);
      }
      outputGrads.push(row);
    }
    this.gradients[numLayers - 1] = outputGrads;
    return { deltas: outputDeltas, gradients: outputGrads };
  }

  /** Backward pass: hidden layer only (assumes output backward already done) */
  backwardHidden() {
    const numLayers = this.weights.length;
    for (let l = numLayers - 2; l >= 0; l--) {
      const layerOut = this.outValues[l + 1];
      const nextDeltas = this.deltas[l + 1];
      const nextWeights = this.weights[l + 1];
      const layerDeltas = [];
      for (let j = 0; j < layerOut.length; j++) {
        let errorSum = 0;
        for (let k = 0; k < nextDeltas.length; k++) {
          errorSum += nextDeltas[k] * nextWeights[j][k];
        }
        const dout_dnet = this.activation.derivative(layerOut[j]);
        layerDeltas.push(errorSum * dout_dnet);
      }
      this.deltas[l] = layerDeltas;

      const prevOut = this.outValues[l];
      const layerGrads = [];
      for (let i = 0; i < prevOut.length; i++) {
        const row = [];
        for (let j = 0; j < layerDeltas.length; j++) {
          row.push(layerDeltas[j] * prevOut[i]);
        }
        layerGrads.push(row);
      }
      this.gradients[l] = layerGrads;
    }
    return { deltas: this.deltas, gradients: this.gradients };
  }

  computeLoss(targets) {
    const output = this.outValues[this.outValues.length - 1];
    const totalLoss = mse(output, targets);
    const perOutput = msePerOutput(output, targets);
    return { totalLoss, perOutput };
  }

  backward(targets) {
    const numLayers = this.weights.length;
    this.deltas = new Array(numLayers);
    this.gradients = new Array(numLayers);

    // Output layer deltas
    const outputIdx = numLayers;
    const outputOut = this.outValues[outputIdx];
    const outputDeltas = [];

    for (let j = 0; j < outputOut.length; j++) {
      const dE_dout = mseDerivative(outputOut[j], targets[j]);
      const dout_dnet = this.activation.derivative(outputOut[j]);
      outputDeltas.push(dE_dout * dout_dnet);
    }
    this.deltas[numLayers - 1] = outputDeltas;

    // Output layer gradients
    const hiddenOut = this.outValues[outputIdx - 1];
    const outputGrads = [];
    for (let i = 0; i < hiddenOut.length; i++) {
      const row = [];
      for (let j = 0; j < outputDeltas.length; j++) {
        row.push(outputDeltas[j] * hiddenOut[i]);
      }
      outputGrads.push(row);
    }
    this.gradients[numLayers - 1] = outputGrads;

    // Hidden layers (right to left)
    for (let l = numLayers - 2; l >= 0; l--) {
      const layerOut = this.outValues[l + 1];
      const nextDeltas = this.deltas[l + 1];
      const nextWeights = this.weights[l + 1];
      const layerDeltas = [];

      for (let j = 0; j < layerOut.length; j++) {
        let errorSum = 0;
        for (let k = 0; k < nextDeltas.length; k++) {
          errorSum += nextDeltas[k] * nextWeights[j][k];
        }
        const dout_dnet = this.activation.derivative(layerOut[j]);
        layerDeltas.push(errorSum * dout_dnet);
      }
      this.deltas[l] = layerDeltas;

      // Gradients for this layer
      const prevOut = this.outValues[l];
      const layerGrads = [];
      for (let i = 0; i < prevOut.length; i++) {
        const row = [];
        for (let j = 0; j < layerDeltas.length; j++) {
          row.push(layerDeltas[j] * prevOut[i]);
        }
        layerGrads.push(row);
      }
      this.gradients[l] = layerGrads;
    }

    return { deltas: this.deltas, gradients: this.gradients };
  }

  updateWeights() {
    const oldWeights = this.weights.map(l => l.map(r => r.slice()));

    for (let l = 0; l < this.weights.length; l++) {
      for (let i = 0; i < this.weights[l].length; i++) {
        for (let j = 0; j < this.weights[l][i].length; j++) {
          this.weights[l][i][j] -= this.learningRate * this.gradients[l][i][j];
        }
      }
      // Update biases
      for (let j = 0; j < this.biases[l].length; j++) {
        this.biases[l][j] -= this.learningRate * this.deltas[l][j];
      }
    }

    return oldWeights;
  }

  getState() {
    return {
      weights: this.weights.map(l => l.map(r => r.slice())),
      biases: this.biases.map(l => l.slice()),
      netValues: this.netValues.map(l => l.slice()),
      outValues: this.outValues.map(l => l.slice()),
      deltas: this.deltas.map ? this.deltas.map(l => l ? l.slice() : []) : [],
      gradients: this.gradients.map ? this.gradients.map(l => l ? l.map(r => r.slice()) : []) : [],
    };
  }

  setActivation(name) {
    this.activationName = name;
    this.activation = activations[name];
  }
}

export function createDefaultNetwork() {
  return new NeuralNetwork({
    layers: [2, 2, 2],
    learningRate: 0.5,
    activation: 'sigmoid',
    initialWeights: [
      [[0.15, 0.25], [0.20, 0.30]],  // input→hidden: w1,w3 / w2,w4
      [[0.40, 0.50], [0.45, 0.55]],  // hidden→output: w5,w7 / w6,w8
    ],
    initialBiases: [
      [0.35, 0.35],  // hidden layer bias
      [0.60, 0.60],  // output layer bias
    ],
  });
}

export const DEFAULT_INPUTS = [0.05, 0.10];
export const DEFAULT_TARGETS = [0.01, 0.99];
