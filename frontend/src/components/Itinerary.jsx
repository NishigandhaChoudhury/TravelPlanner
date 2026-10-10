
import { useEffect, useState } from "react";
import "./TripPlanner.css";

const ACTIVITY_ID = () =>
  globalThis.crypto?.randomUUID?.() ??
  `activity-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const activityIdeas = {
  Adventure: [
    { title: "Explore the city on foot", time: "09:00", notes: "Discover interesting streets and neighbourhoods." },
    { title: "Try a local outdoor experience", time: "11:00", notes: "Look for a suitable walk, cycle route, or outdoor activity." },
    { title: "Visit a popular local attraction", time: "14:00", notes: "Choose an attraction that fits your interests." },
    { title: "Watch the sunset", time: "17:30", notes: "Find a scenic viewpoint or waterfront." },
    { title: "Explore the evening food scene", time: "19:00", notes: "Try local dishes at a well-reviewed place." },
  ],
  Relaxation: [
    { title: "Enjoy a relaxed breakfast", time: "09:00", notes: "Start the day slowly at a local café." },
    { title: "Visit a peaceful garden or park", time: "10:30", notes: "Take a gentle walk and enjoy the surroundings." },
    { title: "Leave time for a leisurely lunch", time: "13:00", notes: "Choose a restaurant that suits your budget." },
    { title: "Enjoy a free afternoon", time: "15:00", notes: "Consider a spa, quiet café, or time to rest." },
    { title: "Have dinner somewhere atmospheric", time: "19:00", notes: "Look for a relaxed local dining experience." },
  ],
  Culture: [
    { title: "Explore the historic neighbourhood", time: "09:00", notes: "Look for architecture, local stories, and landmarks." },
    { title: "Visit a museum or cultural site", time: "11:00", notes: "Check visitor information and opening hours first." },
    { title: "Try traditional local food", time: "13:00", notes: "Choose a regional dish or local speciality." },
    { title: "Discover local art and crafts", time: "15:00", notes: "Explore galleries, markets, or craft shops." },
    { title: "Enjoy an evening cultural experience", time: "18:30", notes: "Consider a performance or cultural event if available." },
  ],
  Romantic: [
    { title: "Have breakfast at a cosy café", time: "09:00", notes: "Find somewhere with a relaxed atmosphere." },
    { title: "Explore a beautiful part of the city", time: "10:30", notes: "Take photos and enjoy a leisurely walk." },
    { title: "Plan a special lunch", time: "13:00", notes: "Choose a restaurant that suits your budget." },
    { title: "Visit a scenic viewpoint", time: "16:30", notes: "Allow time to enjoy the view together." },
    { title: "Enjoy a memorable dinner", time: "19:00", notes: "Consider booking ahead if the restaurant requires it." },
  ],
};

const interestIdeas = {
  History: { title: "Discover a historic landmark", time: "10:00", notes: "Explore the destination's history and heritage." },
  "Local food": { title: "Taste local food specialities", time: "13:00", notes: "Try a regional dish or visit a food market." },
  Nature: { title: "Spend time in nature", time: "09:30", notes: "Look for a garden, park, nature trail, or scenic area." },
  Adventure: { title: "Try a local adventure activity", time: "11:00", notes: "Choose an activity suitable for your group." },
  Sightseeing: { title: "Explore a famous local sight", time: "10:00", notes: "Check visitor details before setting out." },
  Shopping: { title: "Explore local shops and markets", time: "15:00", notes: "Look for local crafts, souvenirs, and independent shops." },
  Nightlife: { title: "Explore the evening scene", time: "19:00", notes: "Consider a lively neighbourhood or evening event." },
  Relaxation: { title: "Make time to unwind", time: "16:00", notes: "Choose a quiet café, park, or relaxing experience." },
  Art: { title: "Discover local art and design", time: "14:00", notes: "Explore a gallery, exhibition, or creative neighbourhood." },
  Photography: { title: "Go on a photo walk", time: "17:00", notes: "Look for interesting architecture and scenic views." },
};

const dayTitles = [
  "The adventure begins",
  "Make it memorable",
  "Explore a little deeper",
  "Discover something new",
  "Enjoy every moment",
];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getDateForDay(startDate, dayIndex) {
  const date = new Date(`${startDate}T12:00:00`);
  date.setDate(date.getDate() + dayIndex);
  return date.toISOString().slice(0, 10);
}

function createActivity(title, time, notes, source = "suggested") {
  return { id: ACTIVITY_ID(), title, time, notes, source };
}

function generatePlan(trip) {
  const dayCount = Math.max(1, Math.min(Number(trip.days) || 1, 30));
  const style = activityIdeas[trip.travelStyle] ? trip.travelStyle : "Adventure";
  const baseIdeas = activityIdeas[style];
  const interests = Array.isArray(trip.interests) ? trip.interests : [];
  const mustVisitPlaces = Array.isArray(trip.mustVisitPlaces)
    ? trip.mustVisitPlaces.filter((place) => place.trim())
    : [];

  const personalizedIdeas = interests
    .map((interest) => interestIdeas[interest])
    .filter(Boolean);

  const allIdeas = [...personalizedIdeas, ...baseIdeas];
  const uniqueIdeas = allIdeas.filter(
    (idea, index, list) =>
      list.findIndex((item) => item.title === idea.title) === index
  );

  const days = Array.from({ length: dayCount }, (_, index) => {
    const activities = [];

    // Place traveller-requested destinations first, spreading them across days.
    if (mustVisitPlaces[index]) {
      activities.push(
        createActivity(
          `Must visit: ${mustVisitPlaces[index]}`,
          "10:00",
          "Added from your must-visit list. Check location details and opening hours before your visit.",
          "must-visit"
        )
      );
    }

    // Add suitable suggestions to fill out the day.
    const slots = [
      { start: 0, end: 12 },
      { start: 12, end: 17 },
      { start: 17, end: 24 },
    ];

    slots.forEach((slot, slotIndex) => {
      const idea = uniqueIdeas.find((candidate) => {
        const hour = Number(candidate.time.split(":")[0]);
        return hour >= slot.start && hour < slot.end &&
          !activities.some((activity) => activity.title === candidate.title);
      });

      if (idea && activities.length < 4) {
        activities.push(
          createActivity(idea.title, idea.time, idea.notes, "suggested")
        );
      } else if (slotIndex === 2 && activities.length < 3) {
        activities.push(
          createActivity(
            "Free time to explore",
            "18:00",
            "Keep this time flexible for spontaneous discoveries, rest, or a place you find along the way."
          )
        );
      }
    });

    return {
      day: index + 1,
      date: trip.startDate ? getDateForDay(trip.startDate, index) : "",
      title: dayTitles[index % dayTitles.length],
      activities: activities.sort((a, b) => a.time.localeCompare(b.time)),
    };
  });

  // If there are more must-visit places than days, add the extras to existing days.
  mustVisitPlaces.slice(dayCount).forEach((place, index) => {
    const targetDay = days[index % days.length];
    targetDay.activities.push(
      createActivity(
        `Must visit: ${place}`,
        "15:00",
        "Added from your must-visit list. Check opening hours and travel time.",
        "must-visit"
      )
    );
    targetDay.activities.sort((a, b) => a.time.localeCompare(b.time));
  });

  return days;
}

export default function Itinerary({ trip, onUpdateTrip }) {
  const [days, setDays] = useState(
    Array.isArray(trip.itinerary) ? trip.itinerary : []
  );
  const [drafts, setDrafts] = useState({});
  const [showManualForms, setShowManualForms] = useState({});
  const [hasGenerated, setHasGenerated] = useState(
    Array.isArray(trip.itinerary) && trip.itinerary.some(
      (day) => Array.isArray(day.activities) && day.activities.length > 0
    )
  );

  useEffect(() => {
    const savedDays = Array.isArray(trip.itinerary) ? trip.itinerary : [];
    setDays(savedDays);
    setHasGenerated(
      savedDays.some((day) => Array.isArray(day.activities) && day.activities.length > 0)
    );
  }, [trip.id]);

  function saveDays(updatedDays) {
    setDays(updatedDays);
    onUpdateTrip({ ...trip, itinerary: updatedDays });
  }

  function handleGeneratePlan() {
    const newDays = generatePlan(trip);
    saveDays(newDays);
    setHasGenerated(true);
    setShowManualForms({});
    setDrafts({});
  }

  function handleRemoveActivity(dayIndex, activityId) {
    const updatedDays = days.map((day, index) =>
      index === dayIndex
        ? {
            ...day,
            activities: day.activities.filter(
              (activity) => activity.id !== activityId
            ),
          }
        : day
    );
    saveDays(updatedDays);
  }

  function handleEditActivity(dayIndex, activityId, field, value) {
    const updatedDays = days.map((day, index) =>
      index === dayIndex
        ? {
            ...day,
            activities: day.activities.map((activity) =>
              activity.id === activityId
                ? { ...activity, [field]: value }
                : activity
            ),
          }
        : day
    );
    saveDays(updatedDays);
  }

  function handleAddActivity(dayIndex) {
    const draft = drafts[dayIndex] || {};
    if (!draft.title?.trim()) return;

    const newActivity = createActivity(
      draft.title.trim(),
      draft.time || "09:00",
      draft.notes?.trim() || "Added by you.",
      "custom"
    );

    const updatedDays = days.map((day, index) =>
      index === dayIndex
        ? {
            ...day,
            activities: [...day.activities, newActivity].sort((a, b) =>
              a.time.localeCompare(b.time)
            ),
          }
        : day
    );

    saveDays(updatedDays);
    setDrafts((previous) => ({ ...previous, [dayIndex]: {} }));
    setShowManualForms((previous) => ({ ...previous, [dayIndex]: false }));
  }

  const totalActivities = days.reduce(
    (total, day) => total + (day.activities?.length || 0),
    0
  );

  return (
    <main className="wander-page itinerary-page">
      <header className="itinerary-heading">
        <div>
          <p className="eyebrow">THE ADVENTURE UNFOLDS</p>
          <h1>Your journey, day by day.</h1>
          <p className="itinerary-subtitle">
            {trip.destination} · {trip.days} days · {trip.travelers} travellers
          </p>
        </div>
        <div className="itinerary-total">
          <strong>{totalActivities}</strong>
          <span>ACTIVITIES PLANNED</span>
        </div>
      </header>

      <section className="auto-plan-panel">
        <div className="auto-plan-copy">
          <span className="auto-plan-icon" aria-hidden="true">✦</span>
          <div>
            <p className="eyebrow">YOUR PERSONAL TRIP ASSISTANT</p>
            <h2>{hasGenerated ? "Want to try a different plan?" : "Not sure what to do?"}</h2>
            <p>
              Let Wanderlust create a suggested plan for every day. We'll include
              your must-visit places and use your travel style and interests to
              fill the rest of the itinerary.
            </p>
          </div>
        </div>
        <button className="auto-plan-button" type="button" onClick={handleGeneratePlan}>
          <span aria-hidden="true">✦</span>{" "}
          {hasGenerated ? "Generate a New Plan" : "Plan My Entire Trip"}
        </button>
        <p className="auto-plan-note">
          These are editable suggestions. Check local details and opening hours before visiting.
        </p>
      </section>

      {days.length === 0 && (
        <section className="itinerary-empty">
          <h2>Your trip is a blank canvas.</h2>
          <p>
            Generate a complete suggested itinerary, or start by adding your own
            activities below.
          </p>
          <button type="button" className="manual-plan-button" onClick={handleGeneratePlan}>
            Create my day-by-day plan
          </button>
        </section>
      )}

      {days.map((day, dayIndex) => (
        <section className="itinerary-day-card" key={`${day.day}-${day.date || dayIndex}`}>
          <div className="itinerary-day-number">
            <span>DAY</span>
            <strong>{String(day.day || dayIndex + 1).padStart(2, "0")}</strong>
          </div>

          <div className="itinerary-day-content">
            <div className="itinerary-day-top">
              <div>
                <p className="itinerary-date">
                  {day.date ? formatDate(day.date) : `DAY ${dayIndex + 1}`}
                </p>
                <h2>{day.title || dayTitles[dayIndex % dayTitles.length]}</h2>
              </div>
              <span className="itinerary-stops">
                {day.activities?.length || 0} stops
              </span>
            </div>

            {(!day.activities || day.activities.length === 0) && (
              <p className="empty-day-message">
                A blank page, full of possibilities. Add your first stop.
              </p>
            )}

            <div className="itinerary-activities">
              {(day.activities || []).map((activity) => (
                <article className="itinerary-activity" key={activity.id}>
                  <div className="activity-time">
                    <label htmlFor={`time-${activity.id}`}>TIME</label>
                    <input
                      id={`time-${activity.id}`}
                      type="time"
                      value={activity.time || "09:00"}
                      onChange={(event) =>
                        handleEditActivity(dayIndex, activity.id, "time", event.target.value)
                      }
                    />
                  </div>

                  <div className="activity-details">
                    <label htmlFor={`title-${activity.id}`}>ACTIVITY</label>
                    <input
                      id={`title-${activity.id}`}
                      type="text"
                      value={activity.title}
                      onChange={(event) =>
                        handleEditActivity(dayIndex, activity.id, "title", event.target.value)
                      }
                    />
                    <label htmlFor={`notes-${activity.id}`}>NOTES</label>
                    <input
                      id={`notes-${activity.id}`}
                      type="text"
                      value={activity.notes || ""}
                      placeholder="Anything to remember?"
                      onChange={(event) =>
                        handleEditActivity(dayIndex, activity.id, "notes", event.target.value)
                      }
                    />
                    {activity.source === "must-visit" && (
                      <span className="activity-tag">YOUR MUST-VISIT</span>
                    )}
                    {activity.source === "suggested" && (
                      <span className="activity-tag">WANDERLUST SUGGESTION</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="remove-activity-button"
                    onClick={() => handleRemoveActivity(dayIndex, activity.id)}
                    aria-label={`Remove ${activity.title}`}
                    title="Remove activity"
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>

            {showManualForms[dayIndex] ? (
              <div className="manual-activity-form">
                <label htmlFor={`new-title-${dayIndex}`}>Activity</label>
                <input
                  id={`new-title-${dayIndex}`}
                  type="text"
                  placeholder="e.g. Explore the local market"
                  value={drafts[dayIndex]?.title || ""}
                  onChange={(event) =>
                    setDrafts((previous) => ({
                      ...previous,
                      [dayIndex]: { ...previous[dayIndex], title: event.target.value },
                    }))
                  }
                />

                <div className="manual-activity-fields">
                  <div>
                    <label htmlFor={`new-time-${dayIndex}`}>TIME</label>
                    <input
                      id={`new-time-${dayIndex}`}
                      type="time"
                      value={drafts[dayIndex]?.time || "09:00"}
                      onChange={(event) =>
                        setDrafts((previous) => ({
                          ...previous,
                          [dayIndex]: { ...previous[dayIndex], time: event.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`new-notes-${dayIndex}`}>NOTES</label>
                    <input
                      id={`new-notes-${dayIndex}`}
                      type="text"
                      placeholder="Anything to remember?"
                      value={drafts[dayIndex]?.notes || ""}
                      onChange={(event) =>
                        setDrafts((previous) => ({
                          ...previous,
                          [dayIndex]: { ...previous[dayIndex], notes: event.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="manual-form-actions">
                  <button type="button" onClick={() => handleAddActivity(dayIndex)}>
                    + Add to my day
                  </button>
                  <button
                    type="button"
                    className="cancel-manual-button"
                    onClick={() =>
                      setShowManualForms((previous) => ({ ...previous, [dayIndex]: false }))
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="add-activity-button"
                onClick={() =>
                  setShowManualForms((previous) => ({ ...previous, [dayIndex]: true }))
                }
              >
                + Add my own activity
              </button>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
