const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Request failed');
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async download(endpoint: string): Promise<Blob> {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, unknown>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
    }

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);

// =============================================================================
// PROJECTS API (5 endpoints)
// =============================================================================
export const projectsApi = {
  list: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get('/api/projects', params as Record<string, string | number | boolean>),

  get: (id: string) => api.get(`/api/projects/${id}`),

  create: (data: unknown) => api.post('/api/projects', data),

  update: (id: string, data: unknown) => api.put(`/api/projects/${id}`, data),

  delete: (id: string) => api.delete(`/api/projects/${id}`),

  generate: (id: string) => api.post(`/api/projects/${id}/generate`),

  download: (id: string) => api.download(`/api/projects/${id}/download`),
};

// =============================================================================
// GENERATIONS API (2 endpoints)
// =============================================================================
export const generationsApi = {
  list: (projectId: string) => api.get(`/api/generations?projectId=${projectId}`),

  get: (id: string) => api.get(`/api/generations/${id}`),
};

// =============================================================================
// TEMPLATES API (2 endpoints)
// =============================================================================
export const templatesApi = {
  list: () => api.get('/api/templates'),

  get: (id: string) => api.get(`/api/templates/${id}`),
};

// =============================================================================
// AI MODELS API (3 endpoints)
// =============================================================================
export const aiModelsApi = {
  list: () => api.get('/api/ai-models'),

  get: (id: string) => api.get(`/api/ai-models/${id}`),

  getByProvider: (provider: string) => api.get(`/api/ai-models/provider/${provider}`),
};

// =============================================================================
// CUSTOM PROMPTS API (5 endpoints)
// =============================================================================
export const customPromptsApi = {
  list: () => api.get('/api/custom-prompts'),

  get: (id: string) => api.get(`/api/custom-prompts/${id}`),

  create: (data: {
    name: string;
    description?: string;
    category: string;
    prompt: string;
    variables?: string[];
  }) => api.post('/api/custom-prompts', data),

  update: (id: string, data: {
    name?: string;
    description?: string;
    category?: string;
    prompt?: string;
    variables?: string[];
  }) => api.put(`/api/custom-prompts/${id}`, data),

  delete: (id: string) => api.delete(`/api/custom-prompts/${id}`),
};

// =============================================================================
// VISUAL EDITOR API (7 endpoints)
// =============================================================================
export const visualEditorApi = {
  getCanvas: (projectId: string) => api.get(`/api/visual-editor/${projectId}/canvas`),

  saveCanvas: (projectId: string, data: {
    components: unknown[];
    layout: unknown;
    styles: unknown;
  }) => api.post(`/api/visual-editor/${projectId}/canvas`, data),

  getComponents: () => api.get('/api/visual-editor/components'),

  getComponent: (componentId: string) => api.get(`/api/visual-editor/components/${componentId}`),

  generateCode: (projectId: string, data: {
    framework: string;
    styling: string;
  }) => api.post(`/api/visual-editor/${projectId}/generate-code`, data),

  exportDesign: (projectId: string, format: string) =>
    api.get(`/api/visual-editor/${projectId}/export`, { format }),

  importDesign: (projectId: string, file: File) =>
    api.upload(`/api/visual-editor/${projectId}/import`, file),
};

// =============================================================================
// GRAPHQL GENERATOR API (5 endpoints)
// =============================================================================
export const graphqlGeneratorApi = {
  getSchema: (projectId: string) => api.get(`/api/graphql-generator/${projectId}/schema`),

  saveSchema: (projectId: string, data: {
    types: unknown[];
    queries: unknown[];
    mutations: unknown[];
    subscriptions?: unknown[];
  }) => api.post(`/api/graphql-generator/${projectId}/schema`, data),

  generateResolvers: (projectId: string) =>
    api.post(`/api/graphql-generator/${projectId}/generate-resolvers`),

  validateSchema: (projectId: string, schema: string) =>
    api.post(`/api/graphql-generator/${projectId}/validate`, { schema }),

  generateFromDatabase: (projectId: string, data: {
    tables: string[];
    includeRelations: boolean;
  }) => api.post(`/api/graphql-generator/${projectId}/from-database`, data),
};

