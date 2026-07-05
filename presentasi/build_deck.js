/* Deck: Cara kerja MOWA + eksperimen A/B/B' (bimbingan progress, ID, akademik minimalis) */
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const FA = require("react-icons/fa");

// ---------- palette ----------
const NAVY = "0F2A43";
const NAVY2 = "173A5A";
const TEAL = "1C7293";
const TEAL2 = "2A9D8F";
const AMBER = "E9A23B";
const RED = "C05746";
const LIGHT = "F5F8FA";
const CARD = "FFFFFF";
const INK = "1E293B";
const MUTED = "64748B";
const WHITE = "FFFFFF";
const LINE = "D9E2EA";

const HFONT = "Georgia";
const BFONT = "Calibri";

// ---------- icon rasterization ----------
async function icon(IconComponent, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

async function main() {
  const I = {};
  const spec = {
    target: FA.FaBullseye, flow: FA.FaProjectDiagram, layers: FA.FaLayerGroup,
    curve: FA.FaBezierCurve, wave: FA.FaWaveSquare, brain: FA.FaMagic,
    expand: FA.FaExpandAlt, scale: FA.FaBalanceScale, chart: FA.FaChartBar,
    warn: FA.FaExclamationTriangle, wrench: FA.FaTools, book: FA.FaBookOpen,
    flag: FA.FaFlagCheckered, camera: FA.FaVideo, cut: FA.FaCut,
    blur: FA.FaTint, check: FA.FaCheckCircle, arrow: FA.FaArrowRight,
    grid: FA.FaTh, network: FA.FaSitemap, minus: FA.FaBan,
  };
  for (const [k, v] of Object.entries(spec)) I[k] = await icon(v, "#FFFFFF", 256);
  const Iteal = {};
  for (const [k, v] of Object.entries(spec)) Iteal[k] = await icon(v, "#1C7293", 256);

  const p = new pptxgen();
  p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
  p.layout = "W";
  p.author = "Skripsi Broiler";
  p.title = "MOWA & Eksperimen A/B/B'";
  const W = 13.333, H = 7.5;

  const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.13 });

  // ---------- reusable pieces ----------
  function pageBg(s) { s.background = { color: LIGHT }; }

  function iconCircle(s, x, y, d, dataUrl, fill = TEAL) {
    s.addShape(p.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
    const pad = d * 0.24;
    s.addImage({ data: dataUrl, x: x + pad, y: y + pad, w: d - pad * 2, h: d - pad * 2 });
  }

  // content-slide header (light bg): circle icon + title + kicker
  function header(s, iconUrl, kicker, title) {
    iconCircle(s, 0.6, 0.52, 0.72, iconUrl, TEAL);
    s.addText(kicker.toUpperCase(), {
      x: 1.5, y: 0.5, w: 10.5, h: 0.3, fontFace: BFONT, fontSize: 11.5,
      color: TEAL, bold: true, charSpacing: 3, margin: 0, align: "left",
    });
    s.addText(title, {
      x: 1.5, y: 0.78, w: 11.2, h: 0.7, fontFace: HFONT, fontSize: 27,
      color: NAVY, bold: true, margin: 0, align: "left",
    });
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.62, w: 12.13, h: 0.02, fill: { color: LINE }, line: { type: "none" } });
    s.addText("Skripsi — Generalisasi Estimasi Berat & Deteksi Anomali Broiler", {
      x: 0.6, y: 7.06, w: 9, h: 0.3, fontFace: BFONT, fontSize: 9, color: MUTED, margin: 0,
    });
  }

  function pageNum(s, n) {
    s.addText(String(n).padStart(2, "0"), {
      x: 12.4, y: 7.02, w: 0.5, h: 0.3, fontFace: BFONT, fontSize: 9.5, color: MUTED, align: "right", margin: 0,
    });
  }

  // card with left accent bar
  function card(s, x, y, w, h, accent = TEAL) {
    s.addShape(p.shapes.RECTANGLE, { x, y, w, h, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.09, h, fill: { color: accent }, line: { type: "none" } });
  }

  let pageCounter = 0;
  const num = (s) => { pageCounter++; pageNum(s, pageCounter); };

  // ===================================================================
  // 1. TITLE (dark)
  // ===================================================================
  {
    const s = p.addSlide();
    s.background = { color: NAVY };
    // motif: faint concentric rings top-right (fisheye nod)
    s.addShape(p.shapes.OVAL, { x: 9.7, y: -2.1, w: 6, h: 6, fill: { type: "none" }, line: { color: TEAL, width: 1.2, transparency: 55 } });
    s.addShape(p.shapes.OVAL, { x: 10.7, y: -1.1, w: 4, h: 4, fill: { type: "none" }, line: { color: TEAL2, width: 1.2, transparency: 45 } });
    s.addShape(p.shapes.OVAL, { x: 11.4, y: -0.4, w: 2.6, h: 2.6, fill: { type: "none" }, line: { color: AMBER, width: 1.4, transparency: 35 } });

    s.addText("BIMBINGAN — LAPORAN KEMAJUAN", {
      x: 0.9, y: 1.5, w: 8, h: 0.4, fontFace: BFONT, fontSize: 13, color: TEAL2, bold: true, charSpacing: 4, margin: 0,
    });
    s.addText("Rektifikasi Fisheye MOWA\nuntuk Deteksi Broiler", {
      x: 0.9, y: 2.0, w: 10.5, h: 1.9, fontFace: HFONT, fontSize: 44, color: WHITE, bold: true, lineSpacingMultiple: 1.02, margin: 0,
    });
    s.addText("Cara kerja model MOWA dan eksperimen A/B/B' — mengapa rektifikasi belum mengungguli baseline", {
      x: 0.9, y: 4.05, w: 9.6, h: 0.8, fontFace: BFONT, fontSize: 16, color: "C9D8E4", margin: 0,
    });
    s.addShape(p.shapes.RECTANGLE, { x: 0.92, y: 5.0, w: 2.2, h: 0.04, fill: { color: AMBER }, line: { type: "none" } });

    // bottom chips
    const chips = ["YOLOv8m (PIO)", "MOWA — TPAMI 2025", "A / B / B'"];
    let cx = 0.9;
    chips.forEach((c) => {
      const cw = 0.35 + c.length * 0.105;
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: cx, y: 5.5, w: cw, h: 0.5, fill: { color: NAVY2 }, line: { color: TEAL, width: 1 }, rectRadius: 0.08 });
      s.addText(c, { x: cx, y: 5.5, w: cw, h: 0.5, fontFace: BFONT, fontSize: 12, color: "DCE7F0", align: "center", valign: "middle", margin: 0 });
      cx += cw + 0.25;
    });
    s.addText("Program Skripsi  ·  2026", { x: 0.9, y: 6.55, w: 8, h: 0.3, fontFace: BFONT, fontSize: 11, color: MUTED, margin: 0 });
  }

  // ===================================================================
  // 2. KONTEKS & TUJUAN
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.target, "Konteks", "Latar & Tujuan Eksperimen");
    const items = [
      [Iteal.camera, "Masalah generalisasi", "Detektor broiler dilatih pada dataset PIO. Kamera atas peternakan punya distorsi barrel/wide-angle — apakah akurasi bisa dijaga lintas kamera/dataset?"],
      [Iteal.curve, "Pivot ke model end-to-end", "Heuristik radial lama (\"DaFIR-light\") hanya perhitungan statistik, bukan model. Diganti MOWA: rektifikasi terpelajar tanpa kalibrasi kamera."],
      [Iteal.scale, "Pertanyaan uji (A/B/B')", "Apakah menaruh MOWA sebagai praproses di depan YOLO meningkatkan mAP? Diuji pada PIO + 2 dataset eksternal."],
    ];
    let y = 1.95;
    items.forEach(([ic, h, b]) => {
      card(s, 0.6, y, 12.13, 1.5, TEAL);
      iconCircle(s, 0.95, y + 0.42, 0.66, ic, LIGHT); // teal icon on light circle
      s.addText(h, { x: 1.85, y: y + 0.2, w: 10.5, h: 0.4, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
      s.addText(b, { x: 1.85, y: y + 0.62, w: 10.6, h: 0.8, fontFace: BFONT, fontSize: 13.5, color: INK, margin: 0, lineSpacingMultiple: 1.02 });
      y += 1.66;
    });
    num(s);
  }

  // ===================================================================
  // 3. ALUR EKSPERIMEN (process flow)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.flow, "Peta Eksperimen", "Tiga Kondisi: A → B → B'");
    const steps = [
      [I.check, "A — Baseline", "YOLOv8m dilatih & diuji pada gambar ASLI (terdistorsi).", TEAL2],
      [I.wave, "B — MOWA apa adanya", "Gambar uji direktifikasi MOWA; detektor dipakai TANPA latih ulang.", AMBER],
      [I.wrench, "B' — Rectify-both", "Train + uji sama-sama direktifikasi; detektor DI-FINE-TUNE ulang.", TEAL],
    ];
    const cw = 3.75, gap = 0.62, y = 2.3, hgt = 3.0;
    let x = 0.6;
    steps.forEach(([ic, h, b, ac], i) => {
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: hgt, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: 0.12, fill: { color: ac }, line: { type: "none" } });
      iconCircle(s, x + cw / 2 - 0.42, y + 0.42, 0.84, ic, ac);
      s.addText(h, { x, y: y + 1.42, w: cw, h: 0.5, fontFace: HFONT, fontSize: 19, color: NAVY, bold: true, align: "center", margin: 0 });
      s.addText(b, { x: x + 0.28, y: y + 1.95, w: cw - 0.56, h: 0.95, fontFace: BFONT, fontSize: 13, color: INK, align: "center", margin: 0, lineSpacingMultiple: 1.03 });
      if (i < 2) {
        const ax = x + cw + 0.06;
        s.addImage({ data: Iteal.arrow, x: ax + 0.06, y: y + hgt / 2 - 0.22, w: 0.44, h: 0.44 });
      }
      x += cw + gap;
    });
    // takeaway strip
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.7, w: 12.13, h: 0.95, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.08 });
    iconCircle(s, 0.95, 5.85, 0.64, I.warn, AMBER);
    s.addText([
      { text: "Hipotesis metodologis:  ", options: { bold: true, color: WHITE } },
      { text: "menaruh gambar rectified di depan detektor yang dilatih pada gambar asli menimbulkan ", options: { color: "C9D8E4" } },
      { text: "domain mismatch", options: { bold: true, color: AMBER } },
      { text: " — B' menguji apakah fine-tune memulihkannya.", options: { color: "C9D8E4" } },
    ], { x: 1.8, y: 5.7, w: 10.7, h: 0.95, fontFace: BFONT, fontSize: 13.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.0 });
    num(s);
  }

  // ===================================================================
  // 4. MOWA — IKHTISAR
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.brain, "MOWA · 1 dari 5", "Ikhtisar: Apa itu MOWA?");
    // left definition block
    card(s, 0.6, 1.95, 6.0, 4.75, TEAL);
    s.addText("Multiple-in-One\nImage Warping Model", { x: 0.95, y: 2.2, w: 5.4, h: 1.0, fontFace: HFONT, fontSize: 22, color: NAVY, bold: true, margin: 0, lineSpacingMultiple: 1.0 });
    s.addText("Liao, Yue, Wu, Loy — IEEE TPAMI 2025 (arXiv:2404.10716)", { x: 0.95, y: 3.15, w: 5.4, h: 0.35, fontFace: BFONT, fontSize: 12, color: MUTED, italic: true, margin: 0 });
    const defs = [
      ["Satu model, banyak tugas", "Menyelesaikan 6 tugas warping (fisheye, wide-angle, rotasi, potret, dll) dalam satu kerangka."],
      ["Tanpa kalibrasi kamera", "Memprediksi medan perpindahan piksel langsung dari gambar — tak butuh intrinsik/parameter distorsi."],
      ["Cocok kamera campur", "Karena blind/self-supervised, cocok untuk PIO + eksternal yang kameranya tak terkalibrasi."],
    ];
    let y = 3.65;
    defs.forEach(([h, b]) => {
      s.addImage({ data: Iteal.check, x: 0.95, y: y + 0.03, w: 0.28, h: 0.28 });
      s.addText(h, { x: 1.35, y, w: 5.0, h: 0.32, fontFace: BFONT, fontSize: 14, color: NAVY, bold: true, margin: 0 });
      s.addText(b, { x: 1.35, y: y + 0.33, w: 5.05, h: 0.6, fontFace: BFONT, fontSize: 12, color: INK, margin: 0, lineSpacingMultiple: 1.0 });
      y += 1.0;
    });
    // right: input/output visual
    card(s, 6.85, 1.95, 5.88, 4.75, AMBER);
    s.addText("Kontrak Inferensi", { x: 7.2, y: 2.15, w: 5.2, h: 0.4, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
    // input chip
    const io = [
      ["INPUT", "RGB 256×256 + 1 mask = 4 kanal", TEAL],
      ["PROSES", "Prediksi warp 2-tahap (TPS + flow)", TEAL2],
      ["OUTPUT", "Gambar rectified pada resolusi asli", AMBER],
    ];
    let yy = 2.75;
    io.forEach(([tag, txt, c], i) => {
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 7.2, y: yy, w: 5.2, h: 0.86, fill: { color: LIGHT }, line: { color: LINE, width: 1 }, rectRadius: 0.06 });
      s.addShape(p.shapes.RECTANGLE, { x: 7.2, y: yy, w: 0.09, h: 0.86, fill: { color: c }, line: { type: "none" } });
      s.addText(tag, { x: 7.42, y: yy + 0.12, w: 1.3, h: 0.3, fontFace: BFONT, fontSize: 11, color: c, bold: true, charSpacing: 2, margin: 0 });
      s.addText(txt, { x: 7.42, y: yy + 0.4, w: 4.85, h: 0.4, fontFace: BFONT, fontSize: 13, color: INK, margin: 0 });
      if (i < 2) s.addImage({ data: Iteal.arrow, x: 9.6, y: yy + 0.92, w: 0.3, h: 0.3, rotate: 90 });
      yy += 1.18;
    });
    num(s);
  }

  // ===================================================================
  // 5. MOWA — ARSITEKTUR UFORMER
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.layers, "MOWA · 2 dari 5", "Arsitektur: Backbone Uformer (U-Net Transformer)");
    // U-shape diagram: encoder blocks descending, bottleneck, decoder ascending
    const encColors = [TEAL, TEAL, TEAL2, TEAL2];
    const decColors = ["E9A23B", "E9A23B", "F0B968", "F0B968"]; // mirror: two-tone amber, lighter toward top
    const baseY = 2.15, topH = 0.6, step = 0.45;
    const encLabels = ["256²", "128²", "64²", "32²"];
    // encoder (left, going down)
    let ex = 0.9;
    encLabels.forEach((lb, i) => {
      const h = topH + i * step;
      s.addShape(p.shapes.RECTANGLE, { x: ex, y: baseY, w: 1.05, h, fill: { color: encColors[i] }, line: { type: "none" }, shadow: shadow() });
      s.addText(lb, { x: ex, y: baseY + h + 0.06, w: 1.05, h: 0.3, fontFace: BFONT, fontSize: 11, color: MUTED, align: "center", margin: 0 });
      s.addText("Enc", { x: ex, y: baseY + 0.06, w: 1.05, h: 0.3, fontFace: BFONT, fontSize: 10, color: WHITE, align: "center", bold: true, margin: 0 });
      ex += 1.18;
    });
    // bottleneck
    const bx = ex + 0.15;
    s.addShape(p.shapes.RECTANGLE, { x: bx, y: baseY, w: 1.15, h: topH + 3 * step + 0.3, fill: { color: NAVY }, line: { type: "none" }, shadow: shadow() });
    s.addText("Bottleneck\n16²", { x: bx, y: baseY + 0.75, w: 1.15, h: 0.8, fontFace: BFONT, fontSize: 11, color: WHITE, align: "center", bold: true, margin: 0 });
    // decoder (right, going up) with skip arrows
    let dx = bx + 1.15 + 0.5;
    const decLabels = ["32²", "64²", "128²", "256²"];
    decLabels.forEach((lb, i) => {
      const h = topH + (3 - i) * step;
      s.addShape(p.shapes.RECTANGLE, { x: dx, y: baseY, w: 1.05, h, fill: { color: decColors[i] }, line: { type: "none" }, shadow: shadow() });
      s.addText(lb, { x: dx, y: baseY + h + 0.06, w: 1.05, h: 0.3, fontFace: BFONT, fontSize: 11, color: MUTED, align: "center", margin: 0 });
      s.addText("Dec", { x: dx, y: baseY + 0.06, w: 1.05, h: 0.3, fontFace: BFONT, fontSize: 10, color: NAVY, align: "center", bold: true, margin: 0 });
      dx += 1.18;
    });
    s.addText("Encoder (biru-teal) menyusut ke bottleneck 16², decoder (kuning) memulihkan ke 256² — dengan skip-connection.", { x: 0.9, y: 4.72, w: 11.83, h: 0.35, fontFace: BFONT, fontSize: 11.5, color: MUTED, italic: true, align: "center", margin: 0 });

    // bottom notes cards
    const notes = [
      [Iteal.grid, "Blok LeWin", "Atensi dalam jendela lokal 8×8 (hemat komputasi vs atensi global) + depthwise-conv (LeFF) untuk detail spasial."],
      [Iteal.network, "Bentuk-U", "4 tahap encoder (downsample 2×) → bottleneck 16² → 4 tahap decoder dengan skip-connection."],
    ];
    let nx = 0.6;
    notes.forEach(([ic, h, b]) => {
      card(s, nx, 5.35, 5.96, 1.35, TEAL);
      iconCircle(s, nx + 0.28, 5.62, 0.6, ic, LIGHT);
      s.addText(h, { x: nx + 1.05, y: 5.5, w: 4.7, h: 0.35, fontFace: HFONT, fontSize: 15, color: NAVY, bold: true, margin: 0 });
      s.addText(b, { x: nx + 1.05, y: 5.84, w: 4.8, h: 0.8, fontFace: BFONT, fontSize: 11.5, color: INK, margin: 0, lineSpacingMultiple: 1.0 });
      nx += 6.17;
    });
    num(s);
  }

  // ===================================================================
  // 6. MOWA — WARPING 2 TAHAP (core)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.curve, "MOWA · 3 dari 5", "Mekanisme Inti: Warping Dua Tahap (kasar → halus)");
    // stage 1
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.95, w: 5.95, h: 4.75, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.95, w: 5.95, h: 0.12, fill: { color: TEAL }, line: { type: "none" } });
    iconCircle(s, 0.9, 2.28, 0.7, I.grid, TEAL);
    s.addText("TAHAP 1", { x: 1.75, y: 2.3, w: 4.5, h: 0.3, fontFace: BFONT, fontSize: 11, color: TEAL, bold: true, charSpacing: 3, margin: 0 });
    s.addText("TPS kasar bertingkat (global)", { x: 1.75, y: 2.58, w: 4.7, h: 0.5, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, margin: 0 });
    s.addText([
      { text: "8 kepala regresi", options: { bold: true } },
      { text: " memprediksi pergeseran ", options: {} },
      { text: "mesh titik kontrol Thin-Plate-Spline", options: { bold: true } },
      { text: " yang makin rapat (8→10→12→14).", options: {} },
    ], { x: 0.95, y: 3.25, w: 5.35, h: 0.9, fontFace: BFONT, fontSize: 13, color: INK, margin: 0, lineSpacingMultiple: 1.03 });
    s.addText("tps[i] = pre + tps_up[i−1]", { x: 0.95, y: 4.15, w: 5.35, h: 0.4, fontFace: "Consolas", fontSize: 12.5, color: TEAL, bold: true, margin: 0 });
    s.addText("Cascade coarse-to-fine: tiap kepala menambah koreksi di atas kepala sebelumnya.", { x: 0.95, y: 4.55, w: 5.35, h: 0.6, fontFace: BFONT, fontSize: 12, color: MUTED, italic: true, margin: 0 });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 5.3, w: 5.35, h: 1.1, fill: { color: LIGHT }, line: { color: LINE, width: 1 }, rectRadius: 0.06 });
    s.addText([
      { text: "Efek: ", options: { bold: true, color: TEAL } },
      { text: "pelurusan besar (debarreling) — rel bengkok jadi lurus, tepi ditarik masuk. Ayam tetap terdeteksi (mAP50 utuh).", options: { color: INK } },
    ], { x: 1.15, y: 5.42, w: 5.0, h: 0.9, fontFace: BFONT, fontSize: 12, valign: "middle", margin: 0, lineSpacingMultiple: 1.0 });

    // arrow between
    s.addImage({ data: Iteal.arrow, x: 6.62, y: 4.1, w: 0.5, h: 0.5 });

    // stage 2
    s.addShape(p.shapes.RECTANGLE, { x: 7.15, y: 1.95, w: 5.58, h: 4.75, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x: 7.15, y: 1.95, w: 5.58, h: 0.12, fill: { color: AMBER }, line: { type: "none" } });
    iconCircle(s, 7.45, 2.28, 0.7, I.wave, AMBER);
    s.addText("TAHAP 2", { x: 8.3, y: 2.3, w: 4.2, h: 0.3, fontFace: BFONT, fontSize: 11, color: AMBER, bold: true, charSpacing: 3, margin: 0 });
    s.addText("Residual flow halus (lokal)", { x: 8.3, y: 2.58, w: 4.3, h: 0.5, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, margin: 0 });
    s.addText([
      { text: "Decoder mengeluarkan ", options: {} },
      { text: "medan aliran optik padat 2-kanal", options: { bold: true } },
      { text: " — koreksi per-piksel untuk distorsi lokal yang tak tertangkap TPS mulus.", options: {} },
    ], { x: 7.5, y: 3.25, w: 5.05, h: 0.95, fontFace: BFONT, fontSize: 13, color: INK, margin: 0, lineSpacingMultiple: 1.03 });
    s.addText("final_flow = flow + tps_flow", { x: 7.5, y: 4.2, w: 5.05, h: 0.4, fontFace: "Consolas", fontSize: 12.5, color: AMBER, bold: true, margin: 0 });
    s.addText("output = resample( resample(img, TPS), flow )", { x: 7.5, y: 4.6, w: 5.05, h: 0.4, fontFace: "Consolas", fontSize: 11.5, color: MUTED, margin: 0 });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 7.5, y: 5.3, w: 5.05, h: 1.1, fill: { color: "FBF1DE" }, line: { color: AMBER, width: 1 }, rectRadius: 0.06 });
    s.addText([
      { text: "Konsekuensi: ", options: { bold: true, color: RED } },
      { text: "warping = 2× interpolasi bilinear → tepi objek melunak. Ini menggerus presisi lokalisasi (mAP50-95).", options: { color: INK } },
    ], { x: 7.7, y: 5.42, w: 4.7, h: 0.9, fontFace: BFONT, fontSize: 12, valign: "middle", margin: 0, lineSpacingMultiple: 1.0 });
    num(s);
  }

  // ===================================================================
  // 7. MOWA — POINT CLASSIFIER / PROMPT
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.brain, "MOWA · 4 dari 5", "Deteksi Tugas Otomatis via Point-Classifier");
    // flow: tps points -> PointNet -> softmax prompt -> conditions decoder
    const boxes = [
      ["Mesh TPS final", "Pola titik kontrol dari Tahap 1", TEAL],
      ["PointNet", "Klasifikasi jenis warp\n(fisheye? wide-angle? …)", NAVY],
      ["Softmax → prompt", "point_cls → F.softmax", TEAL2],
      ["Kondisikan decoder", "Prompt learning menuntun\ndecoder ke tugas yang tepat", AMBER],
    ];
    const bw = 2.75, gap = 0.42, y = 2.35, hh = 1.65;
    let x = 0.6;
    boxes.forEach(([h, b, c], i) => {
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w: bw, h: hh, fill: { color: CARD }, line: { color: LINE, width: 1 }, rectRadius: 0.08, shadow: shadow() });
      s.addShape(p.shapes.RECTANGLE, { x, y, w: bw, h: 0.11, fill: { color: c }, line: { type: "none" } });
      s.addText(h, { x: x + 0.15, y: y + 0.28, w: bw - 0.3, h: 0.55, fontFace: HFONT, fontSize: 15, color: NAVY, bold: true, align: "center", margin: 0, lineSpacingMultiple: 0.95 });
      s.addText(b, { x: x + 0.15, y: y + 0.85, w: bw - 0.3, h: 0.7, fontFace: BFONT, fontSize: 11.5, color: INK, align: "center", margin: 0, lineSpacingMultiple: 1.0 });
      if (i < 3) s.addImage({ data: Iteal.arrow, x: x + bw + 0.02, y: y + hh / 2 - 0.19, w: 0.38, h: 0.38 });
      x += bw + gap;
    });
    // key point band
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 4.5, w: 12.13, h: 0.02, fill: { color: LINE }, line: { type: "none" } });
    const kp = [
      [I.check, "Tanpa task-id manual", "Model sendiri yang menentukan jenis distorsi — di test-path default, index 4 = fisheye."],
      [I.brain, "Prompt learning", "Satu bobot melayani banyak tugas; prompt mengaktifkan perilaku yang relevan per gambar."],
      [I.camera, "Relevan untuk kita", "PIO terdeteksi sebagai fisheye/wide-angle secara otomatis — tak perlu anotasi jenis kamera."],
    ];
    let kx = 0.6;
    kp.forEach(([ic, h, b]) => {
      iconCircle(s, kx, 4.9, 0.66, ic, TEAL);
      s.addText(h, { x: kx + 0.85, y: 4.9, w: 3.1, h: 0.66, fontFace: BFONT, fontSize: 13.5, color: NAVY, bold: true, valign: "middle", margin: 0, lineSpacingMultiple: 0.95 });
      s.addText(b, { x: kx + 0.02, y: 5.68, w: 3.95, h: 1.0, fontFace: BFONT, fontSize: 12, color: INK, margin: 0, lineSpacingMultiple: 1.03 });
      kx += 4.06;
    });
    num(s);
  }

  // ===================================================================
  // 8. MOWA — RESOLUSI & RESAMPLING (bridge to why B<A)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.expand, "MOWA · 5 dari 5", "Dari 256² ke Resolusi Asli — dan Harganya");
    card(s, 0.6, 1.95, 6.0, 2.35, TEAL);
    s.addText("Model berpikir di 256², hasil di resolusi penuh", { x: 0.95, y: 2.15, w: 5.4, h: 0.6, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, margin: 0, lineSpacingMultiple: 0.95 });
    s.addText([
      { text: "•  Mesh TPS di-upsample ke resolusi asli (mis. 1920×1080).", options: { breakLine: true } },
      { text: "•  Residual flow di-interpolasi bilinear + diskalakan (flow[:,0]*=scale_W).", options: { breakLine: true } },
      { text: "•  Warping akhir = grid-sample bilinear di resolusi penuh.", options: {} },
    ], { x: 0.95, y: 2.8, w: 5.45, h: 1.4, fontFace: BFONT, fontSize: 13, color: INK, margin: 0, lineSpacingMultiple: 1.15 });

    // cost cards (right)
    const costs = [
      [I.blur, "Resampling ganda → blur tepi", "Dua kali interpolasi melunakkan tepi objek. Broiler kecil rapat paling terdampak."],
      [I.cut, "FOV trim / cropping", "Tepi ditarik masuk (clamp mesh) → objek pinggir mengecil atau keluar frame."],
    ];
    let cy = 1.95;
    costs.forEach(([ic, h, b]) => {
      card(s, 6.85, cy, 5.88, 1.1, AMBER);
      iconCircle(s, 7.12, cy + 0.25, 0.6, ic, AMBER);
      s.addText(h, { x: 7.9, y: cy + 0.15, w: 4.7, h: 0.35, fontFace: HFONT, fontSize: 14.5, color: NAVY, bold: true, margin: 0 });
      s.addText(b, { x: 7.9, y: cy + 0.5, w: 4.75, h: 0.55, fontFace: BFONT, fontSize: 11.5, color: INK, margin: 0, lineSpacingMultiple: 1.0 });
      cy += 1.25;
    });

    // bottom: the diagnostic link
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.55, w: 12.13, h: 2.1, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.08 });
    iconCircle(s, 0.95, 4.85, 0.68, I.minus, AMBER);
    s.addText("Jembatan ke hasil A/B", { x: 1.85, y: 4.82, w: 10.6, h: 0.4, fontFace: HFONT, fontSize: 17, color: WHITE, bold: true, margin: 0 });
    s.addText([
      { text: "Rektifikasi kuat secara geometris (rel lurus) → ", options: { color: "C9D8E4" } },
      { text: "mAP50 nyaris tak turun (0.900 → 0.897)", options: { bold: true, color: TEAL2 } },
      { text: ".  Tetapi resampling ganda + FOV trim menggerus lokalisasi ketat → ", options: { color: "C9D8E4" } },
      { text: "mAP50-95 turun 0.710 → 0.638", options: { bold: true, color: AMBER } },
      { text: ".  Artinya MOWA tetap MENEMUKAN ayam, tapi kotaknya kurang pas.", options: { color: "C9D8E4" } },
    ], { x: 1.85, y: 5.25, w: 10.55, h: 1.3, fontFace: BFONT, fontSize: 14, margin: 0, lineSpacingMultiple: 1.12 });
    num(s);
  }

  // ===================================================================
  // 9. KONDISI A / B / B' (definitions comparison)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.scale, "Desain", "Definisi Tiga Kondisi");
    const cols = [
      ["A", "Baseline", TEAL2, ["Train: gambar ASLI", "Uji: gambar ASLI", "Detektor: apa adanya", "Peran: acuan pembanding"]],
      ["B", "MOWA apa adanya", AMBER, ["Train: gambar ASLI", "Uji: gambar RECTIFIED", "Detektor: TANPA latih ulang", "Menguji: praproses saja"]],
      ["B'", "Rectify-both", TEAL, ["Train: gambar RECTIFIED", "Uji: gambar RECTIFIED", "Detektor: FINE-TUNE ulang", "Menguji: adaptasi domain"]],
    ];
    const cw = 3.9, gap = 0.2, y = 2.0, hh = 4.6;
    let x = 0.7;
    cols.forEach(([tag, name, c, rows]) => {
      const onAmber = c === AMBER;
      const htext = onAmber ? NAVY : WHITE;
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: hh, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: 1.0, fill: { color: c }, line: { type: "none" } });
      s.addText(tag, { x, y: y + 0.1, w: cw, h: 0.6, fontFace: HFONT, fontSize: 30, color: htext, bold: true, align: "center", margin: 0 });
      s.addText(name, { x, y: y + 0.66, w: cw, h: 0.32, fontFace: BFONT, fontSize: 13, color: htext, bold: onAmber, align: "center", margin: 0 });
      let ry = y + 1.25;
      rows.forEach((r) => {
        const parts = r.split(": ");
        s.addText([
          { text: parts[0] + ":  ", options: { bold: true, color: NAVY } },
          { text: parts[1], options: { color: INK } },
        ], { x: x + 0.3, y: ry, w: cw - 0.6, h: 0.5, fontFace: BFONT, fontSize: 13, margin: 0, valign: "middle", lineSpacingMultiple: 1.0 });
        s.addShape(p.shapes.RECTANGLE, { x: x + 0.3, y: ry + 0.62, w: cw - 0.6, h: 0.014, fill: { color: LINE }, line: { type: "none" } });
        ry += 0.78;
      });
      x += cw + gap;
    });
    num(s);
  }

  // ===================================================================
  // 10. HASIL (chart + table)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.chart, "Hasil", "mAP50-95 pada Tiga Dataset (A / B / B')");
    // grouped bar chart
    const data = [
      { name: "A — baseline", labels: ["PIO val", "broiler_seg", "chicken_fum"], values: [0.710, 0.536, 0.058] },
      { name: "B — MOWA", labels: ["PIO val", "broiler_seg", "chicken_fum"], values: [0.638, 0.457, 0.049] },
      { name: "B' — fine-tune", labels: ["PIO val", "broiler_seg", "chicken_fum"], values: [0.683, 0.530, 0.058] },
    ];
    s.addChart(p.charts.BAR, data, {
      x: 0.6, y: 1.95, w: 7.7, h: 4.7, barDir: "col",
      chartColors: [TEAL2, AMBER, TEAL],
      chartArea: { fill: { color: CARD } },
      catAxisLabelColor: MUTED, catAxisLabelFontSize: 12, catAxisLabelFontFace: BFONT,
      valAxisLabelColor: MUTED, valAxisLabelFontSize: 11,
      valAxisMinVal: 0, valAxisMaxVal: 0.8, valGridLine: { color: "E8EEF3", size: 0.5 }, catGridLine: { style: "none" },
      showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontSize: 10, dataLabelFontFace: BFONT, dataLabelFormatCode: "0.000",
      showLegend: true, legendPos: "b", legendColor: INK, legendFontSize: 12,
      barGapWidthPct: 40,
    });
    // right: verdict stats
    s.addShape(p.shapes.RECTANGLE, { x: 8.55, y: 1.95, w: 4.18, h: 4.7, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x: 8.55, y: 1.95, w: 4.18, h: 0.12, fill: { color: NAVY }, line: { type: "none" } });
    s.addText("Rata-rata Δ vs A", { x: 8.55, y: 2.25, w: 4.18, h: 0.4, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, align: "center", margin: 0 });
    // stat B
    s.addText("−0.053", { x: 8.55, y: 2.75, w: 4.18, h: 0.9, fontFace: HFONT, fontSize: 44, color: AMBER, bold: true, align: "center", margin: 0 });
    s.addText("B — MOWA apa adanya", { x: 8.55, y: 3.6, w: 4.18, h: 0.3, fontFace: BFONT, fontSize: 12, color: MUTED, align: "center", margin: 0 });
    s.addShape(p.shapes.RECTANGLE, { x: 9.2, y: 4.15, w: 2.9, h: 0.014, fill: { color: LINE }, line: { type: "none" } });
    // stat B'
    s.addText("−0.011", { x: 8.55, y: 4.35, w: 4.18, h: 0.9, fontFace: HFONT, fontSize: 44, color: TEAL, bold: true, align: "center", margin: 0 });
    s.addText("B' — setelah fine-tune", { x: 8.55, y: 5.2, w: 4.18, h: 0.3, fontFace: BFONT, fontSize: 12, color: MUTED, align: "center", margin: 0 });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 8.85, y: 5.7, w: 3.58, h: 0.75, fill: { color: LIGHT }, line: { color: TEAL, width: 1 }, rectRadius: 0.06 });
    s.addText([
      { text: "Fine-tune memulihkan ", options: { color: INK } },
      { text: "~79%", options: { bold: true, color: TEAL } },
      { text: " loss", options: { color: INK } },
    ], { x: 8.95, y: 5.7, w: 3.4, h: 0.75, fontFace: BFONT, fontSize: 13, align: "center", valign: "middle", margin: 0 });
    num(s);
  }

  // ===================================================================
  // 11. KENAPA B < A
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.warn, "Analisis", "Mengapa B Lebih Buruk dari A?");
    s.addText("Rektifikasi geometris BENAR — masalahnya pada interaksi dengan detektor, bukan kualitas warping.", {
      x: 0.6, y: 1.78, w: 12.1, h: 0.4, fontFace: BFONT, fontSize: 13.5, color: MUTED, italic: true, margin: 0,
    });
    const reasons = [
      [I.camera, "1 · Domain mismatch", "Detektor dilatih pada gambar ASLI. Input rectified = distribusi tak pernah dilihat saat training. (Penyebab utama.)", TEAL],
      [I.blur, "2 · Loss di lokalisasi ketat", "mAP50 utuh (0.900→0.897) tapi mAP50-95 turun (0.710→0.638): ayam ketemu, kotak kurang pas akibat blur tepi.", AMBER],
      [I.cut, "3 · FOV trim di tepi", "MOWA menarik tepi masuk → objek pinggir keluar frame; box GT ter-warp keluar dibuang saat eval.", TEAL],
      [I.minus, "4 · Manfaat tak relevan", "Meluruskan rel/feeder tak membantu deteksi ayam. Biaya (resampling+trim) langsung, manfaat geometris tidak.", NAVY],
    ];
    const cw = 5.96, gap = 0.21, hh = 1.9;
    let idx = 0;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const [ic, h, b, col] = reasons[idx];
        const x = 0.6 + c * (cw + gap);
        const y = 2.3 + r * (hh + 0.2);
        s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: hh, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
        s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.09, h: hh, fill: { color: col }, line: { type: "none" } });
        iconCircle(s, x + 0.32, y + 0.32, 0.66, ic, col);
        s.addText(h, { x: x + 1.15, y: y + 0.3, w: cw - 1.35, h: 0.45, fontFace: HFONT, fontSize: 16.5, color: NAVY, bold: true, margin: 0 });
        s.addText(b, { x: x + 1.15, y: y + 0.82, w: cw - 1.4, h: 1.0, fontFace: BFONT, fontSize: 12.5, color: INK, margin: 0, lineSpacingMultiple: 1.05 });
        idx++;
      }
    }
    num(s);
  }

  // ===================================================================
  // 12. B': apa yang dilakukan & kenapa masih < A
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.wrench, "Analisis", "B' — Yang Dilakukan & Mengapa Masih < A");
    // left: what B' does (steps)
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.95, w: 6.0, h: 4.75, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.95, w: 6.0, h: 0.12, fill: { color: TEAL }, line: { type: "none" } });
    s.addText("Apa yang dilakukan B'", { x: 0.9, y: 2.2, w: 5.4, h: 0.4, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
    const steps = [
      "Rektifikasi juga train set PIO (+ label ikut di-warp).",
      "Warm-start dari bobot baseline A (bukan dari nol).",
      "Latih ulang di domain rectified: 20 epoch, imgsz 960.",
      "Eval ulang → kondisi B', bandingkan dengan A.",
    ];
    let y = 2.75;
    steps.forEach((t, i) => {
      s.addShape(p.shapes.OVAL, { x: 0.95, y: y, w: 0.42, h: 0.42, fill: { color: TEAL }, line: { type: "none" } });
      s.addText(String(i + 1), { x: 0.95, y: y, w: 0.42, h: 0.42, fontFace: BFONT, fontSize: 15, color: WHITE, bold: true, align: "center", valign: "middle", margin: 0 });
      s.addText(t, { x: 1.55, y: y - 0.05, w: 4.85, h: 0.55, fontFace: BFONT, fontSize: 13, color: INK, valign: "middle", margin: 0, lineSpacingMultiple: 1.0 });
      y += 0.72;
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.9, y: 5.75, w: 5.4, h: 0.8, fill: { color: LIGHT }, line: { color: TEAL, width: 1 }, rectRadius: 0.06 });
    s.addText([
      { text: "Hasil: ", options: { bold: true, color: TEAL } },
      { text: "Δ membaik −0.053 → −0.011 (pulih ~79%). Membuktikan loss B sebagian besar domain mismatch.", options: { color: INK } },
    ], { x: 1.1, y: 5.75, w: 5.0, h: 0.8, fontFace: BFONT, fontSize: 12, valign: "middle", margin: 0, lineSpacingMultiple: 1.0 });

    // right: why still < A
    s.addShape(p.shapes.RECTANGLE, { x: 6.85, y: 1.95, w: 5.88, h: 4.75, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x: 6.85, y: 1.95, w: 5.88, h: 0.12, fill: { color: AMBER }, line: { type: "none" } });
    s.addText("Mengapa sisa −0.011 tak hilang", { x: 7.15, y: 2.2, w: 5.3, h: 0.4, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
    s.addText("Fine-tune menghapus mismatch domain, tapi tiga kerugian ini sudah hilang di piksel — tak bisa dipulihkan pelatihan:", {
      x: 7.15, y: 2.62, w: 5.3, h: 0.7, fontFace: BFONT, fontSize: 12, color: MUTED, italic: true, margin: 0, lineSpacingMultiple: 1.0,
    });
    const why = [
      [I.blur, "Information loss (resampling)", "Tepi yang melunak tak bisa ditajamkan lagi; model hanya belajar hidup dengannya."],
      [I.cut, "FOV trim / cropping", "Objek yang keluar frame tak bisa dideteksi seberapapun baik pelatihannya."],
      [I.minus, "Tak ada sinyal baru", "Manfaat geometris bukan target deteksi; distorsi ringan tubuh ayam sudah 'diserap' detektor asli."],
    ];
    let wy = 3.4;
    why.forEach(([ic, h, b]) => {
      iconCircle(s, 7.15, wy, 0.56, ic, AMBER);
      s.addText(h, { x: 7.85, y: wy - 0.02, w: 4.7, h: 0.35, fontFace: BFONT, fontSize: 13.5, color: NAVY, bold: true, margin: 0 });
      s.addText(b, { x: 7.85, y: wy + 0.32, w: 4.75, h: 0.6, fontFace: BFONT, fontSize: 12, color: INK, margin: 0, lineSpacingMultiple: 1.0 });
      wy += 1.08;
    });
    num(s);
  }

  // ===================================================================
  // 13. REFERENSI
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.book, "Landasan", "Referensi Utama");
    const refs = [
      ["Model", "MOWA: Multiple-in-One Image Warping Model", "Liao, Yue, Wu, Loy — IEEE TPAMI 2025", "arXiv:2404.10716", TEAL],
      ["Metodologi", "WoodScape: Multi-Task, Multi-Camera Fisheye Dataset", "Yogamani dkk. — ICCV 2019", "arXiv:1905.01489", NAVY],
      ["Metodologi", "FisheyeDetNet: Object Detection on Fisheye Surround-View", "Sistu & Yogamani — 2024", "arXiv:2404.13443", NAVY],
      ["Metodologi", "Generalized Object Detection on Fisheye (FisheyeYOLO)", "Rashed dkk. — WACV 2021", "arXiv:2012.02124", NAVY],
      ["Bukti", "Benchmarking BEV Detection, Mixed Pinhole+Fisheye (KITTI-360)", "Liu & Shen (fortiss/TUM) — 2026", "arXiv:2603.27818", AMBER],
    ];
    let y = 1.95;
    refs.forEach(([tag, title, auth, id, c]) => {
      s.addShape(p.shapes.RECTANGLE, { x: 0.6, y, w: 12.13, h: 0.9, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
      s.addShape(p.shapes.RECTANGLE, { x: 0.6, y, w: 0.09, h: 0.9, fill: { color: c }, line: { type: "none" } });
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.85, y: y + 0.28, w: 1.35, h: 0.34, fill: { color: c }, line: { type: "none" }, rectRadius: 0.05 });
      s.addText(tag, { x: 0.85, y: y + 0.28, w: 1.35, h: 0.34, fontFace: BFONT, fontSize: 10.5, color: WHITE, bold: true, align: "center", valign: "middle", margin: 0 });
      s.addText(title, { x: 2.4, y: y + 0.14, w: 8.2, h: 0.4, fontFace: HFONT, fontSize: 14.5, color: NAVY, bold: true, margin: 0 });
      s.addText(auth, { x: 2.4, y: y + 0.52, w: 8.2, h: 0.32, fontFace: BFONT, fontSize: 11.5, color: MUTED, margin: 0 });
      s.addText(id, { x: 10.7, y, w: 2.0, h: 0.9, fontFace: "Consolas", fontSize: 11.5, color: c, bold: true, align: "right", valign: "middle", margin: 0 });
      y += 0.98;
    });
    num(s);
  }

  // ===================================================================
  // 14. KESIMPULAN (dark)
  // ===================================================================
  {
    const s = p.addSlide();
    s.background = { color: NAVY };
    s.addShape(p.shapes.OVAL, { x: -1.8, y: 4.3, w: 5, h: 5, fill: { type: "none" }, line: { color: TEAL, width: 1.2, transparency: 60 } });
    s.addShape(p.shapes.OVAL, { x: -0.9, y: 5.2, w: 3.2, h: 3.2, fill: { type: "none" }, line: { color: AMBER, width: 1.3, transparency: 45 } });
    iconCircle(s, 0.9, 0.85, 0.8, I.flag, TEAL);
    s.addText("KESIMPULAN", { x: 1.95, y: 0.95, w: 8, h: 0.4, fontFace: BFONT, fontSize: 13, color: TEAL2, bold: true, charSpacing: 4, margin: 0 });
    s.addText("Hasil Negatif yang Valid", { x: 1.95, y: 1.28, w: 10, h: 0.8, fontFace: HFONT, fontSize: 34, color: WHITE, bold: true, margin: 0 });

    const pts = [
      ["MOWA tidak mengalahkan baseline", "Sebagai praproses, rektifikasi MOWA lebih buruk (−0.053); setelah fine-tune tetap ~1 pt di bawah A (−0.011)."],
      ["Penyebab dipahami & terukur", "Domain mismatch (pulih via fine-tune) + information loss & FOV trim (permanen) + manfaat geometris tak relevan bagi deteksi."],
      ["Konsisten dengan literatur", "WoodScape & benchmark KITTI-360: untuk kamera distorsi ringan, undistortion tak andal meningkatkan detektor modern."],
    ];
    let y = 2.5;
    pts.forEach(([h, b], i) => {
      s.addShape(p.shapes.OVAL, { x: 1.0, y: y + 0.05, w: 0.5, h: 0.5, fill: { color: i === 0 ? AMBER : TEAL2 }, line: { type: "none" } });
      s.addText(String(i + 1), { x: 1.0, y: y + 0.05, w: 0.5, h: 0.5, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, align: "center", valign: "middle", margin: 0 });
      s.addText(h, { x: 1.75, y: y, w: 10.8, h: 0.4, fontFace: HFONT, fontSize: 19, color: WHITE, bold: true, margin: 0 });
      s.addText(b, { x: 1.75, y: y + 0.42, w: 10.9, h: 0.7, fontFace: BFONT, fontSize: 14, color: "C9D8E4", margin: 0, lineSpacingMultiple: 1.05 });
      y += 1.3;
    });
    s.addShape(p.shapes.RECTANGLE, { x: 1.0, y: 6.5, w: 2.2, h: 0.045, fill: { color: AMBER }, line: { type: "none" } });
    s.addText([
      { text: "Kontribusi skripsi:  ", options: { bold: true, color: AMBER } },
      { text: "bukti empiris + penjelasan mekanistik mengapa rektifikasi fisheye belum menguntungkan pada domain broiler ini.", options: { color: "AEC2D4" } },
    ], { x: 1.0, y: 6.65, w: 11.4, h: 0.5, fontFace: BFONT, fontSize: 12.5, italic: true, margin: 0 });
  }

  const out = "MOWA_Eksperimen_AB.pptx";
  await p.writeFile({ fileName: out });
  console.log("WROTE", out);
}

main().catch((e) => { console.error(e); process.exit(1); });
