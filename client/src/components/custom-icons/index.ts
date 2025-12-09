import Briefcase from "./Briefcase";
import ChecklistVerify from "./ChecklistVerify";
import CodeWindow from "./CodeWindow";
import Contract from "./Contract";
import FolderCheck from "./FolderCheck";
import Graduation from "./Graduation";
import GrowthChart from "./GrowthChart";
import HandsGroup from "./HandsGroup";
import Handshake from "./Handshake";
import Monitor from "./Monitor";
import PeopleGroup from "./PeopleGroup";
import RigobotIconTiny from "./RigobotIconTiny";
import Rocket from "./Rocket";
import Security from "./Security";
import StairsWithFlag from "./StairsWithFlag";

const customIcons: Record<string, React.ComponentType<{
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}>> = {
  Briefcase,
  ChecklistVerify,
  CodeWindow,
  Contract,
  FolderCheck,
  Graduation,
  GrowthChart,
  HandsGroup,
  Handshake,
  Monitor,
  PeopleGroup,
  RigobotIconTiny,
  Rocket,
  Security,
  StairsWithFlag,
};

export function getCustomIcon(name: string) {
  return customIcons[name] || null;
}

export {
  Briefcase,
  ChecklistVerify,
  CodeWindow,
  Contract,
  FolderCheck,
  Graduation,
  GrowthChart,
  HandsGroup,
  Handshake,
  Monitor,
  PeopleGroup,
  RigobotIconTiny,
  Rocket,
  Security,
  StairsWithFlag,
};