// =============================================================================
// MOBILE APP GENERATOR API (3 endpoints)
// =============================================================================
export const mobileAppGeneratorApi = {
  generate: (projectId: string, data: {
    platform: 'ios' | 'android' | 'both';
    framework: 'react-native' | 'flutter' | 'expo';
    features: string[];
  }) => api.post(`/api/mobile-app-generator/${projectId}/generate`, data),

  getScreens: (projectId: string) =>
    api.get(`/api/mobile-app-generator/${projectId}/screens`),

  saveScreens: (projectId: string, data: {
    screens: unknown[];
    navigation: unknown;
  }) => api.post(`/api/mobile-app-generator/${projectId}/screens`, data),
};

// =============================================================================
// DEPLOYMENT API (7 endpoints)
// =============================================================================
export const deploymentApi = {
  list: (projectId: string) => api.get(`/api/deployments?projectId=${projectId}`),

  get: (deploymentId: string) => api.get(`/api/deployments/${deploymentId}`),

  create: (data: {
    projectId: string;
    platform: 'vercel' | 'netlify' | 'railway' | 'aws' | 'docker';
    config?: unknown;
  }) => api.post('/api/deployments', data),

  deploy: (deploymentId: string) => api.post(`/api/deployments/${deploymentId}/deploy`),

  rollback: (deploymentId: string, version: string) =>
    api.post(`/api/deployments/${deploymentId}/rollback`, { version }),

  getLogs: (deploymentId: string) => api.get(`/api/deployments/${deploymentId}/logs`),

  getMetrics: (deploymentId: string) => api.get(`/api/deployments/${deploymentId}/metrics`),
};

// =============================================================================
// TESTING API (10 endpoints)
// =============================================================================
export const testingApi = {
  generateTests: (projectId: string, data: {
    type: 'unit' | 'integration' | 'e2e';
    coverage?: number;
    framework?: string;
  }) => api.post(`/api/testing/${projectId}/generate`, data),

  runTests: (projectId: string, data?: {
    type?: string;
    files?: string[];
  }) => api.post(`/api/testing/${projectId}/run`, data),

  getResults: (projectId: string, testRunId?: string) =>
    api.get(`/api/testing/${projectId}/results`, testRunId ? { testRunId } : undefined),

  getCoverage: (projectId: string) => api.get(`/api/testing/${projectId}/coverage`),

  generateMocks: (projectId: string, data: {
    services: string[];
    dataTypes: string[];
  }) => api.post(`/api/testing/${projectId}/mocks`, data),

  generateFixtures: (projectId: string, data: {
    models: string[];
    count: number;
  }) => api.post(`/api/testing/${projectId}/fixtures`, data),

  lint: (projectId: string, data?: {
    fix?: boolean;
    files?: string[];
  }) => api.post(`/api/testing/${projectId}/lint`, data),

  securityScan: (projectId: string) => api.post(`/api/testing/${projectId}/security-scan`),

  performanceTest: (projectId: string, data: {
    endpoints: string[];
    concurrent: number;
    duration: number;
  }) => api.post(`/api/testing/${projectId}/performance`, data),

  accessibilityTest: (projectId: string, data?: {
    pages?: string[];
    standard?: string;
  }) => api.post(`/api/testing/${projectId}/accessibility`, data),
};

// =============================================================================
// SIMPLE GENERATE API (1 endpoint)
// =============================================================================
export const simpleGenerateApi = {
  generate: (data: {
    prompt: string;
    provider?: string;
    model?: string;
    apiKey?: string;
  }) => api.post('/api/simple-generate', data),
};

// =============================================================================
// CODE REVIEW API
// =============================================================================
export const codeReviewApi = {
  review: (projectId: string, data?: {
    files?: string[];
    severity?: string;
  }) => api.post(`/api/code-review/${projectId}/review`, data),

  getIssues: (projectId: string) => api.get(`/api/code-review/${projectId}/issues`),

  fixIssue: (projectId: string, issueId: string) =>
    api.post(`/api/code-review/${projectId}/fix/${issueId}`),

  getSuggestions: (projectId: string) => api.get(`/api/code-review/${projectId}/suggestions`),
};

