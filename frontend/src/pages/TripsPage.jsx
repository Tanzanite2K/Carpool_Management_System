import React, { useEffect, useState } from 'react';

const TripsPage = () => {
  const [drivingTrips, setDrivingTrips] = useState([]);
  const [ridingTrips, setRidingTrips] = useState([]);
  const [loadingDriving, setLoadingDriving] = useState(true);
  const [loadingRiding, setLoadingRiding] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrivingTrips = async () => {
    setLoadingDriving(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/trips/driving', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch driving trips');
      const data = await response.json();
      setDrivingTrips(data);
    } catch (error) {
      setError('Failed to load driving trips');
    } finally {
      setLoadingDriving(false);
    }
  };

  const fetchRidingTrips = async () => {
    setLoadingRiding(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/trips/riding', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch riding trips');
      const data = await response.json();
      setRidingTrips(data);
    } catch (error) {
      setError('Failed to load riding trips');
    } finally {
      setLoadingRiding(false);
    }
  };

  const handleRequestStatusChange = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update request status');
      await fetchDrivingTrips();
    } catch (error) {
      setError('Failed to update request status');
    }
  };

  useEffect(() => {
    fetchDrivingTrips();
    fetchRidingTrips();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="p-6 min-h-screen font-sans bg-gradient-to-br from-[#26383e] to-[#3AAFA9]">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow">
          {error}
        </div>
      )}

      {/* Driving Section */}
      <div className="mb-10">
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-[#2B7A78] pb-2 text-center">Driving</h2>
        {loadingDriving ? (
          <div className="text-center p-4 text-white">Loading driving trips...</div>
        ) : drivingTrips.length === 0 ? (
          <div className="text-center p-4 text-white">No driving trips found</div>
        ) : (
          <div className="grid gap-6">
            {drivingTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-3xl shadow-xl p-6 transition hover:shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-[#2B7A78]">From</h3>
                    <p className="text-gray-700">{trip.origin}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2B7A78]">To</h3>
                    <p className="text-gray-700">{trip.destination}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-[#2B7A78]">Departure Time</h3>
                  <p className="text-gray-700">{formatDate(trip.departureTime)}</p>
                </div>
                {trip.requests && trip.requests.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-[#2B7A78] mb-2">Ride Requests</h3>
                    <div className="space-y-4">
                      {trip.requests.map((request) => (
                        <div
                          key={request.id}
                          className="bg-[#f0fdfa] p-4 rounded-xl hover:bg-[#e0f7f4] transition"
                        >
                          <p className="font-medium text-gray-800">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              className="bg-[#2B7A78] hover:bg-[#205f5a] text-white px-4 py-1 rounded-full transition"
                              onClick={() => handleRequestStatusChange(request.id, 'APPROVED')}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition"
                              onClick={() => handleRequestStatusChange(request.id, 'DECLINED')}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No ride requests yet</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Riding Section */}
      <div>
      <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-[#2B7A78] pb-2 text-center">Riding</h2>
        {loadingRiding ? (
          <div className="text-center p-4 text-white">Loading riding trips...</div>
        ) : ridingTrips.length === 0 ? (
          <div className="text-center p-4 text-white">No riding trips found</div>
        ) : (
          <div className="grid gap-6">
            {ridingTrips.map((request) => (
              <div key={request.id} className="bg-white rounded-3xl shadow-xl p-6 transition hover:shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-[#2B7A78]">From</h3>
                    <p className="text-gray-700">{request.share.origin}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2B7A78]">To</h3>
                    <p className="text-gray-700">{request.share.destination}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-[#2B7A78]">Departure Time</h3>
                  <p className="text-gray-700">{formatDate(request.share.departureTime)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#2B7A78]">Status</h3>
                  <span
                    className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${
                      request.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'DECLINED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
