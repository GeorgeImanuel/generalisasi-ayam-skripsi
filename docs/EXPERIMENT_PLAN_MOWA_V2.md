# Rencana Eksperimen MOWA V2 — Rectifikasi Fisheye untuk Deteksi Broiler

Tanggal: 2026-07-05
Status: rencana metodologi + terminologi riset + sitasi (Task 4 orchestrator: `src/run_experiments_campaign.py`)

Dokumen ini merangkum metodologi eksperimen lanjutan setelah hasil negatif MOWA A/B/B',
mendefinisikan terminologi riset yang benar (iterative / recursive rectification),
serta menetapkan tabel varian yang di-retest pada 3 dataset. Kode agregasi tabel master
ada di `src/run_experiments_campaign.py`; dokumen ini menjadi rujukan metodologisnya.

---

## Latar belakang — hasil negatif MOWA

MOWA (Multiple-in-One Image Warping, arXiv:2404.10716, TPAMI 2025) dipakai untuk
me-rektifikasi distorsi fisheye kandang sebelum deteksi YOLOv8m. Hasil A/B/B':

| Kondisi | Deskripsi | mean Δ mAP50-95 vs baseline |
|---|---|---|
| A (baseline) | Gambar asli, bobot baseline | 0 (acuan) |
| B (MOWA raw) | Gambar MOWA 1 pass, bobot baseline | **−0.053** |
| B' (rectify-both FT) | Gambar MOWA 1 pass, bobot fine-tune-on-rectified | **−0.011** |

Kesimpulan sementara: rektifikasi MOWA apa adanya **memperburuk** deteksi (−0.053).
Fine-tune ulang detektor pada citra rectified (rectify-both) memulihkan sebagian besar
kerugian (−0.011, mendekati netral) tetapi belum memberi keuntungan bersih. Ini memicu
empat tugas lanjutan (Task 1–4) untuk memahami *mengapa* dan menguji mitigasi.

Prinsip pemandu: **ukur sesuatu yang bisa gagal.** Setiap varian dinilai dengan metrik
primer yang objektif (mAP50-95) memakai dead-band 0.005 supaya perbedaan kecil tidak
dilebih-lebihkan.

---

## Task 1 — Verifikasi integritas bounding box ("kotak hitam")

**Motivasi.** Sebelum menyimpulkan MOWA buruk, pastikan penurunan mAP bukan artefak
label yang rusak saat warp. Warp MOWA memindahkan piksel; label bbox harus ikut ter-warp
dengan benar. Risiko: bbox **melebar** (over-warp di tepi), **menyempit**, atau
**terpotong** keluar bingkai (burung di pinggir hilang). Verifikasi visual + kuantitatif
memastikan integritas geometri kotak.

**Yang diukur.**
- Rasio luas bbox sebelum vs sesudah warp (deteksi pelebaran/penyempitan sistematis).
- Fraksi bbox yang ter-clip / keluar bingkai setelah rektifikasi.
- Panel visual "kotak hitam": overlay bbox pra/pasca-warp untuk sampel padat.

**Skrip.** `verify_bbox_integrity.py` (metrik agregat), `bbox_integrity_panels.py`
(panel overlay visual).

**Dataset uji.** FUM dense (`chicken_detection_fum`, kepadatan tinggi — paling rawan
clip/merge), `broiler_instance_seg`, dan `pio_val` (in-domain sebagai kontrol).

---

## Task 2 — MOWA bolak-balik = iterative / recursive rectification

**Terminologi riset.** Menjalankan MOWA berulang pada keluarannya sendiri adalah bentuk
**iterative / recursive rectification** — dalam literatur disebut *test-time iterative
refinement*. Ini sejalan dengan keluarga metode:
- **ESIR** (CVPR 2019, arXiv:1812.05824) — *iterative* rectification via estimasi ulang
  parameter distorsi bertahap.
- **DocScanner** (IJCV 2025, arXiv:2110.14968) — *progressive learning*: memperbaiki
  medan/estimasi secara bertahap hingga konvergen.
- **RAFT** (ECCV 2020, arXiv:2003.12039) — refinement iteratif pada *flow field*
  (bukan pada citra yang sudah dirender).

**Caveat kritis (jangan naif).** Metode iteratif yang benar me-refine sebuah
**flow field / medan perpindahan**, lalu me-*resample citra ASLI satu kali* pada akhir.
Me-*re-feed* keluaran MOWA yang **sudah dirender** kembali ke MOWA berisiko:
1. **Compounding interpolation blur** — tiap resample menambah blur bilinear/bicubic.
2. **Kehilangan konten tepi** — burung di pinggir bisa ter-crop progresif tiap pass.
3. **Over-correction** — MOWA dilatih pada input *terdistorsi tunggal*; input yang sudah
   diluruskan berada di luar distribusi latih, sehingga pass ke-2+ bisa merusak geometri.

