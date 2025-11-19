import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  projectsApi,
  generationsApi,
  templatesApi,
  aiModelsApi,
  customPromptsApi,
  visualEditorApi,
  graphqlGeneratorApi,
  mobileAppGeneratorApi,
  deploymentApi,
  testingApi,
  codeReviewApi,
  jobQueueApi,
  autoDatabaseApi,
  pluginSystemApi,
  microservicesGeneratorApi,
  i18nGeneratorApi,
  premiumTemplatesApi,
  systemApi,
} from '../services/api';

// =============================================================================
// PROJECTS HOOKS
// =============================================================================
export const useProjects = (params?: { page?: number; pageSize?: number; status?: string }) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.list(params),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => projectsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useGenerateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.generate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });
};

// =============================================================================
// GENERATIONS HOOKS
// =============================================================================
export const useGenerations = (projectId: string) => {
  return useQuery({
    queryKey: ['generations', projectId],
    queryFn: () => generationsApi.list(projectId),
    enabled: !!projectId,
  });
};

export const useGeneration = (id: string) => {
  return useQuery({
    queryKey: ['generation', id],
    queryFn: () => generationsApi.get(id),
    enabled: !!id,
  });
};

// =============================================================================
// TEMPLATES HOOKS
// =============================================================================
export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.list(),
  });
};

export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesApi.get(id),
    enabled: !!id,
  });
};

// =============================================================================
// AI MODELS HOOKS
// =============================================================================
export const useAIModels = () => {
  return useQuery({
    queryKey: ['ai-models'],
    queryFn: () => aiModelsApi.list(),
  });
};

export const useAIModel = (id: string) => {
  return useQuery({
    queryKey: ['ai-model', id],
    queryFn: () => aiModelsApi.get(id),
    enabled: !!id,
  });
};

export const useAIModelsByProvider = (provider: string) => {
  return useQuery({
    queryKey: ['ai-models', 'provider', provider],
    queryFn: () => aiModelsApi.getByProvider(provider),
    enabled: !!provider,
  });
};

// =============================================================================
// CUSTOM PROMPTS HOOKS
// =============================================================================
export const useCustomPrompts = () => {
  return useQuery({
    queryKey: ['custom-prompts'],
    queryFn: () => customPromptsApi.list(),
  });
};

export const useCustomPrompt = (id: string) => {
  return useQuery({
    queryKey: ['custom-prompt', id],
    queryFn: () => customPromptsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateCustomPrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      category: string;
      prompt: string;
      variables?: string[];
    }) => customPromptsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-prompts'] });
    },
  });
};

export const useUpdateCustomPrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => customPromptsApi.update(id, data as Parameters<typeof customPromptsApi.update>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-prompts'] });
    },
  });
};

export const useDeleteCustomPrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customPromptsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-prompts'] });
    },
  });
};

// =============================================================================
// VISUAL EDITOR HOOKS
// =============================================================================
export const useVisualEditorCanvas = (projectId: string) => {
  return useQuery({
    queryKey: ['visual-editor', 'canvas', projectId],
    queryFn: () => visualEditorApi.getCanvas(projectId),
    enabled: !!projectId,
  });
};

export const useSaveVisualEditorCanvas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof visualEditorApi.saveCanvas>[1] }) =>
      visualEditorApi.saveCanvas(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['visual-editor', 'canvas', projectId] });
    },
  });
};

export const useVisualEditorComponents = () => {
  return useQuery({
    queryKey: ['visual-editor', 'components'],
    queryFn: () => visualEditorApi.getComponents(),
  });
};

export const useGenerateVisualEditorCode = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: { framework: string; styling: string } }) =>
      visualEditorApi.generateCode(projectId, data),
  });
};

// =============================================================================
// GRAPHQL GENERATOR HOOKS
// =============================================================================
export const useGraphQLSchema = (projectId: string) => {
  return useQuery({
    queryKey: ['graphql-schema', projectId],
    queryFn: () => graphqlGeneratorApi.getSchema(projectId),
    enabled: !!projectId,
  });
};

export const useSaveGraphQLSchema = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof graphqlGeneratorApi.saveSchema>[1] }) =>
      graphqlGeneratorApi.saveSchema(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['graphql-schema', projectId] });
    },
  });
};

export const useGenerateGraphQLResolvers = () => {
  return useMutation({
    mutationFn: (projectId: string) => graphqlGeneratorApi.generateResolvers(projectId),
  });
};

export const useValidateGraphQLSchema = () => {
  return useMutation({
    mutationFn: ({ projectId, schema }: { projectId: string; schema: string }) =>
      graphqlGeneratorApi.validateSchema(projectId, schema),
  });
};

export const useGenerateGraphQLFromDatabase = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: { tables: string[]; includeRelations: boolean } }) =>
      graphqlGeneratorApi.generateFromDatabase(projectId, data),
  });
};

// =============================================================================
// MOBILE APP GENERATOR HOOKS
// =============================================================================
export const useGenerateMobileApp = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof mobileAppGeneratorApi.generate>[1] }) =>
      mobileAppGeneratorApi.generate(projectId, data),
  });
};

