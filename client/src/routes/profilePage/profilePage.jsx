import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Home, Heart, MessageSquare, Settings, LogOut, Eye, DollarSign, BarChart3, Edit, Trash2, Mail, Phone, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/PropertyCard";
import { useContext, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AuthContext } from "@/context/AuthContext";
import { useAuthUser } from "@/hooks/jwt/useAuthUser";
import apiRequest from "@/lib/apiRequest";
import { commissionRates } from "../singlePage/singlePage";

// Mock dashboard statistics
export const mockDashboardStats = {
  totalViews: 5734,
  totalInquiries: 89,
  activeListings: 2,
  savedProperties: 4,
  monthlyViews: [
    { month: "Sep", views: 320 },
    { month: "Oct", views: 480 },
    { month: "Nov", views: 620 },
    { month: "Dec", views: 890 },
    { month: "Jan", views: 1200 },
    { month: "Feb", views: 1420 },
  ],
  recentInquiries: [
    { id: "inq1", propertyTitle: "Luxury Penthouse with Panoramic Views", buyerName: "Michael Brown", date: "2026-02-14", status: "new", message: "I'm interested in scheduling a viewing this weekend." },
    { id: "inq2", propertyTitle: "Luxury Penthouse with Panoramic Views", buyerName: "Lisa Park", date: "2026-02-13", status: "replied", message: "What utilities are included in the rent?" },
    { id: "inq3", propertyTitle: "Modern Downtown Studio Apartment", buyerName: "Tom Wilson", date: "2026-02-12", status: "new", message: "Is the apartment available from March 1st?" },
    { id: "inq4", propertyTitle: "Luxury Penthouse with Panoramic Views", buyerName: "Anna Lee", date: "2026-02-10", status: "closed" , message: "Can I bring my dog?" },
  ],
  transactionHistory: [
    { id: "tx1", propertyTitle: "Beachside Studio", type: "rent" , amount: 2400, commission: 1200, date: "2026-01-15", status: "completed" },
    { id: "tx2", propertyTitle: "Downtown Loft", type: "rent" , amount: 1800, commission: 900, date: "2025-12-20", status: "completed" },
    { id: "tx3", propertyTitle: "Suburban House", type: "sale", amount: 450000, commission: 11250, date: "2025-11-05", status: "completed"  },
  ],
};
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const userInfo = useAuthUser();
  
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [chatsError, setChatsError] = useState(null);
  
  const stats = mockDashboardStats;

  // Fetch user posts and saved posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        setPostsError(null);

        const response = await fetch(`${import.meta.env.VITE_SERVER_API}/api/v1/users/profilePosts`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token") 
          },
          body: JSON.stringify({ userId: userInfo.userId })
        });
        const data = await response.json();

        if (data.success) {
          setUserPosts(data.data.userPosts || []);
          setSavedPosts(data.data.savedPosts || []);
        } else {
          setPostsError("Failed to load posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPostsError(error.response?.data?.error || "Failed to load posts");
      } finally {
        setIsLoadingPosts(false);
      }
    };

    if (userInfo?.userId) {
      fetchPosts();
    }
  }, [userInfo?.userId]);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoadingChats(true);
        setChatsError(null);

        const response = await apiRequest.get("/chats");
        setChats(response.data.data || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChatsError(error.response?.data?.error || "Failed to load chats");
        setChats([]);
      } finally {
        setIsLoadingChats(false);
      }
    };

    fetchChats();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "listings", label: "My Listings", icon: Home },
    { key: "inquiries", label: "Inquiries", icon: MessageSquare },
    { key: "transactions", label: "Transactions", icon: DollarSign },
    { key: "profile", label: "Profile", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-card p-5 lg:p-6 lg:sticky lg:top-24">
              {/* User */}
              <div className="text-center mb-6">
                <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-full mx-auto mb-3 overflow-hidden">
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-amber flex items-center justify-center text-secondary-foreground text-xl lg:text-2xl font-bold font-body">
                      {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                    </div>
                  )}
                </div>
                <h2 className="font-display text-lg lg:text-xl font-bold text-foreground">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <p className="text-muted-foreground font-body text-sm">{currentUser?.email}</p>
                <Badge className="mt-2 bg-secondary/10 text-secondary font-body text-xs">Property Owner</Badge>
              </div>

              {/* Mobile: horizontal scroll tabs */}
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg font-body text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.key
                        ? "bg-secondary/10 text-secondary font-semibold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg font-body text-sm text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-6 lg:space-y-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {[
                    { icon: Eye, label: "Total Views", value: stats.totalViews.toLocaleString(), color: "text-blue-500" },
                    { icon: MessageSquare, label: "Inquiries", value: chats.length.toString(), color: "text-secondary" },
                    { icon: Home, label: "Active Listings", value: userPosts.length.toString(), color: "text-emerald-500" },
                    { icon: Heart, label: "Saved", value: savedPosts.length.toString(), color: "text-rose-500" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-card rounded-xl shadow-card p-4 lg:p-5">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                      <p className="text-xl lg:text-2xl font-display font-bold text-foreground">{stat.value}</p>
                      <p className="text-muted-foreground font-body text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Views Chart */}
                <div className="bg-card rounded-xl shadow-card p-5 lg:p-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">Monthly Views</h3>
                  <div className="h-56 lg:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.monthlyViews}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 88%)" />
                        <XAxis dataKey="month" tick={{ fontFamily: "DM Sans", fontSize: 12 }} />
                        <YAxis tick={{ fontFamily: "DM Sans", fontSize: 12 }} />
                        <Tooltip contentStyle={{ fontFamily: "DM Sans", borderRadius: "8px" }} />
                        <Bar dataKey="views" fill="hsl(35 80% 52%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Inquiries Preview */}
                <div className="bg-card rounded-xl shadow-card p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold text-foreground">Recent Inquiries</h3>
                    <button onClick={() => setActiveTab("inquiries")} className="text-secondary font-body text-sm hover:underline">
                      View All
                    </button>
                  </div>
                  
                  {isLoadingChats ? (
                    <div className="py-8 text-center">
                      <div className="w-8 h-8 border-2 border-muted border-t-secondary rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-muted-foreground text-sm">Loading inquiries...</p>
                    </div>
                  ) : chatsError ? (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-destructive text-sm font-body">{chatsError}</p>
                    </div>
                  ) : chats.length > 0 ? (
                    <div className="space-y-3">
                      {chats.slice(0, 3).map((chat) => (
                        <div key={chat.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gradient-amber flex items-center justify-center text-secondary-foreground text-xs font-bold flex-shrink-0">
                            {chat.receiver?.firstName?.[0] || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-body text-sm font-semibold text-foreground truncate">
                                {chat.receiver?.firstName} {chat.receiver?.lastName}
                              </p>
                              {chat.seenBy && !chat.seenBy.includes(userInfo.userId) && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-secondary text-secondary">
                                  new
                                </Badge>
                              )}
                            </div>
                            <p className="font-body text-xs text-muted-foreground line-clamp-1">
                              {chat.lastMessage || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No inquiries yet</p>
                  )}
                </div>

                {/* Saved Properties */}
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">Saved Properties</h3>
                  
                  {isLoadingPosts ? (
                    <div className="py-12 text-center">
                      <div className="w-10 h-10 border-3 border-muted border-t-secondary rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-muted-foreground">Loading saved properties...</p>
                    </div>
                  ) : postsError ? (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-destructive font-body">{postsError}</p>
                    </div>
                  ) : savedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      {savedPosts.slice(0, 2).map((p) => (
                        <PropertyCard key={p.id} property={p} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No saved properties yet</p>
                  )}
                </div>
              </>
            )}

           {/* Listings Tab */}
{activeTab === "listings" && (
  <>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
      <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground">My Listings</h2>
      <Link to="/add-property">
        <Button className="bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Listing
        </Button>
      </Link>
    </div>

    {isLoadingPosts ? (
      <div className="py-12 text-center">
        <div className="w-10 h-10 border-3 border-muted border-t-secondary rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-muted-foreground">Loading properties...</p>
      </div>
    ) : postsError ? (
      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <p className="text-destructive font-body">{postsError}</p>
      </div>
    ) : userPosts.length > 0 ? (
      <div className="space-y-4">
        {userPosts.map((p) => (
          <div key={p._id} className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <Link to={`/${p._id}`} className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                <img src={p.images?.[0] || '/placeholder.jpg'} alt={p.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 p-4 lg:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <Link to={`/${p._id}`} className="font-display text-lg font-bold text-foreground hover:text-secondary transition-colors">
                      {p.title}
                    </Link>
                    <p className="text-muted-foreground font-body text-sm">{p.address}, {p.city}</p>
                  </div>
                  <Badge className={p.type === "rent" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}>
                    {p.type === "rent" ? "For Rent" : "For Sale"}
                  </Badge>
                </div>
                <p className="font-display text-xl font-bold text-secondary mb-3">
                  {p.type === "rent" ? `$${p.price.toLocaleString()}/${p.rentalPeriod || 'month'}` : `$${p.price.toLocaleString()}`}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-body text-xs mb-3">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {p.views || 0} views</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {p.inquiries || 0} inquiries</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Listed {new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/${p._id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" /> View
                    </Button>
                  </Link>
                  <Link to={`/update/${p._id}`}>
                    <Button  variant="outline" size="sm" className="h-8 text-xs">
                      <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                  </Link>
                  
                  <Button variant="outline" size="sm" className="h-8 text-xs text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">No properties yet</p>
        <Link to="/add-property">
          <Button className="bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90">
            Create your first property listing →
          </Button>
        </Link>
      </div>
    )}
  </>
)}
            {/* Inquiries Tab */}
            {activeTab === "inquiries" && (
              <>
                <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-2">Inquiries</h2>
                
                {isLoadingChats ? (
                  <div className="py-12 text-center">
                    <div className="w-10 h-10 border-3 border-muted border-t-secondary rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-muted-foreground">Loading messages...</p>
                  </div>
                ) : chatsError ? (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-destructive font-body">{chatsError}</p>
                  </div>
                ) : chats.length > 0 ? (
                  <div className="space-y-3">
                    {chats.map((chat) => (
                      <div key={chat.id} className="bg-card rounded-xl shadow-card p-4 lg:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-amber flex items-center justify-center text-secondary-foreground font-bold text-sm flex-shrink-0">
                              {chat.receiver?.firstName?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-body font-semibold text-foreground">
                                {chat.receiver?.firstName} {chat.receiver?.lastName}
                              </p>
                              <p className="font-body text-xs text-muted-foreground">
                                {new Date(chat.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            chat.seenBy && !chat.seenBy.includes(userInfo.userId)
                              ? "border-secondary text-secondary" 
                              : "border-emerald-500 text-emerald-500"
                          }>
                            {chat.seenBy && !chat.seenBy.includes(userInfo.userId) ? "new" : "seen"}
                          </Badge>
                        </div>
                        <p className="font-body text-sm text-foreground mb-3">{chat.lastMessage || "No messages yet"}</p>
                        <div className="flex gap-2">
                          <Link to={`/chat/${chat.id}`}>
                            <Button size="sm" className="h-8 bg-gradient-amber text-secondary-foreground text-xs font-semibold hover:opacity-90">
                              View Chat
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No messages yet</p>
                )}
              </>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <>
                <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-2">Transaction History</h2>

                {/* Commission Rates Info */}
                <div className="bg-amber-light/10 border border-secondary/20 rounded-xl p-4 lg:p-5 mb-4">
                  <h4 className="font-display text-base font-bold text-foreground mb-2">Commission Structure</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-card rounded-lg p-3">
                      <p className="font-body text-xs text-muted-foreground">Sales Commission</p>
                      <p className="font-display text-lg font-bold text-secondary">{commissionRates.sale.description}</p>
                    </div>
                    <div className="bg-card rounded-lg p-3">
                      <p className="font-body text-xs text-muted-foreground">Rental Commission</p>
                      <p className="font-display text-lg font-bold text-secondary">{commissionRates.rent.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.transactionHistory.map((tx) => (
                    <div key={tx.id} className="bg-card rounded-xl shadow-card p-4 lg:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-body font-semibold text-foreground">{tx.propertyTitle}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{tx.type === "sale" ? "Sale" : "Rental"}</Badge>
                            <span className="font-body text-xs text-muted-foreground">{tx.date}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-display text-lg font-bold text-foreground">${tx.amount.toLocaleString()}</p>
                          <p className="font-body text-xs text-secondary font-semibold">Commission: ${tx.commission.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Earnings */}
                <div className="bg-card rounded-xl shadow-card p-5 lg:p-6 text-center">
                  <p className="font-body text-sm text-muted-foreground mb-1">Total Earnings</p>
                  <p className="font-display text-3xl font-bold text-secondary">
                    ${stats.transactionHistory.reduce((s, t) => s + (t.amount - t.commission), 0).toLocaleString()}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Total commission paid: ${stats.transactionHistory.reduce((s, t) => s + t.commission, 0).toLocaleString()}
                  </p>
                </div>
              </>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">Profile Settings</h2>

                <div className="bg-card rounded-xl shadow-card p-5 lg:p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row items-center gap-4 pb-5 border-b border-border">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      {currentUser?.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt={`${currentUser.firstName} ${currentUser.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-amber flex items-center justify-center text-secondary-foreground text-2xl font-bold font-body">
                          {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground">
                        Property Owner • Member since {new Date(currentUser?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-secondary" />
                        <p className="font-body text-sm text-foreground">{currentUser?.email}</p>
                      </div>
                    </div>
                    {currentUser?.phoneNumber && (
                      <div className="space-y-1">
                        <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">Phone</p>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-secondary" />
                          <p className="font-body text-sm text-foreground">{currentUser.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                    {currentUser?.region && (
                      <div className="space-y-1">
                        <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <p className="font-body text-sm text-foreground">{currentUser.region}</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">Joined</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <p className="font-body text-sm text-foreground">
                          {new Date(currentUser?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link to="/profile/update">
                    <Button className="bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>

                {/* Account Stats */}
                <div className="bg-card rounded-xl shadow-card p-5 lg:p-6 mt-4">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">Account Summary</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Listings", value: userPosts.length.toString() },
                      { label: "Saved", value: savedPosts.length.toString() },
                      { label: "Inquiries", value: chats.length.toString() },
                      { label: "Transactions", value: "0" },
                    ].map((s, i) => (
                      <div key={i} className="bg-muted rounded-lg p-3 text-center">
                        <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                        <p className="font-body text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;