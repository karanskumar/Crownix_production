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
      className="group block bg-card rounded-lg overflow-hidden border border-card-border hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}, {state}</span>
        </div>
        <h3 className="text-card-foreground mb-2 font-medium">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all font-medium">
          <span>View Project</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
