import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectCardProps {
  id: string;
  title: string;
  location: string;
  state: string;
  description: string;
  image: string;
}

export function ProjectCard({ id, title, location, state, description, image }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{location}, {state}</span>
        </div>
        <h3 className="text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center gap-2 text-gray-900 group-hover:gap-3 transition-all">
          <span>View Project</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
