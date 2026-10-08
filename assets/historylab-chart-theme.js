/* History Lab — Stage 2.2A Unified Chart Palette */
(function () {
  'use strict';

  const palette = [
    '#F59E0B', // gold
    '#38BDF8', // sky
    '#34D399', // emerald
    '#A78BFA', // violet
    '#FB7185', // coral
    '#FB923C', // orange
    '#2DD4BF', // teal
    '#94A3B8'  // slate
  ];

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  window.HistoryLabCharts = {
    palette,
    text: '#E2E8F0',
    mutedText: '#CBD5E1',
    grid: 'rgba(148, 163, 184, 0.22)',
    sliceBorder: '#F8FAFC',
    positive: '#34D399',
    negative: '#FB7185',
    color(index, alpha = 0.88) {
      const c = palette[index % palette.length];
      return alpha >= 1 ? c : hexToRgba(c, alpha);
    },
    colors(count, offset = 0, alpha = 0.88) {
      return Array.from({ length: count }, (_, i) => this.color(i + offset, alpha));
    }
  };

  if (!window.Chart) return;

  Chart.defaults.font.family = '"Nunito", system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
  Chart.defaults.color = HistoryLabCharts.mutedText;
  Chart.defaults.borderColor = HistoryLabCharts.grid;

  if (Chart.defaults.plugins && Chart.defaults.plugins.legend) {
    Chart.defaults.plugins.legend.labels.color = HistoryLabCharts.text;
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.boxHeight = 12;
    Chart.defaults.plugins.legend.labels.padding = 14;
  }

  if (Chart.defaults.plugins && Chart.defaults.plugins.tooltip) {
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.96)';
    Chart.defaults.plugins.tooltip.titleColor = '#F8FAFC';
    Chart.defaults.plugins.tooltip.bodyColor = '#E2E8F0';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(148, 163, 184, 0.35)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
  }

  if (Chart.defaults.scale) {
    Chart.defaults.scale.ticks.color = HistoryLabCharts.mutedText;
    Chart.defaults.scale.grid.color = HistoryLabCharts.grid;
    Chart.defaults.scale.title.color = HistoryLabCharts.text;
  }
})();
