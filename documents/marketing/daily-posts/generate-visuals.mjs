#!/usr/bin/env node
/**
 * Génère les 14 visuels × 2 formats du pack daily-posts.
 *
 *   node documents/marketing/daily-posts/generate-visuals.mjs          # tout
 *   node documents/marketing/daily-posts/generate-visuals.mjs 3 7     # jours 3 et 7 seulement
 *
 * - feed/jour-NN.jpg     : 1080×1350 (4:5)  → Instagram + Facebook
 * - vertical/jour-NN.jpg : 1080×1920 (9:16) → TikTok + Stories + Reels
 *
 * Le texte incrusté = la requête SEO du jour (voir posts.md). Les photos
 * viennent de public/images/menu-items/. Si une photo n'est pas encore
 * téléchargée depuis iCloud (fichier « dataless »), le jour est sauté avec
 * un avertissement — relance le script après téléchargement.
 */
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const require = createRequire(join(ROOT, "package.json"));
const sharp = require("sharp");

const IMG = join(ROOT, "public/images/menu-items");
const REAL = join(IMG, "Photos-3-001 2");

// ————— Palette (globals.css) —————
const INK = "#0D0A08";
const INK_800 = "#231A14";
const CREAM = "#F6F0E7";
const CREAM_300 = "#B9AD9A";
const EMBER = "#EFA63B";

const FONT = "Montserrat"; // installée depuis public/fonts (fallback système sinon)

// ————— Les 14 jours —————
// title : la requête incrustée (levier OCR). sub : la ligne produit.
// photo : chemin absolu. badge : chip optionnel (ex. BIENTÔT).
const DAYS = [
  { day: 1,  photo: join(IMG, "liegeoisenutella.jpg"), light: false,
    title: "Meilleures gaufres\nà Marrakech ?", sub: "La liégeoise · dorée à la commande" },
  { day: 2,  photo: join(REAL, "PXL_20260327_121346676.RAW-01.jpg"), light: true,
    title: "Un vrai café\nà Marrakech", sub: "Ice dalgona · ice lattes · cold brew" },
  { day: 3,  photo: join(IMG, "kunefe.png"), light: false,
    title: "Kunefe\nà Marrakech", sub: "Préparé à la commande, servi brûlant" },
  { day: 4,  photo: join(IMG, "gauffresbruxellesaemporter.jpg"), light: true,
    title: "Best waffles\nin Marrakech", sub: "Brussels waffle · fresh strawberries · to go" },
  { day: 5,  photo: join(IMG, "pzzawaffleboisée.jpg"), light: false,
    title: "La gaufre salée\nexiste", sub: "La Boisée · poulet, mozzarella, sauce gruyère" },
  { day: 6,  photo: join(IMG, "craflesoreo.jpg"), light: false,
    title: "C'est quoi,\nun croffle ?", sub: "Croissant + gaufre · Oreo, spéculoos, caramel…" },
  { day: 7,  photo: join(REAL, "PXL_20260327_222910187.NIGHT.RAW-01.jpg"), light: false,
    title: "Ouvert jusqu'à 2h\ndu matin", sub: "Tous les soirs · sauf le lundi" },
  { day: 8,  photo: join(IMG, "craflecaramelspeculos.jpg"), light: false,
    title: "Le goûter\nà Marrakech", sub: "Croffles · toppings au choix" },
  { day: 9,  photo: join(IMG, "craflechocolatfraise.jpg"), light: false,
    title: "L'idée date night\nà Marrakech", sub: "Croffle chocolat-fraise · deux cuillères" },
  { day: 10, photo: join(IMG, "gauffresliegeoise.jpg"), light: true,
    title: "La liégeoise,\nla vraie", sub: "Perles de sucre caramélisées · framboises" },
  { day: 11, photo: join(REAL, "PXL_20260327_222351635.RAW-01.jpg"), light: false,
    title: "Dessert livré\nà Marrakech", sub: "Nos cans voyagent sur Glovo" },
  { day: 12, photo: join(IMG, "crafles3chocolats.jpg"), light: false,
    title: "Le dessert des\nchocolat-addicts", sub: "Croffle 3 chocolats · noir, lait, blanc" },
  { day: 13, photo: join(REAL, "PXL_20260329_213541386.RAW-01.jpg"), light: true, badge: "BIENTÔT",
    title: "La rfissa…\nen sandwich ?", sub: "En test dans notre cuisine" },
  { day: 14, brand: true,
    title: "Kech Waffles", sub: "Gaufres · croffles · kunefe · café\nMAG 33 Al Badii · Marrakech\nmar–jeu 11h–2h · ven 18h30–2h\nsam 11h–2h · dim 18h–2h · lun fermé\njusqu'à 2h du matin, tous les soirs" },
];

