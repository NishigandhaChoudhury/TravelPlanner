import { useState } from "react";

function BudgetSummary() {
  const [expenses, setExpenses] = useState({
    accommodation: 0,
    food: 0,
    transport: 0,
    activities: 0,
    other: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setExpenses((previous) => ({
      ...previous,
      [name]: Math.max(0, Number(value) || 0),
    }));
  };

  const total = Object.values(expenses).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const categories = [
    { name: "accommodation", label: "Accommodation" },
    { name: "food", label: "Food" },
    { name: "transport", label: "Transportation" },
    { name: "activities", label: "Activities" },
    { name: "other", label: "Other expenses" },
  ];

  return (
    <section className="budget-card">
      <h2>Trip Budget Calculator</h2>
      <p>Estimate your travel expenses.</p>

      {categories.map((category) => (
        <div className="budget-field" key={category.name}>
          <label htmlFor={category.name}>{category.label} (₹)</label>
          <input
            id={category.name}
            type="number"
            min="0"
            step="1"
            name={category.name}
            value={expenses[category.name]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="budget-total">
        <h3>Total Estimated Budget</h3>
        <p>
          {total.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </section>
  );
}

export default BudgetSummary;