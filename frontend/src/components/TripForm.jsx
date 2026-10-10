
import { useState } from "react";
import "./TripPlanner.css";

const interestOptions = [
  "History", "Local food", "Nature", "Adventure", "Sightseeing",
  "Shopping", "Nightlife", "Relaxation", "Art", "Photography",
];

const travelStyles = [
  { value: "Adventure", icon: "⛰", note: "Wild & free" },
  { value: "Relaxation", icon: "☼", note: "Slow living" },
  { value: "Culture", icon: "✳", note: "Local stories" },
  { value: "Romantic", icon: "♡", note: "Made for two" },
];

function TripForm({ onCreateTrip }) {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [mustVisitText, setMustVisitText] = useState("");
  const [interests, setInterests] = useState(["Local food", "Sightseeing"]);
  const [error, setError] = useState("");

  const tripDays =
    startDate && endDate && endDate >= startDate
      ? Math.round(
          (new Date(`${endDate}T12:00:00`) -
            new Date(`${startDate}T12:00:00`)) / 86400000
        ) + 1
      : 0;

  function handleSubmit(event) {
    event.preventDefault();

    if (!tripName.trim() || !destination.trim()) {
      setError("Add a trip name and destination to get started.");
      return;
    }

    if (!startDate || !endDate || endDate < startDate) {
      setError("Please choose valid travel dates.");
      return;
    }

    const trip = {
      id: globalThis.crypto?.randomUUID?.() || `trip-${Date.now()}`,
      name: tripName.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      travelers: Number(travelers),
      travelStyle,
      days: tripDays,
      mustVisitPlaces: mustVisitText
        .split(",")
        .map((place) => place.trim())
        .filter(Boolean),
      interests,
      itinerary: [],
    };

    onCreateTrip(trip);
    setError("");
  }

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  return (
    <main className="wander-page" id="trip-planner">
      <header className="wander-nav">
        <a className="wander-brand" href="#trip-planner" aria-label="Wanderlust home">
          <span className="brand-icon">✳</span>
          wander<span>lust.</span>
        </a>
        <span className="nav-note">YOUR NEXT CHAPTER STARTS HERE ↗</span>
      </header>

      <section className="wander-hero">
        <div className="hero-copy">
          <span className="eyebrow">✦ YOUR PERSONAL TRAVEL STUDIO</span>
          <h1>
            The world
            <br />
            is your <em>story.</em>
          </h1>
          <p>
            Somewhere new is calling. Create a trip that feels like you,
            discover experiences worth remembering, and leave the planning to us.
          </p>

          <a className="hero-cta" href="#trip-builder">
            Start your journey <span>↘</span>
          </a>

          <div className="hero-stats">
            <div><strong>01</strong><span>Imagine</span></div>
            <i>→</i>
            <div><strong>02</strong><span>Discover</span></div>
            <i>→</i>
            <div><strong>03</strong><span>Wander</span></div>
          </div>
        </div>

        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85"
            alt="Sunlight falling across majestic mountain peaks"
          />
          <div className="photo-label">
            <span>✳ A LITTLE FURTHER</span>
            <strong>Find your somewhere.</strong>
          </div>
          <div className="floating-stamp">
            <span>GO</span>
            <span>BEYOND</span>
            <span>THE USUAL ↗</span>
          </div>
        </div>
      </section>

      <section className="trip-builder" id="trip-builder">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LET'S MAKE IT HAPPEN</span>
            <h2>Design your getaway<span>.</span></h2>
            <p>A few little details. A whole world of possibilities.</p>
          </div>
          <span className="step-count">YOUR ADVENTURE · 01</span>
        </div>

        <div className="builder-grid">
          <form className="trip-form" onSubmit={handleSubmit}>
            <div className="form-intro">
              <span className="form-step">01 — THE ESSENTIALS</span>
              <h3>Every great story starts somewhere.</h3>
            </div>

            <div className="field">
              <label htmlFor="tripName">GIVE YOUR TRIP A NAME</label>
              <input
                id="tripName"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g. Lost in the Himalayas"
                maxLength={70}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="destination">WHERE WOULD YOU LIKE TO GO?</label>
              <input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Manali, India"
                required
              />
              <small>Choose a place that makes you feel something.</small>
            </div>

            <div className="date-grid">
              <div className="field">
                <label htmlFor="startDate">DEPARTURE</label>
                <input
                  id="startDate"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate && e.target.value > endDate) setEndDate("");
                  }}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="endDate">RETURN</label>
                <input
                  id="endDate"
                  type="date"
                  min={startDate || new Date().toISOString().slice(0, 10)}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {tripDays > 0 && (
              <p className="date-hint">✳ Your journey will be {tripDays} {tripDays === 1 ? "day" : "days"} long.</p>
            )}

            <div className="field">
              <label htmlFor="travelers">WHO'S COMING ALONG?</label>
              <select
                id="travelers"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((count) => (
                  <option key={count} value={count}>
                    {count === 1
                      ? "Just me · Solo travel"
                      : count === 2
                        ? "Two travellers · A duo"
                        : `${count} travellers`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-divider" />

            <div className="field">
              <label>02 — CHOOSE YOUR KIND OF ESCAPE</label>
              <div className="vibe-options">
                {travelStyles.map(({ value, icon, note }) => (
                  <button
                    type="button"
                    key={value}
                    className={`vibe-card ${travelStyle === value ? "selected" : ""}`}
                    onClick={() => setTravelStyle(value)}
                    aria-pressed={travelStyle === value}
                  >
                    <span className="vibe-icon">{icon}</span>
                    <strong>{value}</strong>
                    <small>{note}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="mustVisit">PLACES YOU ALREADY DREAM OF</label>
              <textarea
                id="mustVisit"
                value={mustVisitText}
                onChange={(e) => setMustVisitText(e.target.value)}
                placeholder="e.g. a famous temple, a local food market, a mountain viewpoint..."
                rows={3}
              />
              <small>Separate places with commas. We'll prioritize these in your itinerary.</small>
            </div>

            <div className="field">
              <label>03 — WHAT DO YOU LOVE TO DISCOVER?</label>
              <div className="interest-options">
                {interestOptions.map((interest) => {
                  const selected = interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      className={`interest-chip ${selected ? "selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => toggleInterest(interest)}
                    >
                      {selected ? "✓ " : "+ "}{interest}
                    </button>
                  );
                })}
              </div>
              <small>Pick as many as you like. Your interests help shape your trip.</small>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="create-button" type="submit">
              Create my adventure <span>↗</span>
            </button>
            <p className="form-footnote">NO PERFECT PLANS. JUST GREAT STORIES.</p>
          </form>

          <aside className="preview-card">
            <span className="preview-kicker">A POSTCARD FROM YOUR FUTURE</span>
            <div className="preview-illustration">✳</div>
            <span className="preview-location">
              {destination.trim() || "YOUR DESTINATION"}
            </span>
            <h3>{tripName.trim() || "An adventure awaits."}</h3>
            <p className="preview-description">
              Every unforgettable journey begins with one little idea.
            </p>

            <div className="preview-divider" />

            <div className="preview-detail">
              <span>◷ &nbsp; DURATION</span>
              <strong>{tripDays ? `${tripDays} ${tripDays === 1 ? "day" : "days"}` : "—"}</strong>
            </div>
            <div className="preview-detail">
              <span>♧ &nbsp; TRAVELLERS</span>
              <strong>{travelers} {Number(travelers) === 1 ? "person" : "people"}</strong>
            </div>
            <div className="preview-detail">
              <span>✧ &nbsp; YOUR VIBE</span>
              <strong>{travelStyle}</strong>
            </div>
            <div className="preview-detail">
              <span>✦ &nbsp; MUST-VISIT PLACES</span>
              <strong>{mustVisitText.split(",").filter((place) => place.trim()).length}</strong>
            </div>
            <div className="preview-detail">
              <span>♡ &nbsp; INTERESTS</span>
              <strong>{interests.length} selected</strong>
            </div>

            <div className="preview-divider" />
            <p className="preview-quote">“Collect moments, not just destinations.”</p>
            <div className="preview-bottom">
              <span>MADE FOR THE MOMENTS.</span><span>✳</span>
            </div>
          </aside>
        </div>
      </section>

      <footer className="wander-footer">
        <span>WANDER OFTEN. WONDER ALWAYS.</span>
        <span>MADE FOR THE JOURNEY ✳</span>
      </footer>
    </main>
  );
}

export default TripForm;
