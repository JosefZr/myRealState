import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Heart, Share2, Shield, PawPrint, Zap, Calendar, Info, Send, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContext, useEffect, useState } from "react";
import ContactOwnerForm from "@/components/ContactOwnerForm";
import PropertyMap from "@/components/PropertyMap";
import { mockProperties } from "../listPage/listPage";
import { AuthContext } from "@/context/AuthContext";
import DOMPurify from "dompurify";

export const commissionRates = {
  sale: { rate: 2.5, description: "2.5% of sale price" },
  rent: { rate: 50, description: "50% of first month's rent" },
};

const SignlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_API}/api/v1/posts/${id}`
        );
        const data = await res.json();

        if (data.success) {
          setPost(data.data);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/posts/${post._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-muted border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-body">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">{error}</h2>
          <Link to="/listings">
            <Button variant="outline">Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Property Not Found</h2>
          <Link to="/listings">
            <Button variant="outline">Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && post.user && post.user._id === currentUser._id;

  const formatPrice = (price, type, period) => {
    return type === "rent" ? `$${price.toLocaleString()}/${period || "mo"}` : `$${price.toLocaleString()}`;
  };

  const commission = post.type === "sale"
    ? { label: commissionRates.sale.description, amount: post.price * (commissionRates.sale.rate / 100) }
    : { label: commissionRates.rent.description, amount: post.price * 0.5 };

  const nextImage = () => setSelectedImage((i) => (i + 1) % post.images.length);
  const prevImage = () => setSelectedImage((i) => (i - 1 + post.images.length) % post.images.length);

  // Related properties (using mock data for now - can be fetched from API later)
  const related = mockProperties.filter((p) => p.id !== id && (p.city === post.city || p.type === post.type)).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
        {/* Back */}
        <Link to="/listings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mb-8 lg:mb-10">
          <div className="relative rounded-xl overflow-hidden h-64 sm:h-80 lg:h-[450px]">
            <img src={post.images[selectedImage]} alt={post.title} className="w-full h-full object-cover" />
            {post.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 bg-card/80 backdrop-blur rounded-full px-3 py-1 text-xs font-body text-foreground">
              {selectedImage + 1} / {post.images.length}
            </div>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 lg:gap-4">
            {post.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`rounded-xl overflow-hidden h-20 sm:h-24 lg:h-[215px] border-2 transition-colors ${
                  selectedImage === i ? "border-secondary" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={post.type === "rent" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}>
                  {post.type === "rent" ? "For Rent" : "For Sale"}
                </Badge>
                {post.propertyType && (
                  <Badge variant="outline" className="font-body">{post.propertyType}</Badge>
                )}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{post.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground font-body">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-sm sm:text-base">{post.address}, {post.city}</span>
              </div>
            </div>

            {/* Mobile Price Card */}
            <div className="lg:hidden bg-card rounded-xl shadow-card p-5">
              <p className="text-3xl font-display font-bold text-secondary">
                {formatPrice(post.price, post.type, post.rentalPeriod)}
              </p>
              {post.type === "rent" && post.rentalPeriod && (
                <p className="text-muted-foreground font-body text-sm mt-1">per {post.rentalPeriod}</p>
              )}
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Bed, label: "Bedrooms", value: post.bedroom },
                { icon: Bath, label: "Bathrooms", value: post.bathroom },
                { icon: Maximize, label: "Size", value: post.size ? `${post.size} sqft` : "N/A" },
              ].map((f, i) => (
                <div key={i} className="bg-muted rounded-xl p-4 sm:p-5 text-center">
                  <f.icon className="w-5 sm:w-6 h-5 sm:h-6 text-secondary mx-auto mb-2" />
                  <p className="text-lg sm:text-2xl font-display font-bold text-foreground">{f.value}</p>
                  <p className="text-muted-foreground font-body text-xs sm:text-sm">{f.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Description</h3>
              <div
                className="text-muted-foreground font-body leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.description || ""),
                }}
              />
            </div>

            {/* Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-muted rounded-xl p-4 sm:p-5">
                <PawPrint className="w-5 h-5 text-secondary mb-2" />
                <p className="font-body text-sm text-muted-foreground">Pet Policy</p>
                <p className="font-body font-semibold text-foreground capitalize">{post.pet || "Not specified"}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 sm:p-5">
                <Zap className="w-5 h-5 text-secondary mb-2" />
                <p className="font-body text-sm text-muted-foreground">Utilities</p>
                <p className="font-body font-semibold text-foreground capitalize">{post.utilities || "Not specified"}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 sm:p-5">
                <Calendar className="w-5 h-5 text-secondary mb-2" />
                <p className="font-body text-sm text-muted-foreground">Listed</p>
                <p className="font-body font-semibold text-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Additional Details */}
            {(post.school || post.bus || post.restaurant || post.income) && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Nearby Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {post.school && (
                    <div className="bg-muted rounded-xl p-4">
                      <p className="font-body text-sm text-muted-foreground mb-1">🏫 School</p>
                      <p className="font-body font-semibold text-foreground">{post.school} km</p>
                    </div>
                  )}
                  {post.bus && (
                    <div className="bg-muted rounded-xl p-4">
                      <p className="font-body text-sm text-muted-foreground mb-1">🚌 Bus Stop</p>
                      <p className="font-body font-semibold text-foreground">{post.bus} km</p>
                    </div>
                  )}
                  {post.restaurant && (
                    <div className="bg-muted rounded-xl p-4">
                      <p className="font-body text-sm text-muted-foreground mb-1">🍽️ Restaurant</p>
                      <p className="font-body font-semibold text-foreground">{post.restaurant} km</p>
                    </div>
                  )}
                  {post.income && (
                    <div className="bg-muted rounded-xl p-4">
                      <p className="font-body text-sm text-muted-foreground mb-1">💰 Income Required</p>
                      <p className="font-body font-semibold text-foreground">{post.income}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Commission Info */}
            <div className="bg-amber-light/10 border border-secondary/20 rounded-xl p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-2">Platform Commission</h4>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-3">
                    NestFind charges a commission of <strong className="text-foreground">{commission.label}</strong> upon
                    successful {post.type === "sale" ? "sale" : "rental agreement"}.
                    This covers secure transaction processing, document verification, and platform support.
                  </p>
                  <div className="bg-card rounded-lg p-3 inline-block">
                    <p className="font-body text-xs text-muted-foreground">Estimated commission for this property</p>
                    <p className="font-display text-xl font-bold text-secondary">${commission.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            {post.latitude && post.longitude && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Location</h3>
                <PropertyMap
                  properties={[post]}
                  center={[post.latitude, post.longitude]}
                  zoom={14}
                  singleMarker
                  className="h-[300px] sm:h-[400px]"
                />
              </div>
            )}

            {/* Related Properties */}
            {related.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Similar Properties</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map((p) => (
                    <Link key={p.id} to={`/property/${p.id}`} className="group block">
                      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                        <div className="h-32 overflow-hidden">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3">
                          <p className="font-body text-sm font-semibold text-foreground line-clamp-1">{p.title}</p>
                          <p className="font-display text-lg font-bold text-secondary">{formatPrice(p.price, p.type, p.rentalPeriod)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-card p-6 sm:p-8 sticky top-24 space-y-6">
              {/* Price - desktop only */}
              <div className="hidden lg:block">
                <p className="text-4xl font-display font-bold text-secondary">
                  {formatPrice(post.price, post.type, post.rentalPeriod)}
                </p>
                {post.type === "rent" && post.rentalPeriod && (
                  <p className="text-muted-foreground font-body text-sm mt-1">per {post.rentalPeriod}</p>
                )}
              </div>

              {/* Owner */}
              <div className="bg-muted rounded-xl p-4 sm:p-5">
                <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-3">Property Owner</p>
                <div className="flex items-center gap-3">
                  {post.user.avatar ? (
                    <img 
                      src={post.user.avatar} 
                      alt={`${post.user.firstName} ${post.user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-amber flex items-center justify-center text-secondary-foreground font-bold font-body flex-shrink-0">
                      {post.user.firstName?.[0]}{post.user.lastName?.[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-foreground truncate">
                      {post.user.firstName} {post.user.lastName}
                    </p>
                    <div className="flex items-center gap-1 text-secondary">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="font-body text-xs">Verified Owner</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Actions or Delete Button */}
              {isOwner ? (
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="destructive"
                  className="w-full h-12"
                >
                  {isDeleting ? "Deleting..." : "Delete Listing"}
                </Button>
              ) : (
                <>
                  {/* Contact Form Toggle */}
                  {!showContact ? (
                    <>
                      <Button
                        onClick={() => setShowContact(true)}
                        className="w-full bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90 h-12"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Contact Owner
                      </Button>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                        {post.user.phoneNumber && (
                          <a href={`tel:${post.user.phoneNumber}`} className="flex-1">
                            <Button variant="outline" className="w-full h-10 text-sm">
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                          </a>
                        )}
                        {post.user.email && (
                          <a href={`mailto:${post.user.email}`} className="flex-1">
                            <Button variant="outline" className="w-full h-10 text-sm">
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </Button>
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <ContactOwnerForm 
                      ownerName={`${post.user.firstName} ${post.user.lastName}`} 
                      propertyTitle={post.title} 
                    />
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-secondary text-secondary" : ""}`} />
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignlePage;