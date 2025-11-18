import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';
import { universalAIClient } from '@/utils/universal-ai-client';

const prisma = new PrismaClient();

/**
 * Visual Editor Service - Drag & Drop UI Builder
 *
 * This service powers the visual editor that allows users to:
 * - Drag & drop UI components
 * - Visually design their application
 * - Generate production-ready code from visual designs
 * - Preview changes in real-time
 */

export interface ComponentDefinition {
  id: string;
  type: string;
  name: string;
  category: 'layout' | 'form' | 'data' | 'navigation' | 'feedback' | 'media';
  props: Record<string, any>;
  children?: ComponentDefinition[];
  styles?: Record<string, any>;
}

export interface PageDesign {
  id: string;
  projectId: string;
  pageName: string;
  route: string;
  components: ComponentDefinition[];
  metadata: {
    title?: string;
    description?: string;
    responsive?: boolean;
  };
}

export const COMPONENT_LIBRARY: Record<string, {
  name: string;
  category: string;
  description: string;
  defaultProps: Record<string, any>;
  codeTemplate: string;
}> = {
  // ====================
  // Layout Components
  // ====================
  Container: {
    name: 'Container',
    category: 'layout',
    description: 'Responsive container with max-width',
    defaultProps: {
      maxWidth: 'lg',
      padding: 4,
      centered: true,
    },
    codeTemplate: `<div className="container mx-auto max-w-{{maxWidth}} px-{{padding}}">\n  {{children}}\n</div>`,
  },
  Grid: {
    name: 'Grid',
    category: 'layout',
    description: 'Responsive grid layout',
    defaultProps: {
      columns: 3,
      gap: 4,
      responsive: true,
    },
    codeTemplate: `<div className="grid grid-cols-1 md:grid-cols-{{columns}} gap-{{gap}}">\n  {{children}}\n</div>`,
  },
  Flex: {
    name: 'Flex',
    category: 'layout',
    description: 'Flexbox container',
    defaultProps: {
      direction: 'row',
      justify: 'start',
      align: 'center',
      gap: 2,
    },
    codeTemplate: `<div className="flex flex-{{direction}} justify-{{justify}} items-{{align}} gap-{{gap}}">\n  {{children}}\n</div>`,
  },
  Card: {
    name: 'Card',
    category: 'layout',
    description: 'Card container with shadow',
    defaultProps: {
      shadow: 'md',
      padding: 6,
      rounded: 'lg',
    },
    codeTemplate: `<div className="bg-white shadow-{{shadow}} rounded-{{rounded}} p-{{padding}}">\n  {{children}}\n</div>`,
  },

  // ====================
  // Form Components
  // ====================
  Input: {
    name: 'Input',
    category: 'form',
    description: 'Text input field',
    defaultProps: {
      type: 'text',
      placeholder: '',
      label: '',
      required: false,
    },
    codeTemplate: `<div className="mb-4">
  {{#if label}}<label className="block text-sm font-medium mb-2">{{label}}</label>{{/if}}
  <input type="{{type}}" placeholder="{{placeholder}}" {{#if required}}required{{/if}} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
</div>`,
  },
  Button: {
    name: 'Button',
    category: 'form',
    description: 'Button component',
    defaultProps: {
      variant: 'primary',
      size: 'md',
      text: 'Button',
      fullWidth: false,
    },
    codeTemplate: `<button className="btn btn-{{variant}} btn-{{size}} {{#if fullWidth}}w-full{{/if}}">{{text}}</button>`,
  },
  Form: {
    name: 'Form',
    category: 'form',
    description: 'Form container',
    defaultProps: {
      method: 'POST',
      onSubmit: 'handleSubmit',
    },
    codeTemplate: `<form method="{{method}}" onSubmit={{{onSubmit}}}>\n  {{children}}\n</form>`,
  },
  Select: {
    name: 'Select',
    category: 'form',
    description: 'Dropdown select',
    defaultProps: {
      label: '',
      options: [],
      placeholder: 'Select option',
    },
    codeTemplate: `<div className="mb-4">
  {{#if label}}<label className="block text-sm font-medium mb-2">{{label}}</label>{{/if}}
  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
    <option value="">{{placeholder}}</option>
    {{#each options}}
    <option value="{{value}}">{{label}}</option>
    {{/each}}
  </select>
</div>`,
  },
  Checkbox: {
    name: 'Checkbox',
    category: 'form',
    description: 'Checkbox input',
    defaultProps: {
      label: '',
      checked: false,
    },
    codeTemplate: `<label className="flex items-center space-x-2">
  <input type="checkbox" {{#if checked}}checked{{/if}} className="w-4 h-4 text-blue-600 rounded" />
  <span>{{label}}</span>
</label>`,
  },

  // ====================
  // Data Display
  // ====================
  Table: {
    name: 'Table',
    category: 'data',
    description: 'Data table',
    defaultProps: {
      columns: [],
      striped: true,
      hoverable: true,
    },
    codeTemplate: `<table className="w-full {{#if striped}}table-striped{{/if}} {{#if hoverable}}table-hover{{/if}}">
  <thead>
    <tr>
      {{#each columns}}
      <th className="px-4 py-2 text-left">{{this}}</th>
      {{/each}}
    </tr>
  </thead>
  <tbody>
    {{children}}
  </tbody>
</table>`,
  },
  List: {
    name: 'List',
    category: 'data',
    description: 'Ordered or unordered list',
    defaultProps: {
      type: 'ul',
      items: [],
    },
    codeTemplate: `<{{type}} className="list-disc pl-6">
  {{#each items}}
  <li>{{this}}</li>
  {{/each}}
</{{type}}>`,
  },

  // ====================
  // Navigation
  // ====================
  Navbar: {
    name: 'Navbar',
    category: 'navigation',
    description: 'Navigation bar',
    defaultProps: {
      logo: '',
      links: [],
      sticky: true,
    },
    codeTemplate: `<nav className="bg-white shadow-md {{#if sticky}}sticky top-0{{/if}}">
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <div className="text-xl font-bold">{{logo}}</div>
    <div className="space-x-4">
      {{#each links}}
      <a href="{{url}}" className="hover:text-blue-600">{{label}}</a>
      {{/each}}
    </div>
  </div>
</nav>`,
  },
  Sidebar: {
    name: 'Sidebar',
    category: 'navigation',
    description: 'Sidebar navigation',
    defaultProps: {
      width: '256px',
      links: [],
    },
    codeTemplate: `<aside className="w-64 bg-gray-100 h-screen p-4">
  <nav className="space-y-2">
    {{#each links}}
    <a href="{{url}}" className="block px-4 py-2 rounded hover:bg-gray-200">{{label}}</a>
    {{/each}}
  </nav>
</aside>`,
  },
  Breadcrumbs: {
    name: 'Breadcrumbs',
    category: 'navigation',
    description: 'Breadcrumb navigation',
    defaultProps: {
      items: [],
    },
    codeTemplate: `<nav className="flex space-x-2 text-sm">
  {{#each items}}
  <a href="{{url}}" className="text-blue-600 hover:underline">{{label}}</a>
  {{#unless @last}}<span>/</span>{{/unless}}
  {{/each}}
</nav>`,
  },

  // ====================
  // Feedback
  // ====================
  Alert: {
    name: 'Alert',
    category: 'feedback',
    description: 'Alert message',
    defaultProps: {
      type: 'info',
      message: '',
      dismissible: false,
    },
    codeTemplate: `<div className="alert alert-{{type}} {{#if dismissible}}alert-dismissible{{/if}}" role="alert">
  {{message}}
</div>`,
  },
  Modal: {
    name: 'Modal',
    category: 'feedback',
    description: 'Modal dialog',
    defaultProps: {
      title: '',
      size: 'md',
      closeButton: true,
    },
    codeTemplate: `<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white rounded-lg max-w-{{size}} w-full p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">{{title}}</h2>
      {{#if closeButton}}<button className="text-gray-500 hover:text-gray-700">×</button>{{/if}}
    </div>
    {{children}}
  </div>
</div>`,
  },
  Toast: {
    name: 'Toast',
    category: 'feedback',
    description: 'Toast notification',
    defaultProps: {
      type: 'success',
      message: '',
      position: 'top-right',
    },
    codeTemplate: `<div className="toast toast-{{type}} toast-{{position}}">{{message}}</div>`,
  },

  // ====================
  // Media
  // ====================
  Image: {
    name: 'Image',
    category: 'media',
    description: 'Image component',
    defaultProps: {
      src: '',
      alt: '',
      width: 'full',
      rounded: false,
    },
    codeTemplate: `<img src="{{src}}" alt="{{alt}}" className="w-{{width}} {{#if rounded}}rounded-full{{/if}}" />`,
  },
  Video: {
    name: 'Video',
    category: 'media',
    description: 'Video player',
    defaultProps: {
      src: '',
      controls: true,
      autoplay: false,
    },
    codeTemplate: `<video src="{{src}}" {{#if controls}}controls{{/if}} {{#if autoplay}}autoplay{{/if}} className="w-full"></video>`,
  },
  Icon: {
    name: 'Icon',
    category: 'media',
    description: 'Icon component',
    defaultProps: {
      name: 'star',
      size: 'md',
      color: 'current',
    },
    codeTemplate: `<i className="icon-{{name}} text-{{size}} text-{{color}}"></i>`,
  },
};

