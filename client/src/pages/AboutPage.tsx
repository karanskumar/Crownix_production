import { Link } from 'react-router-dom';
import { Target, Eye, Award, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { TeamMemberCard } from '../components/TeamMemberCard';

export function AboutPage() {
  const teamMembers = [
    {
      name: 'Sarah Mitchell',
      role: 'Chief Executive Officer',
      bio: '20+ years in construction leadership, driving operational excellence across major developments.',
      image: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MjM3OTA4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Michael Chen',
      role: 'Chief Operating Officer',
      bio: 'Expert in project delivery with a track record of completing complex projects on time and budget.',
      image: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MjM3OTA4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Emma Thompson',
      role: 'Head of Development',
      bio: 'Specialist in residential and commercial development with extensive market knowledge.',
      image: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MjM3OTA4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'James Anderson',
      role: 'Chief Financial Officer',
      bio: 'Strategic financial leadership ensuring sustainable growth and investment returns.',
      image: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MjM3OTA4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

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
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold text-white mb-4">About BuildAus</h1>
            <p className="text-xl text-gray-100">
              Building Australia's future with expertise, integrity, and innovation
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Founded with a vision to transform Australia's construction landscape, BuildAus has grown from a single-state operation to a nationally recognized leader in residential and commercial development. Our journey has been defined by an unwavering commitment to quality, transparency, and operational excellence.
              </p>
              <p>
                Today, we operate across all major Australian markets, delivering projects that range from boutique residential developments to large-scale commercial complexes. Our success is built on strong relationships with clients, partners, and communities, and a team of dedicated professionals who share our values.
              </p>
              <p>
                We believe in the power of innovation and continuous improvement. Our systematic approach to project management, honed over years of experience, ensures that every project we undertake is delivered with precision, efficiency, and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Guided by principles that drive excellence in every project
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-lg text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-white mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Proven expertise driving innovation and excellence
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-gray-900 mb-6">Accreditations & Awards</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              BuildAus is proud to hold industry-leading certifications and has been recognized with multiple awards for excellence in construction and development. Our commitment to safety, quality, and sustainability is reflected in our ISO certifications and our recognition as a preferred partner by major clients across Australia.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <p className="text-gray-900">ISO 9001:2015</p>
                <p className="text-gray-600">Quality Management</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <p className="text-gray-900">ISO 14001:2015</p>
                <p className="text-gray-600">Environmental Management</p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <p className="text-gray-900">ISO 45001:2018</p>
                <p className="text-gray-600">Occupational Health & Safety</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white mb-6">Ready to Work With Us?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Explore our portfolio of completed projects or get in touch to discuss your next development.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>View Our Projects</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
