export function mse(predicted, target) {
  let sum = 0;
  for (let i = 0; i < predicted.length; i++) {
    sum += Math.pow(target[i] - predicted[i], 2);
  }
  return 0.5 * sum;
}

export function msePerOutput(predicted, target) {
  const errors = [];
  for (let i = 0; i < predicted.length; i++) {
    errors.push(0.5 * Math.pow(target[i] - predicted[i], 2));
  }
  return errors;
}

export function mseDerivative(predicted, target) {
  return predicted - target;
}
