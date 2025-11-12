import { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const offices = [
    {
      city: 'Melbourne (HQ)',
      state: 'VIC',
      address: 'Level 10, 123 Collins Street',
      postcode: 'Melbourne VIC 3000',
      phone: '(03) 9000 0000',
    },
    {
      city: 'Sydney',
      state: 'NSW',
      address: 'Level 15, 100 George Street',
      postcode: 'Sydney NSW 2000',
      phone: '(02) 9000 0000',
    },
    {
      city: 'Brisbane',
      state: 'QLD',
      address: 'Level 8, 180 Queen Street',
      postcode: 'Brisbane QLD 4000',
      phone: '(07) 3000 0000',
    },
    {
      city: 'Perth',
      state: 'WA',
      address: 'Level 5, 125 St Georges Terrace',
      postcode: 'Perth WA 6000',
      phone: '(08) 9000 0000',
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1554878516-1691fd114521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjIzMjk0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Contact us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-100">
              Ready to discuss your next project? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-gray-900 mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-900">
                    Thank you for your message! We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-shadow resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">Phone</p>
                    <p className="text-gray-600">1300 BUILD AU</p>
                    <p className="text-gray-600">(1300 284 532)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">Email</p>
                    <p className="text-gray-600">info@buildaus.com.au</p>
                    <p className="text-gray-600">projects@buildaus.com.au</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">Head Office</p>
                    <p className="text-gray-600">Level 10, 123 Collins Street</p>
                    <p className="text-gray-600">Melbourne VIC 3000</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Our Offices</h2>
            <p className="text-gray-600 text-lg">
              Nationwide presence with local expertise
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {offices.map((office) => (
              <div key={office.city} className="bg-white p-6 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-900 mb-1">{office.city}</p>
                    <p className="text-gray-600">{office.address}</p>
                    <p className="text-gray-600">{office.postcode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{office.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-gray-200">
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <p>Interactive map would be integrated here</p>
            <p className="text-sm">(Using Google Maps or similar service)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
