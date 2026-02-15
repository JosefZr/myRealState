import { useState, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters, { defaultFilters } from "@/components/SearchFilters";
import PropertyMap from "@/components/PropertyMap";
import { Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";


export const mockProperties = [
  {
    id: "1",
    title: "Luxury Penthouse with Panoramic Views",
    description: "Stunning penthouse apartment with floor-to-ceiling windows offering breathtaking city views. Features modern finishes, a gourmet kitchen, and a private terrace. The open-plan living area is flooded with natural light, while the master suite offers a spa-like bathroom with double vanity and rain shower.",
    price: 4500,
    type: "rent",
    propertyType: "apartment",
    rentalPeriod: "month",
    bedrooms: 3,
    bathrooms: 2,
    size: 2200,
    address: "125 Skyline Boulevard, Floor 32",
    city: "New York",
    latitude: 40.7580,
    longitude: -73.9855,
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    amenities: ["Gym", "Pool", "Concierge", "Parking", "Rooftop", "In-unit Laundry"],
    petPolicy: "allowed",
    utilities: "tenant",
    featured: true,
    createdAt: "2025-12-01",
    views: 1247,
    inquiries: 23,
    owner: { id: "u1", name: "Sarah Mitchell", avatar: "", verified: true, phone: "+1 (555) 234-5678", email: "sarah@nestfind.com", memberSince: "2023-06-15" },
  },
  {
    id: "2",
    title: "Modern Downtown Studio Apartment",
    description: "Sleek studio in the heart of downtown. Perfect for young professionals. Walking distance to transit, restaurants, and nightlife. Features smart home technology, premium appliances, and floor-to-ceiling windows.",
    price: 1800,
    type: "rent",
    propertyType: "apartment",
    rentalPeriod: "month",
    bedrooms: 1,
    bathrooms: 1,
    size: 650,
    address: "88 Commerce Street, Apt 14B",
    city: "Chicago",
    latitude: 41.8781,
    longitude: -87.6298,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
    amenities: ["Gym", "Laundry", "Doorman", "Smart Home"],
    petPolicy: "not-allowed",
    utilities: "shared",
    featured: false,
    createdAt: "2025-11-20",
    views: 892,
    inquiries: 15,
    owner: { id: "u2", name: "James Chen", avatar: "", verified: true, phone: "+1 (555) 345-6789", email: "james@nestfind.com", memberSince: "2024-01-10" },
  },
  {
    id: "3",
    title: "Elegant Family Villa with Garden",
    description: "Spacious family villa featuring 5 bedrooms, a private garden, and a swimming pool. Located in a quiet residential neighborhood with excellent schools nearby. The property includes a chef's kitchen, home office, and entertainment room.",
    price: 850000,
    type: "sale",
    propertyType: "villa",
    bedrooms: 5,
    bathrooms: 4,
    size: 4500,
    address: "42 Oak Lane, Riverside District",
    city: "Los Angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"],
    amenities: ["Pool", "Garden", "Garage", "Security", "Home Office", "Wine Cellar"],
    petPolicy: "allowed",
    utilities: "owner",
    featured: true,
    createdAt: "2025-11-15",
    views: 2341,
    inquiries: 47,
    owner: { id: "u3", name: "Maria Rodriguez", avatar: "", verified: true, phone: "+1 (555) 456-7890", email: "maria@nestfind.com", memberSince: "2022-09-01" },
  },
  {
    id: "4",
    title: "Cozy Beachfront Condo",
    description: "Wake up to ocean views every morning in this beautifully furnished beachfront condo. Steps from the sand with resort-style amenities. Recently renovated with premium materials and fixtures.",
    price: 3200,
    type: "rent",
    propertyType: "condo",
    rentalPeriod: "month",
    bedrooms: 2,
    bathrooms: 2,
    size: 1400,
    address: "200 Ocean Drive, Unit 8C",
    city: "Miami",
    latitude: 25.7617,
    longitude: -80.1918,
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    amenities: ["Pool", "Beach Access", "Gym", "Parking", "Balcony"],
    petPolicy: "allowed",
    utilities: "tenant",
    featured: true,
    createdAt: "2025-11-10",
    views: 1563,
    inquiries: 31,
    owner: { id: "u4", name: "David Kim", avatar: "", verified: true, phone: "+1 (555) 567-8901", email: "david@nestfind.com", memberSince: "2023-03-20" },
  },
  {
    id: "5",
    title: "Charming Brownstone Townhouse",
    description: "Historic brownstone with modern updates. Features original hardwood floors, exposed brick, and a private backyard. Perfect blend of classic and contemporary with a renovated kitchen and bathroom.",
    price: 1200000,
    type: "sale",
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 3,
    size: 3200,
    address: "314 Park Slope Avenue",
    city: "Brooklyn",
    latitude: 40.6782,
    longitude: -73.9442,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    amenities: ["Garden", "Fireplace", "Basement", "Parking", "Roof Deck"],
    petPolicy: "allowed",
    utilities: "owner",
    featured: false,
    createdAt: "2025-10-28",
    views: 987,
    inquiries: 19,
    owner: { id: "u5", name: "Emily Watson", avatar: "", verified: true, phone: "+1 (555) 678-9012", email: "emily@nestfind.com", memberSince: "2024-05-12" },
  },
  {
    id: "6",
    title: "Minimalist Loft in Arts District",
    description: "Open-plan loft with soaring ceilings, industrial finishes, and abundant natural light. Located in the vibrant arts district surrounded by galleries and cafes.",
    price: 2600,
    type: "rent",
    propertyType: "apartment",
    rentalPeriod: "month",
    bedrooms: 2,
    bathrooms: 1,
    size: 1800,
    address: "55 Gallery Row, Loft 4",
    city: "San Francisco",
    latitude: 37.7749,
    longitude: -122.4194,
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    amenities: ["Rooftop", "Bike Storage", "Laundry", "High Ceilings"],
    petPolicy: "allowed",
    utilities: "shared",
    featured: false,
    createdAt: "2025-10-15",
    views: 654,
    inquiries: 8,
    owner: { id: "u6", name: "Alex Thompson", avatar: "", verified: false, phone: "+1 (555) 789-0123", email: "alex@nestfind.com", memberSince: "2025-01-05" },
  },
];

const ListPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [viewMode, setViewMode] = useState("grid");

  const filtered = useMemo(() => {
    return mockProperties.filter((p) => {
      if (filters.type !== "all" && p.type !== filters.type) return false;
      if (filters.propertyType !== "all" && p.propertyType !== filters.propertyType) return false;
      if (filters.city !== "all" && p.city !== filters.city) return false;
      if (filters.bedrooms !== "all" && p.bedrooms < parseInt(filters.bedrooms)) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
              Browse Properties
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              {filtered.length} properties available
            </p>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-gradient-amber text-secondary-foreground" : ""}
            >
              <List className="w-4 h-4 mr-1" /> Grid
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "bg-gradient-amber text-secondary-foreground" : ""}
            >
              <Map className="w-4 h-4 mr-1" /> Map
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 lg:mb-8">
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="mb-6 lg:mb-8">
            <PropertyMap properties={filtered} className="h-[300px] sm:h-[400px] lg:h-[500px]" />
          </div>
        )}

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg">No properties found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPage;
