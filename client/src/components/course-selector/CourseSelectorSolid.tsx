import { useState, useMemo, useCallback } from "react";
import type { CourseSelectorSection } from "@shared/schema";
import { IconArrowRight } from "@tabler/icons-react";
import { resolveColorVar, hslColorRaw } from "./shared";
import { CourseContent } from "./CourseContent";

interface CourseSelectorSolidProps {
  data: CourseSelectorSection;
}

export function CourseSelectorSolid({ data }: CourseSelectorSolidProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const courses = data.courses;
  const activeCourse = courses[activeIndex];

  const resolved = useMemo(() => {
    return resolveColorVar(activeCourse?.solid_background);
  }, [activeCourse?.solid_background]);

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (!courses || courses.length === 0) return null;

  return (
    <section
      className="w-full py-12 md:py-16"
      data-testid="section-course-selector"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {(data.heading || data.subheading) && (
          <div className="text-center mb-8 md:mb-12">
            {data.heading && (
              <h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-3"
                data-testid="text-heading"
              >
                {data.heading}
              </h2>
            )}
            {data.subheading && (
              <p
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                data-testid="text-subheading"
              >
                {data.subheading}
              </p>
            )}
          </div>
        )}

        <div
          className="rounded-2xl border overflow-hidden flex flex-col md:flex-row min-h-[420px]"
          data-testid="card-course-selector"
        >
          <div className="md:w-[280px] lg:w-[360px] shrink-0 bg-card flex flex-col">
            {courses.map((course, index) => {
              const isActive = index === activeIndex;
              const tabResolved = resolveColorVar(course.solid_background);
              return (
                <button
                  key={index}
                  onClick={() => handleTabClick(index)}
                  className={`
                    relative text-left px-5 py-4 transition-colors duration-200
                    flex items-center justify-between gap-2
                    ${isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                  style={isActive ? {
                    backgroundColor: hslColorRaw(tabResolved),
                  } : undefined}
                  data-testid={`button-tab-${index}`}
                >
                  <span className="text-sm md:text-lg">{course.name}</span>
                  {isActive && (
                    <IconArrowRight className="w-4 h-4 shrink-0 hidden md:block" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-4 md:p-8 lg:p-10 relative overflow-hidden transition-all duration-500">
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                backgroundColor: hslColorRaw(resolved),
              }}
            />
            {activeCourse && (
              <CourseContent course={activeCourse} resolved={resolved} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
