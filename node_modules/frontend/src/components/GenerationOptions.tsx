import { useState } from 'react';
import type { GenerationOptions } from '@/types';

const SCENES = [
  { value: 'outdoor', label: 'Outdoor / Nature' },
  { value: 'studio', label: 'Clean Studio' },
  { value: 'lifestyle', label: 'Lifestyle / In-use' },
  { value: 'minimal', label: 'Minimal / White' },
  { value: 'urban', label: 'Urban / City' },
  { value: 'beach', label: 'Beach / Tropical' },
  { value: 'mountain', label: 'Mountain / Adventure' },
  { value: 'home', label: 'Home / Interior' },
];

const PURPOSES = [
  { value: 'ecommerce', label: 'E-commerce Product Page' },
  { value: 'social', label: 'Social Media Post' },
  { value: 'ad', label: 'Paid Advertisement' },
  { value: 'story', label: 'Instagram Story / Reels' },
  { value: 'banner', label: 'Website Banner' },
  { value: 'email', label: 'Email Marketing' },
  { value: 'print', label: 'Print Catalog' },
];

const STYLES = [
  { value: 'professional', label: 'Professional' },
  { value: 'vibrant', label: 'Vibrant & Colorful' },
  { value: 'moody', label: 'Moody & Dramatic' },
  { value: 'clean', label: 'Clean & Minimal' },
  { value: 'warm', label: 'Warm & Inviting' },
  { value: 'cool', label: 'Cool & Modern' },
  { value: 'vintage', label: 'Vintage / Retro' },
  { value: 'luxury', label: 'Luxury & Premium' },
];

interface GenerationOptionsProps {
  onGenerate: (options: GenerationOptions) => void;
  isGenerating: boolean;
  initialOptions?: Partial<GenerationOptions>;
}

export function GenerationOptions({ onGenerate, isGenerating, initialOptions }: GenerationOptionsProps) {
  const [options, setOptions] = useState<GenerationOptions>({
    scene: 'outdoor',
    purpose: 'social',
    style: 'professional',
    variations: 4,
    ...initialOptions,
  });

  const handleChange = (field: keyof GenerationOptions, value: string | number) => {
    setOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(options);
  };

  const Select = ({ label, value, onChange, options: selectOptions, name }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    name: string;
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input appearance-none bg-white"
        disabled={isGenerating}
      >
        {selectOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Generation Settings</h2>
      
      <Select
        label="Scene / Environment"
        value={options.scene}
        onChange={v => handleChange('scene', v)}
        options={SCENES}
        name="scene"
      />
      
      <Select
        label="Marketing Purpose"
        value={options.purpose}
        onChange={v => handleChange('purpose', v)}
        options={PURPOSES}
        name="purpose"
      />
      
      <Select
        label="Visual Style"
        value={options.style}
        onChange={v => handleChange('style', v)}
        options={STYLES}
        name="style"
      />
      
      <div>
        <label htmlFor="variations" className="block text-sm font-medium text-gray-700 mb-2">
          Number of Variations
        </label>
        <input
          type="number"
          id="variations"
          name="variations"
          min="1"
          max="8"
          value={options.variations}
          onChange={(e) => handleChange('variations', parseInt(e.target.value) || 1)}
          className="input w-24"
          disabled={isGenerating}
        />
      </div>
      
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Variations'}
      </button>
    </form>
  );
}