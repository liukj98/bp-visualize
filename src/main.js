import 'katex/dist/katex.min.css';
import { TrainingController } from './controller/training-controller.js';
import { UIController } from './controller/ui-controller.js';
import { NetworkRenderer } from './view/network-renderer.js';
import { AnimationEngine } from './view/animation-engine.js';
import { ChartRenderer } from './view/chart-renderer.js';
import { FormulaDisplay } from './view/formula-display.js';
import { renderEducationPage } from './pages/education.js';
import { renderFaqPage } from './pages/faq.js';

// Initialize
const networkCanvas = document.getElementById('network-canvas');
const chartCanvas = document.getElementById('chart-canvas');
const formulaContainer = document.getElementById('formula-container');

const renderer = new NetworkRenderer(networkCanvas);
const animEngine = new AnimationEngine(renderer);
const chartRenderer = new ChartRenderer(chartCanvas);
const formulaDisplay = new FormulaDisplay(formulaContainer);

const trainingController = new TrainingController();
const uiController = new UIController(trainingController, renderer, animEngine, chartRenderer, formulaDisplay);

// Render education page
renderEducationPage(document.getElementById('education-content'));

// Render FAQ page
renderFaqPage(document.getElementById('faq-content'));
