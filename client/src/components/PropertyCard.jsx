import { Link } from "react-router-dom";
import { Bed, Bath, Maximize, MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";



const PropertyCard = ({ property }) => {
  const [isSaved, setIsSaved] = useState(false);

  const formatPrice = (price, type, period) => {
    const formatted = price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : price >= 1000
        ? `$${(price / 1000).toFixed(0)}K`
        : `$${price.toLocaleString()}`;
    return type === "rent" ? `${formatted}/${period || "mo"}` : formatted;
  };

  return (
    <Link to={`/${property.id}`} className="group block">
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={property.type === "rent" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}>
              {property.type === "rent" ? "For Rent" : "For Sale"}
            </Badge>
            {property.featured && (
              <Badge className="bg-gradient-amber text-secondary-foreground">Featured</Badge>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
          </button>

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <p className="text-2xl font-bold text-primary-foreground font-display">
              {formatPrice(property.price, property.type, property.rentalPeriod)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-card-foreground mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span className="font-body">{property.address}, {property.city}</span>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
              <Maximize className="w-4 h-4" />
              <span>{property.size} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