**Ekspektasi & pengukuran.** Diperkirakan **≤2 pass** yang berguna. Konvergensi diukur
lewat:
- Rata-rata perpindahan piksel antar pass (turun → konvergen).
- Metrik kelurusan garis (line-straightness, lihat Task 3b).
- mAP pada 3 dataset (sinyal akhir yang menentukan).

**Skrip.** `mowa_rectify_iterative.py`. Keluaran pass ke-2 disimpan ke
`data/rectified_iter2/<dataset>/{images,labels}` untuk dinilai varian `mowa_iter2`.

---

## Task 3 — Augmentasi & mitigasi lain

Empat arah untuk menetralkan efek samping MOWA atau menyerang masalah dari sisi detektor:

**(a) CLAHE + unsharp masking** — `enhance_preprocess.py`.
Melawan blur akibat resample MOWA dengan penajaman lokal + kontras adaptif. Referensi:
CLAHE+YOLO untuk objek kecil (PLOS One 2024). Keluaran → `data/enhanced/<dataset>/images`
(varian `enhanced`).

**(b) Metrik kelurusan garis (LSD straightness)** — `straightness_metric.py`.
Line Segment Detector untuk mengukur seberapa lurus garis kandang setelah rektifikasi
(proksi kualitas geometri, bukan bergantung mAP). Referensi: Xue et al. (CVPR 2019,
arXiv:1904.09856); lihat juga LaRecNet (arXiv:2003.11386).

**(c) TTA multi-scale + flip** — `eval_detection_tta.py`.
Test-time augmentation untuk menaikkan recall pada objek kecil/terdistorsi tanpa mengubah
citra sumber. Diproduksi terpisah; hasil di-merge dari `reports/eval_tta.json`
(varian `tta`).

**(d) Augmentasi distorsi radial acak + retrain** — `radial_distort_augment.py`.
Alih-alih meluruskan citra, **adaptasikan detektor** ke distorsi dengan menambah augmentasi
distorsi radial acak saat training (paradigma "adapt detector vs rectify"). Referensi:
WoodScape (ICCV 2019, arXiv:1905.01489), FisheyeDetNet (arXiv:2404.13443), dan sintesis
edge-case (arXiv:2507.16254). Bobot hasil retrain → `train model/runs_radial/ft_radial_yolov8m/weights/best.pt`
(varian `radial_retrain`).

---

## Task 4 — Re-test 3 dataset (tabel master)

Orkestrator `src/run_experiments_campaign.py` merangkai evaluasi tiap varian pada 3 dataset
(`pio_val`, `broiler_instance_seg`, `chicken_detection_fum`) dan menyusun satu tabel master.

**Tabel varian.**

| Varian | Bobot | Sumber citra | Diproduksi oleh |
|---|---|---|---|
| `baseline` | `runs_compare/cmp_yolov8m` | asli | — (acuan Δ) |
| `mowa_1pass` | baseline | `data/rectified` | sudah ada |
| `mowa_1pass_ft` | `runs_rectified/ft_rectified_yolov8m` | `data/rectified` | sudah ada |
| `mowa_iter2` | baseline | `data/rectified_iter2` | Task 2 (Unit 3) |
| `enhanced` | baseline | `data/enhanced` | Task 3a (Unit 4) |
| `tta` | baseline | asli (TTA) | Task 3c — merge `reports/eval_tta.json` |
| `radial_retrain` | `runs_radial/ft_radial_yolov8m` | asli | Task 3d (Unit 7) |

**Verdict.** Metrik primer = **mAP50-95**. Untuk tiap varian: Δ per dataset vs `baseline`,
lalu **rata-rata Δ lintas dataset**. Dead-band `NEUTRAL_EPS = 0.005`:
- mean Δ > +0.005 → `better`
- mean Δ < −0.005 → `worse`
- selainnya → `neutral`

Varian yang input-nya belum tersedia dicatat dengan status jujur
(`missing_weights` / `missing_input` / `external` / `no_data`) dan **tidak** membuat
kampanye gagal. Logika evaluasi diimpor ulang dari `src/eval_detection.py`
(`evaluate_one`, `resolve_val_dirs`, `count_images`, `DATASETS`) — tidak
diimplementasi ulang; ambang verdict mengikuti `src/compare_ab.py` (`NEUTRAL_EPS`).

