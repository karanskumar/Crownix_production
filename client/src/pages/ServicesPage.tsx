import { Home, Building, MapPin, ClipboardCheck, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ServiceSection } from '../components/ServiceSection';

export function ServicesPage() {
  const processSteps = [
    { title: 'Initial Consultation', description: 'Understanding your vision and requirements' },
    { title: 'Feasibility Study', description: 'Detailed analysis and planning' },
    { title: 'Design & Approval', description: 'Working through permits and specifications' },
    { title: 'Construction', description: 'Expert execution with regular updates' },
    { title: 'Quality Assurance', description: 'Rigorous testing and inspection' },
    { title: 'Handover', description: 'Smooth transition and ongoing support' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1704297275778-8763889fa47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzYyMzY3MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Our services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-xl text-white/90">
              Comprehensive development and construction solutions across Australia
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-foreground mb-6">What We Do</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From concept to completion, we deliver exceptional results across residential and commercial developments. Our integrated approach ensures seamless project delivery with transparency at every stage.
            </p>
          </div>

          <div className="space-y-24">
            <ServiceSection
              title="Luxury Developments"
              description="Crownix specialises in luxury residential developments that redefine modern living. From bespoke knockdown rebuilds to architecturally designed townhouses, each project reflects uncompromising quality, attention to detail, and timeless design. Our team manages every stage — from acquisition and design through to construction and handover — ensuring seamless delivery and enduring value. With Crownix, luxury isn't just built — it's curated."
              image="https://images.unsplash.com/photo-1491357492920-d2979986a84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MjM1ODM5NHww&ixlib=rb-4.1.0&q=80&w=1080"
              icon={Home}
            />

            <ServiceSection
              title="Commercial Builds"
              description="Our commercial division delivers high-performance spaces built for business growth and long-term functionality. Whether it's office complexes, industrial parks, retail centres, or mixed-use developments, Crownix combines construction precision with strategic foresight to optimise every square metre. We partner closely with investors, tenants, and stakeholders to ensure each project meets budget, timeline, and performance benchmarks without compromise. Crownix builds with purpose — for productivity, presence, and profit."
              image="https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              icon={Building}
              reverse
            />

            <ServiceSection
              title="Land Subdivisions"
              description="Crownix leads end-to-end land subdivision and house-and-land delivery, transforming raw land into thriving residential communities. We oversee every phase — site acquisition, planning, civil works, construction, and sales — with a strong focus on quality, speed, and financial return. At Crownix, we don't just develop land — we create opportunity."
              image="https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              icon={MapPin}
            />

            <ServiceSection
              title="SMSF Projects"
              description="For investors seeking stability and long-term growth through their Self-Managed Super Funds, Crownix provides tailored property development and acquisition strategies. We handle the full process — from compliant structuring and project selection to construction and settlement — ensuring transparency and maximised returns within SMSF regulations. With deep expertise across finance, development, and construction, Crownix empowers clients to build wealth through tangible, high-performing assets."
              image="https://images.unsplash.com/photo-1635402009210-9e36c68f0868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2MjQwODIxNnww&ixlib=rb-4.1.0&q=80&w=1080"
              icon={ClipboardCheck}
              reverse
            />
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-foreground mb-6">Our Approach</h2>
            <p className="text-muted-foreground text-lg">
              A systematic process ensuring excellence from EOI to handover
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.title} className="bg-card p-6 rounded-lg border border-card-border">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-card-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-foreground mb-8 text-center">Why Choose Crownix</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Nationwide coverage with local expertise',
                'Proven track record of on-time delivery',
                'Transparent communication and reporting',
                'Experienced leadership team',
                'Strong safety and sustainability focus',
                'Comprehensive project management',
                'End-to-end development capabilities',
                'Industry leading quality control measures',
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
