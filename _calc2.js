// 2-2-1 linear network, no activation, no bias
// Reference: https://zhuanlan.zhihu.com/p/40378224
const x1=2, x2=3;
const w1=0.1, w2=0.2, w3=0.3, w4=0.4, w5=0.5, w6=0.6;
const target=1.8;
const eta=0.5;

// Forward
const h1 = w1*x1 + w3*x2;  // 0.1*2 + 0.3*3 = 0.2+0.9=1.1
const h2 = w2*x1 + w4*x2;  // 0.2*2 + 0.4*3 = 0.4+1.2=1.6
const y = w5*h1 + w6*h2;    // 0.5*1.1 + 0.6*1.6 = 0.55+0.96=1.51
const loss = 0.5*(y-target)**2; // 0.5*(1.51-1.8)^2 = 0.5*0.0841=0.04205

console.log('=== Forward ===');
console.log('h1:', h1);
console.log('h2:', h2);
console.log('y:', y);
console.log('Loss:', loss);

// Backward
const dL_dy = y - target;  // 1.51-1.8=-0.29
console.log('\n=== Backward ===');
console.log('dL/dy:', dL_dy);

// Output weights
const dL_dw5 = dL_dy * h1;  // -0.29*1.1=-0.319
const dL_dw6 = dL_dy * h2;  // -0.29*1.6=-0.464
console.log('dL/dw5:', dL_dw5);
console.log('dL/dw6:', dL_dw6);

// Hidden weights (chain rule through linear)
const dy_dh1 = w5;  // 0.5
const dy_dh2 = w6;  // 0.6
const dL_dh1 = dL_dy * dy_dh1;  // -0.29*0.5=-0.145
const dL_dh2 = dL_dy * dy_dh2;  // -0.29*0.6=-0.174

const dL_dw1 = dL_dh1 * x1;  // -0.145*2=-0.29
const dL_dw2 = dL_dh2 * x1;  // -0.174*2=-0.348
const dL_dw3 = dL_dh1 * x2;  // -0.145*3=-0.435
const dL_dw4 = dL_dh2 * x2;  // -0.174*3=-0.522

console.log('dL/dw1:', dL_dw1);
console.log('dL/dw2:', dL_dw2);
console.log('dL/dw3:', dL_dw3);
console.log('dL/dw4:', dL_dw4);

// Weight update
const nw1=w1-eta*dL_dw1, nw2=w2-eta*dL_dw2, nw3=w3-eta*dL_dw3;
const nw4=w4-eta*dL_dw4, nw5=w5-eta*dL_dw5, nw6=w6-eta*dL_dw6;
console.log('\n=== Updated weights ===');
console.log('w1:', nw1, 'w2:', nw2, 'w3:', nw3);
console.log('w4:', nw4, 'w5:', nw5, 'w6:', nw6);

// New forward
const nh1=nw1*x1+nw3*x2, nh2=nw2*x1+nw4*x2;
const ny=nw5*nh1+nw6*nh2;
const nloss=0.5*(ny-target)**2;
console.log('\nAfter 1 step: y=', ny, 'loss=', nloss);

// Train 1000 iterations
let cw=[w1,w2,w3,w4,w5,w6];
for(let i=0;i<1000;i++){
  let ch1=cw[0]*x1+cw[2]*x2;
  let ch2=cw[1]*x1+cw[3]*x2;
  let cy=cw[4]*ch1+cw[5]*ch2;
  let dl=cy-target;
  cw[4]-=eta*dl*ch1; cw[5]-=eta*dl*ch2;
  let dlh1=dl*cw[4], dlh2=dl*cw[5];
  cw[0]-=eta*dlh1*x1; cw[2]-=eta*dlh1*x2;
  cw[1]-=eta*dlh2*x1; cw[3]-=eta*dlh2*x2;
}
let fh1=cw[0]*x1+cw[2]*x2, fh2=cw[1]*x1+cw[3]*x2;
let fy=cw[4]*fh1+cw[5]*fh2;
let floss=0.5*(fy-target)**2;
console.log('After 1000 iters: y=',fy,'loss=',floss);
