import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import sty from "./GithubContributionBackground.module.scss";

const GITHUB_USERNAME = "ransuhaneda";
const API_URL = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(GITHUB_USERNAME)}?y=last`;
const CACHE_KEY = `portfolio-github-contributions:${GITHUB_USERNAME}`;
const REFRESH_EVERY = 60 * 60 * 1000;
const ROWS = 7;
const MAX_WEEKS = 53;

type Contribution = {
  date: string;
  count: number;
  level: number;
};

type ContributionPayload = {
  total: {
    lastYear?: number;
  };
  contributions: Contribution[];
};

type ContributionCell = Contribution & {
  col: number;
  row: number;
  unavailable: boolean;
};

type ContributionStyle = CSSProperties & {
  "--cell": string;
  "--gap": string;
  "--weeks": number;
  "--chart-width": string;
  "--chart-height": string;
};

function addDays(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
}

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function createSamplePayload() {
  let seed = 721313;
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const today = new Date();
  const contributions: Contribution[] = [];

  for (let index = 370; index >= 0; index -= 1) {
    const date = addDays(today, -index);
    const quiet = date.getDay() === 0 || date.getDay() === 6;
    let count = next() < (quiet ? 0.54 : 0.28) ? 0 : Math.round(next() ** 0.62 * 17);
    if (index % 43 < 12 && next() > 0.32) count += 10;
    const level = count === 0 ? 0 : count < 5 ? 1 : count < 10 ? 2 : count < 18 ? 3 : 4;
    contributions.push({ date: toISO(date), count, level });
  }

  return {
    total: { lastYear: contributions.reduce((sum, day) => sum + day.count, 0) },
    contributions,
  } satisfies ContributionPayload;
}

// oxlint-disable-next-line anti-slop/no-unknown-parameters -- External JSON is validated field-by-field at this boundary.
function parsePayload(value: unknown): ContributionPayload {
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- This is the boundary guard before schema parsing.
  if (!value || typeof value !== "object" || !("contributions" in value)) {
    throw new Error("Invalid contributions response");
  }

  // SAFETY: the object guard above establishes the only required response key before parsing its fields.
  // oxlint-disable-next-line anti-slop/no-unsafe-dictionary-type -- The provider response is normalized immediately below.
  const source = value as { contributions?: unknown; total?: unknown };
  if (!Array.isArray(source.contributions)) throw new Error("Invalid contributions response");

  const contributions = source.contributions
    .map((entry): Contribution | null => {
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- This is the boundary guard before entry parsing.
      if (!entry || typeof entry !== "object") return null;
      // SAFETY: the object guard above establishes a dictionary-shaped contribution entry.
      // oxlint-disable-next-line anti-slop/no-unsafe-dictionary-type -- The provider entry is normalized immediately below.
      const item = entry as Record<string, unknown>;
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- The date string check validates the provider's date field.
      const date = typeof item.date === "string" ? item.date : "";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

      return {
        date,
        count: Math.max(0, Number(item.count) || 0),
        level: Math.max(0, Math.min(4, Math.round(Number(item.level) || 0))),
      };
    })
    .filter((entry): entry is Contribution => entry !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (contributions.length < 180) throw new Error("Not enough contribution dates");

  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- This is the boundary guard before total parsing.
  const totalRecord = source.total && typeof source.total === "object" ? source.total : null;
  // SAFETY: totalRecord is narrowed to the provider's object-shaped total before reading lastYear.
  // oxlint-disable-next-line anti-slop/no-unsafe-dictionary-type
  const total = totalRecord ? Number((totalRecord as { lastYear?: number }).lastYear) : Number.NaN;

  return {
    total: Number.isFinite(total) ? { lastYear: total } : {},
    contributions,
  };
}

function readCache() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- This is the local-storage boundary guard.
    if (!value || typeof value !== "object") return null;
    // SAFETY: the object guard above establishes a dictionary-shaped cache record.
    // oxlint-disable-next-line anti-slop/no-unsafe-dictionary-type -- The cache record is validated before use.
    const record = value as Record<string, unknown>;
    const savedAt = Number(record.savedAt);
    if (!Number.isFinite(savedAt) || !record.data) return null;
    return { savedAt, data: parsePayload(record.data) };
  } catch {
    return null;
  }
}

function saveCache(data: ContributionPayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Storage is optional; the live feed and sample remain available without it.
  }
}

// Cell sizes follow three viewport tiers. Subscribing to the tier rather than the raw
// width means resizing (or mobile address bars) only re-renders when the size changes.
type SizeTier = "sm" | "md" | "lg";

function readSizeTier(): SizeTier {
  return window.innerWidth >= 1250 ? "lg" : window.innerWidth >= 800 ? "md" : "sm";
}

function subscribeToResize(onChange: () => void) {
  window.addEventListener("resize", onChange, { passive: true });
  return () => window.removeEventListener("resize", onChange);
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function readReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function dimensionsFor(tier: SizeTier) {
  const cellSize = tier === "lg" ? 14 : tier === "md" ? 12 : 10;
  const gap = tier === "sm" ? 4 : 6;
  const chartWidth = MAX_WEEKS * cellSize + (MAX_WEEKS - 1) * gap;
  const chartHeight = ROWS * cellSize + (ROWS - 1) * gap;

  return { cellSize, gap, chartWidth, chartHeight };
}

function buildCells(payload: ContributionPayload): ContributionCell[] {
  const byDate = new Map(payload.contributions.map((day) => [day.date, day]));
  const firstAvailable = payload.contributions[0]?.date ?? "";
  const today = new Date();
  const todayISO = toISO(today);
  const startOfWeek = addDays(today, -today.getDay());
  const firstWeek = addDays(startOfWeek, -(MAX_WEEKS - 1) * 7);

  return Array.from({ length: MAX_WEEKS * ROWS }, (_, index) => {
    const col = Math.floor(index / ROWS);
    const row = index % ROWS;
    const date = addDays(firstWeek, col * 7 + row);
    const iso = toISO(date);
    const info = byDate.get(iso);

    return {
      date: iso,
      count: info?.count ?? 0,
      level: info?.level ?? 0,
      col,
      row,
      unavailable: iso > todayISO || iso < firstAvailable,
    };
  });
}

function formatTotal(data: ContributionPayload) {
  const total = data.total.lastYear ?? data.contributions.reduce((sum, day) => sum + day.count, 0);
  return new Intl.NumberFormat("en-US").format(total);
}

// localStorage is unavailable during prerender, so the server snapshot is always the sample.
// Tiles render only on the client (see isClient), so the two never need to match.
function readInitialState() {
  const cached = readCache();
  if (!cached) {
    return {
      payload: createSamplePayload(),
      status: "Preview data · connecting…",
      isPreview: true,
      lastFetch: 0,
    };
  }
  return {
    payload: cached.data,
    status: `${formatTotal(cached.data)} contributions · cached`,
    isPreview: false,
    lastFetch: cached.savedAt,
  };
}

function subscribeNever() {
  return () => {};
}

// Reveal sweeps from the newest week (right edge, the visible part) towards the oldest.
function revealDelay(col: number, row: number) {
  return Math.min(930, (MAX_WEEKS - 1 - col) * 16 + row * 9);
}

export function GithubContributionBackground() {
  const [initial] = useState(readInitialState);
  const [payload, setPayload] = useState(initial.payload);
  const [status, setStatus] = useState(initial.status);
  // False for the prerender and hydration pass, true afterwards. Tiles mount once, already at
  // the right size with cached data, so the staggered reveal plays instead of a visible swap.
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const sizeTier = useSyncExternalStore(subscribeToResize, readSizeTier, () => "md" as const);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    readReducedMotion,
    () => false,
  );
  const ambientGridRef = useRef<HTMLDivElement>(null);
  const gridWrapRef = useRef<HTMLDivElement>(null);
  const sparkLayerRef = useRef<HTMLDivElement>(null);
  const isPreviewRef = useRef(initial.isPreview);
  const lastFetchRef = useRef(initial.lastFetch);
  const fetchingRef = useRef(false);

  const dimensions = useMemo(() => dimensionsFor(sizeTier), [sizeTier]);
  const cells = useMemo(() => buildCells(payload), [payload]);
  const contributionStyle: ContributionStyle = {
    "--cell": `${dimensions.cellSize}px`,
    "--gap": `${dimensions.gap}px`,
    "--weeks": MAX_WEEKS,
    "--chart-width": `${dimensions.chartWidth}px`,
    "--chart-height": `${dimensions.chartHeight}px`,
  };

  useEffect(() => {
    const ambient = ambientGridRef.current;
    const gridWrap = gridWrapRef.current;
    const sparkLayer = sparkLayerRef.current;
    if (!isClient || reducedMotion || !ambient || !gridWrap || !sparkLayer || cells.length === 0)
      return;

    const tiles = Array.from(gridWrap.querySelectorAll<HTMLElement>("[data-contribution-tile]"));
    const glints = Array.from({ length: 12 }, () => {
      const element = document.createElement("span");
      element.className = sty.glint;
      sparkLayer.append(element);
      return { element, busy: false };
    });
    const baseColors = [
      "--color-contribution-empty",
      "--color-contribution-level-1",
      "--color-contribution-level-2",
      "--color-contribution-level-3",
      "--color-contribution-level-4",
    ].map((name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    const brighten = baseColors[4];
    const busyCells = new Set<number>();
    let timer = 0;
    let lastIndex = -1;

    const sparkle = (explicitIndex?: number) => {
      if (document.hidden) return;
      const spot = glints.find((glint) => !glint.busy);
      if (!spot) return;

      let index = explicitIndex;
      if (index === undefined) {
        const chartRect = gridWrap.getBoundingClientRect();
        const clipRect = ambient.getBoundingClientRect();
        const stride = dimensions.cellSize + dimensions.gap;
        const first = Math.max(
          0,
          Math.ceil((clipRect.left - chartRect.left - dimensions.cellSize) / stride),
        );
        const last = Math.min(
          MAX_WEEKS - 1,
          Math.floor((clipRect.right - chartRect.left) / stride),
        );
        if (last < first) return;

        for (let attempt = 0; attempt < 22; attempt += 1) {
          const column = first + Math.floor(Math.random() * (last - first + 1));
          const candidateIndex = column * ROWS + Math.floor(Math.random() * ROWS);
          const candidate = cells[candidateIndex];
          if (
            candidate &&
            !candidate.unavailable &&
            !busyCells.has(candidateIndex) &&
            candidateIndex !== lastIndex &&
            (candidate.level > 0 || Math.random() < 0.06)
          ) {
            index = candidateIndex;
            break;
          }
        }
      }

      if (index === undefined) return;
      const cell = cells[index];
      const tile = tiles[index];
      if (!cell || !tile || cell.unavailable || busyCells.has(index)) return;

      spot.busy = true;
      busyCells.add(index);
      lastIndex = index;
      const x = cell.col * (dimensions.cellSize + dimensions.gap) + dimensions.cellSize / 2;
      const y = cell.row * (dimensions.cellSize + dimensions.gap) + dimensions.cellSize / 2;
      spot.element.style.left = `${x}px`;
      spot.element.style.top = `${y}px`;
      const lightEffect = spot.element.animate(
        [
          { opacity: 0, transform: "translate(-50%, -50%) scale(.48)" },
          { opacity: 0.94, transform: "translate(-50%, -50%) scale(1.05)", offset: 0.2 },
          { opacity: 0, transform: "translate(-50%, -50%) scale(1.43)" },
        ],
        { duration: 1250, easing: "ease-out" },
      );
      tile.animate(
        [
          { backgroundColor: baseColors[cell.level] },
          { backgroundColor: brighten, offset: 0.2 },
          { backgroundColor: baseColors[cell.level] },
        ],
        { duration: 1250, easing: "ease-in-out" },
      );
      const release = () => {
        spot.busy = false;
        busyCells.delete(index);
      };
      lightEffect.onfinish = release;
      lightEffect.oncancel = release;
    };

    const scheduleSparkle = () => {
      timer = window.setTimeout(
        () => {
          sparkle();
          scheduleSparkle();
        },
        320 + Math.random() * 470,
      );
    };
    const handlePointerOver = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const tile = event.target.closest<HTMLElement>("[data-contribution-tile]");
      if (!tile || !gridWrap.contains(tile)) return;
      const index = tiles.indexOf(tile);
      if (index >= 0) sparkle(index);
    };

    gridWrap.addEventListener("pointerover", handlePointerOver);
    scheduleSparkle();
    return () => {
      window.clearTimeout(timer);
      gridWrap.removeEventListener("pointerover", handlePointerOver);
      glints.forEach(({ element }) => {
        element.getAnimations().forEach((animation) => animation.cancel());
        element.remove();
      });
      tiles.forEach((tile) => tile.getAnimations().forEach((animation) => animation.cancel()));
    };
  }, [cells, dimensions, isClient, reducedMotion]);

  useEffect(() => {
    let disposed = false;

    const fetchContributions = async () => {
      if (disposed || fetchingRef.current) return;
      if (!isPreviewRef.current && Date.now() - lastFetchRef.current < REFRESH_EVERY) return;

      fetchingRef.current = true;
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 16000);

      try {
        const response = await fetch(API_URL, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = parsePayload(await response.json());
        if (disposed) return;

        lastFetchRef.current = Date.now();
        isPreviewRef.current = false;
        setPayload(data);
        saveCache(data);
        setStatus(`${formatTotal(data)} contributions · updated hourly`);
      } catch (error) {
        if (!disposed) {
          console.warn(
            "Live GitHub feed unavailable; sample/cached activity remains visible.",
            error,
          );
          setStatus(
            isPreviewRef.current
              ? "Preview data · live feed unavailable"
              : "Cached contributions · offline",
          );
        }
      } finally {
        window.clearTimeout(timeoutId);
        fetchingRef.current = false;
      }
    };

    void fetchContributions();
    const intervalId = window.setInterval(() => void fetchContributions(), REFRESH_EVERY);
    const handleVisibility = () => {
      if (!document.hidden && Date.now() - lastFetchRef.current >= REFRESH_EVERY) {
        void fetchContributions();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <>
      <div ref={ambientGridRef} className={sty.ambientGrid} aria-hidden="true">
        <section className={sty.contributions} style={contributionStyle}>
          <div className={sty.chart}>
            <div ref={gridWrapRef} className={sty.gridWrap}>
              <div className={sty.heatmap}>
                {isClient &&
                  cells.map((cell) => (
                    <span
                      className={sty.tile}
                      data-contribution-tile="true"
                      data-empty-day={cell.unavailable ? "true" : undefined}
                      data-level={cell.level}
                      key={cell.date}
                      style={{ animationDelay: `${revealDelay(cell.col, cell.row)}ms` }}
                    />
                  ))}
              </div>
              <div ref={sparkLayerRef} className={sty.sparkLayer} />
            </div>
          </div>
        </section>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {isClient ? status : ""}
      </p>
    </>
  );
}
