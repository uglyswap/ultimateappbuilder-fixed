import React, { useState } from 'react';
import {
  usePremiumTemplates,
  usePurchasePremiumTemplate
} from '../hooks';

interface PremiumTemplate {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  preview: string;
  rating: number;
  downloads: number;
  author: string;
  purchased?: boolean;
}

export const PremiumTemplatesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data: templates, isLoading } = usePremiumTemplates();
  const purchaseTemplate = usePurchasePremiumTemplate();

  const handlePurchase = async (templateId: string) => {
    await purchaseTemplate.mutateAsync(templateId);
  };

  // Mock templates data
  const mockTemplates: PremiumTemplate[] = [
    {
      id: '1',
      name: 'E-Commerce Pro',
      description: 'Complete e-commerce solution with cart, checkout, and admin panel',
      price: 49,
      category: 'E-Commerce',
      features: ['Shopping Cart', 'Payment Integration', 'Admin Dashboard', 'Inventory Management'],
      preview: '/previews/ecommerce.png',
      rating: 4.8,
      downloads: 1250,
      author: 'TemplateStudio'
    },
    {
      id: '2',
      name: 'SaaS Dashboard',
      description: 'Modern dashboard for SaaS applications with analytics and user management',
      price: 79,
      category: 'Dashboard',
      features: ['Analytics Charts', 'User Management', 'Billing Integration', 'API Dashboard'],
      preview: '/previews/saas.png',
      rating: 4.9,
      downloads: 890,
      author: 'ProDesigns'
    },
    {
      id: '3',
      name: 'Blog Platform',
      description: 'Feature-rich blogging platform with SEO optimization',
      price: 29,
      category: 'Blog',
      features: ['Markdown Editor', 'SEO Tools', 'Comments', 'Categories & Tags'],
      preview: '/previews/blog.png',
      rating: 4.6,
      downloads: 2100,
      author: 'ContentCreators'
    },
    {
      id: '4',
      name: 'Real Estate Portal',
      description: 'Property listing and management platform',
      price: 99,
      category: 'Real Estate',
      features: ['Property Listings', 'Map Integration', 'Agent Profiles', 'Search Filters'],
      preview: '/previews/realestate.png',
      rating: 4.7,
      downloads: 560,
      author: 'PropertyTech'
    },
    {
      id: '5',
      name: 'Social Network',
      description: 'Full-featured social networking platform',
      price: 149,
      category: 'Social',
      features: ['User Profiles', 'News Feed', 'Messaging', 'Groups'],
      preview: '/previews/social.png',
      rating: 4.5,
      downloads: 340,
      author: 'SocialApps'
    },
    {
      id: '6',
      name: 'Learning Management',
      description: 'Complete LMS for online courses and education',
      price: 119,
      category: 'Education',
      features: ['Course Builder', 'Quiz System', 'Progress Tracking', 'Certificates'],
      preview: '/previews/lms.png',
      rating: 4.8,
      downloads: 720,
      author: 'EduTech'
    },
  ];

  const displayTemplates = (templates as PremiumTemplate[]) || mockTemplates;
  const categories = ['all', ...new Set(displayTemplates.map(t => t.category))];

  const filteredTemplates = displayTemplates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentTemplate = displayTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Premium Templates</h1>
          <p className="text-gray-400 mt-2">Professional templates to jumpstart your projects</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Categories */}
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="ml-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="bg-gray-800 rounded-lg px-4 py-2 w-64"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading templates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
              >
                {/* Preview */}
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <div className="text-4xl text-gray-500">[]</div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <span className="text-green-400 font-bold">${template.price}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      * {template.rating}
                    </span>
                    <span>{template.downloads} downloads</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.slice(0, 3).map(feature => (
                      <span
                        key={feature}
                        className="bg-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTemplate(template.id)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handlePurchase(template.id)}
                      disabled={purchaseTemplate.isPending || template.purchased}
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        template.purchased
                          ? 'bg-green-600 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800'
                      }`}
                    >
                      {template.purchased
                        ? 'Purchased'
                        : purchaseTemplate.isPending
                        ? 'Processing...'
                        : 'Purchase'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Detail Modal */}
        {selectedTemplate && currentTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{currentTemplate.name}</h2>
                    <p className="text-gray-400">by {currentTemplate.author}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    x
                  </button>
                </div>

                {/* Preview */}
                <div className="h-64 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl text-gray-500">[]</div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-4">{currentTemplate.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentTemplate.features.map(feature => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className="text-green-400">+</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-6 text-sm">
                  <div>
                    <span className="text-gray-400">Rating: </span>
                    <span className="text-yellow-400">* {currentTemplate.rating}/5</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Downloads: </span>
                    <span>{currentTemplate.downloads}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Category: </span>
                    <span>{currentTemplate.category}</span>
                  </div>
                </div>

                {/* Purchase */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-3xl font-bold text-green-400">
                    ${currentTemplate.price}
                  </span>
                  <button
                    onClick={() => {
                      handlePurchase(currentTemplate.id);
                      setSelectedTemplate(null);
                    }}
                    disabled={purchaseTemplate.isPending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-8 py-3 rounded-lg font-medium"
                  >
                    {purchaseTemplate.isPending ? 'Processing...' : 'Purchase Template'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumTemplatesPage;
