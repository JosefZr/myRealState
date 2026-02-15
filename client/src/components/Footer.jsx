import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-amber flex items-center justify-center">
                <Home className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                Nest<span className="text-secondary">Find</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed font-body">
              Your trusted platform for buying, selling, and renting properties. Connecting you with your dream home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body text-sm">
              {[
                { to: "/listings", label: "Browse Properties" },
                { to: "/add-property", label: "List Your Property" },
                { to: "/login", label: "Sign In" },
                { to: "/register", label: "Create Account" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4">Property Types</h4>
            <ul className="space-y-3 font-body text-sm text-primary-foreground/70">
              <li>Apartments</li>
              <li>Houses</li>
              <li>Condos</li>
              <li>Villas</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary" /> support@nestfind.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> 123 Real Estate Ave</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/50 text-sm font-body">
            © 2026 NestFind. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