// ————— Helpers —————
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function isLocal(p) {
  try {
    const kb = parseInt(execSync(`du -k "${p}"`).toString().split("\t")[0], 10);
    return kb > 0;
  } catch { return false; }
}

async function text(str, { size, weight = 800, color = CREAM, spacing = 0, width = 0, align = "left" }) {
  const span = `<span foreground="${color}" weight="${weight}"${spacing ? ` letter_spacing="${spacing * 1024}"` : ""}>${esc(str)}</span>`;
  const opts = { text: span, font: `${FONT} ${size}`, rgba: true };
  if (width) { opts.width = width; opts.align = align; }
  const buf = await sharp({ text: opts }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, w: meta.width, h: meta.height };
}

const bar = (w, h) => sharp({ create: { width: w, height: h, channels: 4, background: EMBER } }).png().toBuffer();

async function logo(width) {
  return sharp(join(IMG, "TransparentWhite.png")).resize(width).png().toBuffer();
}

// ————— Compositions —————
async function feed(d, out) {
  const W = 1080, H = 1350, BAND = 340, PAD = 72;
  const comps = [];
  const photo = await sharp(d.photo).rotate().resize(W, H - BAND, { fit: "cover", position: "attention" }).toBuffer();
  comps.push({ input: photo, left: 0, top: 0 });

  // chip marque en haut
  const chip = await text("KECH WAFFLES · MARRAKECH", { size: 21, weight: 700, color: d.light ? INK : CREAM, spacing: 6 });
  const chipBg = await sharp({ create: { width: chip.w + 56, height: chip.h + 26, channels: 4, background: d.light ? "#F6F0E7E6" : "#0D0A08CC" } }).png().toBuffer();
  comps.push({ input: chipBg, left: PAD - 28, top: 54 });
  comps.push({ input: chip.buf, left: PAD, top: 54 + 13 });

  if (d.badge) {
    const b = await text(d.badge, { size: 26, weight: 800, color: INK, spacing: 4 });
    const bg = await sharp({ create: { width: b.w + 48, height: b.h + 28, channels: 4, background: EMBER } }).png().toBuffer();
    comps.push({ input: bg, left: W - PAD - b.w - 48, top: 54 });
    comps.push({ input: b.buf, left: W - PAD - b.w - 24, top: 54 + 14 });
  }

  // bande du bas
  const band = await sharp({ create: { width: W, height: BAND, channels: 4, background: INK } }).png().toBuffer();
  comps.push({ input: band, left: 0, top: H - BAND });
  comps.push({ input: await bar(96, 8), left: PAD, top: H - BAND + 52 });
  const title = await text(d.title, { size: 62, weight: 800, color: CREAM });
  comps.push({ input: title.buf, left: PAD, top: H - BAND + 84 });
  const sub = await text(d.sub, { size: 30, weight: 600, color: CREAM_300 });
  comps.push({ input: sub.buf, left: PAD, top: Math.min(H - BAND + 96 + title.h, H - sub.h - 44) });

  await sharp({ create: { width: W, height: H, channels: 3, background: INK } }).composite(comps).jpeg({ quality: 88 }).toFile(out);
}

