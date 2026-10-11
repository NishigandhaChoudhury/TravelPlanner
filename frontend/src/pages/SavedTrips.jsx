import { useEffect, useState } from "react";

const STORAGE_KEY = "travelPlannerSavedTrips";

function readSavedTrips() {
  try {
    const trips = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(trips) ? trips : [];
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return "Not set";

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(readSavedTrips());
  }, []);

  function deleteTrip(id) {
    const updatedTrips = trips.filter((trip) => trip.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    setTrips(updatedTrips);
  }

  return (
    <main className="saved-trips-page">
      <style>{`
        .saved-trips-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px 60px;
          color: #173f38;
        }

        .saved-trips-page h1 {
          font-size: clamp(28px, 4vw, 40px);
          margin: 8px 0;
        }

        .saved-trips-page .muted {
          color: #64748b;
          line-height: 1.6;
        }

        .saved-trips-page .trip-card {
          background: white;
          border: 1px solid #dfe9e5;
          border-radius: 16px;
          padding: 22px;
          margin-top: 20px;
          box-shadow: 0 8px 24px rgba(23, 63, 56, 0.06);
          overflow-wrap: anywhere;
        }

        .saved-trips-page .trip-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .saved-trips-page button,
        .saved-trips-page .trip-link {
          cursor: pointer;
          border: 0;
          border-radius: 8px;
          padding: 11px 14px;
          font-weight: 700;
          text-decoration: none;
        }

        .saved-trips-page button {
          background: #fff0f0;
          color: #a33434;
        }

        .saved-trips-page .trip-link {
          display: inline-block;
          background: #087f70;
          color: white;
        }

        .saved-trips-page .activity {
          border-top: 1px solid #e5ece9;
          padding: 12px 0;
        }

        @media (max-width: 600px) {
          .saved-trips-page {
            padding: 25px 14px 40px;
          }

          .saved-trips-page .trip-card {
            padding: 16px;
          }

          .saved-trips-page .trip-header {
            flex-direction: column;
          }
        }
      `}</style>

      <p className="muted">YOUR TRAVEL COLLECTION</p>
      <h1>Saved Trips</h1>
      <p className="muted">
        Review your manually planned trips and their activities.
      </p>

      {trips.length === 0 ? (
        <section className="trip-card">
          <h2>No saved trips yet</h2>
          <p className="muted">
            Create your first trip, add activities, and save it here.
          </p>
          <a className="trip-link" href="/create-trip">
            Plan a Trip →
          </a>
        </section>
      ) : (
        trips.map((trip) => (
          <article className="trip-card" key={trip.id}>
            <div className="trip-header">
              <div>
                <h2>{trip.name}</h2>
                <p className="muted">{trip.destination}</p>
                <p className="muted">
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                  {" · "}
                  {trip.travelers}{" "}
                  {Number(trip.travelers) === 1
                    ? "traveller"
                    : "travellers"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => deleteTrip(trip.id)}
              >
                Delete trip
              </button>
            </div>

            <h3>
              Itinerary · {(trip.itinerary || []).length} activities
            </h3>

            {(trip.itinerary || []).length === 0 ? (
              <p className="muted">No activities were added to this trip.</p>
            ) : (
              trip.itinerary.map((activity) => (
                <div className="activity" key={activity.id}>
                  <strong>{activity.title}</strong>
                  <p className="muted">
                    {formatDate(activity.date)}
                    {activity.time ? ` · ${activity.time}` : ""}
                  </p>
                  {activity.notes && (
                    <p className="muted">{activity.notes}</p>
                  )}
                </div>
              ))
            )}
          </article>
        ))
      )}
    </main>
  );
}