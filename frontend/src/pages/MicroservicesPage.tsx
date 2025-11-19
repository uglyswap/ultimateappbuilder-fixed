import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGenerateMicroservices,
  useMicroservicesArchitecture,
  useGenerateDockerCompose,
  useGenerateKubernetes
} from '../hooks';

interface Service {
  id: string;
  name: string;
  type: 'api' | 'worker' | 'gateway' | 'database' | 'cache' | 'queue';
  port: number;
  dependencies: string[];
}

export const MicroservicesPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'api-gateway', type: 'gateway', port: 3000, dependencies: ['user-service', 'order-service'] },
    { id: '2', name: 'user-service', type: 'api', port: 3001, dependencies: ['postgres', 'redis'] },
    { id: '3', name: 'order-service', type: 'api', port: 3002, dependencies: ['postgres', 'rabbitmq'] },
    { id: '4', name: 'notification-worker', type: 'worker', port: 0, dependencies: ['rabbitmq'] },
    { id: '5', name: 'postgres', type: 'database', port: 5432, dependencies: [] },
    { id: '6', name: 'redis', type: 'cache', port: 6379, dependencies: [] },
    { id: '7', name: 'rabbitmq', type: 'queue', port: 5672, dependencies: [] },
  ]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('architecture');

  const { data: architecture } = useMicroservicesArchitecture(projectId || '');
  const generateMicroservices = useGenerateMicroservices();
  const generateDockerCompose = useGenerateDockerCompose();
  const generateKubernetes = useGenerateKubernetes();

  const handleGenerateMicroservices = async () => {
    if (!projectId) return;
    await generateMicroservices.mutateAsync({
      projectId,
      data: { services, communicationPattern: 'event-driven' }
    });
  };

  const handleGenerateDockerCompose = async () => {
    if (!projectId) return;
    await generateDockerCompose.mutateAsync({ projectId });
  };

  const handleGenerateKubernetes = async () => {
    if (!projectId) return;
    await generateKubernetes.mutateAsync({ projectId });
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `${Date.now()}`,
      name: `service-${services.length + 1}`,
      type: 'api',
      port: 3000 + services.length,
      dependencies: []
    };
    setServices([...services, newService]);
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'gateway': return 'bg-purple-600';
      case 'api': return 'bg-blue-600';
      case 'worker': return 'bg-green-600';
      case 'database': return 'bg-yellow-600';
      case 'cache': return 'bg-red-600';
      case 'queue': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const tabs = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'docker', label: 'Docker Compose' },
    { id: 'kubernetes', label: 'Kubernetes' },
    { id: 'diagram', label: 'Diagram' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Microservices Generator</h1>
          <p className="text-gray-400 mt-2">Design and deploy microservices architecture</p>
        </header>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleAddService}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Add Service
          </button>
          <button
            onClick={handleGenerateMicroservices}
            disabled={generateMicroservices.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg"
          >
            {generateMicroservices.isPending ? 'Generating...' : 'Generate Code'}
          </button>
          <button
            onClick={handleGenerateDockerCompose}
            disabled={generateDockerCompose.isPending}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-4 py-2 rounded-lg"
          >
            {generateDockerCompose.isPending ? 'Generating...' : 'Docker Compose'}
          </button>
          <button
            onClick={handleGenerateKubernetes}
            disabled={generateKubernetes.isPending}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 px-4 py-2 rounded-lg"
          >
            {generateKubernetes.isPending ? 'Generating...' : 'Kubernetes'}
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
        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services List */}
            <div className="lg:col-span-2">
              <h2 className="font-medium mb-4">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer border-2 ${
                      selectedService === service.id
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        {service.port > 0 && (
                          <span className="text-sm text-gray-400">:{service.port}</span>
                        )}
                      </div>
                      <span className={`${getServiceColor(service.type)} px-2 py-0.5 rounded text-xs`}>
                        {service.type}
                      </span>
                    </div>
                    {service.dependencies.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-400">Depends on: </span>
                        {service.dependencies.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Service Editor */}
            <div>
              <h2 className="font-medium mb-4">Service Properties</h2>
              {selectedService ? (
                <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                  {(() => {
                    const service = services.find(s => s.id === selectedService);
                    if (!service) return null;
                    return (
                      <>
                        <div>
                          <label className="text-sm text-gray-400">Name</label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => {
                              setServices(services.map(s =>
                                s.id === selectedService
                                  ? { ...s, name: e.target.value }
                                  : s
                              ));
                            }}
                            className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Type</label>
                          <select
                            value={service.type}
                            onChange={(e) => {
                              setServices(services.map(s =>
                                s.id === selectedService
                                  ? { ...s, type: e.target.value as Service['type'] }
                                  : s
                              ));
                            }}
                            className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                          >
                            <option value="api">API Service</option>
                            <option value="gateway">API Gateway</option>
                            <option value="worker">Worker</option>
                            <option value="database">Database</option>
                            <option value="cache">Cache</option>
                            <option value="queue">Message Queue</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Port</label>
                          <input
                            type="number"
                            value={service.port}
                            onChange={(e) => {
                              setServices(services.map(s =>
                                s.id === selectedService
                                  ? { ...s, port: parseInt(e.target.value) || 0 }
                                  : s
                              ));
                            }}
                            className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setServices(services.filter(s => s.id !== selectedService));
                            setSelectedService(null);
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 rounded py-2 mt-4"
                        >
                          Delete Service
                        </button>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-4 text-gray-500 text-center">
                  Select a service to edit
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'docker' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-4">Docker Compose Configuration</h3>
            <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto">
{`version: '3.8'

services:
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - user-service
      - order-service
    environment:
      - NODE_ENV=production

  user-service:
    build: ./services/user-service
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/users

  order-service:
    build: ./services/order-service
    ports:
      - "3002:3002"
    depends_on:
      - postgres
      - rabbitmq

  notification-worker:
    build: ./services/notification-worker
    depends_on:
      - rabbitmq

  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

volumes:
  postgres_data:`}
            </pre>
          </div>
        )}

        {activeTab === 'kubernetes' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-4">Kubernetes Manifests</h3>
            <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto">
{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: myregistry/api-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
spec:
  selector:
    app: api-gateway
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer`}
            </pre>
          </div>
        )}

        {activeTab === 'diagram' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-medium mb-6">Architecture Diagram</h3>
            <div className="flex justify-center">
              <div className="text-center">
                {/* Gateway */}
                <div className="bg-purple-600 rounded-lg px-6 py-3 inline-block mb-4">
                  API Gateway
                </div>
                <div className="text-gray-500 mb-4">|</div>

                {/* Services */}
                <div className="flex gap-8 justify-center mb-4">
                  <div className="bg-blue-600 rounded-lg px-4 py-2">User Service</div>
                  <div className="bg-blue-600 rounded-lg px-4 py-2">Order Service</div>
                  <div className="bg-green-600 rounded-lg px-4 py-2">Notification Worker</div>
                </div>
                <div className="text-gray-500 mb-4">|</div>

                {/* Infrastructure */}
                <div className="flex gap-4 justify-center">
                  <div className="bg-yellow-600 rounded-lg px-4 py-2">PostgreSQL</div>
                  <div className="bg-red-600 rounded-lg px-4 py-2">Redis</div>
                  <div className="bg-orange-600 rounded-lg px-4 py-2">RabbitMQ</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroservicesPage;
