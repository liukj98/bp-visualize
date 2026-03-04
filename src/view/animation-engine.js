export class AnimationEngine {
  constructor(renderer) {
    this.renderer = renderer;
    this.particles = [];
    this.animating = false;
    this.animQueue = [];
    this.currentAnim = null;
    this.onComplete = null;
  }

  createForwardParticles(network) {
    const particles = [];
    const positions = this.renderer.nodePositions;

    for (let l = 0; l < network.weights.length; l++) {
      const fromLayer = positions[l];
      const toLayer = positions[l + 1];
      const layerParticles = [];

      for (let i = 0; i < fromLayer.length; i++) {
        for (let j = 0; j < toLayer.length; j++) {
          layerParticles.push({
            fromX: fromLayer[i].x,
            fromY: fromLayer[i].y,
            toX: toLayer[j].x,
            toY: toLayer[j].y,
            x: fromLayer[i].x,
            y: fromLayer[i].y,
            progress: 0,
            layer: l,
            radius: 4,
            color: '#22d3ee',
          });
        }
      }
      particles.push(layerParticles);
    }
    return particles;
  }

  createBackwardParticles(network) {
    const particles = [];
    const positions = this.renderer.nodePositions;

    for (let l = network.weights.length - 1; l >= 0; l--) {
      const fromLayer = positions[l + 1];
      const toLayer = positions[l];
      const layerParticles = [];

      for (let j = 0; j < fromLayer.length; j++) {
        for (let i = 0; i < toLayer.length; i++) {
          layerParticles.push({
            fromX: fromLayer[j].x,
            fromY: fromLayer[j].y,
            toX: toLayer[i].x,
            toY: toLayer[i].y,
            x: fromLayer[j].x,
            y: fromLayer[j].y,
            progress: 0,
            layer: l,
            radius: 4,
            color: '#f97316',
          });
        }
      }
      particles.push(layerParticles);
    }
    return particles;
  }

  animateForward(network, state, duration, callback) {
    const allParticles = this.createForwardParticles(network);
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

      if (t >= 1) {
        currentLayer++;
        layerStart = time;
      }

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

  animateBackward(network, state, duration, callback) {
    const allParticles = this.createBackwardParticles(network);
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

      if (t >= 1) {
        currentLayer++;
        layerStart = time;
      }

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
    // Save the final new weights
    const newWeights = network.weights.map(l => l.map(r => r.slice()));

    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = this.easeInOut(t);

      // Interpolate between old and new weights for rendering
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
        // Restore final new weights
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

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}
