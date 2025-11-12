import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ArticlePage() {
  const { id } = useParams();

  // Mock article data - in a real app, this would come from an API or database
  const articleData: Record<string, any> = {
    'sustainable-construction': {
      title: 'The Future of Sustainable Construction in Australia',
      date: 'Nov 1, 2025',
      category: 'Sustainability',
      author: 'Sarah Mitchell',
      image: 'https://images.unsplash.com/photo-1635402009210-9e36c68f0868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2MjQwODIxNnww&ixlib=rb-4.1.0&q=80&w=1080',
      content: `
        <p>As Australia moves towards a more sustainable future, the construction industry is at the forefront of this transformation. At BuildAus, we've been implementing innovative sustainable practices across our projects, and we're seeing remarkable results.</p>

        <h2>The Imperative for Change</h2>
        <p>The construction industry accounts for approximately 40% of global carbon emissions. In Australia, where we face unique environmental challenges, the need for sustainable building practices has never been more urgent. Climate change, resource scarcity, and increasing regulatory requirements are driving fundamental changes in how we approach construction.</p>

        <h2>Innovative Materials and Techniques</h2>
        <p>We're seeing a revolution in building materials. Cross-laminated timber (CLT) is emerging as a viable alternative to concrete and steel, offering carbon sequestration benefits and reduced construction time. Recycled materials are being incorporated into everything from concrete mixes to insulation products.</p>

        <p>Our recent projects have incorporated high-performance glazing systems that reduce energy consumption by up to 40%, green roofs that manage stormwater and reduce urban heat island effects, and smart building systems that optimize energy use in real-time.</p>

        <h2>The Business Case</h2>
        <p>Sustainable construction isn't just good for the environment—it makes sound business sense. Green buildings command premium rents and sale prices, have lower operating costs, and attract quality tenants. Our data shows that sustainable developments achieve faster sales and higher buyer satisfaction rates.</p>

        <h2>Looking Ahead</h2>
        <p>The future of construction in Australia will be defined by our commitment to sustainability. We're investing in research and development, partnering with innovative material suppliers, and training our teams in the latest sustainable practices. The buildings we construct today will shape our communities for generations to come, and we're committed to ensuring they do so sustainably.</p>
      `,
    },
    'project-efficiency': {
      title: 'Maximizing Project Efficiency Through Digital Innovation',
      date: 'Oct 28, 2025',
      category: 'Technology',
      author: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1704297275778-8763889fa47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzYyMzY3MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      content: `
        <p>Digital transformation is revolutionizing how we deliver construction projects. At BuildAus, we've embraced technology not as an end in itself, but as a means to deliver better outcomes for our clients.</p>

        <h2>Building Information Modeling (BIM)</h2>
        <p>BIM has transformed our design and construction process. By creating detailed digital representations of our projects before breaking ground, we can identify and resolve conflicts, optimize designs, and provide clients with clear visualizations of the final product. This has reduced design changes during construction by over 60% across our projects.</p>

        <h2>Real-Time Collaboration</h2>
        <p>Cloud-based project management platforms have eliminated information silos. Our teams, consultants, and clients can access up-to-date project information anywhere, anytime. This transparency builds trust and enables faster decision-making. We've seen project communication time reduced by 40% since implementing these systems.</p>

        <h2>Data-Driven Decision Making</h2>
        <p>We're leveraging data analytics to predict potential delays, optimize resource allocation, and improve cost estimation accuracy. Machine learning algorithms analyze historical project data to provide insights that inform our planning and execution strategies.</p>

        <h2>The Human Element</h2>
        <p>Technology is a tool, not a replacement for human expertise. Our investment in digital capabilities is matched by investment in training our people. The most successful projects combine technological sophistication with experienced professionals who understand construction fundamentals.</p>

        <h2>Results That Matter</h2>
        <p>The proof is in the results. Since implementing our digital transformation strategy, we've improved on-time delivery rates to 95%, reduced cost variations to less than 3%, and achieved industry-leading client satisfaction scores. Technology isn't the future—it's how we deliver excellence today.</p>
      `,
    },
    'residential-trends': {
      title: 'Emerging Residential Development Trends for 2026',
      date: 'Oct 22, 2025',
      category: 'Market Insights',
      author: 'Emma Thompson',
      image: 'https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIyODY4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      content: `
        <p>The Australian residential property market is evolving rapidly, shaped by changing demographics, lifestyle preferences, and economic factors. Understanding these trends is crucial for successful development.</p>

        <h2>The Rise of Multi-Generational Living</h2>
        <p>We're seeing increased demand for homes that accommodate extended families. This means larger floor plans, flexible spaces that can adapt to changing needs, and designs that provide privacy while maintaining connection. Our latest projects incorporate dual master suites and separate living zones to meet this demand.</p>

        <h2>Wellness-Focused Design</h2>
        <p>Post-pandemic, health and wellness have become central to residential design. Buyers want access to natural light, fresh air, and outdoor space. We're incorporating larger balconies, communal gardens, and wellness amenities including gyms, yoga studios, and walking trails.</p>

        <h2>Technology Integration</h2>
        <p>Smart home technology is no longer a luxury—it's an expectation. Buyers want integrated systems for climate control, security, and entertainment. We're working with technology partners to deliver homes that are truly future-ready.</p>

        <h2>Sustainable Living</h2>
        <p>Energy efficiency, water conservation, and sustainable materials are key selling points. Developments with high environmental ratings achieve price premiums and sell faster than conventional alternatives.</p>

        <h2>Community and Connectivity</h2>
        <p>Location matters, but so does community. Successful developments create opportunities for social connection through shared amenities, community spaces, and thoughtful design that encourages neighborly interaction.</p>
      `,
    },
  };

  const article = articleData[id || ''] || articleData['sustainable-construction'];

  return (
    <div>
      {/* Back Button */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Insights</span>
          </Link>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-[400px] md:h-[500px]">
        <ImageWithFallback
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
      </section>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600">
                <Tag className="w-4 h-4" />
                {article.category}
              </span>
              <span className="inline-flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
            </div>
            <h1 className="text-gray-900 mb-4">{article.title}</h1>
            <p className="text-gray-600">By {article.author}</p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <div
              className="text-gray-600 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-gray-900 mb-4">Want to Learn More?</h2>
            <p className="text-gray-600 mb-8">
              Explore our other insights or get in touch to discuss how we can help with your project.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/insights"
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                More Insights
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
