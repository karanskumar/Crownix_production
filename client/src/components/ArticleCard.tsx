import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export function ArticleCard({ id, title, excerpt, date, category, image }: ArticleCardProps) {
  return (
    <Link
      to={`/insights/${id}`}
      className="group block bg-card rounded-lg overflow-hidden border border-card-border hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-muted-foreground mb-3">
          <span className="px-3 py-1 bg-muted rounded-full text-sm">{category}</span>
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
        </div>
        <h3 className="text-card-foreground mb-2 font-medium">{title}</h3>
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all font-medium">
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
