import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArticleCard } from '../components/ArticleCard';

export function InsightsPage() {
  const articles = [
    {
      id: 'sustainable-construction',
      title: 'The Future of Sustainable Construction in Australia',
      excerpt: 'Exploring innovative approaches to eco-friendly building practices and materials that are shaping the future of construction across Australia.',
      date: 'Nov 1, 2025',
      category: 'Sustainability',
      image: 'https://images.unsplash.com/photo-1635402009210-9e36c68f0868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2MjQwODIxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'project-efficiency',
      title: 'Maximizing Project Efficiency Through Digital Innovation',
      excerpt: 'How technology is transforming construction project management and delivery, from BIM to real-time collaboration tools.',
      date: 'Oct 28, 2025',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1704297275778-8763889fa47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzYyMzY3MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'residential-trends',
      title: 'Emerging Residential Development Trends for 2026',
      excerpt: 'Understanding buyer preferences and market dynamics in Australia\'s evolving residential property landscape.',
      date: 'Oct 22, 2025',
      category: 'Market Insights',
      image: 'https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIyODY4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'safety-excellence',
      title: 'Building a Culture of Safety Excellence',
      excerpt: 'Our comprehensive approach to workplace safety and how it drives better outcomes for all stakeholders.',
      date: 'Oct 15, 2025',
      category: 'Safety',
      image: 'https://images.unsplash.com/photo-1758798349125-5c297b18b8b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0ZWFtJTIwd29ya2Vyc3xlbnwxfHx8fDE3NjIzNDY0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'commercial-demand',
      title: 'Commercial Property Demand in Post-Pandemic Australia',
      excerpt: 'Analyzing shifts in commercial space requirements and what they mean for future developments.',
      date: 'Oct 8, 2025',
      category: 'Market Insights',
      image: 'https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE7NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'process-improvement',
      title: 'Continuous Improvement in Construction Operations',
      excerpt: 'How systematic process refinement is helping us deliver better projects more efficiently.',
      date: 'Oct 1, 2025',
      category: 'Operations',
      image: 'https://images.unsplash.com/photo-1635402009210-9e36c68f0868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2MjQwODIxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Insights"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-white mb-4">Insights & News</h1>
            <p className="text-xl text-gray-100">
              Industry perspectives, project updates, and thought leadership from our team
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
