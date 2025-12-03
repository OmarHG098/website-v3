import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

const REGISTRY_PATH = path.join(process.cwd(), "marketing-content", "component-registry");

export interface ComponentSchema {
  name: string;
  version: string;
  component: string;
  file: string;
  description: string;
  when_to_use: string;
  props: Record<string, unknown>;
}

export interface ComponentExample {
  name: string;
  description: string;
  yaml: string;
}

export interface ComponentVersion {
  version: string;
  schema: ComponentSchema;
  examples: ComponentExample[];
}

export interface ComponentInfo {
  type: string;
  versions: ComponentVersion[];
  latestVersion: string;
}

export interface RegistryOverview {
  components: Array<{
    type: string;
    name: string;
    description: string;
    latestVersion: string;
    versions: string[];
  }>;
}

function parseVersion(version: string): number[] {
  return version.replace('v', '').split('.').map(Number);
}

function compareVersions(a: string, b: string): number {
  const aParts = parseVersion(a);
  const bParts = parseVersion(b);
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal !== bVal) return bVal - aVal;
  }
  return 0;
}

export function listComponents(): string[] {
  try {
    if (!fs.existsSync(REGISTRY_PATH)) {
      return [];
    }
    return fs.readdirSync(REGISTRY_PATH).filter(dir => {
      const dirPath = path.join(REGISTRY_PATH, dir);
      return fs.statSync(dirPath).isDirectory();
    });
  } catch (error) {
    console.error("Error listing components:", error);
    return [];
  }
}

export function listVersions(componentType: string): string[] {
  try {
    const componentPath = path.join(REGISTRY_PATH, componentType);
    if (!fs.existsSync(componentPath)) {
      return [];
    }
    const versions = fs.readdirSync(componentPath)
      .filter(dir => {
        const versionPath = path.join(componentPath, dir);
        return fs.statSync(versionPath).isDirectory() && dir.startsWith('v');
      })
      .sort(compareVersions);
    return versions;
  } catch (error) {
    console.error(`Error listing versions for ${componentType}:`, error);
    return [];
  }
}

export function loadSchema(componentType: string, version: string): ComponentSchema | null {
  try {
    const schemaPath = path.join(REGISTRY_PATH, componentType, version, "schema.yml");
    if (!fs.existsSync(schemaPath)) {
      return null;
    }
    const content = fs.readFileSync(schemaPath, "utf8");
    return yaml.load(content) as ComponentSchema;
  } catch (error) {
    console.error(`Error loading schema for ${componentType}/${version}:`, error);
    return null;
  }
}

export function loadExamples(componentType: string, version: string): ComponentExample[] {
  try {
    const examplesPath = path.join(REGISTRY_PATH, componentType, version, "examples");
    if (!fs.existsSync(examplesPath)) {
      return [];
    }
    const exampleFiles = fs.readdirSync(examplesPath)
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
    
    return exampleFiles.map(file => {
      const filePath = path.join(examplesPath, file);
      const content = fs.readFileSync(filePath, "utf8");
      const data = yaml.load(content) as { name?: string; description?: string; yaml?: string };
      
      return {
        name: data.name || file.replace(/\.(yml|yaml)$/, ''),
        description: data.description || '',
        yaml: data.yaml || content,
      };
    });
  } catch (error) {
    console.error(`Error loading examples for ${componentType}/${version}:`, error);
    return [];
  }
}

export function getComponentInfo(componentType: string): ComponentInfo | null {
  const versions = listVersions(componentType);
  if (versions.length === 0) {
    return null;
  }
  
  const componentVersions: ComponentVersion[] = versions.map(version => {
    const schema = loadSchema(componentType, version);
    const examples = loadExamples(componentType, version);
    return {
      version,
      schema: schema!,
      examples,
    };
  }).filter(v => v.schema !== null);
  
  return {
    type: componentType,
    versions: componentVersions,
    latestVersion: versions[0],
  };
}

export function getRegistryOverview(): RegistryOverview {
  const components = listComponents();
  
  return {
    components: components.map(type => {
      const versions = listVersions(type);
      const latestVersion = versions[0] || 'v1.0';
      const schema = loadSchema(type, latestVersion);
      
      return {
        type,
        name: schema?.name || type,
        description: schema?.description || '',
        latestVersion,
        versions,
      };
    }),
  };
}

export function createNewVersion(componentType: string, baseVersion: string): { success: boolean; newVersion: string; error?: string } {
  try {
    const versions = listVersions(componentType);
    if (!versions.includes(baseVersion)) {
      return { success: false, newVersion: '', error: `Base version ${baseVersion} not found` };
    }
    
    const baseParts = parseVersion(baseVersion);
    const newVersionStr = `v${baseParts[0]}.${(baseParts[1] || 0) + 1}`;
    
    const basePath = path.join(REGISTRY_PATH, componentType, baseVersion);
    const newPath = path.join(REGISTRY_PATH, componentType, newVersionStr);
    
    if (fs.existsSync(newPath)) {
      return { success: false, newVersion: '', error: `Version ${newVersionStr} already exists` };
    }
    
    fs.mkdirSync(newPath, { recursive: true });
    fs.mkdirSync(path.join(newPath, "examples"), { recursive: true });
    
    const schemaPath = path.join(basePath, "schema.yml");
    if (fs.existsSync(schemaPath)) {
      let schemaContent = fs.readFileSync(schemaPath, "utf8");
      schemaContent = schemaContent.replace(/version:\s*["']?[\d.]+["']?/, `version: "${newVersionStr.replace('v', '')}"`);
      fs.writeFileSync(path.join(newPath, "schema.yml"), schemaContent);
    }
    
    const examplesPath = path.join(basePath, "examples");
    if (fs.existsSync(examplesPath)) {
      const examples = fs.readdirSync(examplesPath);
      for (const example of examples) {
        const srcPath = path.join(examplesPath, example);
        const destPath = path.join(newPath, "examples", example);
        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    return { success: true, newVersion: newVersionStr };
  } catch (error) {
    console.error(`Error creating new version for ${componentType}:`, error);
    return { success: false, newVersion: '', error: String(error) };
  }
}

export function getExampleFilePath(componentType: string, version: string): string {
  return path.join("marketing-content", "component-registry", componentType, version, "examples");
}
