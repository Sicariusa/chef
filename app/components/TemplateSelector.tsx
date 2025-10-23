/**
 * Template Selector Component
 * 
 * Allows users to choose from available e-commerce templates
 */

import { useState } from 'react';
import { TEMPLATE_REGISTRY, type TemplateConfig } from '../../template/ecommerce-templates/template-config';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}

export function TemplateSelector({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) {
  const templates = Object.values(TEMPLATE_REGISTRY);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'General': 'bg-blue-100 text-blue-700',
      'Fashion & Luxury': 'bg-purple-100 text-purple-700',
      'Technology': 'bg-indigo-100 text-indigo-700',
      'Fashion & Apparel': 'bg-pink-100 text-pink-700',
      'Food & Wellness': 'bg-green-100 text-green-700',
      'Starter': 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getThemePreview = (template: TemplateConfig) => {
    return (
      <div className="flex gap-2 mt-2">
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: template.theme.primary }}
          title="Primary color"
        />
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: template.theme.secondary }}
          title="Secondary color"
        />
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: template.theme.accent }}
          title="Accent color"
        />
      </div>
    );
  };

  return (
    <div className="template-selector">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Template
        </h2>
        <p className="text-gray-600">
          Select a pre-designed template or start from scratch
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const isHovered = hoveredTemplate === template.id;

          return (
            <div
              key={template.id}
              className={`
                relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
                ${isSelected 
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
                ${isHovered ? 'transform scale-105' : ''}
              `}
              onClick={() => onSelectTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Template preview background */}
              <div
                className="h-32 relative"
                style={{
                  background: `linear-gradient(135deg, ${template.theme.primary} 0%, ${template.theme.secondary} 50%, ${template.theme.accent} 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              </div>

              {/* Template info */}
              <div className="p-5 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>

                {/* Color preview */}
                {getThemePreview(template)}

                {/* Features */}
                <div className="mt-4 space-y-1">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-start text-xs text-gray-500">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Typography info */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{template.fonts.heading}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{template.animations.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">All templates are fully customizable</p>
            <p className="text-blue-700">
              After selecting a template, you can ask the AI to modify colors, fonts, layouts, and more.
              Each template includes all essential e-commerce features: product catalog, cart, checkout, and admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;
