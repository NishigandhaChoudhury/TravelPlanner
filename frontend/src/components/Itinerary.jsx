
import { useState } from "react";
import "./TripPlanner.css";

function getTripDates(startDate, endDate) {
  if (!startDate || !endDate || endDate < startDate) return [];

  const dates = [];
  let current = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  while (current <= end) {
    dates.push(new Date(current).toISOString().slice(0, 10));
    current += 86400000;
  }

  return dates;
}

function formatDate(value) {
  if (!value) return "";

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Itinerary({ trip, onUpdateTrip }) {
  const [title, setTitle] = useState("");
  const [activityDate, setActivityDate] = useState(trip.startDate || "");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const activities = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  const dates = getTripDates(trip.startDate, trip.endDate);

  function resetForm() {
    setTitle("");
    setActivityDate(trip.startDate || "");
    setTime("");
    setNotes("");
    setEditingId(null);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Enter an activity or place name.");
      return;
    }

    if (!activityDate || !dates.includes(activityDate)) {
      setError("Choose a date within your trip.");
      return;
    }

    const activity = {
      id: editingId || globalThis.crypto?.randomUUID?.() ||
        `activity-${Date.now()}`,
      title: title.trim(),
      date: activityDate,
      time,
      notes: notes.trim(),
    };

    const updatedActivities = editingId
      ? activities.map((item) =>
          item.id === editingId ? activity : item
        )
      : [...activities, activity];

    updatedActivities.sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || "").localeCompare(b.time || "")
    );

    onUpdateTrip({
      ...trip,
      itinerary: updatedActivities,
    });

    resetForm();
  }

  function startEditing(activity) {
    setEditingId(activity.id);
    setTitle(activity.title || "");
    setActivityDate(activity.date || trip.startDate);
    setTime(activity.time || "");
    setNotes(activity.notes || "");
    setError("");

    document
      .getElementById("itinerary-editor")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function removeActivity(id) {
    onUpdateTrip({
      ...trip,
      itinerary: activities.filter((activity) => activity.id !== id),
    });

    if (editingId === id) resetForm();
  }

  return (
    <main className="manual-planner itinerary-page">
      <header className="mp-heading">
        <span className="mp-eyebrow">Your personal itinerary</span>
        <h1>{trip.name || "Your trip plan"}</h1>
        <p className="mp-subtitle">
          {trip.destination} · {formatDate(trip.startDate)} –{" "}
          {formatDate(trip.endDate)}
        </p>
        <p className="mp-muted">
          {trip.travelers}{" "}
          {Number(trip.travelers) === 1 ? "traveller" : "travellers"} ·{" "}
          {dates.length} {dates.length === 1 ? "day" : "days"}
        </p>
      </header>

      <section className="mp-panel" id="itinerary-editor">
        <h2>{editingId ? "Edit activity" : "Add an activity"}</h2>
        <p className="mp-help">
          Choose your own places and activities. Nothing is generated
          automatically.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mp-field">
            <label htmlFor="activity-title">Activity or place</label>
            <input
              id="activity-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Visit a museum or have lunch"
              required
            />
          </div>

          <div className="mp-grid">
            <div className="mp-field">
              <label htmlFor="activity-date">Day</label>
              <select
                id="activity-date"
                value={activityDate}
                onChange={(event) => setActivityDate(event.target.value)}
                required
              >
                {dates.map((date, index) => (
                  <option key={date} value={date}>
                    Day {index + 1} — {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mp-field">
              <label htmlFor="activity-time">Time (optional)</label>
              <input
                id="activity-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
          </div>

          <div className="mp-field">
            <label htmlFor="activity-notes">Notes (optional)</label>
            <textarea
              id="activity-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Booking details, meeting point, reminders..."
            />
          </div>

          {error && (
            <p className="mp-error" role="alert">
              {error}
            </p>
          )}

          <div className="mp-actions">
            <button className="mp-button mp-primary" type="submit">
              {editingId ? "Save changes" : "Add to itinerary"}
            </button>

            {editingId && (
              <button
                className="mp-button mp-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}

            <a className="mp-button mp-secondary" href="/saved-trips">
              View Saved Trips
            </a>
          </div>
        </form>
      </section>

      <section>
        <h2>Trip itinerary</h2>
        <p className="mp-muted">
          {activities.length}{" "}
          {activities.length === 1 ? "activity" : "activities"} planned
        </p>

        {dates.map((date, index) => {
          const dayActivities = activities.filter(
            (activity) => activity.date === date
          );

          return (
            <section className="mp-panel" key={date}>
              <h2>
                Day {index + 1} — {formatDate(date)}
              </h2>

              {dayActivities.length === 0 ? (
                <p className="mp-muted">
                  Nothing planned yet. Add an activity for this day above.
                </p>
              ) : (
                dayActivities.map((activity) => (
                  <article className="mp-activity" key={activity.id}>
                    <div>
                      <strong>{activity.title}</strong>
                      {activity.time && <p>Time: {activity.time}</p>}
                      {activity.notes && <p>{activity.notes}</p>}
                    </div>

                    <div className="mp-actions">
                      <button
                        className="mp-button mp-secondary"
                        type="button"
                        onClick={() => startEditing(activity)}
                      >
                        Edit
                      </button>
                      <button
                        className="mp-button mp-remove"
                        type="button"
                        onClick={() => removeActivity(activity.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          );
        })}
      </section>

      <div className="mp-actions">
        <a className="mp-button mp-secondary" href="/create-trip">
          ← Back to Plan a Trip
        </a>
        <a className="mp-button mp-primary" href="/saved-trips">
          Finish and view Saved Trips →
        </a>
      </div>
    </main>
  );
}
