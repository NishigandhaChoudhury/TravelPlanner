function TripSummary({ trip }) {
  if (!trip) {
    return <p>No trip details available.</p>;
  }

  return (
    <div className="budget-card">
      <h2>{trip.name || "My Trip"}</h2>
      <p>Destination: {trip.destination || "Not specified"}</p>
      <p>Start Date: {trip.startDate || "Not specified"}</p>
      <p>End Date: {trip.endDate || "Not specified"}</p>
      <p>
        Estimated Budget: ₹
        {Number(trip.budget || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default TripSummary;