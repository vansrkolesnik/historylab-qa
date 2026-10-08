/* History Lab — local chart runtime
   Compatible subset of the Chart.js API used by this project.
   Supports bar (including horizontal/stacked), doughnut and pie charts,
   legends, basic tooltips, click hit-testing, responsive redraw and update().
   This file intentionally keeps the site's existing `new Chart(ctx, config)`
   lesson code working without a network dependency. */
(function (global) {
  'use strict';

  const registry = new WeakMap();
  let uid = 0;

  const defaults = {
    color: '#cbd5e1',
    borderColor: 'rgba(148,163,184,.24)',
    font: { family: 'system-ui, -apple-system, Segoe UI, Arial, sans-serif', size: 12 },
    plugins: {
      legend: { labels: { color: '#e2e8f0', boxWidth: 12, boxHeight: 12, padding: 14 } },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,.96)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148,163,184,.35)',
        borderWidth: 1
      }
    },
    scale: {
      ticks: { color: '#cbd5e1' },
      grid: { color: 'rgba(148,163,184,.22)' },
      title: { color: '#e2e8f0' }
    }
  };

  function num(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function valueAt(v, i, fallback) {
    if (Array.isArray(v)) return v[i % Math.max(v.length, 1)] ?? fallback;
    return v ?? fallback;
  }
  function fontString(spec, fallbackSize) {
    spec = spec || {};
    const size = num(spec.size, fallbackSize || defaults.font.size || 12);
    const weight = spec.weight || '600';
    const family = spec.family || defaults.font.family;
    return `${weight} ${size}px ${family}`;
  }
  function textColor(spec, fallback) {
    return (spec && spec.color) || fallback || defaults.color || '#cbd5e1';
  }
  function roundedRect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(num(r, 0), Math.abs(w) / 2, Math.abs(h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function splitLabel(ctx, text, maxWidth) {
    const s = String(text ?? '');
    if (ctx.measureText(s).width <= maxWidth) return [s];
    const words = s.split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines.slice(0, 3);
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  class HistoryLabChart {
    constructor(item, config) {
      const canvas = item && item.canvas ? item.canvas : item;
      if (!canvas || !canvas.getContext) throw new Error('Chart canvas is unavailable');
      this.id = ++uid;
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.config = config || {};
      this.type = this.config.type || 'bar';
      this.data = this.config.data || { labels: [], datasets: [] };
      this.options = this.config.options || {};
      this._regions = [];
      this._destroyed = false;
      this._tooltip = null;
      this._resizeTimer = 0;
      registry.set(canvas, this);
      this._bind();
      this.resize();
      this.draw();
    }

    _bind() {
      this._onClick = (ev) => {
        if (this._destroyed) return;
        const hit = this._hit(ev);
        if (typeof this.options.onClick === 'function') {
          try {
            this.options.onClick(ev, hit ? [{ index: hit.index, datasetIndex: hit.datasetIndex || 0 }] : [], this);
          } catch (_e) {}
        }
      };
      this._onMove = (ev) => {
        const hit = this._hit(ev);
        if (!hit) return this._hideTooltip();
        this._showTooltip(ev, hit);
      };
      this._onLeave = () => this._hideTooltip();
      this.canvas.addEventListener('click', this._onClick);
      this.canvas.addEventListener('mousemove', this._onMove);
      this.canvas.addEventListener('mouseleave', this._onLeave);
      if (global.ResizeObserver) {
        this._ro = new ResizeObserver(() => {
          clearTimeout(this._resizeTimer);
          this._resizeTimer = setTimeout(() => { this.resize(); this.draw(); }, 40);
        });
        this._ro.observe(this.canvas.parentElement || this.canvas);
      } else {
        this._onResize = () => { clearTimeout(this._resizeTimer); this._resizeTimer = setTimeout(() => { this.resize(); this.draw(); }, 80); };
        global.addEventListener('resize', this._onResize);
      }
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const parent = this.canvas.parentElement;
      const parentRect = parent?.getBoundingClientRect ? parent.getBoundingClientRect() : null;
      const fillParent = this.options.maintainAspectRatio === false;

      // History Lab lesson pages deliberately size `.chart-container`.  When
      // maintainAspectRatio is false, Chart.js fills that box; use the same
      // contract here instead of preserving the canvas element's intrinsic
      // 300×150 geometry.  This is especially important for doughnut charts.
      const widthSource = fillParent
        ? (parentRect?.width || parent?.clientWidth || rect.width || this.canvas.clientWidth)
        : (rect.width || this.canvas.clientWidth || parentRect?.width || parent?.clientWidth);
      const heightSource = fillParent
        ? (parentRect?.height || parent?.clientHeight || rect.height || this.canvas.clientHeight)
        : (rect.height || this.canvas.clientHeight || parentRect?.height || parent?.clientHeight);

      const cssW = Math.max(220, Math.round(widthSource || 420));
      const cssH = Math.max(180, Math.round(heightSource || 280));
      const dpr = clamp(global.devicePixelRatio || 1, 1, 2);

      this.canvas.style.width = '100%';
      if (fillParent) this.canvas.style.height = '100%';

      if (this.canvas.width !== Math.round(cssW * dpr) || this.canvas.height !== Math.round(cssH * dpr)) {
        this.canvas.width = Math.round(cssW * dpr);
        this.canvas.height = Math.round(cssH * dpr);
      }
      this._w = cssW;
      this._h = cssH;
      this._dpr = dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    clear() {
      this.ctx.setTransform(this._dpr || 1, 0, 0, this._dpr || 1, 0, 0);
      this.ctx.clearRect(0, 0, this._w || 0, this._h || 0);
      this._regions = [];
    }

    update() { this.resize(); this.draw(); return this; }
    render() { return this.update(); }
    stop() { return this; }
    reset() { return this.update(); }

    destroy() {
      this._destroyed = true;
      this.canvas.removeEventListener('click', this._onClick);
      this.canvas.removeEventListener('mousemove', this._onMove);
      this.canvas.removeEventListener('mouseleave', this._onLeave);
      if (this._ro) this._ro.disconnect();
      if (this._onResize) global.removeEventListener('resize', this._onResize);
      registry.delete(this.canvas);
      this._hideTooltip();
    }

    draw() {
      if (this._destroyed) return;
      this.clear();
      if (this.type === 'doughnut' || this.type === 'pie') this._drawCircular();
      else this._drawBar();
    }

    _legendInfo() {
      const plug = this.options.plugins || {};
      const legend = plug.legend || {};
      const display = legend.display !== false;
      const position = legend.position || 'top';
      return { display, position, labels: legend.labels || {} };
    }

    _legendLayout(items, areaW) {
      const info = this._legendInfo();
      if (!info.display || !items.length) return { height: 0, cols: 0, rows: [], entries: [], spec: null };
      const ctx = this.ctx;
      const labelSpec = Object.assign({}, defaults.plugins.legend.labels, info.labels || {});
      const requestedSize = num(labelSpec.font?.size, 11);
      const fontSize = Math.max(10, requestedSize);
      const fontSpec = Object.assign({}, labelSpec.font || {}, { size: fontSize });
      ctx.font = fontString(fontSpec, fontSize);
      const box = Math.max(10, num(labelSpec.boxWidth, 12));
      const gap = 7;
      const itemPad = Math.max(8, num(labelSpec.padding, 12));
      const colGap = 12;
      const rowGap = 6;
      const lineH = Math.max(15, Math.round(fontSize * 1.35));
      const maxW = Math.max(120, areaW);

      // History Lab charts live mostly in 320–520 px cards. Use up to three
      // columns only when each label still has enough room for complete words.
      let maxCols = maxW >= 660 ? 3 : (maxW >= 380 ? 2 : 1);
      maxCols = Math.min(maxCols, items.length);
      let chosen = null;
      for (let cols = maxCols; cols >= 1; cols--) {
        const colW = (maxW - colGap * (cols - 1)) / cols;
        const textW = Math.max(56, colW - box - gap - itemPad);
        let maxLines = 1;
        let wordFits = true;
        const prepared = items.map(item => {
          const label = String(item.label ?? '');
          const longestWord = label.split(/\s+/).reduce((m, w) => Math.max(m, ctx.measureText(w).width), 0);
          if (longestWord > textW + 1) wordFits = false;
          const lines = [];
          let line = '';
          for (const word of label.split(/\s+/)) {
            const test = line ? `${line} ${word}` : word;
            if (line && ctx.measureText(test).width > textW) { lines.push(line); line = word; }
            else line = test;
          }
          if (line) lines.push(line);
          maxLines = Math.max(maxLines, lines.length);
          return { item, lines: lines.length ? lines : [''] };
        });
        // Prefer compact 2–3 column layouts, but never force a word to clip.
        if (wordFits && (maxLines <= 3 || cols === 1)) {
          chosen = { cols, colW, textW, prepared };
          break;
        }
      }
      if (!chosen) {
        const colW = maxW, textW = Math.max(56, maxW - box - gap - itemPad);
        const prepared = items.map(item => ({ item, lines: [String(item.label ?? '')] }));
        chosen = { cols: 1, colW, textW, prepared };
      }

      const rowCount = Math.ceil(items.length / chosen.cols);
      const rows = [];
      const entries = [];
      let y = 0;
      for (let r = 0; r < rowCount; r++) {
        let rowLines = 1;
        for (let c = 0; c < chosen.cols; c++) {
          const idx = r * chosen.cols + c;
          if (idx >= chosen.prepared.length) continue;
          rowLines = Math.max(rowLines, chosen.prepared[idx].lines.length);
        }
        const rowH = Math.max(box, rowLines * lineH);
        rows.push({ y, h: rowH, lines: rowLines });
        for (let c = 0; c < chosen.cols; c++) {
          const idx = r * chosen.cols + c;
          if (idx >= chosen.prepared.length) continue;
          const prep = chosen.prepared[idx];
          entries.push({
            item: prep.item,
            lines: prep.lines,
            x: c * (chosen.colW + colGap),
            y,
            w: chosen.colW,
            rowH
          });
        }
        y += rowH + (r < rowCount - 1 ? rowGap : 0);
      }
      return {
        height: y,
        cols: chosen.cols,
        rows,
        entries,
        spec: { labelSpec, fontSpec, fontSize, box, gap, lineH, itemPad, colGap }
      };
    }

    _drawLegendLayout(layout, x, y) {
      if (!layout || !layout.height || !layout.entries.length) return 0;
      const ctx = this.ctx;
      const { labelSpec, fontSpec, box, gap, lineH } = layout.spec;
      ctx.font = fontString(fontSpec, 11);
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      for (const entry of layout.entries) {
        const firstY = y + entry.y + lineH / 2;
        ctx.fillStyle = entry.item.color;
        ctx.fillRect(x + entry.x, firstY - box / 2, box, box);
        ctx.strokeStyle = 'rgba(248,250,252,.75)';
        ctx.strokeRect(x + entry.x, firstY - box / 2, box, box);
        ctx.fillStyle = textColor(labelSpec, defaults.plugins.legend.labels.color);
        entry.lines.forEach((line, j) => {
          ctx.fillText(line, x + entry.x + box + gap, firstY + j * lineH);
        });
      }
      return layout.height;
    }

    _drawLegend(items, area) {
      const layout = this._legendLayout(items, area.w);
      this._drawLegendLayout(layout, area.x, area.y);
      return layout.height;
    }

    _drawCircular() {
      const ctx = this.ctx, w = this._w, h = this._h;
      const labels = this.data.labels || [];
      const ds = (this.data.datasets || [])[0] || { data: [] };
      const values = (ds.data || []).map(v => Math.max(0, num(v, 0)));
      const total = values.reduce((a, b) => a + b, 0) || 1;
      const colors = values.map((_, i) => valueAt(ds.backgroundColor, i, `hsl(${(i * 67) % 360} 70% 55%)`));
      const legendInfo = this._legendInfo();
      const items = labels.map((l, i) => ({ label: l, color: colors[i] }));
      const legendLayout = legendInfo.display ? this._legendLayout(items, Math.max(120, w - 24)) : { height: 0 };
      const legendGap = legendLayout.height ? 14 : 0;
      const topLegendH = (legendInfo.display && legendInfo.position !== 'bottom') ? legendLayout.height + legendGap : 0;
      const bottomLegendH = (legendInfo.display && legendInfo.position === 'bottom') ? legendLayout.height + legendGap : 0;
      const plotTop = 8 + topLegendH;
      const plotBottom = h - 8 - bottomLegendH;
      const plotH = Math.max(90, plotBottom - plotTop);
      const cx = w / 2;
      const cy = plotTop + plotH / 2;
      const r = Math.max(38, Math.min(w * .36, plotH * .45));
      const inner = this.type === 'doughnut' ? r * .54 : 0;
      let angle = -Math.PI / 2;
      values.forEach((v, i) => {
        const sweep = (v / total) * Math.PI * 2;
        const end = angle + sweep;
        ctx.beginPath();
        ctx.arc(cx, cy, r, angle, end);
        if (inner > 0) { ctx.arc(cx, cy, inner, end, angle, true); }
        else ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        const bw = num(ds.borderWidth, 1.5);
        if (bw > 0) { ctx.lineWidth = bw; ctx.strokeStyle = valueAt(ds.borderColor, i, '#f8fafc'); ctx.stroke(); }
        this._regions.push({ kind: 'arc', index: i, datasetIndex: 0, cx, cy, r1: inner, r2: r, a1: angle, a2: end, raw: values[i], label: labels[i], dataset: ds });
        angle = end;
      });
      if (legendInfo.display) {
        const ly = legendInfo.position === 'bottom'
          ? h - 8 - legendLayout.height
          : 8;
        this._drawLegendLayout(legendLayout, 12, ly);
      }
    }

    _scaleLimits(datasets, stacked, indexAxis) {
      let max = 0, min = 0;
      if (stacked) {
        const n = Math.max(0, ...datasets.map(d => (d.data || []).length));
        for (let i = 0; i < n; i++) {
          let pos = 0, neg = 0;
          datasets.forEach(d => { const v = num((d.data || [])[i], 0); if (v >= 0) pos += v; else neg += v; });
          max = Math.max(max, pos); min = Math.min(min, neg);
        }
      } else {
        datasets.forEach(d => (d.data || []).forEach(x => { const v = num(x, 0); max = Math.max(max, v); min = Math.min(min, v); }));
      }
      const valScale = indexAxis === 'y' ? (this.options.scales?.x || {}) : (this.options.scales?.y || {});
      if (Number.isFinite(Number(valScale.max))) max = Number(valScale.max);
      if (Number.isFinite(Number(valScale.min))) min = Number(valScale.min);
      if (valScale.beginAtZero !== false) min = Math.min(0, min);
      if (max === min) max = min + 1;
      if (max > 0 && !Number.isFinite(Number(valScale.max))) max *= 1.08;
      return { min, max, valScale };
    }

    _drawBar() {
      const ctx = this.ctx, w = this._w, h = this._h;
      const labels = this.data.labels || [];
      const datasets = (this.data.datasets || []).filter(Boolean);
      const indexAxis = this.options.indexAxis === 'y' ? 'y' : 'x';
      const stacked = !!(this.options.scales?.x?.stacked || this.options.scales?.y?.stacked);
      const legendInfo = this._legendInfo();
      const legendItems = datasets.map((d, i) => ({ label: d.label || `Серія ${i + 1}`, color: valueAt(d.backgroundColor, 0, '#f59e0b') }));
      const legendLayout = legendInfo.display ? this._legendLayout(legendItems, Math.max(120, w - 24)) : { height: 0 };
      const legendH = legendLayout.height || 0;

      ctx.font = fontString(null, 10);
      const catScale = indexAxis === 'y' ? (this.options.scales?.y || {}) : (this.options.scales?.x || {});
      const catDisplay = catScale.display !== false;
      const { min, max, valScale } = this._scaleLimits(datasets, stacked, indexAxis);
      const valDisplay = valScale.display !== false;
      const catLabelWidth = labels.reduce((mw, l) => Math.max(mw, ctx.measureText(String(l)).width), 0);
      const legendBottomSpace = (legendInfo.display && legendInfo.position === 'bottom') ? (legendH + 18) : 0;

      let categoryBottom = 18;
      if (indexAxis === 'x' && catDisplay) {
        // Reserve enough room for up to three wrapped category-label lines.
        const approxBand = Math.max(52, (w - 72) / Math.max(1, labels.length));
        ctx.font = fontString(catScale.ticks?.font, 9);
        const maxLines = labels.reduce((mx, lab) => Math.max(mx, splitLabel(ctx, lab, Math.max(50, approxBand - 8)).length), 1);
        categoryBottom = 18 + maxLines * 12;
      }

      const m = {
        left: indexAxis === 'y'
          ? (catDisplay ? Math.min(Math.max(82, catLabelWidth + 12), w * .42) : 16)
          : (valDisplay ? 48 : 16),
        right: 18,
        top: (legendInfo.display && legendInfo.position !== 'bottom' ? legendH + 18 : 18),
        bottom: indexAxis === 'y'
          ? ((valDisplay ? 36 : 14) + legendBottomSpace)
          : (categoryBottom + legendBottomSpace)
      };
      const pw = Math.max(80, w - m.left - m.right), ph = Math.max(70, h - m.top - m.bottom);
      const range = max - min;
      const gridColor = valScale.grid?.color || defaults.scale.grid.color;
      const tickColor = valScale.ticks?.color || defaults.scale.ticks.color;
      const ticks = 4;
      const gridDisplay = valScale.grid?.display !== false;
      ctx.lineWidth = 1;
      ctx.font = fontString(valScale.ticks?.font, 10);
      ctx.textBaseline = 'middle';

      if (valDisplay) {
        for (let ti = 0; ti <= ticks; ti++) {
          const value = min + (range * ti / ticks);
          if (indexAxis === 'y') {
            const x = m.left + pw * ti / ticks;
            if (gridDisplay) { ctx.strokeStyle = gridColor; ctx.beginPath(); ctx.moveTo(x, m.top); ctx.lineTo(x, m.top + ph); ctx.stroke(); }
            ctx.fillStyle = tickColor; ctx.textAlign = 'center'; ctx.fillText(formatNumber(value), x, m.top + ph + 15);
          } else {
            const y = m.top + ph - ph * ti / ticks;
            if (gridDisplay) { ctx.strokeStyle = gridColor; ctx.beginPath(); ctx.moveTo(m.left, y); ctx.lineTo(m.left + pw, y); ctx.stroke(); }
            ctx.fillStyle = tickColor; ctx.textAlign = 'right'; ctx.fillText(formatNumber(value), m.left - 7, y);
          }
        }
      }

      const n = Math.max(1, labels.length);
      const dsCount = Math.max(1, datasets.length);
      if (indexAxis === 'y') {
        const band = ph / n;
        if (catDisplay) labels.forEach((lab, i) => {
          ctx.fillStyle = (this.options.scales?.y?.ticks?.color || defaults.scale.ticks.color);
          ctx.font = fontString(this.options.scales?.y?.ticks?.font, 10);
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          const lines = splitLabel(ctx, lab, m.left - 15);
          lines.forEach((line, j) => ctx.fillText(line, m.left - 7, m.top + band * (i + .5) + (j - (lines.length - 1)/2) * 12));
        });
        for (let i = 0; i < n; i++) {
          let stackPos = 0, stackNeg = 0;
          datasets.forEach((d, di) => {
            const raw = num((d.data || [])[i], 0);
            let v0 = 0;
            if (stacked) { v0 = raw >= 0 ? stackPos : stackNeg; if (raw >= 0) stackPos += raw; else stackNeg += raw; }
            const v1 = stacked ? v0 + raw : raw;
            const x0 = m.left + (v0 - min) / range * pw;
            const x1 = m.left + (v1 - min) / range * pw;
            const groupBand = band * .72;
            const bh = stacked ? groupBand : groupBand / dsCount;
            const y = m.top + i * band + (band - groupBand)/2 + (stacked ? 0 : di * bh);
            const x = Math.min(x0, x1), bw = Math.max(1, Math.abs(x1 - x0));
            ctx.fillStyle = valueAt(d.backgroundColor, i, '#f59e0b');
            roundedRect(ctx, x, y, bw, Math.max(3, bh - 3), d.borderRadius || 3); ctx.fill();
            this._regions.push({ kind:'rect', index:i, datasetIndex:di, x, y, w:bw, h:Math.max(3,bh-3), raw, label:labels[i], dataset:d });
          });
        }
      } else {
        const band = pw / n;
        if (catDisplay) labels.forEach((lab, i) => {
          const tickSpec = this.options.scales?.x?.ticks?.font || {};
          const baseSize = num(tickSpec.size, 9);
          const allowed = Math.max(50, band - 8);
          ctx.font = fontString(tickSpec, baseSize);
          const longestToken = String(lab ?? '').split(/\s+/).reduce((a, b) => ctx.measureText(a).width >= ctx.measureText(b).width ? a : b, '');
          const longestWidth = Math.max(1, ctx.measureText(longestToken).width);
          const fittedSize = clamp(baseSize * allowed / longestWidth, 8, baseSize);
          const fittedSpec = Object.assign({}, tickSpec, { size: fittedSize });
          ctx.fillStyle = (this.options.scales?.x?.ticks?.color || defaults.scale.ticks.color);
          ctx.font = fontString(fittedSpec, fittedSize);
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          const lines = splitLabel(ctx, lab, allowed);
          const lineH = Math.max(10, fittedSize + 2);
          lines.forEach((line, j) => ctx.fillText(line, m.left + band * (i + .5), m.top + ph + 9 + j*lineH));
        });
        for (let i = 0; i < n; i++) {
          let stackPos = 0, stackNeg = 0;
          datasets.forEach((d, di) => {
            const raw = num((d.data || [])[i], 0);
            let v0 = 0;
            if (stacked) { v0 = raw >= 0 ? stackPos : stackNeg; if (raw >= 0) stackPos += raw; else stackNeg += raw; }
            const v1 = stacked ? v0 + raw : raw;
            const y0 = m.top + ph - (v0 - min) / range * ph;
            const y1 = m.top + ph - (v1 - min) / range * ph;
            const groupBand = band * .72;
            const bw = stacked ? groupBand : groupBand / dsCount;
            const x = m.left + i * band + (band - groupBand)/2 + (stacked ? 0 : di*bw);
            const y = Math.min(y0, y1), bh = Math.max(1, Math.abs(y1-y0));
            ctx.fillStyle = valueAt(d.backgroundColor, i, '#f59e0b');
            roundedRect(ctx, x, y, Math.max(3,bw-3), bh, d.borderRadius || 3); ctx.fill();
            this._regions.push({ kind:'rect', index:i, datasetIndex:di, x, y, w:Math.max(3,bw-3), h:bh, raw, label:labels[i], dataset:d });
          });
        }
      }

      if (legendInfo.display) {
        const ly = legendInfo.position === 'bottom'
          ? h - 8 - legendH
          : 8;
        this._drawLegendLayout(legendLayout, 12, ly);
      }

      const titleSpec = valScale.title || {};
      if (titleSpec.display && titleSpec.text) {
        ctx.save(); ctx.fillStyle = titleSpec.color || defaults.scale.title.color; ctx.font = fontString(titleSpec.font, 10);
        if (indexAxis === 'y') { ctx.textAlign='center'; ctx.fillText(titleSpec.text, m.left + pw/2, h - 7); }
        else { ctx.translate(12, m.top+ph/2); ctx.rotate(-Math.PI/2); ctx.textAlign='center'; ctx.fillText(titleSpec.text,0,0); }
        ctx.restore();
      }
    }

    _hit(ev) {
      const rect = this.canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left, y = ev.clientY - rect.top;
      for (let i = this._regions.length - 1; i >= 0; i--) {
        const r = this._regions[i];
        if (r.kind === 'rect') {
          if (x >= r.x && x <= r.x+r.w && y >= r.y && y <= r.y+r.h) return r;
        } else if (r.kind === 'arc') {
          const dx=x-r.cx, dy=y-r.cy, dist=Math.hypot(dx,dy);
          if (dist < r.r1 || dist > r.r2) continue;
          let a=Math.atan2(dy,dx); if (a < -Math.PI/2) a += Math.PI*2;
          let a1=r.a1, a2=r.a2; while(a2<a1)a2+=Math.PI*2; while(a<a1)a+=Math.PI*2;
          if(a>=a1 && a<=a2)return r;
        }
      }
      return null;
    }

    _tooltipText(hit) {
      const cb = this.options.plugins?.tooltip?.callbacks?.label;
      const context = { chart:this, label:hit.label, raw:hit.raw, dataIndex:hit.index, datasetIndex:hit.datasetIndex, dataset:hit.dataset };
      if (typeof cb === 'function') { try { const out=cb(context); if(out!=null)return String(out); } catch(_e){} }
      const prefix = hit.dataset?.label ? `${hit.dataset.label}: ` : '';
      return `${prefix}${hit.label ? hit.label + ' — ' : ''}${formatNumber(hit.raw)}`;
    }

    _showTooltip(ev, hit) {
      if (this.options.plugins?.tooltip?.enabled === false) return;
      if (!this._tooltip) {
        const t = document.createElement('div');
        t.className = 'hl-local-chart-tooltip';
        t.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;max-width:260px;padding:7px 9px;border-radius:8px;background:rgba(15,23,42,.96);color:#e2e8f0;border:1px solid rgba(148,163,184,.35);font:600 12px/1.35 system-ui,-apple-system,Segoe UI,Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28)';
        document.body.appendChild(t); this._tooltip=t;
      }
      this._tooltip.textContent=this._tooltipText(hit);
      this._tooltip.style.left=`${Math.min(global.innerWidth-275, ev.clientX+12)}px`;
      this._tooltip.style.top=`${Math.min(global.innerHeight-70, ev.clientY+12)}px`;
      this._tooltip.hidden=false;
    }
    _hideTooltip(){ if(this._tooltip)this._tooltip.hidden=true; }
  }

  function formatNumber(v) {
    if (!Number.isFinite(Number(v))) return String(v ?? '');
    const n = Number(v);
    if (Math.abs(n) >= 1000) return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 }).format(n);
    if (Math.abs(n) < 1 && n !== 0) return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(n);
    return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 }).format(n);
  }

  HistoryLabChart.defaults = defaults;
  HistoryLabChart.instances = {};
  HistoryLabChart.getChart = function (item) {
    const canvas = typeof item === 'string' ? document.getElementById(item) : (item && item.canvas ? item.canvas : item);
    return canvas ? registry.get(canvas) : undefined;
  };
  HistoryLabChart.version = 'HistoryLab-local-1.2-legend-scheme-polish';

  global.Chart = HistoryLabChart;
})(window);
