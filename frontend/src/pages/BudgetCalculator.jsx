
import { useState } from "react";
import {
  BUDGET_CATEGORIES,
  calculateTotalBudget,
  formatCurrency,
  getBudgetBreakdown,
} from "../utils/tripUtils";

function BudgetCalculator() {
  const [budget, setBudget] = useState({
    transport: "",
    accommodation: "",
    food: "",
    activities: "",
  });

  const total = calculateTotalBudget(budget);
  const breakdown = getBudgetBreakdown(budget);

  function handleChange(event) {
    const { name, value } = event.target;

    if (value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
      return;
    }

    setBudget((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetBudget() {
    setBudget({
      transport: "",
      accommodation: "",
      food: "",
      activities: "",
    });
  }

  return (
    <main className="budget-page">
      <section className="budget-header">
        <span className="budget-eyebrow">TRIP MANAGEMENT</span>
        <h1>Travel Budget Planner</h1>
        <p>
          Estimate your travel expenses, monitor spending, and plan
          your journey within budget.
        </p>
      </section>

      <section className="budget-layout">
        <div className="budget-card">
          <div className="budget-card-heading">
            <div>
              <h2>Expense Breakdown</h2>
              <p>Enter your estimated expenses in Indian Rupees.</p>
            </div>

            <button
              type="button"
              className="budget-reset"
              onClick={resetBudget}
            >
              Reset
            </button>
          </div>

          <div className="budget-input-list">
            {BUDGET_CATEGORIES.map((category) => (
              <div className="budget-field" key={category.name}>
                <label htmlFor={category.name}>{category.label}</label>

                <div className="budget-input-wrapper">
                  <span>₹</span>
                  <input
                    id={category.name}
                    type="number"
                    name={category.name}
                    min="0"
                    step="1"
                    value={budget[category.name]}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="budget-total-panel">
            <span>Total Estimated Cost</span>
            <strong>{formatCurrency(total)}</strong>
            <p>Based on the expenses entered above</p>
          </div>
        </div>

        <aside className="budget-card budget-summary">
          <h2>Cost Summary</h2>
          <p className="budget-summary-description">
            Review how your estimated budget is distributed.
          </p>

          <div className="budget-summary-total">
            <span>Estimated Trip Budget</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="budget-breakdown-list">
            {breakdown.map((item) => (
              <div className="budget-breakdown-item" key={item.name}>
                <div className="budget-breakdown-label">
                  <span>{item.label}</span>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>

                <div
                  className="budget-progress-track"
                  role="progressbar"
                  aria-label={`${item.label} budget allocation`}
                  aria-valuenow={Math.round(item.percentage)}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="budget-progress-fill"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="budget-summary-footer">
            <span>Expense categories</span>
            <strong>{BUDGET_CATEGORIES.length}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default BudgetCalculator;
