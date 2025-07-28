import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", credentials);

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Login failed!");
      }
    } catch (err) {
      toast.error("Invalid credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#17252A] to-[#3AAFA9] p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">
        <ToastContainer />
        <h2 className="text-3xl font-bold mb-6 text-[#2B7A78] text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
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

export default AdminLogin;
