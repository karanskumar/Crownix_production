import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ProjectCard } from '../components/ProjectCard';

export function ProjectsPage() {
  const [selectedState, setSelectedState] = useState<string>('All');

  const states = ['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA'];

  const allProjects = [
    {
      id: 'riverside-towers',
      title: 'Riverside Towers',
      location: 'Brisbane',
      state: 'QLD',
      description: 'Luxury waterfront residential development with 180 premium apartments',
      image: 'https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIyODY4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'metro-plaza',
      title: 'Metro Plaza',
      location: 'Sydney',
      state: 'NSW',
      description: 'Premium commercial office complex in the heart of CBD',
      image: 'https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'coastal-estate',
      title: 'Coastal Estate',
      location: 'Perth',
      state: 'WA',
      description: 'Master-planned residential community with 250 homes',
      image: 'https://images.unsplash.com/photo-1491357492920-d2979986a84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MjM1ODM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'southbank-residences',
      title: 'Southbank Residences',
      location: 'Melbourne',
      state: 'VIC',
      description: 'Contemporary living spaces with premium amenities',
      image: 'https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIyODY4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'harbor-point',
      title: 'Harbor Point',
      location: 'Sydney',
      state: 'NSW',
      description: 'Mixed-use development featuring retail and residential',
      image: 'https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'parkside-gardens',
      title: 'Parkside Gardens',
      location: 'Adelaide',
      state: 'SA',
      description: 'Sustainable residential development with green spaces',
      image: 'https://images.unsplash.com/photo-1491357492920-d2979986a84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MjM1ODM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'central-towers',
      title: 'Central Towers',
      location: 'Brisbane',
      state: 'QLD',
      description: 'Iconic high-rise commercial building',
      image: 'https://images.unsplash.com/photo-1704297275778-8763889fa47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzYyMzY3MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'bayside-precinct',
      title: 'Bayside Precinct',
      location: 'Melbourne',
      state: 'VIC',
      description: 'Urban renewal project with community focus',
      image: 'https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ocean-views',
      title: 'Ocean Views',
      location: 'Perth',
      state: 'WA',
      description: 'Beachfront apartments with stunning coastal vistas',
      image: 'https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIyODY4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const filteredProjects = selectedState === 'All' 
    ? allProjects 
    : allProjects.filter(project => project.state === selectedState);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Our projects"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-white mb-4">Our Projects</h1>
            <p className="text-xl text-gray-100">
              Delivering excellence across Australia's major markets
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <span className="text-gray-600 flex items-center">Filter by State:</span>
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedState === state
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              {selectedState !== 'All' && ` in ${selectedState}`}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
