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
const RAMP = " .:-=+*#%@";

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function hash(x: number, y: number) {
  let value = Math.imul(x + 19, 374761393) ^ Math.imul(y + 47, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return (value ^ (value >>> 16)) >>> 0;
}

/**
 * Render an image as a cached text raster.
 *
 * This is deliberately a one-shot converter. The reveal animation moves the
 * resulting canvas layers; it never redraws glyphs on every animation frame.
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
  const font = `600 ${fontSize}px ${fontFamily}`;

  ctx.font = font;
  const measuredWidth = ctx.measureText("MMMMMMMMMMMM").width / 12;
  const cellWidth = Math.max(4.5, Math.min(6.15, measuredWidth));
  const cellHeight = cellWidth * 1.43;
  const columns = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const sampleScale = 4;

  target.width = Math.max(1, Math.round(width * pixelRatio));
  target.height = Math.max(1, Math.round(height * pixelRatio));
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const sample = document.createElement("canvas");
  sample.width = columns * sampleScale;
  sample.height = rows * sampleScale;
  const sampleContext = sample.getContext("2d", { willReadFrequently: true });
  if (!sampleContext) return { width, height };
  sampleContext.drawImage(source, 0, 0, sample.width, sample.height);

  const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
  const luminance = new Float32Array(columns * rows);
  const variation = new Float32Array(columns * rows);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      let total = 0;
      let minimum = 1;
      let maximum = 0;

      for (let sampleY = 0; sampleY < sampleScale; sampleY += 1) {
        for (let sampleX = 0; sampleX < sampleScale; sampleX += 1) {
          const pixel =
            ((y * sampleScale + sampleY) * sample.width + x * sampleScale + sampleX) * 4;
          const red = pixels[pixel] / 255;
          const green = pixels[pixel + 1] / 255;
          const blue = pixels[pixel + 2] / 255;
          const brightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
          total += brightness;
          minimum = Math.min(minimum, brightness);
          maximum = Math.max(maximum, brightness);
        }
      }

      const index = y * columns + x;
      luminance[index] = total / (sampleScale * sampleScale);
      variation[index] = maximum - minimum;
    }
  }

  const sorted = Array.from(luminance).sort((a, b) => a - b);
  const percentile = (fraction: number) =>
    sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))] ?? 0;
  const median = percentile(0.5);
  const lightImage = median > 0.53;
  const low = percentile(lightImage ? 0.02 : 0.08);
  const high = percentile(lightImage ? 0.97 : 0.99);
  const span = Math.max(0.19, high - low);
  const getLuminance = (x: number, y: number) =>
    luminance[
      Math.max(0, Math.min(rows - 1, y)) * columns + Math.max(0, Math.min(columns - 1, x))
    ] ?? 0;

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
      const edge = clamp(Math.hypot(horizontal, vertical) * (0.34 / Math.max(0.23, high - low)));
      const strength = clamp(Math.pow(tone, 0.81) * 0.77 + texture * 0.16 + edge * 0.23);
      const noise = hash(x, y);

      if (strength < 0.075 && noise % 17 < 15) continue;
      if (strength < 0.145 && noise % 5 < 2) continue;

      const glyphIndex = Math.min(RAMP.length - 1, Math.floor(strength * RAMP.length));
      const glyph = RAMP[glyphIndex] ?? " ";
      const size = Math.max(7, cellHeight * (strength < 0.19 ? 0.87 : 0.985));
      const weight = strength > 0.56 ? 700 : strength > 0.26 ? 600 : 500;
      ctx.font = `${weight} ${size.toFixed(2)}px ${fontFamily}`;
      const alpha = clamp(0.085 + Math.pow(strength, 0.84) * 0.94 + edge * 0.1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillText(glyph, (x + 0.5) * cellWidth, (y + 0.5) * cellHeight);
    }
  }

  ctx.globalAlpha = 1;

  return { width, height };
}
