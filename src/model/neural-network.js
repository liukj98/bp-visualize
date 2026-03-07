import { mse, msePerOutput, mseDerivative } from './loss-functions.js';

export class NeuralNetwork {
  constructor(config = {}) {
    this.layers = config.layers || [2, 2, 1];
    this.learningRate = config.learningRate || 0.1;

    this.weights = [];

    // Per-layer values (filled during forward/backward)
    this.netValues = [];  // net (= out for linear network)
    this.outValues = [];  // out values per layer
    this.deltas = [];     // error signals
    this.gradients = [];  // ∂E/∂w for each weight

    this.initWeights(config.initialWeights);
  }

  initWeights(initialWeights) {
    this.weights = [];

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
        let net = 0;
        for (let i = 0; i < currentInput.length; i++) {
          net += currentInput[i] * this.weights[l][i][j];
        }
        nets.push(net);
        outs.push(net); // linear: out = net
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
      let net = 0;
      for (let i = 0; i < inputs.length; i++) {
        net += inputs[i] * this.weights[0][i][j];
      }
      nets.push(net);
      outs.push(net); // linear: out = net
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
      let net = 0;
      for (let i = 0; i < hiddenOut.length; i++) {
        net += hiddenOut[i] * this.weights[1][i][j];
      }
      nets.push(net);
      outs.push(net); // linear: out = net
    }
    this.netValues.push(nets);
    this.outValues.push(outs);
    return outs;
  }

  /** Backward pass: output layer only — linear network, no activation derivative */
  backwardOutput(targets) {
    const numLayers = this.weights.length;
    this.deltas = new Array(numLayers);
    this.gradients = new Array(numLayers);

    const outputIdx = numLayers;
    const outputOut = this.outValues[outputIdx];
    const outputDeltas = [];
    for (let j = 0; j < outputOut.length; j++) {
      // dLoss/dy = y - target (linear: dout/dnet = 1)
      const delta = mseDerivative(outputOut[j], targets[j]);
      outputDeltas.push(delta);
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

  /** Backward pass: hidden layer only (assumes output backward already done) — linear */
  backwardHidden() {
    const numLayers = this.weights.length;
    for (let l = numLayers - 2; l >= 0; l--) {
      const nextDeltas = this.deltas[l + 1];
      const nextWeights = this.weights[l + 1];
      const layerDeltas = [];
      const layerOut = this.outValues[l + 1];
      for (let j = 0; j < layerOut.length; j++) {
        let errorSum = 0;
        for (let k = 0; k < nextDeltas.length; k++) {
          errorSum += nextDeltas[k] * nextWeights[j][k];
        }
        // linear: dout/dnet = 1, so delta = errorSum
        layerDeltas.push(errorSum);
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

    // Output layer deltas (linear: no activation derivative)
    const outputIdx = numLayers;
    const outputOut = this.outValues[outputIdx];
    const outputDeltas = [];

    for (let j = 0; j < outputOut.length; j++) {
      const delta = mseDerivative(outputOut[j], targets[j]);
      outputDeltas.push(delta);
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

    // Hidden layers (right to left) — linear
    for (let l = numLayers - 2; l >= 0; l--) {
      const nextDeltas = this.deltas[l + 1];
      const nextWeights = this.weights[l + 1];
      const layerOut = this.outValues[l + 1];
      const layerDeltas = [];

      for (let j = 0; j < layerOut.length; j++) {
        let errorSum = 0;
        for (let k = 0; k < nextDeltas.length; k++) {
          errorSum += nextDeltas[k] * nextWeights[j][k];
        }
        layerDeltas.push(errorSum);
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

  updateWeights() {
    const oldWeights = this.weights.map(l => l.map(r => r.slice()));

    for (let l = 0; l < this.weights.length; l++) {
      for (let i = 0; i < this.weights[l].length; i++) {
        for (let j = 0; j < this.weights[l][i].length; j++) {
          this.weights[l][i][j] -= this.learningRate * this.gradients[l][i][j];
        }
      }
    }

    return oldWeights;
  }

  getState() {
    return {
      weights: this.weights.map(l => l.map(r => r.slice())),
      netValues: this.netValues.map(l => l.slice()),
      outValues: this.outValues.map(l => l.slice()),
      deltas: this.deltas.map ? this.deltas.map(l => l ? l.slice() : []) : [],
      gradients: this.gradients.map ? this.gradients.map(l => l ? l.map(r => r.slice()) : []) : [],
    };
  }
}

export function createDefaultNetwork() {
  return new NeuralNetwork({
    layers: [2, 2, 1],
    learningRate: 0.1,
    initialWeights: [
      [[0.5, 2.3], [1.5, 3]],     // input→hidden: w1,w2 / w3,w4
      [[1], [1]],                  // hidden→output: w5 / w6
    ],
  });
}

export const DEFAULT_INPUTS = [1, 0.5];
export const DEFAULT_TARGETS = [4];
