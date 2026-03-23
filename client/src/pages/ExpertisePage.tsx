import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const expertiseImages = import.meta.glob(
  '../../../attached_assets/expertise/*.{jpeg,jpg,png}',
  { eager: true }
) as Record<string, { default: string }>;

const imageMap: Record<string, string> = {};
for (const [p, mod] of Object.entries(expertiseImages)) {
  const base = p.split('/').pop() ?? '';
  imageMap[base] = mod.default;
}

function imgUrl(title: string): string {
  return (
    imageMap[title + '.jpeg'] ||
    imageMap[title + '.jpg'] ||
    imageMap[title + '.png'] ||
    ''
  );
}

interface StateData {
  code: string;
  label: string;
  projects: string[];
}

const STATES: StateData[] = [
  {
    code: 'NSW',
    label: 'New South Wales',
    projects: [
      'Castle Hill - 489 Apartments',
      'Bringelly - 417 Detached Homes',
      'Austral - 182 Detached Homes',
      'Schofields - 47 Detached Homes',
      'Rose Bay - 5 Luxury Waterfront Apartments',
      'Dural - 3 Luxury Homes',
      'Bondi - 12 Luxury Apartments',
      'Parramatta - Mixed Use Development',
      'Ryde - 4 Luxury Duplexes',
      'Brookvale - Mixed Use Development',
      'Newcastle - 17 Townhouses',
      'Bowral - 17 Luxury Homes',
    ],
  },
  {
    code: 'VIC',
    label: 'Victoria',
    projects: [
      'Mickleham - Mixed Use Development',
      'Footscray - 27 Townhouses',
      'Kalkallo - 22 Detached Homes',
      'Armstrong Creek - 19 Detached Homes',
      'Sunbury - 17 Detached Homes',
      'Mornington - Mixed Use Development',
    ],
  },
  {
    code: 'QLD',
    label: 'Queensland',
    projects: [
      'Burleigh Heads - Mixed Use Development',
      'Pimpama - 7 Luxury Duplexes',
      'Morayfield - 42 Detached Homes',
      'South Maclean - 36 Detached Homes',
      'Logan Reserve - 23 Townhouses',
      'Ripley - 18 Detached Homes',
    ],
  },
  {
    code: 'WA',
    label: 'Western Australia',
    projects: [
      'Alkimos Beach - 33 Detached Homes',
      'Yanchep Lagoon - 11 Luxury Homes',
      'Kennedy Bay - 6 Luxury Homes',
      'Margaret River - Mixed Use Development',
    ],
  },
  {
    code: 'SA',
    label: 'South Australia',
    projects: [
      'Mclaren Vale - Mixed Use Development',
      'Mount Barker - 14 Detached Homes',
      'Angle Vale - 13 Detached Homes',
      'Aldinga Beach - 11 Detached Homes',
    ],
  },
];

function ProjectImageCard({ title }: { title: string }) {
  const url = imgUrl(title);
  return (
    <div
      className="relative overflow-hidden rounded-md aspect-[4/3] group cursor-default"
      data-testid={`card-project-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <ImageWithFallback
        src={url}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-end p-3">
        <p
          className="text-white text-sm font-medium leading-snug"
          style={{ opacity: 0.5 }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function StateAccordion({ state }: { state: StateData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border border-white/20 rounded-md overflow-hidden"
      data-testid={`accordion-state-${state.code.toLowerCase()}`}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-primary hover:bg-primary/90 transition-colors"
        aria-expanded={isOpen}
        data-testid={`button-toggle-${state.code.toLowerCase()}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl md:text-3xl font-bold text-accent tracking-wide">
            {state.code}
          </span>
          <div>
            <p className="text-white font-semibold text-lg">{state.label}</p>
            <p className="text-white/60 text-sm">{state.projects.length} projects</p>
          </div>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-accent flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-6 bg-muted" data-testid={`panel-${state.code.toLowerCase()}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {state.projects.map((project) => (
              <ProjectImageCard key={project} title={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ExpertisePage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Crownix projects across Australia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              data-testid="text-page-title"
            >
              Our Expertise
            </h1>
            <p className="text-xl text-white/90">
              Premium residential and commercial developments delivered across Australia.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-foreground text-3xl md:text-4xl font-bold mb-6"
              data-testid="text-subtitle"
            >
              Projects Across Five States
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              From Sydney's premium suburbs to Western Australia's coastal communities, Crownix has delivered over 32 projects across New South Wales, Victoria, Queensland, Western Australia, and South Australia.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Select a state below to explore our portfolio in that region.
            </p>
          </div>
        </div>
      </section>

      {/* State Accordions */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-3">
            {STATES.map((state) => (
              <StateAccordion key={state.code} state={state} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Ready to Work With Us?</h2>
            <p className="text-white/90 text-lg mb-8">
              Discover how Crownix can deliver your next project with the same precision and excellence.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-primary rounded-md hover:bg-accent/90 transition-colors font-medium"
              data-testid="link-contact-cta"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
