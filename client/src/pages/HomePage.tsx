import { Link } from 'react-router-dom';
import { Building2, Users, Layers, TrendingUp, ArrowRight, Home, Building, MapPin, ClipboardCheck } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function HomePage() {
  const services = [
    {
      icon: Home,
      title: 'Residential Development',
      description: 'Premium residential projects from luxury apartments to masterplanned communities.',
    },
    {
      icon: Building,
      title: 'Commercial Build',
      description: 'State-of-the-art commercial developments built to the highest standards.',
    },
    {
      icon: MapPin,
      title: 'Land Subdivision',
      description: 'Strategic land development and subdivision services across Australia.',
    },
    {
      icon: ClipboardCheck,
      title: 'Project Management',
      description: 'End-to-end project management ensuring on-time, on-budget delivery.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1635402009210-9e36c68f0868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2MjQwODIxNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Construction site"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold text-white mb-6">Building Australia-Wide Innovation</h1>
            <p className="text-xl text-gray-100 mb-8">
              Delivering premium residential and commercial construction across Australia with proven expertise and unwavering commitment to excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Our Projects
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-foreground mb-6">About Crownix</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              We are a national construction and development company with operations across Australia. Our team brings decades of combined experience in delivering high-quality residential and commercial projects. From initial concept to final handover, we prioritize transparency, reliability, and operational excellence in everything we do.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive construction and development solutions tailored to your needs
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card p-6 rounded-lg shadow-sm border border-card-border">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-card-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Leadership Teaser */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="text-foreground mb-6">Led by Industry Experts</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our leadership team brings decades of proven track record in construction and development across Australia. Their expertise drives our commitment to excellence and innovation.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
            >
              <span>Meet Our Team</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
