"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontendAgent = void 0;
const logger_1 = require("../utils/logger");
class FrontendAgent {
    async generate(context) {
        logger_1.logger.info('Frontend Agent: Generating React application');
        const files = [];
        // Generate Vite config
        files.push(this.generateViteConfig());
        // Generate main entry point
        files.push(this.generateMain());
        // Generate App component
        files.push(this.generateApp(context));
        // Generate components
        files.push(...this.generateComponents(context));
        // Generate hooks
        files.push(...this.generateHooks());
        // Generate utils
        files.push(...this.generateUtils());
        // Generate Tailwind config
        files.push(this.generateTailwindConfig());
        return { files };
    }
    generateViteConfig() {
        return {
            path: 'frontend/vite.config.ts',
            content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
`,
            language: 'typescript',
            description: 'Vite configuration',
        };
    }
    generateMain() {
        return {
            path: 'frontend/src/main.tsx',
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
            language: 'typescript',
            description: 'Main entry point',
        };
    }
    generateApp(context) {
        return {
            path: 'frontend/src/App.tsx',
            content: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
${context.config.auth ? "import { Login } from './pages/Login';\nimport { PrivateRoute } from './components/PrivateRoute';" : ''}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          ${context.config.auth ? `
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />` : '<Route path="/dashboard" element={<Dashboard />} />'}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`,
            language: 'typescript',
            description: 'App component with routing',
        };
    }
    generateComponents(context) {
        const files = [];
        // Layout component
        files.push({
            path: 'frontend/src/components/Layout.tsx',
            content: `import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
`,
            language: 'typescript',
            description: 'Layout component',
        });
        // Header component
        files.push({
            path: 'frontend/src/components/Header.tsx',
            content: `import { Link } from 'react-router-dom';
${context.config.auth ? "import { useAuth } from '../hooks/useAuth';" : ''}

export function Header() {
  ${context.config.auth ? `const { user, logout } = useAuth();` : ''}

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            ${context.config.name}
          </Link>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            ${context.config.auth ? `
            {user ? (
              <button onClick={logout} className="text-gray-700 hover:text-gray-900">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
            )}` : ''}
          </div>
        </div>
      </nav>
    </header>
  );
}
`,
            language: 'typescript',
            description: 'Header component',
        });
        // Button component
        files.push({
            path: 'frontend/src/components/Button.tsx',
            content: `import { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded-lg transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'border-2 border-gray-300 hover:border-gray-400': variant === 'outline',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
`,
            language: 'typescript',
            description: 'Reusable Button component',
        });
        return files;
    }
    generateHooks() {
        return [{
                path: 'frontend/src/hooks/useAuth.ts',
                content: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        set({ user: data.user, token: data.token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
`,
                language: 'typescript',
                description: 'Authentication hook with Zustand',
            }];
    }
    generateUtils() {
        return [{
                path: 'frontend/src/utils/cn.ts',
                content: `import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
                language: 'typescript',
                description: 'Tailwind class name utility',
            }];
    }
    generateTailwindConfig() {
        return {
            path: 'frontend/tailwind.config.js',
            content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
            language: 'javascript',
            description: 'Tailwind CSS configuration',
        };
    }
}
exports.FrontendAgent = FrontendAgent;
//# sourceMappingURL=frontend.js.map