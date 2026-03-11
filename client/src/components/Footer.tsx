import { Link } from 'react-router-dom';
import { MapPin, Mail } from 'lucide-react';
import crownixLogo from '@assets/crownix_logo_1762957456049.png';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img src={crownixLogo} alt="Crownix" style={{ height: '4.5rem' }} />
            </div>
            <p className="text-white/70 mb-4">
              Delivering premium residential and commercial projects across Australia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-white font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/crownix-difference" className="text-white/70 hover:text-white transition-colors">
                  The Crownix Difference
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/70 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Offices */}
          <div>
            <h3 className="mb-4 text-white font-medium">Our Presence</h3>
            <ul className="space-y-2 text-white/70">
              <li>Sydney, NSW</li>
              <li>Melbourne, VIC</li>
              <li>Brisbane, QLD</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-white font-medium">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Head Office: Level 35, One International Towers, 100 Barangaroo Avenue, Sydney, NSW, 2000</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@crownix.com.au</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70">
              © 2025 Crownix. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
