import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (response.ok && data.success) {
        // Save token to localStorage FIRST
        localStorage.setItem("token", data.token);
        
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        // Now decode the token
        const userInfo = jwtDecode(data.token);
        console.log("Decoded user info:", userInfo); // Debug log
        
        // Update context
        updateUser(userInfo);
        
        // Navigate to home
        navigate("/");
      } else {
        setError(data.error || data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="email"
            required
            type="email"
            placeholder="Email"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {error && <span className="error">{error}</span>}
          <Link to="/register">Don't have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;