// =============================================================================
// JOB QUEUE API
// =============================================================================
export const jobQueueApi = {
  getStatus: (jobId: string) => api.get(`/api/jobs/${jobId}`),

  getQueueStats: () => api.get('/api/jobs/stats'),

  cancelJob: (jobId: string) => api.post(`/api/jobs/${jobId}/cancel`),

  retryJob: (jobId: string) => api.post(`/api/jobs/${jobId}/retry`),
};

// =============================================================================
// AUTO DATABASE API
// =============================================================================
export const autoDatabaseApi = {
  analyzeSchema: (projectId: string) => api.post(`/api/auto-database/${projectId}/analyze`),

  generateMigrations: (projectId: string) =>
    api.post(`/api/auto-database/${projectId}/migrations`),

  suggestIndexes: (projectId: string) =>
    api.get(`/api/auto-database/${projectId}/suggest-indexes`),

  optimizeQueries: (projectId: string) =>
    api.post(`/api/auto-database/${projectId}/optimize-queries`),
};

// =============================================================================
// PLUGIN SYSTEM API
// =============================================================================
export const pluginSystemApi = {
  list: () => api.get('/api/plugins'),

  get: (pluginId: string) => api.get(`/api/plugins/${pluginId}`),

  install: (pluginId: string) => api.post(`/api/plugins/${pluginId}/install`),

  uninstall: (pluginId: string) => api.delete(`/api/plugins/${pluginId}`),

  configure: (pluginId: string, config: unknown) =>
    api.put(`/api/plugins/${pluginId}/config`, config),
};

// =============================================================================
// MICROSERVICES GENERATOR API
// =============================================================================
export const microservicesGeneratorApi = {
  generate: (projectId: string, data: {
    services: Array<{
      name: string;
      type: string;
      dependencies: string[];
    }>;
    communication: 'rest' | 'grpc' | 'graphql' | 'message-queue';
    containerization: boolean;
  }) => api.post(`/api/microservices-generator/${projectId}/generate`, data),

  getArchitecture: (projectId: string) =>
    api.get(`/api/microservices-generator/${projectId}/architecture`),

  generateDockerCompose: (projectId: string) =>
    api.post(`/api/microservices-generator/${projectId}/docker-compose`),

  generateKubernetes: (projectId: string) =>
    api.post(`/api/microservices-generator/${projectId}/kubernetes`),
};

// =============================================================================
// I18N GENERATOR API
// =============================================================================
export const i18nGeneratorApi = {
  generate: (projectId: string, data: {
    sourceLanguage: string;
    targetLanguages: string[];
    autoTranslate: boolean;
  }) => api.post(`/api/i18n-generator/${projectId}/generate`, data),

  getTranslations: (projectId: string, language?: string) =>
    api.get(`/api/i18n-generator/${projectId}/translations`,
      language ? { language } : undefined),

  updateTranslation: (projectId: string, data: {
    language: string;
    key: string;
    value: string;
  }) => api.put(`/api/i18n-generator/${projectId}/translations`, data),

  exportTranslations: (projectId: string, format: string) =>
    api.get(`/api/i18n-generator/${projectId}/export`, { format }),
};

// =============================================================================
// PREMIUM TEMPLATES API
// =============================================================================
export const premiumTemplatesApi = {
  list: () => api.get('/api/premium-templates'),

  get: (templateId: string) => api.get(`/api/premium-templates/${templateId}`),

  purchase: (templateId: string) => api.post(`/api/premium-templates/${templateId}/purchase`),

  download: (templateId: string) => api.download(`/api/premium-templates/${templateId}/download`),
};

// =============================================================================
// HEALTH & SYSTEM API
// =============================================================================
export const systemApi = {
  health: () => api.get('/api/health'),

  version: () => api.get('/api/version'),

  config: () => api.get('/api/config'),
};
