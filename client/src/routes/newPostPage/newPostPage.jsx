import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, X, Upload } from "lucide-react";
import UploadWidget from "@/components/uploadWidget/UploadWidget";

const AddProperty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("rent");
  const [propertyType, setPropertyType] = useState("apartment");
  const [rentalPeriod, setRentalPeriod] = useState("month");
  const [petPolicy, setPetPolicy] = useState("allowed");
  const [utilities, setUtilities] = useState("tenant");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validation for rental fields
    if (type === "rent" && !rentalPeriod) {
      setError("Please select a rental period");
      setIsLoading(false);
      return;
    }

    try {
      const postData = {
        title: inputs.title,
        description: inputs.description,
        price: parseInt(inputs.price),
        address: inputs.address,
        city: inputs.city,
        bedroom: parseInt(inputs.bedrooms),
        bathroom: parseInt(inputs.bathrooms),
        type: type,
        property: propertyType,
        latitude: inputs.latitude || "0",
        longitude: inputs.longitude || "0",
        images: images,
        utilities: utilities,
        pet: petPolicy,
        income: inputs.income || "",
        size: parseInt(inputs.size) || 0,
        school: parseInt(inputs.school) || 0,
        bus: parseInt(inputs.bus) || 0,
        restaurant: parseInt(inputs.restaurant) || 0,
      };

      // Add rental-specific fields only if type is rent
      if (type === "rent") {
        postData.rentalPeriod = rentalPeriod;
        postData.rentalDuration = parseInt(inputs.rentalDuration) || 1;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ postData }),
        }
      );

      const res = await response.json();

      if (res.success) {
        navigate("/property/" + res.data._id);
      } else {
        setError(res.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">List Your Property</h1>
            <p className="text-muted-foreground font-body">Fill in the details to create your property listing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-card rounded-xl p-6 shadow-card space-y-5">
              <h2 className="font-display text-xl font-bold text-foreground">Basic Information</h2>

              <div className="space-y-2">
                <Label htmlFor="title" className="font-body">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  placeholder="e.g., Modern 2BR Apartment in Downtown" 
                  className="h-12 font-body" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-body">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Describe your property..." 
                  className="min-h-[120px] font-body" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body">Listing Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-body">Price ($)</Label>
                  <Input 
                    id="price"
                    name="price"
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="h-12 font-body" 
                    required 
                  />
                </div>
                {type === "rent" && (
                  <div className="space-y-2">
                    <Label className="font-body">Rental Period</Label>
                    <Select value={rentalPeriod} onValueChange={setRentalPeriod}>
                      <SelectTrigger className="h-12 font-body">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Per Day</SelectItem>
                        <SelectItem value="week">Per Week</SelectItem>
                        <SelectItem value="month">Per Month</SelectItem>
                        <SelectItem value="year">Per Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {type === "rent" && (
                <div className="space-y-2">
                  <Label htmlFor="rentalDuration" className="font-body">Rental Duration (number of periods)</Label>
                  <Input 
                    id="rentalDuration"
                    name="rentalDuration"
                    type="number" 
                    min="1" 
                    placeholder="e.g., 6 for 6 months" 
                    className="h-12 font-body" 
                  />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-card rounded-xl p-6 shadow-card space-y-5">
              <h2 className="font-display text-xl font-bold text-foreground">Property Details</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="font-body">Bedrooms</Label>
                  <Input 
                    id="bedrooms"
                    name="bedrooms"
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="h-12 font-body" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="font-body">Bathrooms</Label>
                  <Input 
                    id="bathrooms"
                    name="bathrooms"
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="h-12 font-body" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size" className="font-body">Size (sqft)</Label>
                  <Input 
                    id="size"
                    name="size"
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="h-12 font-body" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income" className="font-body">Income Policy</Label>
                  <Input 
                    id="income"
                    name="income"
                    placeholder="e.g., 3x rent" 
                    className="h-12 font-body" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body">Pet Policy</Label>
                  <Select value={petPolicy} onValueChange={setPetPolicy}>
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allowed">Allowed</SelectItem>
                      <SelectItem value="not-allowed">Not Allowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-body">Utilities</Label>
                  <Select value={utilities} onValueChange={setUtilities}>
                    <SelectTrigger className="h-12 font-body">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner Responsible</SelectItem>
                      <SelectItem value="tenant">Tenant Responsible</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card rounded-xl p-6 shadow-card space-y-5">
              <h2 className="font-display text-xl font-bold text-foreground">Location</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="font-body">Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    placeholder="Street address" 
                    className="h-12 font-body" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="font-body">City</Label>
                  <Input 
                    id="city"
                    name="city"
                    placeholder="City" 
                    className="h-12 font-body" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="font-body">Latitude</Label>
                  <Input 
                    id="latitude"
                    name="latitude"
                    placeholder="e.g., 40.7128" 
                    className="h-12 font-body" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="font-body">Longitude</Label>
                  <Input 
                    id="longitude"
                    name="longitude"
                    placeholder="e.g., -74.0060" 
                    className="h-12 font-body" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school" className="font-body">School (km)</Label>
                  <Input 
                    id="school"
                    name="school"
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="h-12 font-body" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bus" className="font-body">Bus Stop (km)</Label>
                  <Input 
                    id="bus"
                    name="bus"
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="h-12 font-body" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant" className="font-body">Restaurant (km)</Label>
                  <Input 
                    id="restaurant"
                    name="restaurant"
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="h-12 font-body" 
                  />
                </div>
              </div>
            </div>

            {/* Images with Cloudinary Upload Widget */}
            <div className="bg-card rounded-xl p-6 shadow-card space-y-5">
              <h2 className="font-display text-xl font-bold text-foreground">Photos</h2>
              
              {images.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
                  <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-body text-sm mb-4">Upload images for your property</p>
                  <UploadWidget
                    uwConfig={{
                      multiple: true,
                      cloudName: "lamadev",
                      uploadPreset: "estate",
                      folder: "posts",
                    }}
                    setState={setImages}
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg border border-border" 
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground font-body">
                      {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                    </p>
                    <UploadWidget
                      uwConfig={{
                        multiple: true,
                        cloudName: "lamadev",
                        uploadPreset: "estate",
                        folder: "posts",
                      }}
                      setState={setImages}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm font-body">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="flex-1 h-12 bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90"
              >
                {isLoading ? "Publishing..." : "Publish Listing"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;