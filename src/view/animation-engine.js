export class AnimationEngine {
  constructor(renderer) {
    this.renderer = renderer;
    this.particles = [];
    this.animating = false;
    this.currentAnim = null;
  }

  /** Animate forward propagation: input → hidden layer only */
  animateForwardHidden(network, state, duration, callback) {
    this._animateLayerParticles(network, state, 0, '#22d3ee', duration, callback);
  }

  /** Animate forward propagation: hidden → output layer only */
  animateForwardOutput(network, state, duration, callback) {
    this._animateLayerParticles(network, state, 1, '#22d3ee', duration, callback);
  }

  /** Animate loss: highlight output node (no E_total node) */
  animateLossFlow(network, state, duration, callback) {
    const positions = this.renderer.nodePositions;
    const outputLayer = positions[positions.length - 1];
    // For single output, just do a brief pulse animation (shrink particles around output node)
    const particles = [];
    for (let j = 0; j < outputLayer.length; j++) {
      // Create particles that converge on the output node from slightly outside
      for (let a = 0; a < 4; a++) {
        const angle = (Math.PI * 2 * a) / 4;
        const dist = 50;
        particles.push({
          fromX: outputLayer[j].x + Math.cos(angle) * dist,
          fromY: outputLayer[j].y + Math.sin(angle) * dist,
          toX: outputLayer[j].x,
          toY: outputLayer[j].y,
          x: outputLayer[j].x + Math.cos(angle) * dist,
          y: outputLayer[j].y + Math.sin(angle) * dist,
          progress: 0,
          radius: 4,
          color: '#3b82f6',
        });
      }
    }

    this._runAnimation(particles, network, state, duration, callback);
  }

  /** Animate backward: output → hidden layer gradients (no E_total) */
  animateBackwardOutput(network, state, duration, callback) {
    this._animateLayerParticlesReverse(network, state, 2, '#f97316', duration, callback);
  }

  /** Animate backward: output → hidden layer gradients */
  animateBackwardHidden(network, state, duration, callback) {
    this._animateLayerParticlesReverse(network, state, 1, '#f97316', duration, callback);
  }

  /** Animate full forward pass (legacy, for auto-train display) */
  animateForward(network, state, duration, callback) {
    const allParticles = this._createForwardParticles(network);
    const layerCount = allParticles.length;
    const perLayer = duration / layerCount;
    let currentLayer = 0;
    let layerStart = performance.now();

    const animate = (time) => {
      if (currentLayer >= layerCount) {
        this.particles = [];
        if (callback) callback();
        return;
      }
      const elapsed = time - layerStart;
      const t = Math.min(1, elapsed / perLayer);
      const particles = allParticles[currentLayer];
      for (const p of particles) {
        p.progress = t;
        p.x = p.fromX + (p.toX - p.fromX) * this.easeInOut(t);
        p.y = p.fromY + (p.toY - p.fromY) * this.easeInOut(t);
      }
      this.particles = particles;
      this.renderer.render(network, state, { particles: this.particles });
      if (t >= 1) { currentLayer++; layerStart = time; }
      if (currentLayer < layerCount) {
        requestAnimationFrame(animate);
      } else {
        this.particles = [];
        this.renderer.render(network, state, { particles: [] });
        if (callback) callback();
      }
    };
    requestAnimationFrame(animate);
  }

  /** Animate full backward pass (legacy) */
  animateBackward(network, state, duration, callback) {
    const allParticles = this._createBackwardParticles(network);
    const layerCount = allParticles.length;
    const perLayer = duration / layerCount;
    let currentLayer = 0;
    let layerStart = performance.now();

    const animate = (time) => {
      if (currentLayer >= layerCount) {
        this.particles = [];
        if (callback) callback();
        return;
      }
      const elapsed = time - layerStart;
      const t = Math.min(1, elapsed / perLayer);
      const particles = allParticles[currentLayer];
      for (const p of particles) {
        p.progress = t;
        p.x = p.fromX + (p.toX - p.fromX) * this.easeInOut(t);
        p.y = p.fromY + (p.toY - p.fromY) * this.easeInOut(t);
      }
      this.particles = particles;
      this.renderer.render(network, state, { particles: this.particles });
      if (t >= 1) { currentLayer++; layerStart = time; }
      if (currentLayer < layerCount) {
        requestAnimationFrame(animate);
      } else {
        this.particles = [];
        this.renderer.render(network, state, { particles: [] });
        if (callback) callback();
      }
    };
    requestAnimationFrame(animate);
  }

  animateWeightUpdate(network, state, oldWeights, duration, callback) {
    const startTime = performance.now();
    const newWeights = network.weights.map(l => l.map(r => r.slice()));

    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = this.easeInOut(t);

      for (let l = 0; l < oldWeights.length; l++) {
        for (let i = 0; i < oldWeights[l].length; i++) {
          for (let j = 0; j < oldWeights[l][i].length; j++) {
            network.weights[l][i][j] = oldWeights[l][i][j] + (newWeights[l][i][j] - oldWeights[l][i][j]) * eased;
          }
        }
      }

      this.renderer.render(network, state, { particles: [] });

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        for (let l = 0; l < newWeights.length; l++) {
          for (let i = 0; i < newWeights[l].length; i++) {
            for (let j = 0; j < newWeights[l][i].length; j++) {
              network.weights[l][i][j] = newWeights[l][i][j];
            }
          }
        }
        if (callback) callback();
      }
    };
    requestAnimationFrame(animate);
  }

  // --- Internal helpers ---

  _animateLayerParticles(network, state, layerIdx, color, duration, callback) {
    const positions = this.renderer.nodePositions;
    const fromLayer = positions[layerIdx];
    const toLayer = positions[layerIdx + 1];
    const particles = [];

    for (let i = 0; i < fromLayer.length; i++) {
      for (let j = 0; j < toLayer.length; j++) {
        particles.push({
          fromX: fromLayer[i].x, fromY: fromLayer[i].y,
          toX: toLayer[j].x, toY: toLayer[j].y,
          x: fromLayer[i].x, y: fromLayer[i].y,
          progress: 0, radius: 4, color,
        });
      }
    }

    this._runAnimation(particles, network, state, duration, callback);
  }

  _animateLayerParticlesReverse(network, state, layerIdx, color, duration, callback) {
    const positions = this.renderer.nodePositions;
    const fromLayer = positions[layerIdx];
    const toLayer = positions[layerIdx - 1];
    const particles = [];

    for (let j = 0; j < fromLayer.length; j++) {
      for (let i = 0; i < toLayer.length; i++) {
        particles.push({
          fromX: fromLayer[j].x, fromY: fromLayer[j].y,
          toX: toLayer[i].x, toY: toLayer[i].y,
          x: fromLayer[j].x, y: fromLayer[j].y,
          progress: 0, radius: 4, color,
        });
      }
    }

    this._runAnimation(particles, network, state, duration, callback);
  }

  _runAnimation(particles, network, state, duration, callback) {
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);

      for (const p of particles) {
        p.progress = t;
        p.x = p.fromX + (p.toX - p.fromX) * this.easeInOut(t);
        p.y = p.fromY + (p.toY - p.fromY) * this.easeInOut(t);
      }

      this.particles = particles;
      this.renderer.render(network, state, { particles: this.particles });

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.particles = [];
        this.renderer.render(network, state, { particles: [] });
        if (callback) callback();
      }
    };
    requestAnimationFrame(animate);
  }

  _createForwardParticles(network) {
    const particles = [];
    const positions = this.renderer.nodePositions;
    for (let l = 0; l < network.weights.length; l++) {
      const fromLayer = positions[l];
      const toLayer = positions[l + 1];
      const layerParticles = [];
      for (let i = 0; i < fromLayer.length; i++) {
        for (let j = 0; j < toLayer.length; j++) {
          layerParticles.push({
            fromX: fromLayer[i].x, fromY: fromLayer[i].y,
            toX: toLayer[j].x, toY: toLayer[j].y,
            x: fromLayer[i].x, y: fromLayer[i].y,
            progress: 0, layer: l, radius: 4, color: '#22d3ee',
          });
        }
      }
      particles.push(layerParticles);
    }
    return particles;
  }

  _createBackwardParticles(network) {
    const particles = [];
    const positions = this.renderer.nodePositions;
    for (let l = network.weights.length - 1; l >= 0; l--) {
      const fromLayer = positions[l + 1];
      const toLayer = positions[l];
      const layerParticles = [];
      for (let j = 0; j < fromLayer.length; j++) {
        for (let i = 0; i < toLayer.length; i++) {
          layerParticles.push({
            fromX: fromLayer[j].x, fromY: fromLayer[j].y,
            toX: toLayer[i].x, toY: toLayer[i].y,
            x: fromLayer[j].x, y: fromLayer[j].y,
            progress: 0, layer: l, radius: 4, color: '#f97316',
          });
        }
      }
      particles.push(layerParticles);
    }
    return particles;
  }

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}
