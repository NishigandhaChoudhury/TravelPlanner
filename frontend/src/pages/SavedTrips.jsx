
import { useEffect, useState } from "react";
import {
  calculateTotalBudget,
  formatCurrency,
  getSavedTrips,
  saveTrips,
} from "../utils/tripUtils";
import "../components/TripPlanner.css";

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setTrips(getSavedTrips());
  }, []);

  function deleteTrip(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this saved trip?"
    );

    if (!confirmed) return;

    try {
      const updatedTrips = trips.filter((trip) => trip.id !== id);
      saveTrips(updatedTrips);
      setTrips(updatedTrips);
      setError("");
    } catch {
      setError("The trip could not be deleted. Please try again.");
    }
  }

  return (
    <main className="saved-trips-page">
      <p className="st-muted">YOUR TRAVEL COLLECTION</p>
      <h1>Saved Trips</h1>
      <p className="st-muted">
        Your trips, plans, activities, and estimated budgets in one place.
      </p>

      {error && (
        <p className="mp-error" role="alert">
          {error}
        </p>
      )}

      {trips.length === 0 ? (
        <section className="st-card">
          <h2>No saved trips yet</h2>
          <p className="st-muted">
            Create your first trip, build your itinerary, and save it here.
          </p>
          <a className="st-link" href="/create-trip">
            Plan a Trip →
          </a>
        </section>
      ) : (
        trips.map((trip) => {
          const activities = Array.isArray(trip.itinerary)
            ? [...trip.itinerary].sort(
                (a, b) =>
                  (a.date || "").localeCompare(b.date || "") ||
                  (a.time || "").localeCompare(b.time || "")
              )
            : [];

          const totalBudget = calculateTotalBudget(trip.budget || {});

          return (
            <article className="st-card" key={trip.id}>
              <div className="st-top">
                <div>
                  <p className="mp-eyebrow">YOUR TRIP</p>
                  <h2>{trip.name || trip.destination || "Untitled trip"}</h2>
                  <p className="st-muted">
                    Destination: {trip.destination || "Not specified"}
                  </p>
                  <p className="st-muted">
                    {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                  </p>
                  <p className="st-muted">
                    {Number(trip.travelers) || 1}{" "}
                    {Number(trip.travelers) === 1 ? "traveller" : "travellers"}
                    {trip.days ? ` · ${trip.days} days` : ""}
                  </p>
                  <p className="st-muted">
                    Estimated budget: {formatCurrency(totalBudget)}
                  </p>
                </div>

                <button
                  type="button"
                  className="st-button"
                  onClick={() => deleteTrip(trip.id)}
                  aria-label={`Delete ${trip.name || trip.destination || "trip"}`}
                >
                  Delete trip
                </button>
              </div>

              <div>
                <h3>Itinerary</h3>
                <p className="st-muted">
                  {activities.length}{" "}
                  {activities.length === 1 ? "activity" : "activities"} planned
                </p>

                {activities.length === 0 ? (
                  <p className="st-muted">
                    No activities have been added to this trip yet.
                  </p>
                ) : (
                  activities.map((activity, index) => (
                    <div
                      className="st-activity"
                      key={activity.id || `${trip.id}-activity-${index}`}
                    >
                      <strong>
                        {activity.title || activity.name || "Untitled activity"}
                      </strong>
                      <p className="st-muted">
                        {formatDate(activity.date)}
                        {activity.time ? ` · ${activity.time}` : ""}
                      </p>
                      {activity.notes && (
                        <p className="st-muted">{activity.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </article>
          );
        })
      )}
    </main>
  );
}
