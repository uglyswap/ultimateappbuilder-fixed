import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Wand2, Loader2 } from 'lucide-react';
import { ProjectWizard } from '../components/ProjectWizard';
import { api } from '../services/api';
import type { ProjectConfig } from '../types';

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const createProject = useMutation({
    mutationFn: (config: ProjectConfig) => api.post('/projects', config),
    onSuccess: (data) => {
      toast.success('Project created successfully!');
      navigate(`/projects/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const handleSubmit = (config: ProjectConfig) => {
    createProject.mutate(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Wand2 className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your App
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Configure your project and let our AI agents build it for you
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    s <= step
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-24 mx-2 transition-all duration-300 ${
                      s < step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Template</span>
            <span className={step >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Features</span>
            <span className={step >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Configure</span>
            <span className={step >= 4 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Review</span>
          </div>
        </div>

        {/* Wizard */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <ProjectWizard
            currentStep={step}
            onStepChange={setStep}
            onSubmit={handleSubmit}
            isSubmitting={createProject.isPending}
          />
        </div>

        {/* Loading Overlay */}
        {createProject.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Creating Your Project...</h3>
              <p className="text-gray-600">
                Our AI agents are setting up your application. This may take a moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
