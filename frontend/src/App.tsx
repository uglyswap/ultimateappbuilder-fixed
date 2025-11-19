import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { SettingsPage } from './pages/SettingsPage';
import { FromScratchPage } from './pages/FromScratchPage';
import { DashboardPage } from './pages/DashboardPage';
import { TestingSuitePage } from './pages/TestingSuitePage';
import { DeploymentManagerPage } from './pages/DeploymentManagerPage';
import { VisualEditorPage } from './pages/VisualEditorPage';
import { GraphQLGeneratorPage } from './pages/GraphQLGeneratorPage';
import { MobileAppGeneratorPage } from './pages/MobileAppGeneratorPage';
import { CodeReviewPage } from './pages/CodeReviewPage';
import { DatabaseToolsPage } from './pages/DatabaseToolsPage';
import { MicroservicesPage } from './pages/MicroservicesPage';
import { I18NPage } from './pages/I18NPage';
import { PremiumTemplatesPage } from './pages/PremiumTemplatesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="create" element={<CreateProjectPage />} />
            <Route path="projects" element={<ProjectsListPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="projects/:projectId/testing" element={<TestingSuitePage />} />
            <Route path="projects/:projectId/deployments" element={<DeploymentManagerPage />} />
            <Route path="build-from-scratch" element={<FromScratchPage />} />
            <Route path="testing" element={<TestingSuitePage />} />
            <Route path="deployments" element={<DeploymentManagerPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="visual-editor" element={<VisualEditorPage />} />
            <Route path="projects/:projectId/visual-editor" element={<VisualEditorPage />} />
            <Route path="graphql" element={<GraphQLGeneratorPage />} />
            <Route path="projects/:projectId/graphql" element={<GraphQLGeneratorPage />} />
            <Route path="mobile-app" element={<MobileAppGeneratorPage />} />
            <Route path="projects/:projectId/mobile-app" element={<MobileAppGeneratorPage />} />
            <Route path="code-review" element={<CodeReviewPage />} />
            <Route path="projects/:projectId/code-review" element={<CodeReviewPage />} />
            <Route path="database-tools" element={<DatabaseToolsPage />} />
            <Route path="projects/:projectId/database-tools" element={<DatabaseToolsPage />} />
            <Route path="microservices" element={<MicroservicesPage />} />
            <Route path="projects/:projectId/microservices" element={<MicroservicesPage />} />
            <Route path="i18n" element={<I18NPage />} />
            <Route path="projects/:projectId/i18n" element={<I18NPage />} />
            <Route path="premium-templates" element={<PremiumTemplatesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export { App };
export default App;
