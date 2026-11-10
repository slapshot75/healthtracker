// Läuft einmal vor allen Tests: Chart.js in den lokalen Cache holen (siehe chartjs-cache.js).
const { ensureChartJs } = require('./chartjs-cache.js');

module.exports = async () => { await ensureChartJs(); };
