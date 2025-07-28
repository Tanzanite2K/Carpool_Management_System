import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        window.location.href = "/share";
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#17252A] to-[#3AAFA9] p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">
        <ToastContainer />
        <h2 className="text-3xl font-bold mb-6 text-[#2B7A78] text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#2B7A78] text-white rounded-full hover:bg-[#205f5a] transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;