export const useMobileAppScreens = (projectId: string) => {
  return useQuery({
    queryKey: ['mobile-app-screens', projectId],
    queryFn: () => mobileAppGeneratorApi.getScreens(projectId),
    enabled: !!projectId,
  });
};

export const useSaveMobileAppScreens = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof mobileAppGeneratorApi.saveScreens>[1] }) =>
      mobileAppGeneratorApi.saveScreens(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['mobile-app-screens', projectId] });
    },
  });
};

// =============================================================================
// DEPLOYMENT HOOKS
// =============================================================================
export const useDeployments = (projectId: string) => {
  return useQuery({
    queryKey: ['deployments', projectId],
    queryFn: () => deploymentApi.list(projectId),
    enabled: !!projectId,
  });
};

export const useDeployment = (deploymentId: string) => {
  return useQuery({
    queryKey: ['deployment', deploymentId],
    queryFn: () => deploymentApi.get(deploymentId),
    enabled: !!deploymentId,
  });
};

export const useCreateDeployment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof deploymentApi.create>[0]) => deploymentApi.create(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['deployments', data.projectId] });
    },
  });
};

export const useDeploy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deploymentId: string) => deploymentApi.deploy(deploymentId),
    onSuccess: (_, deploymentId) => {
      queryClient.invalidateQueries({ queryKey: ['deployment', deploymentId] });
    },
  });
};

export const useRollbackDeployment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deploymentId, version }: { deploymentId: string; version: string }) =>
      deploymentApi.rollback(deploymentId, version),
    onSuccess: (_, { deploymentId }) => {
      queryClient.invalidateQueries({ queryKey: ['deployment', deploymentId] });
    },
  });
};

export const useDeploymentLogs = (deploymentId: string) => {
  return useQuery({
    queryKey: ['deployment-logs', deploymentId],
    queryFn: () => deploymentApi.getLogs(deploymentId),
    enabled: !!deploymentId,
  });
};

export const useDeploymentMetrics = (deploymentId: string) => {
  return useQuery({
    queryKey: ['deployment-metrics', deploymentId],
    queryFn: () => deploymentApi.getMetrics(deploymentId),
    enabled: !!deploymentId,
  });
};

// =============================================================================
// TESTING HOOKS
// =============================================================================
export const useGenerateTests = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof testingApi.generateTests>[1] }) =>
      testingApi.generateTests(projectId, data),
  });
};

export const useRunTests = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data?: Parameters<typeof testingApi.runTests>[1] }) =>
      testingApi.runTests(projectId, data),
  });
};

export const useTestResults = (projectId: string, testRunId?: string) => {
  return useQuery({
    queryKey: ['test-results', projectId, testRunId],
    queryFn: () => testingApi.getResults(projectId, testRunId),
    enabled: !!projectId,
  });
};

export const useTestCoverage = (projectId: string) => {
  return useQuery({
    queryKey: ['test-coverage', projectId],
    queryFn: () => testingApi.getCoverage(projectId),
    enabled: !!projectId,
  });
};

export const useGenerateMocks = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof testingApi.generateMocks>[1] }) =>
      testingApi.generateMocks(projectId, data),
  });
};

export const useGenerateFixtures = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof testingApi.generateFixtures>[1] }) =>
      testingApi.generateFixtures(projectId, data),
  });
};

export const useLint = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data?: Parameters<typeof testingApi.lint>[1] }) =>
      testingApi.lint(projectId, data),
  });
};

export const useSecurityScan = () => {
  return useMutation({
    mutationFn: (projectId: string) => testingApi.securityScan(projectId),
  });
};

export const usePerformanceTest = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof testingApi.performanceTest>[1] }) =>
      testingApi.performanceTest(projectId, data),
  });
};

export const useAccessibilityTest = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data?: Parameters<typeof testingApi.accessibilityTest>[1] }) =>
      testingApi.accessibilityTest(projectId, data),
  });
};

// =============================================================================
// CODE REVIEW HOOKS
// =============================================================================
export const useCodeReview = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data?: Parameters<typeof codeReviewApi.review>[1] }) =>
      codeReviewApi.review(projectId, data),
  });
};

export const useCodeReviewIssues = (projectId: string) => {
  return useQuery({
    queryKey: ['code-review-issues', projectId],
    queryFn: () => codeReviewApi.getIssues(projectId),
    enabled: !!projectId,
  });
};

export const useFixCodeReviewIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, issueId }: { projectId: string; issueId: string }) =>
      codeReviewApi.fixIssue(projectId, issueId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['code-review-issues', projectId] });
    },
  });
};

export const useCodeReviewSuggestions = (projectId: string) => {
  return useQuery({
    queryKey: ['code-review-suggestions', projectId],
    queryFn: () => codeReviewApi.getSuggestions(projectId),
    enabled: !!projectId,
  });
};

