import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maps from "../components/Maps";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const ShareForm = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    departureTime: "",
    price: "",
    spots: "",
    message: "",
  });

  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [debouncedOrigin, setDebouncedOrigin] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOrigin(formData.from);
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.from]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDestination(formData.to);
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.to]);

  const fetchSuggestions = async (query, type) => {
    if (!query) {
      if (type === "origin") setOriginSuggestions([]);
      if (type === "destination") setDestinationSuggestions([]);
      return;
    }

    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (type === "origin") {
        setOriginSuggestions(data);
      } else if (type === "destination") {
        setDestinationSuggestions(data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchSuggestions(debouncedOrigin, "origin");
  }, [debouncedOrigin]);

  useEffect(() => {
    fetchSuggestions(debouncedDestination, "destination");
  }, [debouncedDestination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchClick = () => {
    if (formData.from && formData.to) {
      setSearchTriggered(true);
    } else {
      alert("Please select both origin and destination");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/create-trip",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Trip shared successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("Trip created:", response.data);
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create trip. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#17252A] to-[#3AAFA9] p-6">
      <div className="w-full bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-[#2B7A78] text-center">Share a Ride</h2>
        <div className="flex">
          {/* Form Section */}
          <div className="w-1/4 p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">From</label>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="Enter starting location"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {originSuggestions.length > 0 && (
                  <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
                    {originSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setFormData({ ...formData, from: suggestion.display_name });
                          setOriginCoordinates([suggestion.lat, suggestion.lon]);
                          setOriginSuggestions([]);
                        }}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">To</label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="Enter destination"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {destinationSuggestions.length > 0 && (
                  <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
                    {destinationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setFormData({ ...formData, to: suggestion.display_name });
                          setDestinationCoordinates([suggestion.lat, suggestion.lon]);
                          setDestinationSuggestions([]);
                        }}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Date & Time</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    className="w-1/2 p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="w-1/2 p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="₹ per seat"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold">Seats</label>
                  <input
                    type="number"
                    name="spots"
                    value={formData.spots}
                    onChange={handleChange}
                    placeholder="Available seats"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Add any message..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="w-full md:w-1/2 px-5 py-3 text-white bg-[#2B7A78] rounded-full hover:bg-[#205f5a] transition-all duration-300"
                >
                  Search
                </button>
                <button
                  type="submit"
                  className="w-full md:w-1/2 px-5 py-3 text-white bg-black rounded-full hover:bg-gray-900 transition-all duration-300"
                >
                  Share Ride
                </button>
              </div>
            </form>
          </div>

          {/* Map Section */}
          <div className="w-full h-[89vh]">
            <Maps
              originCoordinates={originCoordinates}
              destinationCoordinates={destinationCoordinates}
              searchTriggered={searchTriggered}
            />
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default ShareForm;
