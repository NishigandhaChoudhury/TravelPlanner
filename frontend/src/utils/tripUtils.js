
export const BUDGET_CATEGORIES = [
  { name: "transport", label: "Transportation" },
  { name: "accommodation", label: "Accommodation" },
  { name: "food", label: "Food & Dining" },
  { name: "activities", label: "Activities & Sightseeing" },
];

export function calculateTotalBudget(budget = {}) {
  return BUDGET_CATEGORIES.reduce(
    (total, category) =>
      total + Math.max(0, Number(budget[category.name]) || 0),
    0
  );
}

export function formatCurrency(amount = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function getBudgetBreakdown(budget = {}) {
  const total = calculateTotalBudget(budget);

  return BUDGET_CATEGORIES.map((category) => {
    const amount = Math.max(0, Number(budget[category.name]) || 0);

    return {
      ...category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    };
  });
}

const STORAGE_KEY = "travelPlannerSavedTrips";

export function getSavedTrips() {
  try {
    const trips = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(trips) ? trips : [];
  } catch {
    return [];
  }
}

export function saveTrips(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}