// =============================================================================
// JOB QUEUE HOOKS
// =============================================================================
export const useJobStatus = (jobId: string) => {
  return useQuery({
    queryKey: ['job-status', jobId],
    queryFn: () => jobQueueApi.getStatus(jobId),
    enabled: !!jobId,
    refetchInterval: 2000, // Poll every 2 seconds
  });
};

export const useQueueStats = () => {
  return useQuery({
    queryKey: ['queue-stats'],
    queryFn: () => jobQueueApi.getQueueStats(),
    refetchInterval: 5000,
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobQueueApi.cancelJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['job-status', jobId] });
    },
  });
};

export const useRetryJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobQueueApi.retryJob(jobId),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['job-status', jobId] });
    },
  });
};

// =============================================================================
// AUTO DATABASE HOOKS
// =============================================================================
export const useAnalyzeSchema = () => {
  return useMutation({
    mutationFn: (projectId: string) => autoDatabaseApi.analyzeSchema(projectId),
  });
};

export const useGenerateMigrations = () => {
  return useMutation({
    mutationFn: (projectId: string) => autoDatabaseApi.generateMigrations(projectId),
  });
};

export const useSuggestIndexes = (projectId: string) => {
  return useQuery({
    queryKey: ['suggest-indexes', projectId],
    queryFn: () => autoDatabaseApi.suggestIndexes(projectId),
    enabled: !!projectId,
  });
};

export const useOptimizeQueries = () => {
  return useMutation({
    mutationFn: (projectId: string) => autoDatabaseApi.optimizeQueries(projectId),
  });
};

// =============================================================================
// PLUGIN SYSTEM HOOKS
// =============================================================================
export const usePlugins = () => {
  return useQuery({
    queryKey: ['plugins'],
    queryFn: () => pluginSystemApi.list(),
  });
};

export const usePlugin = (pluginId: string) => {
  return useQuery({
    queryKey: ['plugin', pluginId],
    queryFn: () => pluginSystemApi.get(pluginId),
    enabled: !!pluginId,
  });
};

export const useInstallPlugin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pluginId: string) => pluginSystemApi.install(pluginId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
    },
  });
};

export const useUninstallPlugin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pluginId: string) => pluginSystemApi.uninstall(pluginId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
    },
  });
};

export const useConfigurePlugin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pluginId, config }: { pluginId: string; config: unknown }) =>
      pluginSystemApi.configure(pluginId, config),
    onSuccess: (_, { pluginId }) => {
      queryClient.invalidateQueries({ queryKey: ['plugin', pluginId] });
    },
  });
};

// =============================================================================
// MICROSERVICES GENERATOR HOOKS
// =============================================================================
export const useGenerateMicroservices = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof microservicesGeneratorApi.generate>[1] }) =>
      microservicesGeneratorApi.generate(projectId, data),
  });
};

export const useMicroservicesArchitecture = (projectId: string) => {
  return useQuery({
    queryKey: ['microservices-architecture', projectId],
    queryFn: () => microservicesGeneratorApi.getArchitecture(projectId),
    enabled: !!projectId,
  });
};

export const useGenerateDockerCompose = () => {
  return useMutation({
    mutationFn: (projectId: string) => microservicesGeneratorApi.generateDockerCompose(projectId),
  });
};

export const useGenerateKubernetes = () => {
  return useMutation({
    mutationFn: (projectId: string) => microservicesGeneratorApi.generateKubernetes(projectId),
  });
};

// =============================================================================
// I18N GENERATOR HOOKS
// =============================================================================
export const useGenerateI18n = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof i18nGeneratorApi.generate>[1] }) =>
      i18nGeneratorApi.generate(projectId, data),
  });
};

export const useTranslations = (projectId: string, language?: string) => {
  return useQuery({
    queryKey: ['translations', projectId, language],
    queryFn: () => i18nGeneratorApi.getTranslations(projectId, language),
    enabled: !!projectId,
  });
};

export const useUpdateTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Parameters<typeof i18nGeneratorApi.updateTranslation>[1] }) =>
      i18nGeneratorApi.updateTranslation(projectId, data),
    onSuccess: (_, { projectId, data }) => {
      queryClient.invalidateQueries({ queryKey: ['translations', projectId, data.language] });
    },
  });
};

// =============================================================================
// PREMIUM TEMPLATES HOOKS
// =============================================================================
export const usePremiumTemplates = () => {
  return useQuery({
    queryKey: ['premium-templates'],
    queryFn: () => premiumTemplatesApi.list(),
  });
};

export const usePremiumTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ['premium-template', templateId],
    queryFn: () => premiumTemplatesApi.get(templateId),
    enabled: !!templateId,
  });
};

export const usePurchasePremiumTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => premiumTemplatesApi.purchase(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium-templates'] });
    },
  });
};

// =============================================================================
// SYSTEM HOOKS
// =============================================================================
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => systemApi.health(),
  });
};

export const useSystemVersion = () => {
  return useQuery({
    queryKey: ['version'],
    queryFn: () => systemApi.version(),
  });
};

export const useSystemConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: () => systemApi.config(),
  });
};
