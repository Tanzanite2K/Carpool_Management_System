import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Maps from "../components/Maps";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

function SearchPage() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Autosuggestion states
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [debouncedOrigin, setDebouncedOrigin] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");

  // Debounce for origin
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOrigin(formData.from);
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.from]);

  // Debounce for destination
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDestination(formData.to);
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.to]);

  // Fetch suggestions
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

  // Fetch origin suggestions whenever debouncedOrigin changes
  useEffect(() => {
    fetchSuggestions(debouncedOrigin, "origin");
  }, [debouncedOrigin]);

  // Fetch destination suggestions whenever debouncedDestination changes
  useEffect(() => {
    fetchSuggestions(debouncedDestination, "destination");
  }, [debouncedDestination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = async () => {
    if (!formData.from || !formData.to || !formData.date) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/search-rides?from=${formData.from}&to=${formData.to}&date=${formData.date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
        setSearchTriggered(true);
      } else {
        toast.error(data.message || "Error fetching rides");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while searching for rides");
    }
  };

  const handleRequestRide = async (rideId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/request-ride", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shareId: rideId, message: "Requesting this ride" }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Ride request raised successfully");
      } else {
        toast.error(data.message || "Error raising ride request");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while raising the ride request");
    }
  };

  const handleSuggestionClick = async (suggestion, type) => {
    const url = new URL(NOMINATIM_BASE_URL);
    url.searchParams.set("q", suggestion.display_name);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        if (type === "origin") {
          setFormData({ ...formData, from: suggestion.display_name });
          setOriginCoordinates([parseFloat(lat), parseFloat(lon)]);
          setOriginSuggestions([]);
        } else if (type === "destination") {
          setFormData({ ...formData, to: suggestion.display_name });
          setDestinationCoordinates([parseFloat(lat), parseFloat(lon)]);
          setDestinationSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#17252A] to-[#3AAFA9] p-6">
      <div className="w-full bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-[#2B7A78] text-center">Search for Rides</h2>
        <div className="flex">
          <div className="w-1/4 p-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">From</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-[#2B7A78]"
                placeholder="Enter a location"
              />
              {originSuggestions.length > 0 && (
                <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
                  {originSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(suggestion, "origin")}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">To</label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-[#2B7A78]"
                placeholder="Enter destination"
              />
              {destinationSuggestions.length > 0 && (
                <ul className="bg-white shadow-lg max-h-60 overflow-auto w-full mt-2 rounded-lg z-20">
                  {destinationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(suggestion, "destination")}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#2B7A78]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full px-6 py-3 bg-[#2B7A78] text-white rounded-full hover:bg-[#205f5a] transition-all duration-300"
            >
              Search
            </button>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-[#2B7A78]">Search Results</h3>
              {searchResults.length > 0 ? (
                searchResults.map((ride, index) => (
                  <div key={index} className="border p-4 mb-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">From: {ride.origin}</p>
                        <p className="font-semibold">To: {ride.destination}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{ride.price}</p>
                        <p className="text-sm text-gray-500">per person</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <p className="text-sm">
                        <span className="text-gray-600">Date: </span>
                        {new Date(ride.departureTime).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Spots: </span>
                        {ride.spots}
                      </p>
                    </div>
                    <p className="text-sm mb-3">
                      <span className="text-gray-600">Driver: </span>
                      {ride.driver.firstName} {ride.driver.lastName}
                    </p>
                    <button
                      onClick={() => handleRequestRide(ride.id)}
                      className="w-full px-6 py-2 bg-[#2B7A78] text-white rounded-full hover:bg-[#205f5a] transition-all duration-300"
                    >
                      Request Ride
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No rides found</p>
              )}
            </div>
          </div>
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
  
}

export default SearchPage;