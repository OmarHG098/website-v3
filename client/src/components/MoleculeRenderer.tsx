import NumberedSteps, { type NumberedStepsData } from "@/components/NumberedSteps";

interface NumberedStepsMolecule {
  id: string;
  component: "NumberedSteps";
  name: string;
  description?: string;
  tags: string[];
  props: NumberedStepsData;
}

export type MoleculeDefinition = NumberedStepsMolecule;

interface MoleculeRendererProps {
  molecule: MoleculeDefinition;
}

export function MoleculeRenderer({ molecule }: MoleculeRendererProps) {
  switch (molecule.component) {
    case "NumberedSteps":
      return <NumberedSteps data={molecule.props} />;
    default:
      return (
        <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
          Unknown molecule component: {(molecule as { component: string }).component}
        </div>
      );
  }
}
