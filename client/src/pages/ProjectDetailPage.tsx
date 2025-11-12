import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Ruler, ArrowLeft, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ProjectDetailPage() {
  const { id } = useParams();

  // Mock project data - in a real app, this would come from an API or database
  const projectData: Record<string, any> = {
    'riverside-towers': {
      title: 'Riverside Towers',
      location: 'Brisbane, QLD',
      image: 'https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIyODY4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Riverside Towers is a landmark residential development featuring 180 premium apartments across two architectural towers. Located in the heart of Brisbane\'s vibrant riverfront precinct, this project exemplifies our commitment to creating sophisticated living spaces that blend seamlessly with their urban environment.',
      scope: 'Full design and construction of dual residential towers with ground-floor retail, basement parking, and premium amenities including rooftop gardens, infinity pool, and residents\' lounge.',
      timeline: '36 months',
      budget: '$185 million',
      area: '42,000 sqm',
      units: '180 apartments',
      completion: 'October 2024',
      outcomes: [
        '100% sold prior to completion',
        'Green Star 5-Star rating achieved',
        'Delivered 2 weeks ahead of schedule',
        'Zero lost-time injuries across project',
        'Featured in Architecture Australia magazine',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIyODY4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1491357492920-d2979986a84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MjM1ODM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      testimonial: {
        quote: 'BuildAus delivered exceptional quality and professionalism throughout the project. Their attention to detail and commitment to our vision resulted in a development that exceeded our expectations.',
        author: 'Jennifer Clarke',
        position: 'Development Director, Brisbane Property Group',
      },
    },
    'metro-plaza': {
      title: 'Metro Plaza',
      location: 'Sydney, NSW',
      image: 'https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Metro Plaza represents the future of commercial office space in Sydney\'s CBD. This premium A-grade development features state-of-the-art facilities, sustainable design principles, and a commanding presence on the city skyline.',
      scope: 'Design, construction, and fitout of 32-level commercial office building with premium retail at ground level and executive club amenities.',
      timeline: '42 months',
      budget: '$320 million',
      area: '65,000 sqm',
      units: '32 floors',
      completion: 'June 2025',
      outcomes: [
        '6-Star Green Star Office Design rating',
        'Pre-committed to blue-chip tenants',
        'WELL Building Standard certified',
        'Smart building technology integration',
        'Award-winning architectural design',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1704297275778-8763889fa47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzYyMzY3MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      testimonial: {
        quote: 'The BuildAus team demonstrated outstanding project management capabilities and delivered a world-class commercial building that sets a new benchmark for Sydney.',
        author: 'David Morrison',
        position: 'CEO, Metro Development Corporation',
      },
    },
    'coastal-estate': {
      title: 'Coastal Estate',
      location: 'Perth, WA',
      image: 'https://images.unsplash.com/photo-1491357492920-d2979986a84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MjM1ODM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Coastal Estate is a master-planned residential community that redefines coastal living in Perth. Spanning 85 hectares, this development seamlessly integrates residential lots, parklands, and community facilities.',
      scope: 'Master-planned land subdivision including civil works, infrastructure, roads, parks, and community facilities across 250 residential lots.',
      timeline: '48 months (staged)',
      budget: '$95 million',
      area: '85 hectares',
      units: '250 lots',
      completion: 'December 2025',
      outcomes: [
        '75% of lots already sold',
        'Award for Best Master-Planned Community (WA)',
        '30% open space and parklands',
        'Sustainable water management systems',
        'Strong community engagement throughout',
      ],
      gallery: [
        'https://images.unsplash.com/photo-1491357492920-d2979986a84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MjM1ODM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1635402009210-9e36c68f0868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2MjQwODIxNnww&ixlib=rb-4.1.0&q=80&w=1080',
      ],
      testimonial: {
        quote: 'BuildAus has created a truly special community that balances modern living with environmental responsibility. Their vision and execution have been exemplary.',
        author: 'Rebecca Walsh',
        position: 'Director, Coastal Land Development',
      },
    },
  };

  const project = projectData[id || ''] || projectData['riverside-towers'];

  return (
    <div>
      {/* Back Button */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-[500px] md:h-[600px]">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
      </section>

      {/* Project Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-5 h-5" />
              <span>{project.location}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{project.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl">
            <div className="bg-white p-6 rounded-lg">
              <Calendar className="w-8 h-8 text-gray-900 mb-3" />
              <p className="text-gray-600 mb-1">Timeline</p>
              <p className="text-gray-900">{project.timeline}</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <DollarSign className="w-8 h-8 text-gray-900 mb-3" />
              <p className="text-gray-600 mb-1">Budget</p>
              <p className="text-gray-900">{project.budget}</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <Ruler className="w-8 h-8 text-gray-900 mb-3" />
              <p className="text-gray-600 mb-1">Area</p>
              <p className="text-gray-900">{project.area}</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-gray-900 mb-3" />
              <p className="text-gray-600 mb-1">Completion</p>
              <p className="text-gray-900">{project.completion}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-gray-900 mb-4">Project Scope</h2>
                <p className="text-gray-600 leading-relaxed">{project.scope}</p>
              </div>
              <div>
                <h2 className="text-gray-900 mb-4">Key Outcomes</h2>
                <ul className="space-y-3">
                  {project.outcomes.map((outcome: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-900 mb-8 text-center">Project Gallery</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {project.gallery.map((image: string, index: number) => (
              <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {project.testimonial && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 text-xl italic mb-6">
                "{project.testimonial.quote}"
              </p>
              <p className="text-gray-900">{project.testimonial.author}</p>
              <p className="text-gray-600">{project.testimonial.position}</p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Interested in Working With Us?</h2>
            <p className="text-gray-300 mb-8">
              Let's discuss how we can bring your development vision to life.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
