import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${adminToken}` },
        };

        const [usersResponse, tripsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', config),
          axios.get('http://localhost:5000/api/admin/trips', config),
        ]);

        setUsers(usersResponse.data);
        setTrips(tripsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17252A] to-[#3AAFA9] p-6">
      <nav className="bg-white shadow-md rounded-xl mb-6 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2B7A78]">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === 'users'
                ? 'bg-[#2B7A78] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeTab === 'trips'
                ? 'bg-[#2B7A78] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('trips')}
          >
            Trips
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {activeTab === 'users' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                      Departure Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">
                      Spots
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">
                      Requests
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{trip.origin}</td>
                      <td className="px-6 py-4">{trip.destination}</td>
                      <td className="px-6 py-4">
                        {new Date(trip.departureTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {trip.driver.firstName} {trip.driver.lastName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            trip.spots > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {trip.spots}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {trip.requests.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
