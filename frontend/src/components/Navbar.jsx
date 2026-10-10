import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">✈</span>
        Travel Planner
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/destinations">Explore</NavLink>
        <NavLink to="/create-trip">Plan a Trip</NavLink>
        <NavLink to="/saved-trips">Saved Trips</NavLink>
      </nav>
    </header>
  );
}