**Rasionale integritas bbox untuk skripsi.** Kesimpulan "MOWA memperburuk deteksi" hanya
sahih jika label ter-warp benar (Task 1). Karena itu tabel master dibaca bersama laporan
integritas bbox: jika bbox utuh dan mAP tetap turun, penurunan itu berasal dari kualitas
citra (blur/over-correction), bukan artefak label — inilah temuan metodologis yang
dilaporkan di skripsi.

---

## Sitasi

- **MOWA** — Multiple-in-One Image Warping. arXiv:2404.10716 (TPAMI 2025).
  <https://arxiv.org/abs/2404.10716>
- **ESIR** — Iterative Image Rectification for Scene Text. CVPR 2019. arXiv:1812.05824.
  <https://arxiv.org/abs/1812.05824>
- **DocScanner** — Robust Document Image Rectification via Progressive Learning.
  IJCV 2025. arXiv:2110.14968. <https://arxiv.org/abs/2110.14968>
- **RAFT** — Recurrent All-Pairs Field Transforms for Optical Flow. ECCV 2020.
  arXiv:2003.12039. <https://arxiv.org/abs/2003.12039>
- **Xue et al.** — Learning to Calibrate Straight Lines for Fisheye Image Rectification.
  CVPR 2019. arXiv:1904.09856. <https://arxiv.org/abs/1904.09856>
- **LaRecNet** — Line-aware Rectification Network. arXiv:2003.11386.
  <https://arxiv.org/abs/2003.11386>
- **WoodScape** — Multi-Task Fisheye Dataset for Autonomous Driving. ICCV 2019.
  arXiv:1905.01489. <https://arxiv.org/abs/1905.01489>
- **FisheyeDetNet** — Object Detection on Fisheye Cameras. arXiv:2404.13443.
  <https://arxiv.org/abs/2404.13443>
- **Edge-case Synthesis** — Synthesizing Edge Cases for Fisheye Detection.
  arXiv:2507.16254. <https://arxiv.org/abs/2507.16254>
- **CLAHE + YOLO** — CLAHE preprocessing untuk deteksi objek kecil. PLOS One 2024.

---

## Cara menjalankan (urutan)

Perintah yang dijalankan koordinator (GPU). Path relatif terhadap root repo.

```bash
# 1) Task 2 — MOWA iteratif (pass ke-2) per dataset, di bawah .venv-mowa
.venv-mowa/Scripts/python.exe src/mowa_rectify_iterative.py --passes 2 --dataset pio_val
.venv-mowa/Scripts/python.exe src/mowa_rectify_iterative.py --passes 2 --dataset broiler_instance_seg
.venv-mowa/Scripts/python.exe src/mowa_rectify_iterative.py --passes 2 --dataset chicken_detection_fum
#   -> mengisi data/rectified_iter2/<dataset>/{images,labels}

# 2) Task 3a — enhancement CLAHE+unsharp, di bawah .venv-yolo
.venv-yolo/Scripts/python.exe src/enhance_preprocess.py --out data/enhanced
#   -> mengisi data/enhanced/<dataset>/images

# 3) Task 3b — metrik kelurusan garis (LSD), di bawah .venv-yolo
.venv-yolo/Scripts/python.exe src/straightness_metric.py --out reports/straightness.json

# 4) Task 3c — evaluasi TTA multi-scale+flip, di bawah .venv-yolo
.venv-yolo/Scripts/python.exe src/eval_detection_tta.py \
    --weights "train model/runs_compare/cmp_yolov8m/weights/best.pt" \
    --out reports/eval_tta.json

# 5) Task 3d — augmentasi distorsi radial + finetune, di bawah .venv-yolo
.venv-yolo/Scripts/python.exe src/radial_distort_augment.py --make-data
.venv-yolo/Scripts/python.exe src/finetune_rectified.py \
    --project "train model/runs_radial" --name ft_radial_yolov8m --data <radial_data.yaml>
#   -> menghasilkan train model/runs_radial/ft_radial_yolov8m/weights/best.pt

# 6) Task 4 — tabel master (chaining eval + agregasi), di bawah .venv-yolo
.venv-yolo/Scripts/python.exe src/run_experiments_campaign.py \
    --imgsz 960 --device 0 \
    --merge reports/eval_tta.json \
    --out-prefix reports/experiments_v2_master
#   -> reports/experiments_v2_master.{json,csv,html}
```

Varian yang input-nya belum siap saat langkah 6 dijalankan akan tercatat dengan status
dan dilewati tanpa menggagalkan kampanye; jalankan ulang langkah 6 setelah input lengkap.
