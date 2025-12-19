import { UniversalVideo, type VideoConfig } from "@/components/UniversalVideo";
import { UniversalImage } from "@/components/UniversalImage";
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

export type MoleculeDefinition = UniversalVideoMolecule | UniversalImageMolecule;

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
    default:
      return (
        <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
          Unknown molecule component: {(molecule as { component: string }).component}
        </div>
      );
  }
}
