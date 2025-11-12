import { ImageWithFallback } from './figma/ImageWithFallback';
import { LucideIcon } from 'lucide-react';

interface ServiceSectionProps {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  reverse?: boolean;
}

export function ServiceSection({ title, description, image, icon: Icon, reverse = false }: ServiceSectionProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className={`${reverse ? 'md:order-2' : ''}`}>
        <div className="aspect-[4/3] rounded-lg overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className={`${reverse ? 'md:order-1' : ''}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-900 text-white mb-4">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
