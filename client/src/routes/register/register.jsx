import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
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
        const errText = await response.text();
        console.error("Signup error:", errText);
        return;
      }

      const data = await response.json();
      console.log("Free trial signup success:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error submitting signup:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="firstName" type="text" placeholder="first Name" />
          <input name="lastName" type="text" placeholder="last Name" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
