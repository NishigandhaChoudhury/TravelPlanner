
import { useState } from "react";
import {
  calculateTotalBudget,
  formatCurrency,
  getSavedTrips,
  saveTrips,
} from "../utils/tripUtils";

function SavedTrips() {
  const [trips, setTrips] = useState(() => getSavedTrips());

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this saved trip?"
    );

    if (!confirmed) return;

    const updatedTrips = trips.filter((trip) => trip.id !== id);
    setTrips(updatedTrips);
    saveTrips(updatedTrips);
  }

  return (
    <main className="saved-trips-page">
      <section className="saved-trips-header">
        <span className="budget-eyebrow">YOUR TRAVEL COLLECTION</span>
        <h1>Saved Trips</h1>
        <p>
          Access your saved travel plans and review their estimated budgets.
        </p>
      </section>

      {trips.length === 0 ? (
        <section className="saved-trips-empty">
          <div className="saved-trips-empty-icon" aria-hidden="true">
            ✈
          </div>
          <h2>No saved trips yet</h2>
          <p>
            Your completed travel plans will appear here once you save them.
          </p>
        </section>
      ) : (
        <section className="saved-trips-grid">
          {trips.map((trip) => {
            const budget = trip.budget || {};
            const total = calculateTotalBudget(budget);

            return (
              <article className="saved-trip-card" key={trip.id}>
                <div className="saved-trip-card-top">
                  <span className="saved-trip-label">SAVED ITINERARY</span>

                  <button
                    type="button"
                    className="saved-trip-delete"
                    onClick={() => handleDelete(trip.id)}
                    aria-label={`Delete ${trip.name || "saved trip"}`}
                  >
                    Delete
                  </button>
                </div>

                <h2>{trip.name || "Untitled Trip"}</h2>

                {trip.destination && (
                  <p className="saved-trip-destination">
                    {trip.destination}
                  </p>
                )}

                {trip.startDate && (
                  <p className="saved-trip-date">
                    Start date: {trip.startDate}
                  </p>
                )}

                <div className="saved-trip-budget">
                  <span>Estimated Budget</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>

                <div className="saved-trip-expenses">
                  <span>Transportation</span>
                  <span>{formatCurrency(budget.transport)}</span>

                  <span>Accommodation</span>
                  <span>{formatCurrency(budget.accommodation)}</span>

                  <span>Food & Dining</span>
                  <span>{formatCurrency(budget.food)}</span>

                  <span>Activities</span>
                  <span>{formatCurrency(budget.activities)}</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default SavedTrips;
