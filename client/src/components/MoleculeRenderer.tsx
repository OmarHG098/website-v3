import NumberedSteps, { type NumberedStepsData } from "@/components/NumberedSteps";

export interface MoleculeDefinition {
  id: string;
  component: string;
  name: string;
  description?: string;
  tags: string[];
  props: Record<string, unknown>;
}

interface MoleculeRendererProps {
  molecule: MoleculeDefinition;
}

export function MoleculeRenderer({ molecule }: MoleculeRendererProps) {
  const { component, props } = molecule;

  switch (component) {
    case "NumberedSteps":
      return <NumberedSteps data={props as unknown as NumberedStepsData} />;
    default:
      return (
        <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
          Unknown molecule component: {component}
        </div>
      );
  }
}
