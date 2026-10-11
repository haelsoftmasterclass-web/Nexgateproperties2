import Link from "next/link";

import { locationLine } from "@/lib/format";
import type { ProjectSummary } from "@/lib/types";

import { MediaImage } from "../content/MediaImage";
import { Icon } from "../ui/Icon";

export function ProjectCard({ project, index = 0, large }: { project: ProjectSummary; index?: number; large?: boolean }) {
  const location = locationLine([project.city, project.state_region]) || project.location_description;
  return (
    <article data-reveal="" style={{ ["--reveal-delay" as string]: (index % 3) * 90 }} className="group relative">
      <MediaImage
        src={project.hero_image}
        alt={project.hero_image_alt || project.name}
        sizes={large ? "(min-width:1024px) 60vw, 100vw" : "(min-width:1024px) 40vw, 100vw"}
        className={large ? "aspect-[16/10] rounded-card" : "aspect-[4/3] rounded-card"}
        label="Visuals to follow"
        badge={project.hero_image && project.hero_image_is_rendering ? "Artist’s impression" : undefined}
      />
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
            <span className="text-brand-500">{project.category_label}</span>
            <span className="text-muted/50">/</span>
            <span className="text-gold-700">{project.status_label}</span>
          </div>
          <h3 className="mt-3 text-2xl font-bold leading-tight text-ink">
            <Link href={`/projects/${project.slug}/`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {project.name}
            </Link>
          </h3>
          {location && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <Icon name="pin" size={15} />
              {location}
            </p>
          )}
          {project.summary && <p className="mt-3 max-w-xl leading-relaxed text-charcoal">{project.summary}</p>}
        </div>
        <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-line transition-all duration-500 group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
          <Icon name="arrowUpRight" size={18} />
        </span>
      </div>
    </article>
  );
}
