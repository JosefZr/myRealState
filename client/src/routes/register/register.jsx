import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            userData: {
              firstName,
              lastName,
              email,
              password,
            }
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || errData.message || "Registration failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Registration success:", data);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-navy items-center justify-center p-12">
        <div className="text-center max-w-md">
          <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            Start Your <span className="text-gradient-amber">Journey</span>
          </h2>
          <p className="text-primary-foreground/60 font-body">
            Create an account to list properties, save favorites, and connect with buyers and renters.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-lg bg-gradient-amber flex items-center justify-center">
                <Home className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Nest<span className="text-secondary">Find</span>
              </span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground font-body">Get started with NestFind for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    name="firstName"
                    placeholder="John" 
                    className="pl-10 h-12 font-body" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-body">Last Name</Label>
                <Input 
                  name="lastName"
                  placeholder="Doe" 
                  className="h-12 font-body" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  name="email"
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-10 h-12 font-body" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 font-body"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm font-body">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-12 bg-gradient-amber text-secondary-foreground font-semibold shadow-amber hover:opacity-90"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground font-body text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;