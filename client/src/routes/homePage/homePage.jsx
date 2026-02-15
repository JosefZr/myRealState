import { Link } from "react-router-dom";
import { ArrowRight, Building2, Users, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters, { defaultFilters } from "@/components/SearchFilters";
import { useState } from "react";
import heroBg from "@/assets/bg-hero.jpg";
import { mockProperties } from "../listPage/listPage";

const stats = [
  { value: "16K+", label: "Properties Listed", icon: Building2 },
  { value: "8K+", label: "Happy Clients", icon: Users },
  { value: "99%", label: "Verified Listings", icon: ShieldCheck },
  { value: "200+", label: "Cities Covered", icon: TrendingUp },
];

const Index = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const featured = mockProperties.filter((p) => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 py-20">
          <div className="max-w-3xl mb-10">
            <p className="text-secondary font-body font-semibold text-sm uppercase tracking-widest mb-4 animate-fade-in">
              Buy • Rent • Sell Properties
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Find Your <span className="text-gradient-amber">Perfect</span> Home
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl font-body leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Discover thousands of apartments, houses, and villas. Connect directly with sellers and landlords on one powerful platform.
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <SearchFilters filters={filters} onFiltersChange={setFilters} variant="hero" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <stat.icon className="w-8 h-8 text-secondary mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-muted-foreground font-body text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-secondary font-body font-semibold text-sm uppercase tracking-widest mb-2">
              Handpicked for You
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Featured Properties
            </h2>
          </div>
          <Link to="/listings">
            <Button variant="outline" className="hidden sm:flex">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link to="/listings">
            <Button variant="outline" className="w-full">
              View All Properties <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-navy py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-primary-foreground/70 font-body text-lg mb-8 max-w-lg mx-auto">
            Join thousands of property owners who found their buyers and tenants through NestFind.
          </p>
          <Link to="/add-property">
            <Button size="lg" className="bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90 px-8">
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
