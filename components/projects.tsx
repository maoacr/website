import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { projects } from "@/lib/data/projects";
import { SceneHeading } from "./scene-heading";
import { ProjectCard } from "./project-card";

export function Projects({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  // Data owns the "which projects are the headline case studies" decision
  // (see the `featured` flag in lib/data/projects.ts) — this component
  // only renders whatever the data says, so re-curating the case studies
  // later never touches this file (Open/Closed).
  const featuredProjects = projects.filter((project) => project.featured);
  const secondaryProjects = projects.filter((project) => !project.featured);

  return (
    <section
      id="proyectos"
      data-scene={dict.projects.slugline}
      aria-labelledby="projects-heading"
      className="border-t border-border px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SceneHeading slugline={dict.projects.slugline} title={dict.projects.title}>
          <p className="mt-4 max-w-xl text-muted">{dict.projects.subtitle}</p>
        </SceneHeading>

        <div className="grid gap-6 sm:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              index={index}
              ctaLabel={dict.projects.cta}
              size="lg"
            />
          ))}
        </div>

        {secondaryProjects.length > 0 && (
          <div className="mt-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {dict.projects.moreWorkTitle}
            </p>
            <p className="mt-2 max-w-xl text-sm text-muted">
              {dict.projects.moreWorkSubtitle}
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondaryProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                  index={index}
                  ctaLabel={dict.projects.cta}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
