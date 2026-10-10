import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BudgetCalculator from "./pages/BudgetCalculator";
import SavedTrips from "./pages/SavedTrips";
import "./App.css";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">YOUR NEXT ADVENTURE STARTS HERE</span>
          <h1>Discover places.<br />Create memories.</h1>
          <p>
            Explore amazing destinations, plan your itinerary,
            and manage your travel budget—all in one place.
          </p>
          <a href="/destinations" className="primary-button">
            Explore Destinations <span>→</span>
          </a>
        </div>
      </section>

      <section className="features">
        <h2>Your journey, simplified</h2>
        <p className="section-subtitle">
          Everything you need to plan your next unforgettable trip.
        </p>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-icon">🌍</span>
            <h3>Explore Destinations</h3>
            <p>Discover new places and find inspiration for your next journey.</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">🗓️</span>
            <h3>Plan Your Itinerary</h3>
            <p>Organize your activities and create a day-by-day travel plan.</p>
          </article>

          <article className="feature-card">
            <span className="feature-icon">💰</span>
            <h3>Manage Your Budget</h3>
            <p>Estimate your expenses and keep your travel costs organized.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function Placeholder({ title, description }) {
  return (
    <main className="placeholder-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <p>We're building this feature with our project team.</p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/destinations"
          element={<Placeholder title="Explore Destinations" description="Find your next favorite destination." />}
        />
        <Route
          path="/create-trip"
          element={<Placeholder title="Plan Your Trip" description="Build your personalized itinerary." />}
        />
       <Route path="/saved-trips" element={<SavedTrips />} />
        <Route path="/budget-calculator" element={<BudgetCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}