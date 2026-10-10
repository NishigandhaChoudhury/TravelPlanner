import { useEffect, useState } from "react";
import TripSummary from "../components/TripSummary";

const STORAGE_KEY = "travelPlannerTrips";

function SavedTrips() {
  const [trips, setTrips] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  const addSampleTrip = () => {
    setTrips((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: "Weekend Getaway",
        destination: "Goa",
        startDate: "2026-11-14",
        endDate: "2026-11-16",
        budget: 8000,
      },
    ]);
  };

  const removeTrip = (id) => {
    setTrips((previous) => previous.filter((trip) => trip.id !== id));
  };

  return (
    <main className="saved-trips-page">
      <h1>Saved Trips</h1>
      <p>Your planned adventures in one place.</p>

      <button onClick={addSampleTrip}>Add Sample Trip</button>

      {trips.length === 0 ? (
        <p>You haven't saved any trips yet.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip.id}>
            <TripSummary trip={trip} />
            <button onClick={() => removeTrip(trip.id)}>
              Remove Trip
            </button>
          </div>
        ))
      )}
    </main>
  );
}

export default SavedTrips;