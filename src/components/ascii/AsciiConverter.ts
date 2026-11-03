export type AsciiRenderOptions = {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
};

export type AsciiRenderResult = {
  width: number;
  height: number;
};

const DEFAULT_COLOR = "#b6cf4f";
const DEFAULT_FONT_FAMILY = 'Consolas, "Liberation Mono", monospace';
const SAMPLE_SCALE = 4;
const UNDERLAY_LIGHT = { alpha: 0.105, filter: "grayscale(1) invert(1) contrast(1.55)" };
const UNDERLAY_DARK = { alpha: 0.115, filter: "grayscale(1) contrast(1.6)" };
const GLYPH_GROUPS = [
  " .",
  ".'`",
  "',:",
  ":;!",
  "i!l",
  "l|/",
  "-=+",
  "+*r",
  "rvc",
  "xYX",
  "YJL",
  "CLQ",
  "0OZ",
  "mwq",
  "pdb",
  "kha",
  "*#M",
  "MW&",
  "8%B",
  "@#$",
];

const glyphWidths = new Map<string, number>();
let sampleCanvas: HTMLCanvasElement | null = null;

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function hash(x: number, y: number) {
  let value = Math.imul(x + 19, 374761393) ^ Math.imul(y + 47, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return (value ^ (value >>> 16)) >>> 0;
}

/** Source rectangle matching CSS `object-fit: cover` for the target box. */
function coverRect(source: CanvasImageSource, width: number, height: number) {
  const naturalWidth = source instanceof HTMLImageElement ? source.naturalWidth : 0;
  const naturalHeight = source instanceof HTMLImageElement ? source.naturalHeight : 0;
  if (!naturalWidth || !naturalHeight) return null;
  const scale = Math.max(width / naturalWidth, height / naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  return [
    (naturalWidth - sourceWidth) / 2,
    (naturalHeight - sourceHeight) / 2,
    sourceWidth,
    sourceHeight,
  ] as const;
}

function measureGlyphWidth(ctx: CanvasRenderingContext2D, font: string) {
  const cached = glyphWidths.get(font);
  if (cached !== undefined) return cached;
  ctx.font = font;
  const width = ctx.measureText("MMMMMMMMMMMM").width / 12;
  glyphWidths.set(font, width);
  return width;
}

/**
 * Render an image as a cached text raster.
 *
 * This is deliberately a one-shot converter. Motion is applied to the
 * resulting canvas with composited CSS; glyphs are never redrawn per frame.
 */
export function renderAscii(
  source: CanvasImageSource,
  target: HTMLCanvasElement,
  width: number,
  height: number,
  pixelRatio = 1,
  options: AsciiRenderOptions = {},
): AsciiRenderResult {
  const ctx = target.getContext("2d");
  if (!ctx) return { width: 0, height: 0 };

  const fontSize = options.fontSize ?? (width < 460 ? 8.05 : width < 880 ? 8.95 : 9.65);
  const fontFamily = options.fontFamily ?? DEFAULT_FONT_FAMILY;
  const color = options.color ?? DEFAULT_COLOR;
  const cellWidth = clamp(measureGlyphWidth(ctx, `600 ${fontSize}px ${fontFamily}`), 4.5, 6.15);
  const cellHeight = cellWidth * 1.43;
  const columns = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const total = columns * rows;

  target.width = Math.max(1, Math.round(width * pixelRatio));
  target.height = Math.max(1, Math.round(height * pixelRatio));
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  sampleCanvas ??= document.createElement("canvas");
  const sample = sampleCanvas;
  sample.width = columns * SAMPLE_SCALE;
  sample.height = rows * SAMPLE_SCALE;
  const sampleContext = sample.getContext("2d", { willReadFrequently: true });
  if (!sampleContext) return { width, height };
  const crop = coverRect(source, width, height);
  const drawCover = (context: CanvasRenderingContext2D, drawWidth: number, drawHeight: number) =>
    crop
      ? context.drawImage(source, ...crop, 0, 0, drawWidth, drawHeight)
      : context.drawImage(source, 0, 0, drawWidth, drawHeight);
  drawCover(sampleContext, sample.width, sample.height);

  const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
  const luminance = new Float32Array(total);
  const variation = new Float32Array(total);
  const samplesPerCell = SAMPLE_SCALE * SAMPLE_SCALE;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      let sum = 0;
      let minimum = 1;
      let maximum = 0;
      for (let sampleY = 0; sampleY < SAMPLE_SCALE; sampleY += 1) {
        for (let sampleX = 0; sampleX < SAMPLE_SCALE; sampleX += 1) {
          const pixel =
            ((y * SAMPLE_SCALE + sampleY) * sample.width + x * SAMPLE_SCALE + sampleX) * 4;
          const brightness =
            (pixels[pixel] * 0.2126 + pixels[pixel + 1] * 0.7152 + pixels[pixel + 2] * 0.0722) /
            255;
          sum += brightness;
          if (brightness < minimum) minimum = brightness;
          if (brightness > maximum) maximum = brightness;
        }
      }
      const index = y * columns + x;
      luminance[index] = sum / samplesPerCell;
      variation[index] = maximum - minimum;
    }
  }

  const sorted = Float32Array.from(luminance).sort();
  const percentile = (fraction: number) =>
    sorted[Math.min(total - 1, Math.floor((total - 1) * fraction))] ?? 0;
  const lightImage = percentile(0.5) > 0.53;
  const low = percentile(lightImage ? 0.02 : 0.08);
  const high = percentile(lightImage ? 0.97 : 0.99);
  const span = Math.max(0.19, high - low);
  const edgeScale = 0.34 / Math.max(0.23, high - low);
  const getLuminance = (x: number, y: number) =>
    luminance[
      Math.max(0, Math.min(rows - 1, y)) * columns + Math.max(0, Math.min(columns - 1, x))
    ] ?? 0;

  // Faint tonal underlay keeps the silhouette readable between glyphs.
  const underlay = lightImage ? UNDERLAY_LIGHT : UNDERLAY_DARK;
  ctx.save();
  ctx.globalAlpha = underlay.alpha;
  ctx.filter = underlay.filter;
  drawCover(ctx, width, height);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  let currentFont = "";

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const index = y * columns + x;
      const brightness = luminance[index] ?? 0;
      const tone = clamp((lightImage ? high - brightness : brightness - low) / span);
      const texture = clamp((variation[index] ?? 0) * 1.95);
      const horizontal =
        getLuminance(x + 1, y - 1) +
        2 * getLuminance(x + 1, y) +
        getLuminance(x + 1, y + 1) -
        getLuminance(x - 1, y - 1) -
        2 * getLuminance(x - 1, y) -
        getLuminance(x - 1, y + 1);
      const vertical =
        getLuminance(x - 1, y + 1) +
        2 * getLuminance(x, y + 1) +
        getLuminance(x + 1, y + 1) -
        getLuminance(x - 1, y - 1) -
        2 * getLuminance(x, y - 1) -
        getLuminance(x + 1, y - 1);
      const edge = clamp(Math.hypot(horizontal, vertical) * edgeScale);
      const strength = clamp(Math.pow(tone, 0.81) * 0.77 + texture * 0.16 + edge * 0.23);
      const noise = hash(x, y);

      if (strength < 0.075 && noise % 17 < 15) continue;
      if (strength < 0.145 && noise % 5 < 2) continue;

      const group =
        GLYPH_GROUPS[
          Math.min(GLYPH_GROUPS.length - 1, Math.floor(strength * GLYPH_GROUPS.length))
        ] ?? " ";
      let glyph = group[(noise >>> 9) % group.length] ?? " ";
      if (edge > 0.3 && texture > 0.13 && strength < 0.85 && (noise & 3) !== 0) {
        if (Math.abs(horizontal) > Math.abs(vertical) * 1.7) glyph = "|";
        else if (Math.abs(vertical) > Math.abs(horizontal) * 1.7) glyph = "-";
        else glyph = horizontal * vertical > 0 ? "\\" : "/";
      }

      const size = Math.max(7, cellHeight * (strength < 0.19 ? 0.87 : 0.985));
      const weight = strength > 0.56 ? 700 : strength > 0.26 ? 600 : 500;
      const font = `${weight} ${size.toFixed(2)}px ${fontFamily}`;
      if (font !== currentFont) {
        ctx.font = font;
        currentFont = font;
      }
      const jitter = ((noise >>> 16) & 255) / 255;
      ctx.globalAlpha = clamp(
        0.085 + Math.pow(strength, 0.84) * 0.94 + edge * 0.1 + jitter * 0.025,
      );
      ctx.fillText(glyph, (x + 0.5) * cellWidth, (y + 0.5) * cellHeight);
    }
  }

  ctx.globalAlpha = 1;
  return { width, height };
}
