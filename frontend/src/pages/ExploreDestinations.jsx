import { useMemo, useState } from "react";
import destinations from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import "./ExploreDestinations.css";

const categories = ["All", "Beach", "Mountains", "Culture", "City"];

export default function ExploreDestinations() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxBudget, setMaxBudget] = useState("100000");
  const [selectedDestination, setSelectedDestination] = useState(null);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const searchText = `${destination.name} ${destination.country}`.toLowerCase();
      const matchesSearch = searchText.includes(search.trim().toLowerCase());
      const matchesCategory =
        category === "All" || destination.category === category;
      const matchesBudget = destination.budget <= Number(maxBudget);

      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [search, category, maxBudget]);

  return (
    <main className="explore-page">
      <section className="explore-hero">
        <span className="explore-eyebrow">FIND YOUR NEXT ADVENTURE</span>
        <h1>Explore Destinations</h1>
        <p>
          From peaceful beaches to breathtaking mountains,
          discover a place worth exploring.
        </p>
      </section>

      <section className="destination-tools">
        <input
          type="search"
          aria-label="Search destinations"
          placeholder="Search by destination or country..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All categories" : item}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by maximum budget"
          value={maxBudget}
          onChange={(event) => setMaxBudget(event.target.value)}
        >
          <option value="15000">Up to ₹15,000</option>
          <option value="25000">Up to ₹25,000</option>
          <option value="50000">Up to ₹50,000</option>
          <option value="100000">Any budget</option>
        </select>
      </section>

      <section className="destination-results">
        <div className="destination-results-heading">
          <h2>Popular destinations</h2>
          <span>{filteredDestinations.length} places found</span>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="destination-grid">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onViewDetails={setSelectedDestination}
              />
            ))}
          </div>
        ) : (
          <div className="destination-empty">
            <h3>No destinations found</h3>
            <p>Try a different search, category, or budget.</p>
          </div>
        )}
      </section>

      {selectedDestination && (
        <div
          className="destination-modal-backdrop"
          onClick={() => setSelectedDestination(null)}
        >
          <section
            className="destination-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="destination-modal-close"
              aria-label="Close destination details"
              onClick={() => setSelectedDestination(null)}
            >
              ×
            </button>

            <img
              src={selectedDestination.image}
              alt={selectedDestination.name}
            />

            <div className="destination-modal-content">
              <span className="destination-category">
                {selectedDestination.category}
              </span>
              <h2 id="destination-modal-title">
                {selectedDestination.name}
              </h2>
              <p>{selectedDestination.description}</p>

              <h3>Top attractions</h3>
              <ul>
                {selectedDestination.attractions.map((attraction) => (
                  <li key={attraction}>{attraction}</li>
                ))}
              </ul>

              <p>
                <strong>Estimated budget: </strong>
                ₹{selectedDestination.budget.toLocaleString("en-IN")}
              </p>
              <p>
                <strong>Suggested duration: </strong>
                {selectedDestination.duration}
              </p>

              <button
                type="button"
                className="destination-button"
                onClick={() => setSelectedDestination(null)}
              >
                Close Details
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
