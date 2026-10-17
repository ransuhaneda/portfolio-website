import { describe, expect, it } from "vite-plus/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { onRequest } from "../../functions/[[path]]";
import { FeaturedProjectCarousel } from "../components/FeaturedProjectCarousel";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { getPreferredProjectLink, siteContent, type ProjectLink } from "./siteContent";
import { getRouteMetadata, metadataTags } from "./routeMetadata";
import { publicUrl, readingMinutes } from "./publicUrl";

describe("public launch boundaries", () => {
  const project = siteContent.projects[0];
  const liveLink = getPreferredProjectLink(project)!;
  const githubLink = project.links!.find((link) => new URL(link.href).hostname === "github.com")!;

  const renderFeaturedMetadata = (links?: ProjectLink[]) =>
    renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement(FeaturedProjectCarousel, {
          projects: [{ ...project, links }],
          slugs: [project.slug],
          title: "Selected work",
        }),
      ),
    ).match(/<dl\b[\s\S]*?<\/dl>/)?.[0];

  it("replaces the featured role with the live website even when GitHub comes first", () => {
    const metadata = renderFeaturedMetadata([githubLink, liveLink]);
    expect(metadata).toContain("<dt>Website</dt>");
    expect(metadata).toContain(`href="${liveLink.href}"`);
    expect(metadata).toContain('target="_blank" rel="noreferrer"');
    expect(metadata).not.toContain(githubLink.href);
    expect(metadata).not.toContain("<dt>Role</dt>");
  });

  it("falls back to GitHub when the featured project has no live website", () => {
    const metadata = renderFeaturedMetadata([githubLink]);
    expect(metadata).toContain("<dt>GitHub</dt>");
    expect(metadata).toContain(`href="${githubLink.href}"`);
    expect(metadata).not.toContain("<dt>Role</dt>");
  });

  it("keeps the featured role when there are no project links", () => {
    for (const links of [[], undefined]) {
      const metadata = renderFeaturedMetadata(links);
      expect(metadata).toContain("<dt>Client</dt>");
      expect(metadata).not.toContain("<a ");
      expect(metadata).toContain("<dt>Role</dt>");
      expect(metadata).toContain(`>${project.role}</dd>`);
    }
  });

  it("uses every existing project link in project cards and keeps role only as the fallback", () => {
    for (const entry of siteContent.projects) {
      const markup = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: ["/projects"] },
          createElement(ProjectCard, { project: entry }),
        ),
      );

      for (const link of entry.links ?? []) {
        expect(markup).toContain(`href="${link.href}"`);
        expect(markup).toContain(link.label);
      }
      if (entry.links?.length) expect(markup).not.toContain(`>${entry.role}</span>`);
      else expect(markup).toContain(`Role: ${entry.role}`);
    }
  });

  it("uses all existing project links in every project detail metadata table", () => {
    for (const entry of siteContent.projects) {
      const markup = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: [`/projects/${entry.slug}`] },
          createElement(
            Routes,
            null,
            createElement(Route, {
              path: "/projects/:slug",
              element: createElement(ProjectDetailPage),
            }),
          ),
        ),
      );
      const metadata = markup.match(/<dl\b[\s\S]*?<\/dl>/)?.[0];
      if (entry.links?.length) {
        expect(metadata).toContain("<dt>Links</dt>");
        expect(metadata).not.toContain("<dt>Role</dt>");
        for (const link of entry.links) {
          expect(metadata).toContain(`href="${link.href}"`);
        }
      } else {
        expect(metadata).not.toContain("<dt>Links</dt>");
        expect(metadata).toContain("<dt>Role</dt>");
        expect(metadata).toContain(`>${entry.role}</dd>`);
      }
    }
  });

  it("keeps route metadata truthful and preview unindexed", () => {
    expect(getRouteMetadata("/resume/").canonical).toBe("https://384721.xyz/resume");
    expect(getRouteMetadata("/blog/missing").found).toBe(false);
    expect(getRouteMetadata("/blog/missing").canonical).toBeUndefined();
    expect(metadataTags("/resume", true)).toContain("noindex, nofollow");
    expect(metadataTags("/resume", false)).toContain("index, follow");
    expect(metadataTags("/", false)).toContain("application/ld+json");
    expect(metadataTags("/resume", false)).toContain("twitter:card");
    expect(publicUrl("/files/resume.pdf", "/portfolio-website/")).toBe(
      "/portfolio-website/files/resume.pdf",
    );
    expect(publicUrl("https://example.org/image.png", "/preview/")).toBe(
      "https://example.org/image.png",
    );
    expect(readingMinutes("word ".repeat(401))).toBe(3);
  });

  it("rejects disabled or incompletely configured admin without assets or network", async () => {
    for (const path of [
      "/admin",
      "/admin/",
      "/admin/index.html",
      "/api/admin",
      "/api/admin/auth/start",
      "/api/admin/projects",
    ]) {
      for (const method of ["GET", "HEAD", "POST", "PUT", "DELETE"]) {
        const response = await onRequest({
          request: new Request(`https://example.org${path}`, { method }),
          env: {
            ADMIN_ENABLED: "true",
            ASSETS: {
              fetch: async () => {
                throw new Error("Admin must not reach assets");
              },
            },
          },
        });
        expect(response.status).toBe(404);
        expect(response.headers.get("cache-control")).toBe("no-store");
        if (method === "HEAD") expect(await response.text()).toBe("");
      }
    }
  });

  it("negotiates Markdown GET/HEAD/trailing slash without trusting HTML fallback", async () => {
    for (const method of ["GET", "HEAD"]) {
      for (const path of ["/blog", "/blog/"]) {
        const response = await onRequest({
          request: new Request(`https://example.org${path}`, {
            method,
            headers: { Accept: "text/markdown" },
          }),
          env: {
            ASSETS: {
              fetch: async (request) => {
                expect(new URL(request.url).pathname).toBe("/blog.md");
                return new Response(method === "HEAD" ? null : "# Blog", {
                  headers: { "Content-Type": "text/plain", Vary: "Origin" },
                });
              },
            },
          },
        });
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
        expect(response.headers.get("vary")).toContain("Accept");
        expect(response.headers.get("vary")).toContain("Origin");
        expect(await response.text()).toBe(method === "HEAD" ? "" : "# Blog");
      }
      const missing = await onRequest({
        request: new Request("https://example.org/blog/missing", {
          method,
          headers: { Accept: "text/markdown" },
        }),
        env: {
          ASSETS: {
            fetch: async () =>
              new Response("<html>SPA</html>", { headers: { "Content-Type": "text/html" } }),
          },
        },
      });
      expect(missing.status).toBe(404);
      expect(missing.headers.get("vary")).toContain("Accept");
      if (method === "HEAD") expect(await missing.text()).toBe("");
    }
  });

  it("leaves crawler assets outside Markdown content negotiation", async () => {
    for (const [path, contentType, body] of [
      ["/sitemap.xml", "application/xml", "<urlset />"],
      ["/robots.txt", "text/plain", "User-agent: *"],
    ] as const) {
      const response = await onRequest({
        request: new Request(`https://example.org${path}`, {
          headers: { Accept: "text/markdown" },
        }),
        env: {
          ASSETS: {
            fetch: async () => new Response(body, { headers: { "Content-Type": contentType } }),
          },
        },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe(contentType);
      expect(response.headers.get("link")).toBeNull();
      expect(response.headers.get("vary")).toBeNull();
      expect(await response.text()).toBe(body);
    }
  });
});