export class VisualEditorService {
  /**
   * Create a new visual design
   */
  async createDesign(projectId: string, pageName: string, route: string): Promise<PageDesign> {
    logger.info(`Creating visual design for ${pageName} in project ${projectId}`);

    const design: PageDesign = {
      id: `design_${Date.now()}`,
      projectId,
      pageName,
      route,
      components: [],
      metadata: {
        responsive: true,
      },
    };

    return design;
  }

  /**
   * Add component to design
   */
  async addComponent(
    designId: string,
    componentType: string,
    parentId?: string,
    props?: Record<string, any>
  ): Promise<ComponentDefinition> {
    const componentDef = COMPONENT_LIBRARY[componentType];
    if (!componentDef) {
      throw new Error(`Component type ${componentType} not found in library`);
    }

    const component: ComponentDefinition = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: componentType,
      name: componentDef.name,
      category: componentDef.category as any,
      props: { ...componentDef.defaultProps, ...props },
      children: [],
    };

    logger.info(`Added component ${componentType} to design ${designId}`);
    return component;
  }

  /**
   * Generate React code from visual design
   */
  async generateCodeFromDesign(design: PageDesign): Promise<{
    componentCode: string;
    routeConfig: string;
  }> {
    logger.info(`Generating code for design: ${design.pageName}`);

    // Use AI to generate high-quality, production-ready code
    const prompt = `Generate a production-ready React component from this visual design:

Page: ${design.pageName}
Route: ${design.route}
Components: ${JSON.stringify(design.components, null, 2)}

Requirements:
- Use React 18+ with TypeScript
- Use Tailwind CSS for styling
- Include proper TypeScript types
- Add proper error handling
- Make it responsive
- Include accessibility attributes
- Use modern React patterns (hooks, functional components)
- Add comments for complex logic

Generate ONLY the component code, nothing else.`;

    const result = await universalAIClient.generateCode(prompt, 'frontend', {
      autonomousMode: true,
    });

    // Generate route configuration
    const routeConfig = `{
  path: '${design.route}',
  component: ${this.toPascalCase(design.pageName)},
  meta: {
    title: '${design.metadata.title || design.pageName}',
    description: '${design.metadata.description || ''}',
  },
}`;

    return {
      componentCode: result.content,
      routeConfig,
    };
  }

  /**
   * Generate code for a single component
   */
  private generateComponentCode(component: ComponentDefinition): string {
    const template = COMPONENT_LIBRARY[component.type]?.codeTemplate || '';
    let code = template;

    // Replace props in template
    Object.entries(component.props).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      code = code.replace(regex, String(value));
    });

    // Handle children
    if (component.children && component.children.length > 0) {
      const childrenCode = component.children
        .map(child => this.generateComponentCode(child))
        .join('\n');
      code = code.replace('{{children}}', childrenCode);
    } else {
      code = code.replace('{{children}}', '');
    }

    return code;
  }

  /**
   * Save visual design to database
   */
  async saveDesign(design: PageDesign): Promise<void> {
    // Get existing project config
    const project = await prisma.project.findUnique({
      where: { id: design.projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const existingConfig = project.config as any || {};
    const visualDesigns = existingConfig.visualDesigns || {};

    // Save to database - store as JSON in project config
    await prisma.project.update({
      where: { id: design.projectId },
      data: {
        config: {
          ...existingConfig,
          visualDesigns: {
            ...visualDesigns,
            [design.id]: design,
          },
        } as any,
      },
    });

    logger.info(`Saved visual design ${design.id} to database`);
  }

  /**
   * Get component library
   */
  getComponentLibrary(): typeof COMPONENT_LIBRARY {
    return COMPONENT_LIBRARY;
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category: string): Array<{
    type: string;
    name: string;
    description: string;
  }> {
    return Object.entries(COMPONENT_LIBRARY)
      .filter(([, comp]) => comp.category === category)
      .map(([type, comp]) => ({
        type,
        name: comp.name,
        description: comp.description,
      }));
  }

  /**
   * Generate complete page from AI description
   */
  async generatePageFromDescription(
    projectId: string,
    pageName: string,
    description: string
  ): Promise<PageDesign> {
    logger.info(`Generating page ${pageName} from AI description`);

    const prompt = `You are a visual designer. Create a page design using the available components.

Page Name: ${pageName}
Description: ${description}

Available components: ${Object.keys(COMPONENT_LIBRARY).join(', ')}

Create a logical component structure for this page. Return ONLY valid JSON in this format:
{
  "pageName": "${pageName}",
  "route": "/generated-route",
  "components": [
    {
      "type": "ComponentType",
      "props": { ... },
      "children": [ ... ]
    }
  ],
  "metadata": {
    "title": "Page Title",
    "description": "Page description"
  }
}`;

    const result = await universalAIClient.generateCode(prompt, 'frontend', {
      autonomousMode: true,
      temperature: 0.7,
    });

    try {
      const designData = JSON.parse(result.content);
      const design: PageDesign = {
        id: `design_${Date.now()}`,
        projectId,
        pageName: designData.pageName || pageName,
        route: designData.route || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
        components: designData.components || [],
        metadata: designData.metadata || {},
      };

      return design;
    } catch (error) {
      logger.error('Failed to parse AI-generated design', { error });
      throw new Error('AI generated invalid page design');
    }
  }

  /**
   * Helper to convert to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}

export const visualEditorService = new VisualEditorService();
