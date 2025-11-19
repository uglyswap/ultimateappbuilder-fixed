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