async function vertical(d, out) {
  const W = 1080, H = 1920, PAD = 90; // safe zones TikTok : haut 12 %, bas 22 %, bande droite
  const comps = [];
  const photo = await sharp(d.photo).rotate().resize(W, H, { fit: "cover", position: "attention" }).toBuffer();
  comps.push({ input: photo, left: 0, top: 0 });

  const chip = await text("KECH WAFFLES · MARRAKECH", { size: 22, weight: 700, color: d.light ? INK : CREAM, spacing: 6 });
  const chipBg = await sharp({ create: { width: chip.w + 56, height: chip.h + 26, channels: 4, background: d.light ? "#F6F0E7E6" : "#0D0A08CC" } }).png().toBuffer();
  comps.push({ input: chipBg, left: PAD - 28, top: 250 });
  comps.push({ input: chip.buf, left: PAD, top: 250 + 13 });

  // panneau scrim (contraste garanti sur photo claire ou sombre)
  const title = await text(d.title, { size: 64, weight: 800, color: CREAM });
  const sub = await text(d.sub, { size: 32, weight: 600, color: CREAM_300 });
  const panelW = Math.min(Math.max(title.w, sub.w) + 128, W - 2 * (PAD - 20));
  const panelH = 64 + 8 + 24 + title.h + 18 + sub.h + 56;
  const panelTop = 1470 - panelH; // le bas du panneau reste au-dessus de la zone UI TikTok (22 %)
  const panel = Buffer.from(
    `<svg width="${panelW}" height="${panelH}"><rect width="100%" height="100%" rx="28" fill="${INK}" fill-opacity="0.90"/></svg>`
  );
  comps.push({ input: panel, left: PAD - 20, top: panelTop });
  comps.push({ input: await bar(96, 8), left: PAD + 44, top: panelTop + 56 });
  comps.push({ input: title.buf, left: PAD + 44, top: panelTop + 88 });
  comps.push({ input: sub.buf, left: PAD + 44, top: panelTop + 88 + title.h + 18 });

  if (d.badge) {
    const b = await text(d.badge, { size: 28, weight: 800, color: INK, spacing: 4 });
    const bg = await sharp({ create: { width: b.w + 48, height: b.h + 28, channels: 4, background: EMBER } }).png().toBuffer();
    comps.push({ input: bg, left: PAD - 20, top: panelTop - 70 });
    comps.push({ input: b.buf, left: PAD + 4, top: panelTop - 70 + 14 });
  }

  await sharp({ create: { width: W, height: H, channels: 3, background: INK } }).composite(comps).jpeg({ quality: 88 }).toFile(out);
}

// jour 14 : carte de marque (pas de photo)
async function brandCard(d, W, H, out) {
  const comps = [];
  const lg = await logo(Math.round(W * 0.42));
  const lgMeta = await sharp(lg).metadata();
  const centerY = Math.round(H * (H > 1400 ? 0.30 : 0.24));
  comps.push({ input: lg, left: Math.round((W - lgMeta.width) / 2), top: centerY });
  const title = await text(d.title, { size: 84, weight: 800, color: CREAM, width: W - 160, align: "centre" });
  comps.push({ input: title.buf, left: Math.round((W - title.w) / 2), top: centerY + lgMeta.height + 70 });
  comps.push({ input: await bar(120, 8), left: Math.round((W - 120) / 2), top: centerY + lgMeta.height + 70 + title.h + 34 });
  const sub = await text(d.sub, { size: 34, weight: 600, color: CREAM_300, width: W - 200, align: "centre" });
  comps.push({ input: sub.buf, left: Math.round((W - sub.w) / 2), top: centerY + lgMeta.height + 70 + title.h + 76 });
  await sharp({ create: { width: W, height: H, channels: 3, background: INK } }).composite(comps).jpeg({ quality: 90 }).toFile(out);
}

// ————— Run —————
const only = process.argv.slice(2).map(Number).filter(Boolean);
mkdirSync(join(HERE, "images/feed"), { recursive: true });
mkdirSync(join(HERE, "images/vertical"), { recursive: true });

for (const d of DAYS) {
  if (only.length && !only.includes(d.day)) continue;
  const nn = String(d.day).padStart(2, "0");
  const outF = join(HERE, `images/feed/jour-${nn}.jpg`);
  const outV = join(HERE, `images/vertical/jour-${nn}.jpg`);
  try {
    if (d.brand) {
      await brandCard(d, 1080, 1350, outF);
      await brandCard(d, 1080, 1920, outV);
    } else {
      if (!isLocal(d.photo)) {
        console.warn(`⚠️  jour ${nn} SAUTÉ : photo non téléchargée (iCloud) → ${d.photo}`);
        continue;
      }
      await feed(d, outF);
      await vertical(d, outV);
    }
    console.log(`✅ jour ${nn}`);
  } catch (e) {
    console.error(`❌ jour ${nn} : ${e.message}`);
  }
}
