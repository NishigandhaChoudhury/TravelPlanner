
import { useState } from "react";
import "./TripPlanner.css";

export default function TripForm({ onCreateTrip }) {
  const today = new Date().toISOString().slice(0, 10);

  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [error, setError] = useState("");

  const days =
    startDate && endDate && endDate >= startDate
      ? Math.floor(
          (Date.parse(`${endDate}T00:00:00Z`) -
            Date.parse(`${startDate}T00:00:00Z`)) /
            86400000
        ) + 1
      : 0;

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !destination.trim()) {
      setError("Please enter a trip name and destination.");
      return;
    }

    if (!startDate || !endDate || endDate < startDate) {
      setError("Please choose valid travel dates.");
      return;
    }

    const trip = {
      id: globalThis.crypto?.randomUUID?.() || `trip-${Date.now()}`,
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      travelers: Number(travelers),
      days,
      itinerary: [],
      createdAt: new Date().toISOString(),
    };

    if (typeof onCreateTrip !== "function") {
      setError("Trip planner is not connected yet. Please refresh the page.");
      return;
    }

    onCreateTrip(trip);
  }

  return (
    <main className="manual-planner">
      <header className="mp-heading">
        <span className="mp-eyebrow">Your travel planner</span>
        <h1>Plan your trip</h1>
        <p className="mp-subtitle">
          Enter your trip details first. Then build your own itinerary,
          one activity at a time.
        </p>
      </header>

      <form className="mp-panel" onSubmit={handleSubmit}>
        <h2>Trip details</h2>
        <p className="mp-help">
          Start with the essentials. You can plan the activities on the next step.
        </p>

        <div className="mp-field">
          <label htmlFor="trip-name">Trip name</label>
          <input
            id="trip-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Weekend in Manali"
            maxLength={70}
            required
          />
        </div>

        <div className="mp-field">
          <label htmlFor="trip-destination">Destination</label>
          <input
            id="trip-destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="e.g. Manali, Himachal Pradesh"
            required
          />
        </div>

        <div className="mp-grid">
          <div className="mp-field">
            <label htmlFor="trip-start">Start date</label>
            <input
              id="trip-start"
              type="date"
              min={today}
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value);

                if (endDate && event.target.value > endDate) {
                  setEndDate("");
                }
              }}
              required
            />
          </div>

          <div className="mp-field">
            <label htmlFor="trip-end">End date</label>
            <input
              id="trip-end"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </div>
        </div>

        {days > 0 && (
          <p className="mp-muted">
            Duration: {days} {days === 1 ? "day" : "days"}
          </p>
        )}

        <div className="mp-field">
          <label htmlFor="trip-travelers">Number of travellers</label>
          <select
            id="trip-travelers"
            value={travelers}
            onChange={(event) => setTravelers(event.target.value)}
          >
            {Array.from({ length: 20 }, (_, index) => index + 1).map(
              (count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "traveller" : "travellers"}
                </option>
              )
            )}
          </select>
        </div>

        {error && (
          <p className="mp-error" role="alert">
            {error}
          </p>
        )}

        <div className="mp-actions">
          <button className="mp-button mp-primary" type="submit">
            Continue to itinerary →
          </button>
        </div>
      </form>
    </main>
  );
}
