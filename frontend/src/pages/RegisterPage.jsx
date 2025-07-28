import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    driverLicenseId: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          driverLicense: formData.driverLicenseId,
          gender: formData.gender,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Registration successful!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          repeatPassword: "",
          driverLicenseId: "",
          gender: "",
        });
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Registration failed. Try again.");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      driverLicenseId: "",
      gender: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#17252A] to-[#3AAFA9] p-6">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-1 gap-6 p-10"
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-[#2B7A78] mb-6">Create Account</h2>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
            required
          />
          <input
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            placeholder="Repeat Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
            required
          />
          <input
            type="text"
            name="driverLicenseId"
            value={formData.driverLicenseId}
            onChange={handleChange}
            placeholder="Driver License ID"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#2B7A78]"
            required
          />
          <div className="flex items-center justify-between">
            <label className="font-semibold">Gender:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Female
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#2B7A78] text-white hover:bg-[#205f5a] transition"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;

