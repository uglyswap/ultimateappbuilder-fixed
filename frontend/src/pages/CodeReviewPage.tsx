import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useCodeReview,
  useCodeReviewIssues,
  useFixCodeReviewIssue
} from '../hooks';

interface Issue {
  id: string;
  file: string;
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
  fixable: boolean;
}

export const CodeReviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  const { data: issues, isLoading } = useCodeReviewIssues(projectId || '');
  const requestReview = useCodeReview();
  const fixIssue = useFixCodeReviewIssue();

  const handleRequestReview = async () => {
    if (!projectId) return;
    await requestReview.mutateAsync({
      projectId,
      data: {
        includeTests: true,
        checkStyle: true,
        checkSecurity: true,
        checkPerformance: true
      }
    });
  };

  const handleFixIssue = async (issueId: string) => {
    if (!projectId) return;
    await fixIssue.mutateAsync({ projectId, issueId });
  };

  const handleFixAll = async () => {
    if (!projectId || !issues) return;
    const fixableIssues = (issues as Issue[]).filter(i => i.fixable);
    for (const issue of fixableIssues) {
      await fixIssue.mutateAsync({ projectId, issueId: issue.id });
    }
  };

  // Mock data for display
  const mockIssues: Issue[] = [
    {
      id: '1',
      file: 'src/components/Button.tsx',
      line: 15,
      severity: 'error',
      message: 'Missing return type on function',
      rule: 'typescript-eslint/explicit-function-return-type',
      fixable: true
    },
    {
      id: '2',
      file: 'src/utils/helpers.ts',
      line: 42,
      severity: 'warning',
      message: 'Unused variable \'temp\'',
      rule: 'no-unused-vars',
      fixable: true
    },
    {
      id: '3',
      file: 'src/api/client.ts',
      line: 88,
      severity: 'error',
      message: 'Possible SQL injection vulnerability',
      rule: 'security/detect-sql-injection',
      fixable: false
    },
    {
      id: '4',
      file: 'src/pages/Home.tsx',
      line: 23,
      severity: 'info',
      message: 'Consider using useMemo for expensive computation',
      rule: 'react-hooks/exhaustive-deps',
      fixable: false
    },
    {
      id: '5',
      file: 'src/components/List.tsx',
      line: 56,
      severity: 'warning',
      message: 'Array.prototype.map() expects a return value',
      rule: 'array-callback-return',
      fixable: true
    },
  ];

  const displayIssues = (issues as Issue[]) || mockIssues;
  const filteredIssues = filter === 'all'
    ? displayIssues
    : displayIssues.filter(i => i.severity === filter);

  const errorCount = displayIssues.filter(i => i.severity === 'error').length;
  const warningCount = displayIssues.filter(i => i.severity === 'warning').length;
  const infoCount = displayIssues.filter(i => i.severity === 'info').length;
  const fixableCount = displayIssues.filter(i => i.fixable).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-400 bg-red-900/50';
      case 'warning': return 'text-yellow-400 bg-yellow-900/50';
      case 'info': return 'text-blue-400 bg-blue-900/50';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Code Review</h1>
          <p className="text-gray-400 mt-2">Analyze and fix code issues automatically</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-900/30 rounded-lg p-4">
            <h3 className="text-red-400 text-sm">Errors</h3>
            <p className="text-2xl font-bold">{errorCount}</p>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-4">
            <h3 className="text-yellow-400 text-sm">Warnings</h3>
            <p className="text-2xl font-bold">{warningCount}</p>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4">
            <h3 className="text-blue-400 text-sm">Info</h3>
            <p className="text-2xl font-bold">{infoCount}</p>
          </div>
          <div className="bg-green-900/30 rounded-lg p-4">
            <h3 className="text-green-400 text-sm">Fixable</h3>
            <p className="text-2xl font-bold">{fixableCount}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleRequestReview}
            disabled={requestReview.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg"
          >
            {requestReview.isPending ? 'Analyzing...' : 'Run Code Review'}
          </button>
          <button
            onClick={handleFixAll}
            disabled={fixIssue.isPending || fixableCount === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg"
          >
            {fixIssue.isPending ? 'Fixing...' : `Fix All (${fixableCount})`}
          </button>

          {/* Filter */}
          <div className="ml-auto flex gap-2">
            {(['all', 'error', 'warning', 'info'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filter === f
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Analyzing code...</div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No issues found. Your code looks great!
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredIssues.map(issue => (
                <div
                  key={issue.id}
                  className={`p-4 hover:bg-gray-750 cursor-pointer ${
                    selectedIssue === issue.id ? 'bg-gray-750' : ''
                  }`}
                  onClick={() => setSelectedIssue(
                    selectedIssue === issue.id ? null : issue.id
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className="text-sm text-gray-400">
                          {issue.file}:{issue.line}
                        </span>
                      </div>
                      <p className="text-sm">{issue.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{issue.rule}</p>
                    </div>
                    {issue.fixable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFixIssue(issue.id);
                        }}
                        disabled={fixIssue.isPending}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-3 py-1 rounded text-sm ml-4"
                      >
                        Fix
                      </button>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedIssue === issue.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium mb-2">Code Preview</h4>
                      <pre className="bg-gray-900 rounded p-3 text-sm overflow-x-auto">
                        <code className="text-gray-300">
                          {`${issue.line - 1}  // ... previous code
${issue.line}  const result = ${issue.severity === 'error' ? 'problematicCode()' : 'someCode()'}
${issue.line + 1}  // ... next code`}
                        </code>
                      </pre>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Suggestion</h4>
                        <p className="text-sm text-gray-400">
                          {issue.severity === 'error'
                            ? 'This issue should be fixed to prevent runtime errors.'
                            : issue.severity === 'warning'
                            ? 'Consider addressing this warning to improve code quality.'
                            : 'This is a suggestion for better code practices.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewPage;
