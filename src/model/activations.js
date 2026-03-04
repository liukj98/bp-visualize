export const sigmoid = (x) => 1 / (1 + Math.exp(-x));
export const sigmoidDerivative = (output) => output * (1 - output);

export const relu = (x) => Math.max(0, x);
export const reluDerivative = (output) => (output > 0 ? 1 : 0);

export const activations = {
  sigmoid: { fn: sigmoid, derivative: sigmoidDerivative },
  relu: { fn: relu, derivative: reluDerivative },
};
