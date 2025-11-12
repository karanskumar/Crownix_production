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
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-gray-600 mb-3">
          <span className="px-3 py-1 bg-gray-100 rounded-full">{category}</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
        </div>
        <h3 className="text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex items-center gap-2 text-gray-900 group-hover:gap-3 transition-all">
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
