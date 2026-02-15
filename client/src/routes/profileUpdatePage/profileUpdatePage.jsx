import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Save, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ProfileUpdate = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Property owner and real estate enthusiast. Looking for great investment opportunities.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast({ title: "Profile updated", description: "Your profile information has been saved." });
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (form.newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "Your password has been changed successfully." });
    setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Edit Profile</h1>
            <p className="font-body text-sm text-muted-foreground">Update your personal information</p>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8 mb-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-5">Profile Photo</h2>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-secondary/20" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-amber flex items-center justify-center text-secondary-foreground text-3xl font-bold font-body ring-4 ring-secondary/20">
                  JD
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-body text-sm text-foreground font-semibold">Upload a new photo</p>
              <p className="font-body text-xs text-muted-foreground mt-1">JPG, PNG or WEBP. Max 2MB.</p>
              <label htmlFor="avatar-upload">
                <Button variant="outline" size="sm" className="mt-3 cursor-pointer" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <form onSubmit={handleProfileSave} className="bg-card rounded-2xl shadow-card p-6 lg:p-8 mb-6">
          <h2 className="font-display text-lg font-bold text-foreground mb-5">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-body text-sm">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-body text-sm">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} className="pl-9" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-body text-sm">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="font-body text-sm">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="location" name="location" value={form.location} onChange={handleChange} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="font-body text-sm">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={form.bio}
                onChange={handleChange}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-body"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" className="bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordSave} className="bg-card rounded-2xl shadow-card p-6 lg:p-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-5">Change Password</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="font-body text-sm">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="pl-9 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="font-body text-sm">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={form.newPassword}
                    onChange={handleChange}
                    className="pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-body text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button type="submit" variant="outline" className="font-semibold">
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
