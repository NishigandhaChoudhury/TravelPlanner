export default function DestinationCard({ destination, onViewDetails }) {
  return (
    <article className="destination-card">
      <img
        className="destination-image"
        src={destination.image}
        alt={destination.name}
        loading="lazy"
      />

      <div className="destination-card-content">
        <div className="destination-card-top">
          <span className="destination-category">
            {destination.category}
          </span>
          <span className="destination-rating">
            ★ {destination.rating}
          </span>
        </div>

        <h2>{destination.name}</h2>
        <p>{destination.description}</p>

        <div className="destination-card-bottom">
          <div>
            <span className="destination-label">Estimated budget</span>
            <strong>
              ₹{destination.budget.toLocaleString("en-IN")}
            </strong>
            <span className="destination-duration">
              for {destination.duration}
            </span>
          </div>

          <button
            type="button"
            className="destination-button"
            onClick={() => onViewDetails(destination)}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
