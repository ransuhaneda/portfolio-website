import type { IconType } from "react-icons";
import {
  SiAlpinedotjs,
  SiBootstrap,
  SiCloudflare,
  SiCpanel,
  SiFigma,
  SiGithubactions,
  SiGit,
  SiGreensock,
  SiHostinger,
  SiJson,
  SiLaravel,
  SiMarkdown,
  SiMysql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVitest,
  SiWordpress,
} from "react-icons/si";
import { MdExtension, MdPhotoLibrary, MdSanitizer } from "react-icons/md";
import { LuAccessibility, LuCodeXml, LuServer, LuServerCog, LuShieldCheck } from "react-icons/lu";
import {
  TbBrandAdobeIllustrator,
  TbBrandAdobePhotoshop,
  TbBrandInertia,
  TbFileTypePhp,
  TbMarkdown,
  TbSchema,
} from "react-icons/tb";
import { VscBrowser, VscCode, VscServer, VscSymbolSnippet } from "react-icons/vsc";
import { FaCss3Alt, FaHtml5, FaJs, FaPhp, FaSass } from "react-icons/fa";

const iconColors = {
  WordPress: "#21759b",
  Elementor: "#92003b",
  PHP: "#777bb4",
  HTML5: "#e34f26",
  CSS3: "#1572b6",
  React: "#61dafb",
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Figma: "#f24e1e",
  "GitHub Actions": "#2088ff",
  Git: "#f05032",
  Cloudflare: "#f38020",
  Laravel: "#ff2d20",
  "Laravel 12": "#ff2d20",
  Bootstrap: "#7952b3",
  "Tailwind CSS": "#06b6d4",
  "Alpine.js": "#8bc0d0",
  ACF: "#6f42c1",
  "Code Snippets": "#5c6bc0",
  Markdown: "#ffffff",
  Vite: "#646cff",
  GSAP: "#88ce02",
  SCSS: "#cf649a",
  cPanel: "#ff6c2c",
  Hostinger: "#673de6",
  MySQL: "#4479a1",
  Accessibility: "#4c9aff",
  "Adobe Photoshop": "#31a8ff",
  "Adobe Illustrator": "#ff9a00",
  VPS: "#8b8b8b",
  "Server administration": "#8b8b8b",
  SSL: "#8b8b8b",
};

const icons = {
  WordPress: SiWordpress,
  Elementor: MdExtension,
  PHP: FaPhp,
  HTML5: FaHtml5,
  CSS3: FaCss3Alt,
  ACF: TbSchema,
  "Code Snippets": VscSymbolSnippet,
  "CodeMirror 6": VscCode,
  Marked: TbMarkdown,
  DOMPurify: MdSanitizer,
  Vitest: SiVitest,
  Playwright: VscBrowser,
  cPanel: SiCpanel,
  Hostinger: SiHostinger,
  React: SiReact,
  TypeScript: SiTypescript,
  JavaScript: FaJs,
  Figma: SiFigma,
  "GitHub Actions": SiGithubactions,
  Git: SiGit,
  Cloudflare: SiCloudflare,
  "Laravel 12": SiLaravel,
  Laravel: SiLaravel,
  Blade: TbFileTypePhp,
  Bootstrap: SiBootstrap,
  "Tailwind CSS": SiTailwindcss,
  "Alpine.js": SiAlpinedotjs,
  "Spatie Media Library": MdPhotoLibrary,
  Inertia: TbBrandInertia,
  "Server-side rendering": VscServer,
  "JSON content": SiJson,
  Markdown: SiMarkdown,
  "Cloudflare Pages": SiCloudflare,
  Vite: SiVite,
  GSAP: SiGreensock,
  SCSS: FaSass,
  MySQL: SiMysql,
  Accessibility: LuAccessibility,
  "Adobe Photoshop": TbBrandAdobePhotoshop,
  "Adobe Illustrator": TbBrandAdobeIllustrator,
  VPS: LuServer,
  "Server administration": LuServerCog,
  SSL: LuShieldCheck,
};

export function getProjectStackIcon(item: string): IconType {
  // SAFETY: Object.hasOwn proves item is a key of the closed icon registry.
  return Object.hasOwn(icons, item) ? icons[item as keyof typeof icons] : LuCodeXml;
}

export function getProjectStackIconColor(item: string): string {
  // SAFETY: Object.hasOwn proves item is a key of the closed color registry.
  return Object.hasOwn(iconColors, item)
    ? iconColors[item as keyof typeof iconColors]
    : "currentColor";
}
