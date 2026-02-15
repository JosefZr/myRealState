import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const cities = ["New York", "Chicago", "Los Angeles", "Miami", "Brooklyn", "San Francisco", "Boston", "Seattle", "Austin", "Denver"];

export const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land" },
];


const defaultFilters = {
  query: "",
  type: "all",
  propertyType: "all",
  city: "all",
  minPrice: "",
  maxPrice: "",
  bedrooms: "all",
};

const SearchFilters = ({ filters, onFiltersChange, variant = "full" }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => onFiltersChange(defaultFilters);

  if (variant === "hero") {
    return (
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-4 shadow-card-hover border border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by location, property name..."
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              className="pl-10 h-12 border-border bg-background font-body"
            />
          </div>
          <Select value={filters.type} onValueChange={(v) => updateFilter("type", v)}>
            <SelectTrigger className="w-full sm:w-36 h-12 font-body">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
            <SelectTrigger className="w-full sm:w-40 h-12 font-body">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="h-12 px-8 bg-amber-400 text-secondary-foreground font-semibold shadow-amber hover:opacity-90">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10 h-11 font-body"
          />
        </div>
        <Select value={filters.type} onValueChange={(v) => updateFilter("type", v)}>
          <SelectTrigger className="w-full sm:w-36 h-11 font-body">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-11"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted rounded-xl">
          <Select value={filters.propertyType} onValueChange={(v) => updateFilter("propertyType", v)}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {propertyTypes.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.bedrooms} onValueChange={(v) => updateFilter("bedrooms", v)}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Beds</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export { defaultFilters };
export default SearchFilters;
