import { UniversalVideo, type VideoConfig } from "@/components/UniversalVideo";
import { UniversalImage } from "@/components/UniversalImage";
import { StatCard, type StatCardProps } from "@/components/molecules/StatCard";
import { SyllabusModuleCard, type SyllabusModuleCardProps } from "@/components/molecules/SyllabusModuleCard";
import type { ImageRef } from "@shared/schema";

interface UniversalVideoMolecule {
  id: string;
  component: "UniversalVideo";
  variant: string;
  description?: string;
  tags: string[];
  props: VideoConfig;
}

interface UniversalImageMolecule {
  id: string;
  component: "UniversalImage";
  variant: string;
  description?: string;
  tags: string[];
  props: ImageRef & { loading?: "lazy" | "eager" };
}

interface StatCardMolecule {
  id: string;
  component: "StatCard";
  variant: string;
  description?: string;
  tags: string[];
  props: StatCardProps;
}

interface SyllabusModuleCardMolecule {
  id: string;
  component: "SyllabusModuleCard";
  variant: string;
  description?: string;
  tags: string[];
  props: SyllabusModuleCardProps;
}

export type MoleculeDefinition = 
  | UniversalVideoMolecule 
  | UniversalImageMolecule 
  | StatCardMolecule 
  | SyllabusModuleCardMolecule;

interface MoleculeRendererProps {
  molecule: MoleculeDefinition;
}

export function MoleculeRenderer({ molecule }: MoleculeRendererProps) {
  switch (molecule.component) {
    case "UniversalVideo":
      return (
        <UniversalVideo
          url={molecule.props.url}
          ratio={molecule.props.ratio}
          muted={molecule.props.muted}
          autoplay={molecule.props.autoplay}
          loop={molecule.props.loop}
          preview_image_url={molecule.props.preview_image_url}
          withShadowBorder={molecule.props.with_shadow_border}
        />
      );
    case "UniversalImage":
      return (
        <UniversalImage
          id={molecule.props.id}
          preset={molecule.props.preset}
          alt={molecule.props.alt}
          className={molecule.props.className}
          loading={molecule.props.loading}
        />
      );
    case "StatCard":
      return (
        <div className="p-6">
          <StatCard
            value={molecule.props.value}
            title={molecule.props.title}
            use_card={molecule.props.use_card}
            card_color={molecule.props.card_color}
          />
        </div>
      );
    case "SyllabusModuleCard":
      return (
        <div className="p-6">
          <SyllabusModuleCard
            duration={molecule.props.duration}
            title={molecule.props.title}
            objectives={molecule.props.objectives}
            projects={molecule.props.projects}
            isActive={molecule.props.isActive}
            orientation={molecule.props.orientation}
          />
        </div>
      );
    default:
      return (
        <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
          Unknown molecule component: {(molecule as { component: string }).component}
        </div>
      );
  }
}
