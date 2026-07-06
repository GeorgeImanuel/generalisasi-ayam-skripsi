/* Deck LENGKAP: seluruh percobaan — dari cek integritas ground-truth bbox
   hingga hasil akhir (round-trip + augmentasi radial). Bahasa Indonesia, akademik. */
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const FA = require("react-icons/fa");
const path = require("path");

// ---------- palette ----------
const NAVY = "0F2A43";
const NAVY2 = "173A5A";
const TEAL = "1C7293";
const TEAL2 = "2A9D8F";
const AMBER = "E9A23B";
const RED = "C05746";
const GREEN = "2E8B57";
const LIGHT = "F5F8FA";
const CARD = "FFFFFF";
const INK = "1E293B";
const MUTED = "64748B";
const WHITE = "FFFFFF";
const LINE = "D9E2EA";

const HFONT = "Georgia";
const BFONT = "Calibri";

const ROOT = path.resolve(__dirname, "..");
const IMG = (rel) => path.join(ROOT, rel);

async function icon(IconComponent, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

async function main() {
  const spec = {
    target: FA.FaBullseye, flow: FA.FaProjectDiagram, layers: FA.FaLayerGroup,
    curve: FA.FaBezierCurve, wave: FA.FaWaveSquare, brain: FA.FaMagic,
    expand: FA.FaExpandAlt, scale: FA.FaBalanceScale, chart: FA.FaChartBar,
    warn: FA.FaExclamationTriangle, wrench: FA.FaTools, book: FA.FaBookOpen,
    flag: FA.FaFlagCheckered, camera: FA.FaVideo, cut: FA.FaCut,
    blur: FA.FaTint, check: FA.FaCheckCircle, arrow: FA.FaArrowRight,
    grid: FA.FaTh, network: FA.FaSitemap, minus: FA.FaBan,
    box: FA.FaVectorSquare, sync: FA.FaSyncAlt, repeat: FA.FaRedo,
    ruler: FA.FaRulerCombined, magic: FA.FaWandMagicSparkles || FA.FaMagic,
    adjust: FA.FaSlidersH, trophy: FA.FaTrophy, seedling: FA.FaSeedling,
    exchange: FA.FaExchangeAlt, search: FA.FaSearch, list: FA.FaListOl,
    times: FA.FaTimesCircle, bolt: FA.FaBolt,
  };
  const I = {}, Iteal = {};
  for (const [k, v] of Object.entries(spec)) { I[k] = await icon(v, "#FFFFFF", 256); Iteal[k] = await icon(v, "#1C7293", 256); }

  const p = new pptxgen();
  p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
  p.layout = "W";
  p.author = "Skripsi Broiler";
  p.title = "Rektifikasi Fisheye MOWA — Seluruh Percobaan";
  const W = 13.333, H = 7.5;
  const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.13 });

  // ---------- reusable pieces ----------
  const pageBg = (s) => { s.background = { color: LIGHT }; };
  function iconCircle(s, x, y, d, dataUrl, fill = TEAL) {
    s.addShape(p.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
    const pad = d * 0.24;
    s.addImage({ data: dataUrl, x: x + pad, y: y + pad, w: d - pad * 2, h: d - pad * 2 });
  }
  function header(s, iconUrl, kicker, title) {
    iconCircle(s, 0.6, 0.52, 0.72, iconUrl, TEAL);
    s.addText(kicker.toUpperCase(), { x: 1.5, y: 0.5, w: 10.5, h: 0.3, fontFace: BFONT, fontSize: 11.5, color: TEAL, bold: true, charSpacing: 3, margin: 0, align: "left" });
    s.addText(title, { x: 1.5, y: 0.78, w: 11.2, h: 0.7, fontFace: HFONT, fontSize: 27, color: NAVY, bold: true, margin: 0, align: "left" });
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.62, w: 12.13, h: 0.02, fill: { color: LINE }, line: { type: "none" } });
    s.addText("Skripsi — Generalisasi Estimasi Berat & Deteksi Anomali Broiler", { x: 0.6, y: 7.06, w: 9, h: 0.3, fontFace: BFONT, fontSize: 9, color: MUTED, margin: 0 });
  }
  function card(s, x, y, w, h, accent = TEAL) {
    s.addShape(p.shapes.RECTANGLE, { x, y, w, h, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.09, h, fill: { color: accent }, line: { type: "none" } });
  }
  let pageCounter = 0;
  const num = (s) => { pageCounter++; s.addText(String(pageCounter).padStart(2, "0"), { x: 12.4, y: 7.02, w: 0.5, h: 0.3, fontFace: BFONT, fontSize: 9.5, color: MUTED, align: "right", margin: 0 }); };

  // stat tile
  function stat(s, x, y, w, big, label, color = TEAL, sub) {
    s.addShape(p.shapes.RECTANGLE, { x, y, w, h: 1.5, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x, y, w, h: 0.1, fill: { color }, line: { type: "none" } });
    s.addText(big, { x, y: y + 0.2, w, h: 0.72, fontFace: HFONT, fontSize: 33, color, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(label, { x: x + 0.12, y: y + 0.94, w: w - 0.24, h: 0.42, fontFace: BFONT, fontSize: 11.5, color: INK, align: "center", margin: 0, lineSpacingMultiple: 0.95 });
    if (sub) s.addText(sub, { x, y: y + 1.28, w, h: 0.2, fontFace: BFONT, fontSize: 9, color: MUTED, align: "center", margin: 0 });
  }

  // figure card with caption. imgSrc: {path} or {data} accepted.
  function figure(s, x, y, w, h, imgSrc, caption, accent = TEAL) {
    s.addShape(p.shapes.RECTANGLE, { x, y, w, h, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
    const opt = { x: x + 0.1, y: y + 0.1, w: w - 0.2, h: h - 0.55, sizing: { type: "contain", w: w - 0.2, h: h - 0.55 } };
    if (typeof imgSrc === "string") opt.path = imgSrc; else if (imgSrc && imgSrc.data) opt.data = imgSrc.data; else if (imgSrc && imgSrc.path) opt.path = imgSrc.path;
    try { s.addImage(opt); } catch (e) {}
    s.addText(caption, { x: x + 0.15, y: y + h - 0.42, w: w - 0.3, h: 0.34, fontFace: BFONT, fontSize: 10.5, color: MUTED, align: "center", valign: "middle", margin: 0 });
  }

  // verdict chip
  function chip(s, x, y, text, color, textColor = WHITE) {
    const w = 0.35 + text.length * 0.088;
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.42, fill: { color }, line: { type: "none" }, rectRadius: 0.06 });
    s.addText(text, { x, y, w, h: 0.42, fontFace: BFONT, fontSize: 12, bold: true, color: textColor, align: "center", valign: "middle", margin: 0 });
    return w;
  }

  // crop the top header strip (which has a non-rendering glyph) off a figure, return dataURL
  async function cropTop(relPath, topFrac = 0.055) {
    const buf = await sharp(IMG(relPath)).metadata().then(async (m) => {
      const cutY = Math.round(m.height * topFrac);
      return sharp(IMG(relPath)).extract({ left: 0, top: cutY, width: m.width, height: m.height - cutY }).png().toBuffer();
    });
    return "image/png;base64," + buf.toString("base64");
  }
  const fumBboxCropped = await cropTop("reports/bbox_integrity_panels/chicken_detection_fum_grid.png", 0.05);

  // ===================================================================
  // 1. TITLE (dark)
  // ===================================================================
  {
    const s = p.addSlide();
    s.background = { color: NAVY };
    s.addShape(p.shapes.OVAL, { x: 9.7, y: -2.1, w: 6, h: 6, fill: { type: "none" }, line: { color: TEAL, width: 1.2, transparency: 55 } });
    s.addShape(p.shapes.OVAL, { x: 10.7, y: -1.1, w: 4, h: 4, fill: { type: "none" }, line: { color: TEAL2, width: 1.2, transparency: 45 } });
    s.addShape(p.shapes.OVAL, { x: 11.4, y: -0.4, w: 2.6, h: 2.6, fill: { type: "none" }, line: { color: AMBER, width: 1.4, transparency: 35 } });
    s.addText("BIMBINGAN — LAPORAN LENGKAP PERCOBAAN", { x: 0.9, y: 1.35, w: 10, h: 0.4, fontFace: BFONT, fontSize: 13, color: TEAL2, bold: true, charSpacing: 4, margin: 0 });
    s.addText("Rektifikasi Fisheye MOWA\nuntuk Deteksi Broiler", { x: 0.9, y: 1.85, w: 11, h: 1.9, fontFace: HFONT, fontSize: 42, color: WHITE, bold: true, lineSpacingMultiple: 1.02, margin: 0 });
    s.addText("Dari verifikasi integritas ground-truth bbox — hingga hasil akhir: apa yang mengalahkan baseline, apa yang tidak", { x: 0.9, y: 3.95, w: 10.2, h: 0.8, fontFace: BFONT, fontSize: 15.5, color: "C9D8E4", margin: 0, lineSpacingMultiple: 1.05 });
    const chips = ["YOLOv8m (PIO)", "MOWA — TPAMI 2025", "3 dataset", "7 varian"];
    let cx = 0.9;
    chips.forEach((c) => {
      const cw = 0.35 + c.length * 0.105;
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: cx, y: 5.15, w: cw, h: 0.5, fill: { color: NAVY2 }, line: { color: TEAL, width: 1 }, rectRadius: 0.08 });
      s.addText(c, { x: cx, y: 5.15, w: cw, h: 0.5, fontFace: BFONT, fontSize: 12, color: "DCE7F0", align: "center", valign: "middle", margin: 0 });
      cx += cw + 0.25;
    });
    s.addText("Program Skripsi  ·  2026", { x: 0.9, y: 6.5, w: 8, h: 0.3, fontFace: BFONT, fontSize: 11, color: MUTED, margin: 0 });
  }

  // ===================================================================
  // 2. RINGKASAN EKSEKUTIF (hasil di depan)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.flag, "Ringkasan Eksekutif", "Temuan Utama — Sekilas");
    stat(s, 0.6, 1.95, 2.9, "2", "varian MENGALAHKAN baseline", GREEN, "TTA & augmentasi radial");
    stat(s, 3.68, 1.95, 2.9, "4", "varian MOWA lebih buruk", RED, "rektifikasi menurunkan mAP");
    stat(s, 6.76, 1.95, 2.9, "22.6%", "bbox ter-crop oleh MOWA", AMBER, "113.784 kotak diperiksa");
    stat(s, 9.84, 1.95, 2.89, "~8%", "piksel hilang saat round-trip", TEAL, "rektifikasi tak-invertible");
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 3.75, w: 12.13, h: 1.05, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.08 });
    iconCircle(s, 0.95, 3.98, 0.6, I.trophy, AMBER);
    s.addText([
      { text: "Kesimpulan:  ", options: { bold: true, color: AMBER } },
      { text: "rektifikasi MOWA sebagai praproses ", options: { color: "C9D8E4" } },
      { text: "tidak mengungguli baseline", options: { bold: true, color: WHITE } },
      { text: " pada kamera berdistorsi ringan. Yang berhasil justru ", options: { color: "C9D8E4" } },
      { text: "mengadaptasi detektor", options: { bold: true, color: TEAL2 } },
      { text: " (augmentasi distorsi saat latih, atau TTA saat inferensi) — sejalan dengan WoodScape.", options: { color: "C9D8E4" } },
    ], { x: 1.75, y: 3.75, w: 10.8, h: 1.05, fontFace: BFONT, fontSize: 13, valign: "middle", margin: 0, lineSpacingMultiple: 1.02 });
    // journey teaser
    s.addText("Alur laporan ini", { x: 0.6, y: 5.05, w: 6, h: 0.35, fontFace: HFONT, fontSize: 15, color: NAVY, bold: true, margin: 0 });
    const journey = ["Cek integritas bbox", "MOWA bolak-balik (2 tafsir)", "Augmentasi lain", "Retrain adaptif", "Hasil & kesimpulan"];
    let jx = 0.6;
    journey.forEach((j, i) => {
      const jw = 0.3 + j.length * 0.093;
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: jx, y: 5.5, w: jw, h: 0.55, fill: { color: i < 2 ? TEAL : (i < 4 ? TEAL2 : AMBER) }, line: { type: "none" }, rectRadius: 0.07 });
      s.addText(`${i + 1}. ${j}`, { x: jx, y: 5.5, w: jw, h: 0.55, fontFace: BFONT, fontSize: 11, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
      jx += jw + 0.18;
      if (i < journey.length - 1) { s.addImage({ data: Iteal.arrow, x: jx - 0.15, y: 5.63, w: 0.3, h: 0.3 }); jx += 0.2; }
    });
    num(s);
  }

  // ===================================================================
  // 3. KONTEKS
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.target, "Konteks", "Latar & Titik Awal");
    const items = [
      [Iteal.camera, "Masalah generalisasi", "Detektor broiler dilatih pada dataset PIO. Kamera atas peternakan punya distorsi barrel/wide-angle — apakah akurasi bertahan lintas kamera/dataset?"],
      [Iteal.magic, "Rektifikasi terpelajar (MOWA)", "MOWA (TPAMI 2025) meluruskan distorsi tanpa kalibrasi kamera. Dipasang sebagai praproses di depan YOLOv8. Hasil awal A/B/B': belum mengalahkan baseline."],
      [Iteal.search, "Permintaan pembimbing", "(1) Pastikan dulu ground-truth bbox tak rusak setelah MOWA. (2) Coba MOWA “bolak-balik”. (3) Coba augmentasi lain. (4) Uji ulang di 3 dataset."],
    ];
    let y = 1.95;
    items.forEach(([ic, h, b]) => {
      card(s, 0.6, y, 12.13, 1.55, TEAL);
      iconCircle(s, 0.95, y + 0.45, 0.66, ic, LIGHT);
      s.addText(h, { x: 1.85, y: y + 0.22, w: 10.5, h: 0.4, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
      s.addText(b, { x: 1.85, y: y + 0.64, w: 10.6, h: 0.85, fontFace: BFONT, fontSize: 13.5, color: INK, margin: 0, lineSpacingMultiple: 1.03 });
      y += 1.72;
    });
    num(s);
  }

  // ===================================================================
  // 4. DATASET
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.grid, "Data Uji", "Tiga Dataset Evaluasi");
    const ds = [
      ["PIO val", "in-domain", "452", "gambar", "Kamera peternakan asli (barrel). Punya info umur → estimasi berat Cobb500.", TEAL],
      ["broiler_instance_seg", "eksternal", "200", "gambar", "Roboflow, broiler padat. Domain berbeda dari PIO.", TEAL2],
      ["chicken_detection_fum", "eksternal · padat", "326", "gambar", "Roboflow, sangat padat (88 bbox/gambar). Uji density & tepi.", AMBER],
    ];
    const cw = 3.95, gap = 0.14; let x = 0.6, y = 2.05;
    ds.forEach(([nm, tag, big, unit, desc, ac]) => {
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: 4.2, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: 0.12, fill: { color: ac }, line: { type: "none" } });
      s.addText(nm, { x: x + 0.28, y: y + 0.4, w: cw - 0.5, h: 0.5, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
      chip(s, x + 0.28, y + 1.0, tag, ac);
      s.addText(big, { x, y: y + 1.7, w: cw, h: 0.9, fontFace: HFONT, fontSize: 46, color: ac, bold: true, align: "center", margin: 0 });
      s.addText(unit, { x, y: y + 2.6, w: cw, h: 0.3, fontFace: BFONT, fontSize: 12, color: MUTED, align: "center", margin: 0 });
      s.addText(desc, { x: x + 0.28, y: y + 3.05, w: cw - 0.56, h: 1.0, fontFace: BFONT, fontSize: 12.5, color: INK, margin: 0, lineSpacingMultiple: 1.05 });
      x += cw + gap;
    });
    s.addText("Semua single-class (id 0). Metrik primer: mAP50-95. Model: YOLOv8m dilatih pada PIO (imgsz 960).", { x: 0.6, y: 6.5, w: 12.13, h: 0.35, fontFace: BFONT, fontSize: 12, italic: true, color: MUTED, margin: 0 });
    num(s);
  }

  // ===================================================================
  // 5. TASK 1 — INTEGRITAS BBOX (metode)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.box, "Percobaan 1 · Titik awal Anda", "Apakah Ground-Truth BBox Rusak Setelah MOWA?");
    card(s, 0.6, 1.95, 6.0, 4.75, TEAL);
    s.addText("Ide uji “kotak hitam”", { x: 0.95, y: 2.15, w: 5.4, h: 0.4, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
    const steps = [
      "Gambar tiap GT bbox sebagai KOTAK HITAM penuh di gambar asli.",
      "Jalankan rektifikasi MOWA pada gambar itu.",
      "Deteksi ulang wilayah hitam yang sudah ter-warp → bbox baru.",
      "Bandingkan: melebar? menyempit? terpotong keluar frame?",
    ];
    let y = 2.65;
    steps.forEach((t, i) => {
      s.addShape(p.shapes.OVAL, { x: 0.95, y: y + 0.02, w: 0.42, h: 0.42, fill: { color: TEAL2 }, line: { type: "none" } });
      s.addText(String(i + 1), { x: 0.95, y: y + 0.02, w: 0.42, h: 0.42, fontFace: HFONT, fontSize: 15, color: WHITE, bold: true, align: "center", valign: "middle", margin: 0 });
      s.addText(t, { x: 1.5, y: y - 0.05, w: 4.9, h: 0.6, fontFace: BFONT, fontSize: 13, color: INK, margin: 0, valign: "middle", lineSpacingMultiple: 1.0 });
      y += 0.66;
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 5.5, w: 5.35, h: 1.0, fill: { color: LIGHT }, line: { color: LINE, width: 1 }, rectRadius: 0.06 });
    s.addText([
      { text: "Mengapa penting:  ", options: { bold: true, color: TEAL } },
      { text: "kalau label rusak, penurunan mAP bisa jadi artefak label — bukan kesalahan model. Uji ini memastikan A/B adil.", options: { color: INK } },
    ], { x: 1.15, y: 5.5, w: 5.0, h: 1.0, fontFace: BFONT, fontSize: 12.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.03 });
    // right: figure
    figure(s, 6.85, 1.95, 5.88, 4.75, { data: fumBboxCropped }, "Panel FUM: asli+GT (hijau) | rectified+box warp (oranye) | mask hitam+box pulih (merah)", TEAL);
    num(s);
  }

  // ===================================================================
  // 6. TASK 1 — HASIL
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.warn, "Percobaan 1 · Hasil", "Ya — MOWA Merusak Geometri BBox");
    // big stats
    stat(s, 0.6, 1.95, 2.9, "35.4%", "kotak MELEBAR", AMBER);
    stat(s, 3.68, 1.95, 2.9, "22.6%", "kotak TER-CROP", RED);
    stat(s, 6.76, 1.95, 2.9, "20.1%", "kotak MENYEMPIT", AMBER);
    stat(s, 9.84, 1.95, 2.89, "5.8%", "kotak HILANG (keluar frame)", RED);
    // per-dataset table
    card(s, 0.6, 3.75, 7.4, 2.95, TEAL);
    s.addText("Per dataset (113.784 kotak)", { x: 0.9, y: 3.95, w: 6.8, h: 0.4, fontFace: HFONT, fontSize: 15, color: NAVY, bold: true, margin: 0 });
    const rows = [
      ["Dataset", "melebar", "ter-crop", "hilang"],
      ["PIO val", "43.6%", "20.5%", "7.7%"],
      ["broiler_instance_seg", "31.8%", "16.2%", "1.7%"],
      ["chicken_detection_fum", "30.8%", "31.1%", "2.7%"],
    ];
    let ty = 4.45;
    rows.forEach((r, ri) => {
      const cols = [0.95, 4.55, 5.85, 7.1]; const wds = [3.6, 1.3, 1.25, 0.85];
      r.forEach((c, ci) => {
        s.addText(c, { x: cols[ci], y: ty, w: wds[ci], h: 0.42, fontFace: BFONT, fontSize: ri === 0 ? 11.5 : 12.5, bold: ri === 0, color: ri === 0 ? MUTED : (ci === 0 ? NAVY : (ci === 2 ? RED : INK)), margin: 0, valign: "middle" });
      });
      if (ri === 0) s.addShape(p.shapes.RECTANGLE, { x: 0.95, y: ty + 0.4, w: 6.85, h: 0.015, fill: { color: LINE }, line: { type: "none" } });
      ty += ri === 0 ? 0.55 : 0.52;
    });
    // interpretation box
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 8.25, y: 3.75, w: 4.48, h: 2.95, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.08 });
    iconCircle(s, 8.55, 3.98, 0.6, I.bolt, AMBER);
    s.addText("Mengapa ini penting", { x: 9.3, y: 4.05, w: 3.2, h: 0.4, fontFace: HFONT, fontSize: 15, color: WHITE, bold: true, margin: 0 });
    s.addText([
      { text: "Kotak jadi melengkung/miring (fill-ratio turun ke ~0.85), dan ayam di tepi banyak yang terpotong. ", options: { color: "C9D8E4" } },
      { text: "Inilah sebab mAP50 relatif aman tetapi mAP50-95 (lokalisasi ketat) turun.", options: { bold: true, color: AMBER } },
    ], { x: 8.55, y: 4.55, w: 3.9, h: 2.0, fontFace: BFONT, fontSize: 13, valign: "top", margin: 0, lineSpacingMultiple: 1.06 });
    num(s);
  }

  // ===================================================================
  // 7. MOWA BOLAK-BALIK — DUA TAFSIR
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.sync, "Percobaan 2 · Klarifikasi", "“MOWA Bolak-Balik” — Dua Tafsir");
    // Left: iterative (wrong)
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.95, w: 5.95, h: 4.75, fill: { color: CARD }, line: { color: RED, width: 1.5 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x: 0.6, y: 1.95, w: 5.95, h: 0.12, fill: { color: RED }, line: { type: "none" } });
    chip(s, 0.9, 2.2, "Tafsir A — keliru", RED);
    s.addText("Rektifikasi berulang (iteratif)", { x: 0.9, y: 2.78, w: 5.4, h: 0.4, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, margin: 0 });
    s.addText("asli → rectify → rectify lagi → …", { x: 0.9, y: 3.2, w: 5.4, h: 0.35, fontFace: "Consolas", fontSize: 12.5, color: TEAL, margin: 0 });
    s.addText([
      { text: "Diuji: ", options: { color: INK } },
      { text: "2 pass. Perpindahan piksel TIDAK mengecil", options: { bold: true, color: RED } },
      { text: " (PIO 12,36 → 12,63 px) — MOWA men-distorsi ulang output-nya sendiri, tidak konvergen.", options: { color: INK } },
    ], { x: 0.9, y: 3.65, w: 5.4, h: 1.4, fontFace: BFONT, fontSize: 13, margin: 0, lineSpacingMultiple: 1.05 });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.9, y: 5.55, w: 5.35, h: 0.85, fill: { color: "FBEAE8" }, line: { type: "none" }, rectRadius: 0.06 });
    s.addText([{ text: "Hasil mAP: TERBURUK, ", options: { bold: true, color: RED } }, { text: "mean Δ −0.086 vs baseline.", options: { color: INK } }], { x: 1.1, y: 5.55, w: 5.0, h: 0.85, fontFace: BFONT, fontSize: 13, valign: "middle", margin: 0 });
    // Right: round-trip (correct)
    s.addShape(p.shapes.RECTANGLE, { x: 6.78, y: 1.95, w: 5.95, h: 4.75, fill: { color: CARD }, line: { color: GREEN, width: 1.5 }, shadow: shadow() });
    s.addShape(p.shapes.RECTANGLE, { x: 6.78, y: 1.95, w: 5.95, h: 0.12, fill: { color: GREEN }, line: { type: "none" } });
    chip(s, 7.08, 2.2, "Tafsir B — yang Anda maksud", GREEN);
    s.addText("Forward → inverse (round-trip)", { x: 7.08, y: 2.78, w: 5.4, h: 0.4, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, margin: 0 });
    s.addText("asli → rectify → balik (un-rectify) → asli'", { x: 7.08, y: 3.2, w: 5.5, h: 0.35, fontFace: "Consolas", fontSize: 12, color: TEAL, margin: 0 });
    s.addText([
      { text: "Rektifikasi lalu ", options: { color: INK } },
      { text: "dibalik", options: { bold: true, color: GREEN } },
      { text: " ke bentuk terdistorsi semula, lalu ukur selisih |asli′ − asli|. Nama baku: ", options: { color: INK } },
      { text: "inverse/backward warping", options: { bold: true, color: TEAL } },
      { text: " + round-trip / cycle-consistency error.", options: { color: INK } },
    ], { x: 7.08, y: 3.65, w: 5.4, h: 1.5, fontFace: BFONT, fontSize: 13, margin: 0, lineSpacingMultiple: 1.05 });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 7.08, y: 5.55, w: 5.35, h: 0.85, fill: { color: "E8F3EC" }, line: { type: "none" }, rectRadius: 0.06 });
    s.addText([{ text: "Guna: ", options: { bold: true, color: GREEN } }, { text: "ukur seberapa lossless warp MOWA (metrik diagnostik).", options: { color: INK } }], { x: 7.28, y: 5.55, w: 5.0, h: 0.85, fontFace: BFONT, fontSize: 12.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.02 });
    num(s);
  }

  // ===================================================================
  // 8. ROUND-TRIP — KONSEP & HASIL
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.exchange, "Percobaan 2 · Round-trip", "Seberapa Lossless Rektifikasi MOWA?");
    // flow diagram
    const boxes = [["X", "asli\n(terdistorsi)", TEAL], ["Y", "rectified\n(lurus)", TEAL2], ["X′", "dibalik\n(terdistorsi)", AMBER]];
    let bx = 1.3; const by = 2.15, bw = 2.5, bh = 1.25;
    boxes.forEach(([t, sub, ac], i) => {
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: bx, y: by, w: bw, h: bh, fill: { color: ac }, line: { type: "none" }, rectRadius: 0.08, shadow: shadow() });
      s.addText(t, { x: bx, y: by + 0.12, w: bw, h: 0.6, fontFace: HFONT, fontSize: 30, color: WHITE, bold: true, align: "center", margin: 0 });
      s.addText(sub, { x: bx, y: by + 0.72, w: bw, h: 0.5, fontFace: BFONT, fontSize: 11.5, color: "F0F6FA", align: "center", margin: 0, lineSpacingMultiple: 0.9 });
      if (i < 2) {
        s.addText(i === 0 ? "MOWA" : "inverse warp", { x: bx + bw + 0.02, y: by + 0.15, w: 1.55, h: 0.3, fontFace: BFONT, fontSize: 10.5, bold: true, color: NAVY, align: "center", margin: 0 });
        s.addImage({ data: Iteal.arrow, x: bx + bw + 0.55, y: by + 0.48, w: 0.45, h: 0.45 });
      }
      bx += bw + 1.6;
    });
    s.addText("Kalau X′ = X sempurna → warp lossless/invertible. Selisih & lubang = ukuran kerugian informasi.", { x: 1.3, y: 3.55, w: 10.7, h: 0.35, fontFace: BFONT, fontSize: 12.5, italic: true, color: MUTED, margin: 0 });
    // results
    stat(s, 0.6, 4.1, 2.9, "7.95%", "hole-rate (piksel tak pulih)", RED, "rata-rata 978 gambar");
    stat(s, 3.68, 4.1, 2.9, "27.7 dB", "PSNR rekonstruksi", AMBER, "makin rendah = makin rusak");
    stat(s, 6.76, 4.1, 2.9, "6.36", "MAE rekonstruksi (0–255)", AMBER, "X′ berbeda dari X");
    // takeaway
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 9.84, y: 4.1, w: 2.89, h: 1.5, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.08 });
    s.addText([{ text: "MOWA tidak invertible.\n", options: { bold: true, color: AMBER } }, { text: "~8% info hilang → bukti kuantitatif mengapa rektifikasi merusak deteksi.", options: { color: "C9D8E4" } }], { x: 10.04, y: 4.25, w: 2.5, h: 1.25, fontFace: BFONT, fontSize: 11.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.03 });
    s.addText("Metode: inverse dibangun numerik dari flow prediksi MOWA (fixed-point, Sánchez dkk. 2015). MOWA forward-only, tanpa invers bawaan.", { x: 0.6, y: 5.75, w: 12.13, h: 0.6, fontFace: BFONT, fontSize: 11.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.02 });
    num(s);
  }

  // ===================================================================
  // 9. AUGMENTASI LAIN — PETA
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.layers, "Percobaan 3", "Augmentasi & Pelurusan Lain yang Dicoba");
    const items = [
      [Iteal.adjust, "CLAHE + unsharp", "Praproses", "Tingkatkan kontras + tajamkan (lawan blur MOWA). Murah, tanpa GPU.", RED, "gagal −"],
      [Iteal.ruler, "Metrik kelurusan (LSD)", "Diagnostik", "Ukur residual kelurusan garis. Bukan perbaikan — alat validasi.", TEAL, "netral"],
      [Iteal.bolt, "TTA (multi-scale+flip)", "Saat inferensi", "Gabung prediksi multi-skala + flip. Tanpa retrain.", GREEN, "MENANG +"],
      [Iteal.seedling, "Augmentasi radial + retrain", "Saat latih", "Latih detektor dgn distorsi radial acak → tahan-distorsi.", GREEN, "MENANG +"],
    ];
    const cw = 5.95, chh = 2.15, gapx = 0.23, gapy = 0.25; let idx = 0;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
      const x = 0.6 + c * (cw + gapx), y = 1.95 + r * (chh + gapy);
      const [ic, h, tag, b, ac, verd] = items[idx++];
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: chh, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
      s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.1, h: chh, fill: { color: ac }, line: { type: "none" } });
      iconCircle(s, x + 0.32, y + 0.3, 0.72, ic, ac);
      // verdict chip pinned top-right; title gets the full remaining width to its left
      const chipText = verd, chipW = 0.35 + chipText.length * 0.088;
      chip(s, x + cw - chipW - 0.22, y + 0.3, chipText, ac);
      s.addText(h, { x: x + 1.25, y: y + 0.28, w: cw - 1.35 - chipW - 0.35, h: 0.5, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, valign: "middle", margin: 0 });
      s.addText(tag, { x: x + 1.25, y: y + 0.82, w: cw - 1.5, h: 0.3, fontFace: BFONT, fontSize: 11, bold: true, color: MUTED, margin: 0 });
      s.addText(b, { x: x + 1.25, y: y + 1.16, w: cw - 1.5, h: 0.85, fontFace: BFONT, fontSize: 12.5, color: INK, margin: 0, lineSpacingMultiple: 1.03 });
    }
    num(s);
  }

  // ===================================================================
  // 10. KELURUSAN + ENHANCE (bukti singkat)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.ruler, "Percobaan 3 · Bukti", "MOWA Meluruskan — Tapi Tak Berbuah Akurasi");
    // straightness card
    card(s, 0.6, 1.95, 6.0, 4.75, TEAL2);
    s.addText("Metrik kelurusan garis (LSD)", { x: 0.95, y: 2.15, w: 5.4, h: 0.4, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, margin: 0 });
    s.addText("Δ residual kelurusan (rectified − asli). Nilai NEGATIF = lebih lurus.", { x: 0.95, y: 2.58, w: 5.4, h: 0.5, fontFace: BFONT, fontSize: 12.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.02 });
    const sr = [["PIO val", "−1.68", 1.0], ["broiler_instance_seg", "−0.52", 0.31], ["chicken_detection_fum", "−0.23", 0.14]];
    let sy = 3.25;
    sr.forEach(([nm, val, frac]) => {
      s.addText(nm, { x: 0.95, y: sy, w: 3.0, h: 0.4, fontFace: BFONT, fontSize: 12.5, color: NAVY, margin: 0, valign: "middle" });
      const barMax = 2.0, bx0 = 4.1, bw0 = frac * barMax;
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: bx0, y: sy + 0.06, w: bw0, h: 0.3, fill: { color: TEAL2 }, line: { type: "none" }, rectRadius: 0.03 });
      s.addText(val, { x: bx0 + bw0 + 0.1, y: sy, w: 0.9, h: 0.4, fontFace: BFONT, fontSize: 12.5, bold: true, color: TEAL2, margin: 0, valign: "middle" });
      sy += 0.62;
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 5.25, w: 5.35, h: 1.2, fill: { color: LIGHT }, line: { color: LINE, width: 1 }, rectRadius: 0.06 });
    s.addText([{ text: "Jadi MOWA memang benar secara geometris ", options: { color: INK } }, { text: "(meluruskan garis, terkuat di PIO)", options: { bold: true, color: TEAL2 } }, { text: " — tetapi keuntungan geometris ini tidak berubah menjadi kenaikan mAP.", options: { color: INK } }], { x: 1.15, y: 5.25, w: 5.0, h: 1.2, fontFace: BFONT, fontSize: 12.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
    // diff heatmap figure
    figure(s, 6.85, 1.95, 5.88, 4.75, IMG("reports/mowa_diff_heatmap/pio_val_diff_heatmap.png"), "Heatmap: seberapa besar MOWA menggeser piksel (asli | rectified | selisih)", TEAL2);
    num(s);
  }

  // ===================================================================
  // 11. RETRAIN ADAPTIF — augmentasi radial
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.seedling, "Percobaan 4 · Retrain", "Adaptasi Detektor: Augmentasi Distorsi Radial");
    card(s, 0.6, 1.95, 6.1, 4.75, GREEN);
    s.addText("Hipotesis WoodScape", { x: 0.95, y: 2.15, w: 5.5, h: 0.4, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, margin: 0 });
    s.addText([
      { text: "Alih-alih ", options: { color: INK } },
      { text: "meluruskan gambar", options: { bold: true, color: RED } },
      { text: " saat inferensi (MOWA), ", options: { color: INK } },
      { text: "adaptasi detektor", options: { bold: true, color: GREEN } },
      { text: " agar tahan-distorsi: latih dengan distorsi radial (barrel/pincushion) ACAK + bbox ikut di-warp.", options: { color: INK } },
    ], { x: 0.95, y: 2.6, w: 5.5, h: 1.3, fontFace: BFONT, fontSize: 13.5, margin: 0, lineSpacingMultiple: 1.06 });
    const facts = [
      ["1.035 gambar", "train PIO diaugmentasi (1 salinan acak)"],
      ["40 epoch", "fine-tune YOLOv8m (best: epoch 29)"],
      ["val = gambar ASLI", "poin uji: robustness tanpa rektifikasi"],
    ];
    let fy = 4.05;
    facts.forEach(([a, b]) => {
      s.addShape(p.shapes.OVAL, { x: 0.95, y: fy + 0.05, w: 0.34, h: 0.34, fill: { color: GREEN }, line: { type: "none" } });
      s.addImage({ data: I.check, x: 1.02, y: fy + 0.12, w: 0.2, h: 0.2 });
      s.addText([{ text: a + "  ", options: { bold: true, color: NAVY } }, { text: b, options: { color: INK } }], { x: 1.42, y: fy, w: 5.0, h: 0.45, fontFace: BFONT, fontSize: 13, margin: 0, valign: "middle" });
      fy += 0.6;
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.95, y: 5.95, w: 5.5, h: 0.6, fill: { color: "E8F3EC" }, line: { type: "none" }, rectRadius: 0.06 });
    s.addText([{ text: "Catatan teknis: ", options: { bold: true, color: GREEN } }, { text: "dataloader Windows perlu guard __main__ (spawn); dijalankan detached, tahan interupsi.", options: { color: INK } }], { x: 1.15, y: 5.95, w: 5.15, h: 0.6, fontFace: BFONT, fontSize: 11, valign: "middle", margin: 0, lineSpacingMultiple: 1.0 });
    // right: result stats
    s.addText("Hasil vs baseline (mAP50-95)", { x: 7.0, y: 2.1, w: 5.5, h: 0.4, fontFace: HFONT, fontSize: 16, color: NAVY, bold: true, margin: 0 });
    const res = [["broiler_instance_seg", "0,536", "0,608", "+0,072", GREEN], ["chicken_detection_fum", "0,058", "0,065", "+0,007", GREEN], ["PIO val", "0,710", "0,704", "−0,006", MUTED]];
    let ry = 2.7;
    res.forEach(([nm, base, rad, d, ac]) => {
      s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: ry, w: 5.7, h: 0.95, fill: { color: CARD }, line: { color: LINE, width: 1 }, shadow: shadow() });
      s.addShape(p.shapes.RECTANGLE, { x: 7.0, y: ry, w: 0.09, h: 0.95, fill: { color: ac }, line: { type: "none" } });
      s.addText(nm, { x: 7.25, y: ry + 0.12, w: 3.0, h: 0.4, fontFace: BFONT, fontSize: 13, bold: true, color: NAVY, margin: 0 });
      s.addText(`baseline ${base}  →  radial ${rad}`, { x: 7.25, y: ry + 0.52, w: 3.6, h: 0.35, fontFace: BFONT, fontSize: 11.5, color: MUTED, margin: 0 });
      s.addText(d, { x: 10.9, y: ry + 0.1, w: 1.7, h: 0.75, fontFace: HFONT, fontSize: 24, bold: true, color: ac, align: "center", valign: "middle", margin: 0 });
      ry += 1.07;
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 6.0, w: 5.7, h: 0.55, fill: { color: GREEN }, line: { type: "none" }, rectRadius: 0.07 });
    s.addText([{ text: "mean Δ +0,024  →  ", options: { bold: true, color: WHITE } }, { text: "MENGALAHKAN baseline", options: { bold: true, color: WHITE } }], { x: 7.0, y: 6.0, w: 5.7, h: 0.55, fontFace: BFONT, fontSize: 14, align: "center", valign: "middle", margin: 0 });
    num(s);
  }

  // ===================================================================
  // 12. TABEL MASTER — 7 VARIAN
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.chart, "Hasil Akhir", "Tabel Master — 7 Varian di 3 Dataset");
    // header row
    const cols = [0.75, 6.5, 7.9, 9.3, 10.75]; const cw = [5.6, 1.3, 1.3, 1.35, 2.3];
    const chd = ["Varian", "PIO", "broiler", "fum", "mean Δ"];
    let hy = 1.9;
    chd.forEach((c, i) => s.addText(c, { x: cols[i], y: hy, w: cw[i], h: 0.4, fontFace: BFONT, fontSize: 12, bold: true, color: MUTED, margin: 0 }));
    s.addShape(p.shapes.RECTANGLE, { x: 0.75, y: hy + 0.42, w: 11.9, h: 0.02, fill: { color: LINE }, line: { type: "none" } });
    const data = [
      ["Baseline (gambar asli)", "0,710", "0,536", "0,058", "acuan", MUTED, "base"],
      ["TTA (multi-scale + flip)", "0,708", "0,641", "0,060", "+0,035", GREEN, "better"],
      ["Augmentasi radial + retrain", "0,704", "0,608", "0,065", "+0,024", GREEN, "better"],
      ["MOWA + fine-tune (rectify-both)", "0,683", "0,530", "0,058", "−0,011", RED, "worse"],
      ["MOWA 1-pass", "0,638", "0,457", "0,049", "−0,053", RED, "worse"],
      ["MOWA + CLAHE+unsharp", "0,627", "0,418", "0,048", "−0,070", RED, "worse"],
      ["MOWA iteratif (2-pass)", "0,602", "0,398", "0,046", "−0,086", RED, "worse"],
    ];
    let ry = 2.42; const rh = 0.62;
    data.forEach(([nm, a, b, c, d, ac, kind]) => {
      if (kind === "better") s.addShape(p.shapes.RECTANGLE, { x: 0.75, y: ry - 0.03, w: 11.9, h: rh - 0.04, fill: { color: "EAF5EE" }, line: { type: "none" } });
      if (kind === "base") s.addShape(p.shapes.RECTANGLE, { x: 0.75, y: ry - 0.03, w: 11.9, h: rh - 0.04, fill: { color: "EEF2F6" }, line: { type: "none" } });
      s.addShape(p.shapes.RECTANGLE, { x: 0.75, y: ry - 0.03, w: 0.07, h: rh - 0.04, fill: { color: ac }, line: { type: "none" } });
      s.addText(nm, { x: 0.95, y: ry, w: 5.5, h: 0.5, fontFace: BFONT, fontSize: 13, bold: kind !== "worse", color: NAVY, margin: 0, valign: "middle" });
      [[a, 6.5], [b, 7.9], [c, 9.3]].forEach(([v, xx]) => s.addText(v, { x: xx, y: ry, w: 1.3, h: 0.5, fontFace: BFONT, fontSize: 12.5, color: INK, margin: 0, valign: "middle" }));
      s.addText(d, { x: 10.75, y: ry, w: 1.9, h: 0.5, fontFace: HFONT, fontSize: 16, bold: true, color: ac, margin: 0, valign: "middle" });
      ry += rh;
    });
    s.addText("Diurut dari terbaik. Hijau = mengalahkan baseline. Metrik: mAP50-95, dead-band verdict ±0,005.", { x: 6.4, y: 7.06, w: 6.0, h: 0.3, fontFace: BFONT, fontSize: 9.5, italic: true, color: MUTED, align: "right", margin: 0 });
    num(s);
  }

  // ===================================================================
  // 13. VISUAL A/B/B'
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.grid, "Bukti Visual", "Deteksi A / B / B' — Contoh per Dataset");
    figure(s, 0.6, 1.95, 6.0, 4.75, IMG("reports/condition_panels/broiler_instance_seg_summary_grid.png"), "broiler_instance_seg — grid A (asli) | B (MOWA) | B' (fine-tune)", TEAL);
    figure(s, 6.85, 1.95, 5.88, 4.75, IMG("reports/mowa_before_after/chicken_detection_fum_before_after.png"), "FUM — sebelum vs sesudah MOWA (grid biru bantu lihat pelurusan)", AMBER);
    num(s);
  }

  // ===================================================================
  // 14. GRAFIK PERBANDINGAN (diverging bars, digambar)
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.chart, "Hasil Akhir · Visual", "Rata-rata Δ mAP50-95 vs Baseline");
    const V = [
      ["TTA (multi-scale+flip)", 0.035, GREEN],
      ["Augmentasi radial + retrain", 0.024, GREEN],
      ["Baseline", 0.0, MUTED],
      ["MOWA + fine-tune", -0.011, RED],
      ["MOWA 1-pass", -0.053, RED],
      ["MOWA + CLAHE+unsharp", -0.070, RED],
      ["MOWA iteratif 2-pass", -0.086, RED],
    ];
    // Layout: name column x[0.5..4.6], then a label gutter, then the plot with zero line at 7.2.
    // Scale chosen so the longest bar (0.086) never reaches back into the name column.
    const nameW = 4.1, zeroX = 7.2, scale = 26, y0 = 2.1, rh = 0.62, barH = 0.34;
    s.addShape(p.shapes.RECTANGLE, { x: zeroX, y: y0 - 0.05, w: 0.02, h: V.length * rh + 0.1, fill: { color: NAVY }, line: { type: "none" } });
    s.addText("baseline (0)", { x: zeroX - 0.6, y: y0 + V.length * rh + 0.05, w: 1.2, h: 0.25, fontFace: BFONT, fontSize: 9.5, color: MUTED, align: "center", margin: 0 });
    s.addText("← lebih buruk", { x: 5.2, y: y0 + V.length * rh + 0.05, w: 1.8, h: 0.25, fontFace: BFONT, fontSize: 10, color: RED, align: "right", margin: 0 });
    s.addText("lebih baik →", { x: 9.6, y: y0 + V.length * rh + 0.05, w: 2, h: 0.25, fontFace: BFONT, fontSize: 10, color: GREEN, align: "right", margin: 0 });
    V.forEach(([nm, d, ac], i) => {
      const y = y0 + i * rh;
      s.addText(nm, { x: 0.5, y, w: nameW, h: barH + 0.08, fontFace: BFONT, fontSize: 12.5, bold: d > 0, color: NAVY, align: "right", valign: "middle", margin: 0 });
      if (Math.abs(d) < 0.001) { s.addText("0,000", { x: zeroX + 0.12, y, w: 1.2, h: barH + 0.08, fontFace: BFONT, fontSize: 11, color: MUTED, valign: "middle", margin: 0 }); return; }
      const wInch = Math.abs(d) * scale; // 0.086 -> 2.24" (bar starts at x≈4.96, clear of names)
      const bx = d > 0 ? zeroX : zeroX - wInch;
      s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: bx, y: y + 0.05, w: wInch, h: barH, fill: { color: ac }, line: { type: "none" }, rectRadius: 0.03 });
      const lbl = (d > 0 ? "+" : "−") + Math.abs(d).toFixed(3).replace(".", ",");
      if (d > 0) {
        s.addText(lbl, { x: bx + wInch + 0.12, y, w: 1.0, h: barH + 0.08, fontFace: BFONT, fontSize: 12, bold: true, color: ac, valign: "middle", margin: 0 });
      } else if (wInch >= 1.0) {
        // long negative bar: label INSIDE the bar (white), left-aligned — never touches names
        s.addText(lbl, { x: bx + 0.12, y, w: wInch - 0.2, h: barH + 0.08, fontFace: BFONT, fontSize: 12, bold: true, color: WHITE, align: "left", valign: "middle", margin: 0 });
      } else {
        // only the tiny −0,011 bar: label just left of it (still well clear of name column at x≈4.6)
        s.addText(lbl, { x: bx - 1.02, y, w: 0.92, h: barH + 0.08, fontFace: BFONT, fontSize: 12, bold: true, color: ac, align: "right", valign: "middle", margin: 0 });
      }
    });
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 6.35, w: 12.13, h: 0.7, fill: { color: NAVY }, line: { type: "none" }, rectRadius: 0.07 });
    s.addText([{ text: "Dua batang hijau di atas ", options: { color: "C9D8E4" } }, { text: "(TTA, augmentasi radial)", options: { bold: true, color: TEAL2 } }, { text: " keduanya TANPA rektifikasi MOWA. Semua varian MOWA (merah) kalah.", options: { color: "C9D8E4" } }], { x: 0.9, y: 6.35, w: 11.5, h: 0.7, fontFace: BFONT, fontSize: 13, valign: "middle", margin: 0 });
    num(s);
  }

  // ===================================================================
  // 15. KESIMPULAN
  // ===================================================================
  {
    const s = p.addSlide();
    s.background = { color: NAVY };
    s.addShape(p.shapes.OVAL, { x: 10.3, y: -1.8, w: 5, h: 5, fill: { type: "none" }, line: { color: TEAL, width: 1.2, transparency: 60 } });
    iconCircle(s, 0.9, 0.75, 0.8, I.flag, AMBER);
    s.addText("KESIMPULAN", { x: 1.95, y: 0.75, w: 8, h: 0.4, fontFace: BFONT, fontSize: 13, color: TEAL2, bold: true, charSpacing: 3, margin: 0 });
    s.addText("Rektifikasi Kalah, Adaptasi Menang", { x: 1.95, y: 1.1, w: 10.5, h: 0.7, fontFace: HFONT, fontSize: 30, color: WHITE, bold: true, margin: 0 });
    const pts = [
      ["Rektifikasi MOWA tidak mengungguli baseline", "Keempat varian berbasis MOWA negatif (−0,011 s/d −0,086). Iteratif paling buruk."],
      ["Diperkuat 4 bukti mekanistik", "BBox rusak (crop 22,6%), round-trip tak-invertible (~8% info hilang), iteratif tak konvergen, kelurusan naik tapi tak berbuah akurasi."],
      ["Dua pendekatan MENGALAHKAN baseline", "TTA (+0,035) dan augmentasi radial + retrain (+0,024) — keduanya mengadaptasi detektor, bukan meluruskan gambar."],
      ["Sejalan dengan literatur (WoodScape)", "Untuk kamera berdistorsi ringan: adaptasi model > undistortion. Hasil negatif MOWA adalah temuan yang VALID untuk skripsi."],
    ];
    let y = 2.15;
    pts.forEach(([h, b], i) => {
      s.addShape(p.shapes.OVAL, { x: 1.0, y: y + 0.03, w: 0.5, h: 0.5, fill: { color: i < 2 ? AMBER : TEAL2 }, line: { type: "none" } });
      s.addText(String(i + 1), { x: 1.0, y: y + 0.03, w: 0.5, h: 0.5, fontFace: HFONT, fontSize: 17, color: NAVY, bold: true, align: "center", valign: "middle", margin: 0 });
      s.addText(h, { x: 1.75, y: y - 0.02, w: 10.8, h: 0.4, fontFace: HFONT, fontSize: 18, color: WHITE, bold: true, margin: 0 });
      s.addText(b, { x: 1.75, y: y + 0.4, w: 10.9, h: 0.62, fontFace: BFONT, fontSize: 13, color: "C9D8E4", margin: 0, lineSpacingMultiple: 1.03 });
      y += 1.16;
    });
    num(s);
  }

  // ===================================================================
  // 16. REFERENSI
  // ===================================================================
  {
    const s = p.addSlide(); pageBg(s);
    header(s, I.book, "Referensi", "Paper & Standar (PDF di folder papers/)");
    const refs = [
      ["MOWA — Multiple-in-One Image Warping", "Liao dkk., IEEE TPAMI 2025", "arXiv:2404.10716"],
      ["CycleMorph — Cycle-Consistent Registration", "Kim dkk., Medical Image Analysis 2021", "arXiv:2008.05772"],
      ["Warp Consistency (dense correspondence)", "Truong dkk., ICCV 2021 Oral", "arXiv:2104.03308"],
      ["Computing Inverse Optical Flow", "Sánchez dkk., Pattern Recog. Letters 2015", "(berbayar / ScienceDirect)"],
      ["ESIR — Iterative Image Rectification", "Zhan & Lu, CVPR 2019", "arXiv:1812.05824"],
      ["DocScanner — Progressive Rectification", "Feng dkk., IJCV 2025", "arXiv:2110.14968"],
      ["RAFT — Recurrent Refinement (optical flow)", "Teed & Deng, ECCV 2020", "arXiv:2003.12039"],
      ["WoodScape — Fisheye Multi-task Dataset", "Yogamani dkk., ICCV 2019", "arXiv:1905.01489"],
      ["Xue — Calibrate Straight Lines (fisheye)", "Xue dkk., CVPR 2019", "arXiv:1904.09856"],
      ["FisheyeDetNet / FisheyeYOLO", "Sistu/Rashed dkk., 2021–24", "arXiv:2404.13443 / 2012.02124"],
      ["Edge-case Synthesis (fisheye detection)", "2025", "arXiv:2507.16254"],
      ["Cobb500 Broiler Performance Supplement", "Cobb-Vantress, 2022", "standar berat"],
    ];
    const cw = 5.95, rh = 0.72, gapx = 0.23; let idx = 0;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) {
      if (idx >= refs.length) break;
      const x = 0.6 + c * (cw + gapx), y = 1.9 + r * (rh + 0.06);
      const [t, a, id] = refs[idx++];
      s.addShape(p.shapes.RECTANGLE, { x, y, w: cw, h: rh, fill: { color: CARD }, line: { color: LINE, width: 1 } });
      s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.07, h: rh, fill: { color: TEAL }, line: { type: "none" } });
      s.addText(t, { x: x + 0.2, y: y + 0.06, w: cw - 0.35, h: 0.34, fontFace: BFONT, fontSize: 12, bold: true, color: NAVY, margin: 0 });
      s.addText([{ text: a + "  ", options: { color: MUTED } }, { text: id, options: { color: TEAL, italic: true } }], { x: x + 0.2, y: y + 0.38, w: cw - 0.35, h: 0.3, fontFace: BFONT, fontSize: 10, margin: 0 });
    }
    num(s);
  }

  const out = path.join(__dirname, "MOWA_Percobaan_Lengkap.pptx");
  await p.writeFile({ fileName: out });
  console.log("WROTE", out);
}

main().catch((e) => { console.error(e); process.exit(1); });
