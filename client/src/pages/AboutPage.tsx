import { Link } from 'react-router-dom';
import { Target, Eye, Award, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We set the highest standards in every project, ensuring quality and precision in all we deliver.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Open communication and honest reporting are at the core of our client relationships.',
    },
    {
      icon: Award,
      title: 'Reliability',
      description: 'We honor our commitments, delivering projects on time and within budget consistently.',
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758798349125-5c297b18b8b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0ZWFtJTIwd29ya2Vyc3xlbnwxfHx8fDE3NjIzNDY0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Our team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold text-white mb-4">About Crownix</h1>
            <p className="text-xl text-white/90">
              Where excellence is the standard
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-foreground mb-6">Our Story</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded with a vision to transform Australia's property landscape, Crownix has grown from a single-state operation to a nationally recognized leader in residential and commercial development. Our journey has been defined by an unwavering commitment to quality, transparency, and operational excellence.
              </p>
              <p>
                Today, we operate across all major Australian markets, delivering projects that range from boutique residential developments to large-scale house and land subdivisions. Our success is built on strong relationships with clients, partners, and communities, and a team of dedicated professionals who share our values.
              </p>
              <p>
                We believe in the power of innovation and continuous improvement. Our systematic approach to project management, honed over years of experience, ensures that every project we undertake is delivered with precision, efficiency, and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">Our Mission & Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Guided by principles that drive excellence in every project
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="bg-card p-8 rounded-lg text-center border border-card-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-card-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
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
              Get in touch to discuss your next development.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <span>Our Services</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
