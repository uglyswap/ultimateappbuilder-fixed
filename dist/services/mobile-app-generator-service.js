"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileAppGeneratorService = exports.MobileAppGeneratorService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const universal_ai_client_1 = require("../utils/universal-ai-client");
const prisma = new client_1.PrismaClient();
class MobileAppGeneratorService {
    /**
     * Generate complete React Native app
     */
    async generateMobileApp(config) {
        logger_1.logger.info(`Generating React Native app: ${config.appName}`);
        // Generate package.json
        const packageJson = this.generatePackageJson(config);
        // Generate app.json (Expo config)
        const appJson = this.generateAppJson(config);
        // Generate navigation structure
        const navigation = await this.generateNavigation(config);
        // Generate screens
        const screens = await this.generateScreens(config);
        // Generate reusable components
        const components = await this.generateComponents(config);
        // Generate API client
        const apiClient = await this.generateApiClient(config);
        // Generate state store
        const stateStore = await this.generateStateStore(config);
        // Project structure
        const projectStructure = this.generateProjectStructure(config);
        logger_1.logger.info('Mobile app generation completed!');
        return {
            projectStructure,
            packageJson,
            appJson,
            navigation,
            screens,
            components,
            apiClient,
            stateStore,
        };
    }
    /**
     * Generate package.json
     */
    generatePackageJson(config) {
        const dependencies = {
            'react': '^18.2.0',
            'react-native': '^0.73.2',
            'expo': '~50.0.0',
            '@react-navigation/native': '^6.1.9',
            '@react-navigation/stack': '^6.3.20',
            '@react-navigation/bottom-tabs': '^6.5.11',
            '@react-navigation/drawer': '^6.6.6',
            'react-native-safe-area-context': '^4.8.2',
            'react-native-screens': '^3.29.0',
            'axios': '^1.6.5',
        };
        // Add UI framework
        if (config.uiFramework === 'native-base') {
            dependencies['native-base'] = '^3.4.28';
        }
        else if (config.uiFramework === 'react-native-paper') {
            dependencies['react-native-paper'] = '^5.11.6';
        }
        else {
            dependencies['@rneui/themed'] = '^4.0.0-rc.8';
        }
        // Add state management
        if (config.stateManagement === 'zustand') {
            dependencies['zustand'] = '^4.4.7';
        }
        else if (config.stateManagement === 'redux') {
            dependencies['@reduxjs/toolkit'] = '^2.0.1';
            dependencies['react-redux'] = '^9.0.4';
        }
        else {
            dependencies['mobx'] = '^6.12.0';
            dependencies['mobx-react-lite'] = '^4.0.5';
        }
        // Add authentication
        if (config.authentication) {
            dependencies['expo-auth-session'] = '~5.4.0';
            dependencies['expo-local-authentication'] = '~13.8.0';
            dependencies['@react-native-async-storage/async-storage'] = '^1.21.0';
        }
        // Add push notifications
        if (config.pushNotifications) {
            dependencies['expo-notifications'] = '~0.27.6';
        }
        // Add offline support
        if (config.offlineSupport) {
            dependencies['@tanstack/react-query'] = '^5.17.9';
            dependencies['react-native-mmkv'] = '^2.11.0';
        }
        return JSON.stringify({
            name: config.appName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            description: config.description,
            main: 'expo/AppEntry.js',
            scripts: {
                start: 'expo start',
                android: 'expo start --android',
                ios: 'expo start --ios',
                web: 'expo start --web',
                build: 'eas build',
                'build:ios': 'eas build --platform ios',
                'build:android': 'eas build --platform android',
                submit: 'eas submit',
                test: 'jest',
                lint: 'eslint .',
            },
            dependencies,
            devDependencies: {
                '@babel/core': '^7.23.7',
                '@types/react': '~18.2.45',
                '@types/react-native': '^0.73.0',
                'typescript': '^5.3.3',
                'jest': '^29.7.0',
                '@testing-library/react-native': '^12.4.3',
                'eslint': '^8.56.0',
            },
        }, null, 2);
    }
    /**
     * Generate app.json (Expo configuration)
     */
    generateAppJson(config) {
        return JSON.stringify({
            expo: {
                name: config.appName,
                slug: config.appName.toLowerCase().replace(/\s+/g, '-'),
                version: '1.0.0',
                orientation: 'portrait',
                icon: './assets/icon.png',
                userInterfaceStyle: 'automatic',
                splash: {
                    image: './assets/splash.png',
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
                assetBundlePatterns: ['**/*'],
                ios: {
                    supportsTablet: true,
                    bundleIdentifier: config.bundleId,
                    buildNumber: '1',
                },
                android: {
                    adaptiveIcon: {
                        foregroundImage: './assets/adaptive-icon.png',
                        backgroundColor: '#ffffff',
                    },
                    package: config.bundleId,
                    versionCode: 1,
                    permissions: config.pushNotifications
                        ? ['NOTIFICATIONS', 'CAMERA', 'READ_EXTERNAL_STORAGE']
                        : ['CAMERA', 'READ_EXTERNAL_STORAGE'],
                },
                web: {
                    favicon: './assets/favicon.png',
                },
                plugins: config.pushNotifications
                    ? [
                        'expo-notifications',
                        [
                            'expo-build-properties',
                            {
                                ios: {
                                    useFrameworks: 'static',
                                },
                            },
                        ],
                    ]
                    : [],
            },
        }, null, 2);
    }
    /**
     * Generate navigation structure using AI
     */
    async generateNavigation(config) {
        const prompt = `Generate a React Navigation setup for a React Native app.

App: ${config.appName}
Description: ${config.description}
Features: ${config.features.join(', ')}
Authentication: ${config.authentication}

Requirements:
- Use TypeScript
- Use React Navigation v6
- Include stack, tab, and drawer navigators as needed
- Include authentication flow if needed
- Add proper TypeScript types
- Add deep linking configuration
- Include screen options (header, tab bar icons, etc.)

Generate ONLY the navigation configuration code.`;
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'frontend', {
            autonomousMode: true,
        });
        return result.content;
    }
    /**
     * Generate screens using AI
     */
    async generateScreens(config) {
        const screenTypes = [
            'Home',
            'Profile',
            'Settings',
            ...(config.authentication ? ['Login', 'Register'] : []),
        ];
        const screens = {};
        for (const screenName of screenTypes) {
            const prompt = `Generate a React Native screen component for "${screenName}".

App: ${config.appName}
UI Framework: ${config.uiFramework}
Features: ${config.features.join(', ')}

Requirements:
- Use TypeScript
- Use ${config.uiFramework} for UI components
- Use React Navigation for navigation
- Include proper TypeScript types
- Add loading states
- Add error handling
- Make it responsive
- Include accessibility labels
- Use modern React patterns (hooks)

Generate ONLY the screen component code.`;
            const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'frontend', {
                autonomousMode: true,
            });
            screens[screenName] = result.content;
        }
        return screens;
    }
    /**
     * Generate reusable components
     */
    async generateComponents(config) {
        const componentTypes = ['Button', 'Card', 'Input', 'Avatar', 'Badge'];
        const components = {};
        for (const componentName of componentTypes) {
            const code = `import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface ${componentName}Props {
  // Add props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>${componentName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
`;
            components[componentName] = code;
        }
        return components;
    }
    /**
     * Generate API client
     */
    async generateApiClient(config) {
        return `import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string = 'https://api.example.com';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          // Navigate to login
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
`;
    }
    /**
     * Generate state store
     */
    async generateStateStore(config) {
        if (config.stateManagement === 'zustand') {
            return `import { create } from 'zustand';

interface AppState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: any) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
`;
        }
        return '';
    }
    /**
     * Generate project structure
     */
    generateProjectStructure(config) {
        return {
            'App.tsx': 'Main app component',
            'app.json': 'Expo configuration',
            'package.json': 'Dependencies',
            'tsconfig.json': 'TypeScript configuration',
            src: {
                navigation: {
                    'index.tsx': 'Navigation configuration',
                },
                screens: {
                    'HomeScreen.tsx': 'Home screen',
                    'ProfileScreen.tsx': 'Profile screen',
                    'SettingsScreen.tsx': 'Settings screen',
                },
                components: {
                    'Button.tsx': 'Button component',
                    'Card.tsx': 'Card component',
                    'Input.tsx': 'Input component',
                },
                api: {
                    'client.ts': 'API client',
                },
                store: {
                    'index.ts': 'State store',
                },
                utils: {
                    'constants.ts': 'Constants',
                    'theme.ts': 'Theme configuration',
                },
                types: {
                    'index.ts': 'TypeScript types',
                },
            },
            assets: {
                'icon.png': 'App icon',
                'splash.png': 'Splash screen',
                'adaptive-icon.png': 'Android adaptive icon',
            },
        };
    }
    /**
     * Generate iOS build configuration
     */
    async generateIOSBuildConfig() {
        return JSON.stringify({
            build: {
                production: {
                    ios: {
                        buildConfiguration: 'Release',
                        scheme: 'production',
                    },
                },
            },
            submit: {
                production: {
                    ios: {
                        appleId: 'your-apple-id@example.com',
                        ascAppId: 'your-asc-app-id',
                        appleTeamId: 'your-team-id',
                    },
                },
            },
        }, null, 2);
    }
    /**
     * Generate Android build configuration
     */
    async generateAndroidBuildConfig() {
        return JSON.stringify({
            build: {
                production: {
                    android: {
                        buildType: 'apk',
                        gradleCommand: ':app:assembleRelease',
                    },
                },
            },
            submit: {
                production: {
                    android: {
                        serviceAccountKeyPath: './service-account-key.json',
                        track: 'production',
                    },
                },
            },
        }, null, 2);
    }
}
exports.MobileAppGeneratorService = MobileAppGeneratorService;
exports.mobileAppGeneratorService = new MobileAppGeneratorService();
//# sourceMappingURL=mobile-app-generator-service.js.map