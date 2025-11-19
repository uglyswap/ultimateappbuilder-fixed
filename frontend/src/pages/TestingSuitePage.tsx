import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useTestResults,
  useTestCoverage,
  useGenerateTests,
  useRunTests,
  useLint,
  useSecurityScan,
  usePerformanceTest,
  useAccessibilityTest
} from '../hooks';

export const TestingSuitePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('results');

  const { data: testResults, isLoading: resultsLoading } = useTestResults(projectId || '');
  const { data: coverage } = useTestCoverage(projectId || '');
  const generateTests = useGenerateTests();
  const runTests = useRunTests();
  const lint = useLint();
  const securityScan = useSecurityScan();
  const performanceTest = usePerformanceTest();
  const accessibilityTest = useAccessibilityTest();

  const handleGenerateTests = async (type: 'unit' | 'integration' | 'e2e') => {
    if (!projectId) return;
    await generateTests.mutateAsync({ projectId, data: { type, coverage: 80 } });
  };

  const handleRunTests = async () => {
    if (!projectId) return;
    await runTests.mutateAsync({ projectId });
  };

  const handleLint = async () => {
    if (!projectId) return;
    await lint.mutateAsync({ projectId, data: { fix: true } });
  };

  const handleSecurityScan = async () => {
    if (!projectId) return;
    await securityScan.mutateAsync(projectId);
  };

  const handlePerformanceTest = async () => {
    if (!projectId) return;
    await performanceTest.mutateAsync({
      projectId,
      data: { endpoints: ['/api/health'], concurrent: 10, duration: 30 }
    });
  };

  const handleAccessibilityTest = async () => {
    if (!projectId) return;
    await accessibilityTest.mutateAsync({ projectId });
  };

  const tabs = [
    { id: 'results', label: 'Test Results' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'generate', label: 'Generate Tests' },
    { id: 'quality', label: 'Code Quality' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Testing Suite</h1>
          <p className="text-gray-400 mt-2">Generate, run, and analyze tests for your project</p>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={handleRunTests}
            disabled={runTests.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 rounded-lg p-4 text-center"
          >
            {runTests.isPending ? 'Running...' : 'Run All Tests'}
          </button>
          <button
            onClick={handleLint}
            disabled={lint.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg p-4 text-center"
          >
            {lint.isPending ? 'Linting...' : 'Lint Code'}
          </button>
          <button
            onClick={handleSecurityScan}
            disabled={securityScan.isPending}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-lg p-4 text-center"
          >
            {securityScan.isPending ? 'Scanning...' : 'Security Scan'}
          </button>
          <button
            onClick={handleAccessibilityTest}
            disabled={accessibilityTest.isPending}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg p-4 text-center"
          >
            {accessibilityTest.isPending ? 'Testing...' : 'Accessibility Test'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'results' && (
          <div>
            {resultsLoading ? (
              <div className="text-center py-8 text-gray-400">Loading test results...</div>
            ) : testResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-900/50 rounded-lg p-4">
                    <h3 className="text-sm text-green-400">Passed</h3>
                    <p className="text-2xl font-bold">{(testResults as { passed?: number }).passed || 0}</p>
                  </div>
                  <div className="bg-red-900/50 rounded-lg p-4">
                    <h3 className="text-sm text-red-400">Failed</h3>
                    <p className="text-2xl font-bold">{(testResults as { failed?: number }).failed || 0}</p>
                  </div>
                  <div className="bg-yellow-900/50 rounded-lg p-4">
                    <h3 className="text-sm text-yellow-400">Skipped</h3>
                    <p className="text-2xl font-bold">{(testResults as { skipped?: number }).skipped || 0}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Test Details</h3>
                  <pre className="text-sm text-gray-300 overflow-auto max-h-96">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No test results available. Run tests to see results.
              </div>
            )}
          </div>
        )}

        {activeTab === 'coverage' && (
          <div>
            {coverage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <CoverageCard title="Statements" value={(coverage as { statements?: number }).statements || 0} />
                  <CoverageCard title="Branches" value={(coverage as { branches?: number }).branches || 0} />
                  <CoverageCard title="Functions" value={(coverage as { functions?: number }).functions || 0} />
                  <CoverageCard title="Lines" value={(coverage as { lines?: number }).lines || 0} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No coverage data available. Run tests with coverage enabled.
              </div>
            )}
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-medium mb-2">Unit Tests</h3>
              <p className="text-sm text-gray-400 mb-4">Generate unit tests for individual components</p>
              <button
                onClick={() => handleGenerateTests('unit')}
                disabled={generateTests.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg py-2"
              >
                {generateTests.isPending ? 'Generating...' : 'Generate Unit Tests'}
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-medium mb-2">Integration Tests</h3>
              <p className="text-sm text-gray-400 mb-4">Generate tests for component interactions</p>
              <button
                onClick={() => handleGenerateTests('integration')}
                disabled={generateTests.isPending}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 rounded-lg py-2"
              >
                {generateTests.isPending ? 'Generating...' : 'Generate Integration Tests'}
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-medium mb-2">E2E Tests</h3>
              <p className="text-sm text-gray-400 mb-4">Generate end-to-end tests for user flows</p>
              <button
                onClick={() => handleGenerateTests('e2e')}
                disabled={generateTests.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg py-2"
              >
                {generateTests.isPending ? 'Generating...' : 'Generate E2E Tests'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-medium mb-4">Performance Testing</h3>
              <p className="text-sm text-gray-400 mb-4">Run load tests on your API endpoints</p>
              <button
                onClick={handlePerformanceTest}
                disabled={performanceTest.isPending}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 rounded-lg px-4 py-2"
              >
                {performanceTest.isPending ? 'Testing...' : 'Run Performance Test'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CoverageCard: React.FC<{ title: string; value: number }> = ({ title, value }) => {
  const getColor = (val: number) => {
    if (val >= 80) return 'text-green-400';
    if (val >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className={`text-2xl font-bold ${getColor(value)}`}>{value}%</p>
    </div>
  );
};

export default TestingSuitePage;
