import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Rocket } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <Sparkles className="relative w-20 h-20 text-blue-600" />
            </div>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Ultimate App Builder
          </h1>

          <p className="text-2xl text-gray-600 mb-4">
            Build Production-Ready Apps in Minutes
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Powered by 7 specialized AI agents working in perfect harmony to generate
            complete SaaS, E-Commerce, Blog, and API applications with world-class code quality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Start Building Now
              </div>
            </Link>

            <Link
              to="/projects"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-2 border-gray-200"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-yellow-500" />}
            title="Lightning Fast"
            description="Generate complete applications in minutes, not weeks. Our AI agents work in parallel for maximum speed."
            gradient="from-yellow-500 to-orange-500"
          />

          <FeatureCard
            icon={<Shield className="w-12 h-12 text-green-500" />}
            title="Production Ready"
            description="Security-first code with OWASP compliance, TypeScript strict mode, and comprehensive test coverage."
            gradient="from-green-500 to-emerald-500"
          />

          <FeatureCard
            icon={<Sparkles className="w-12 h-12 text-purple-500" />}
            title="AI-Powered"
            description="7 specialized agents with 21,000+ words of expert prompts ensure world-class code quality."
            gradient="from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Templates Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Template
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TemplateCard
            title="SaaS"
            description="Complete SaaS with auth, subscriptions, and admin panel"
            color="blue"
          />
          <TemplateCard
            title="E-Commerce"
            description="Online store with cart, checkout, and payments"
            color="purple"
          />
          <TemplateCard
            title="Blog/CMS"
            description="Content management with markdown and SEO"
            color="green"
          />
          <TemplateCard
            title="REST API"
            description="Backend API with docs and authentication"
            color="orange"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <Stat number="7" label="AI Agents" />
            <Stat number="21K+" label="Words of Expertise" />
            <Stat number="< 200ms" label="API Response" />
            <Stat number="100%" label="Type Safe" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TemplateCard({ title, description, color }: {
  title: string;
  description: string;
  color: string;
}) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <Link
      to="/create"
      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color as keyof typeof colors]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300 inline-block">
        Get Started →
      </div>
    </Link>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-5xl font-bold mb-2">{number}</div>
      <div className="text-blue-100 text-lg">{label}</div>
    </div>
  );
}
