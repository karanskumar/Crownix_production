import { Link } from 'react-router-dom';
import { Home, Building, MapPin, ClipboardCheck, ArrowRight, CheckCircle } from 'lucide-react';
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
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-xl text-gray-100">
              Comprehensive construction and development solutions across Australia
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-gray-900 mb-6">What We Do</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              From concept to completion, we deliver exceptional results across residential and commercial developments. Our integrated approach ensures seamless project delivery with transparency at every stage.
            </p>
          </div>

          <div className="space-y-24">
            <ServiceSection
              title="Residential Development"
              description="We specialize in creating premium residential spaces that combine modern design with functional living. From luxury apartments to master-planned communities, our residential projects set new standards in quality and livability. Our team works closely with architects, designers, and local authorities to ensure each development meets the highest standards while reflecting the unique character of its location."
              image="https://images.unsplash.com/photo-1491357492920-d2979986a84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc2MjM1ODM5NHww&ixlib=rb-4.1.0&q=80&w=1080"
              icon={Home}
            />

            <ServiceSection
              title="Commercial Build"
              description="Our commercial construction expertise spans office complexes, retail centers, and mixed-use developments. We understand the unique demands of commercial projects, including tight timelines, minimal disruption, and the need for future-proof infrastructure. Our portfolio includes landmark buildings across Australia's major cities, each delivered with precision and attention to detail."
              image="https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjIyOTkwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              icon={Building}
              reverse
            />

            <ServiceSection
              title="Land Subdivision"
              description="Strategic land development requires careful planning, regulatory expertise, and vision. We manage the entire subdivision process, from initial feasibility studies through to infrastructure development and lot creation. Our experience across diverse Australian markets ensures we can navigate local requirements while maximizing value for stakeholders."
              image="https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              icon={MapPin}
            />

            <ServiceSection
              title="Project Management"
              description="Effective project management is at the heart of successful construction. Our dedicated project managers oversee every aspect of delivery, from procurement and scheduling to quality control and stakeholder communication. We use proven methodologies and digital tools to ensure projects stay on track, on budget, and exceed expectations."
              image="https://images.unsplash.com/photo-1635402009210-9e36c68f0868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYXVzdHJhbGlhfGVufDF8fHx8MTc2MjQwODIxNnww&ixlib=rb-4.1.0&q=80&w=1080"
              icon={ClipboardCheck}
              reverse
            />
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-gray-900 mb-6">Our Approach</h2>
            <p className="text-gray-600 text-lg">
              A systematic process ensuring excellence from EOI to handover
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.title} className="bg-white p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
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
            <h2 className="text-gray-900 mb-8 text-center">Why Choose BuildAus</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Nationwide coverage with local expertise',
                'Proven track record of on-time delivery',
                'Transparent communication and reporting',
                'ISO-certified quality management systems',
                'Experienced leadership team',
                'Strong safety and sustainability focus',
                'Comprehensive project management',
                'End-to-end development capabilities',
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Let's Discuss Your Project</h2>
            <p className="text-gray-300 text-lg mb-8">
              Whether you have a detailed brief or are just exploring possibilities, our team is ready to help bring your vision to life.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Request Project Brief</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
