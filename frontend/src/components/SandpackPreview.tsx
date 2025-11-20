import { useMemo } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview as SandpackPreviewPane,
  SandpackConsole,
} from '@codesandbox/sandpack-react';
import { Monitor } from 'lucide-react';
import type { GeneratedFile } from '../types';

interface SandpackPreviewProps {
  files: GeneratedFile[];
  showEditor?: boolean;
  showConsole?: boolean;
}

export function SandpackPreview({
  files,
  showEditor = true,
  showConsole = false
}: SandpackPreviewProps) {
  // Convert files to Sandpack format
  const sandpackFiles = useMemo(() => {
    const result: Record<string, string> = {};

    files.forEach((file) => {
      // Ensure path starts with /
      let path = file.path.startsWith('/') ? file.path : `/${file.path}`;
      // Clean up the path
      path = path.replace(/\/+/g, '/');
      result[path] = file.content;
    });

    // Check if we have an entry point
    const hasApp = result['/App.tsx'] || result['/App.jsx'] || result['/App.js'];
    const hasIndex = result['/index.tsx'] || result['/index.jsx'] || result['/index.js'];

    // If no entry point, create a wrapper
    if (!hasApp && !hasIndex) {
      // Find main component file (prefer files in root or src directory)
      const mainFile = files.find(f =>
        (f.path.endsWith('.tsx') || f.path.endsWith('.jsx')) &&
        !f.path.includes('node_modules') &&
        !f.path.includes('test')
      ) || files.find(f =>
        f.path.endsWith('.tsx') || f.path.endsWith('.jsx')
      );

      if (mainFile) {
        // Extract component name from file
        const fileName = mainFile.path.replace(/^.*[\\/]/, '').replace(/\.(tsx|jsx)$/, '');
        // PascalCase the component name
        const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

        let importPath = mainFile.path.startsWith('/')
          ? mainFile.path.replace(/\.(tsx|jsx)$/, '')
          : `/${mainFile.path.replace(/\.(tsx|jsx)$/, '')}`;

        // Clean import path
        importPath = importPath.replace(/\/+/g, '/');

        result['/App.tsx'] = `import ${componentName} from '${importPath}';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <${componentName} />
    </div>
  );
}`;
      } else {
        // Create a default component showing the files
        const fileList = files.map(f => `• ${f.path}`).join('\n');
        result['/App.tsx'] = `export default function App() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Generated Files</h1>
      <div className="bg-white p-4 rounded-lg shadow border">
        <pre className="text-sm text-gray-600 whitespace-pre-wrap">${fileList}</pre>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        These files may not have a React entry point.
        Check the Code tab for the full content.
      </p>
    </div>
  );
}`;
      }
    }

    return result;
  }, [files]);

  // Determine template based on files
  const template = useMemo(() => {
    const hasTypeScript = files.some(f => f.path.endsWith('.ts') || f.path.endsWith('.tsx'));
    const hasNextConfig = files.some(f => f.path.includes('next.config'));

    if (hasNextConfig) {
      return 'nextjs' as const;
    }

    return hasTypeScript ? 'react-ts' as const : 'react' as const;
  }, [files]);

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-2">No Code to Preview</p>
          <p className="text-sm text-gray-500">
            Generate some code to see the live preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <SandpackProvider
        template={template}
        files={sandpackFiles}
        theme="light"
        options={{
          externalResources: [
            'https://cdn.tailwindcss.com',
          ],
          recompileMode: 'delayed',
          recompileDelay: 500,
        }}
        customSetup={{
          dependencies: {
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            'lucide-react': '^0.356.0',
            '@tanstack/react-query': '^5.0.0',
            'zustand': '^4.5.0',
            'axios': '^1.6.0',
            'date-fns': '^3.0.0',
            'clsx': '^2.1.0',
            'tailwind-merge': '^2.2.0',
          },
        }}
      >
        <SandpackLayout className="!h-full !rounded-none !border-0">
          {showEditor && (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              closableTabs
              style={{
                height: '100%',
                minWidth: '40%',
              }}
            />
          )}
          <SandpackPreviewPane
            showOpenInCodeSandbox={false}
            showRefreshButton
            style={{
              height: '100%',
              flex: 1,
            }}
          />
          {showConsole && (
            <SandpackConsole
              style={{
                height: '150px',
              }}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

// Simplified preview-only version
export function SandpackPreviewOnly({ files }: { files: GeneratedFile[] }) {
  return <SandpackPreview files={files} showEditor={false} showConsole={false} />;
}
