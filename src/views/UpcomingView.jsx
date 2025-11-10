import React from "react";
import "./UpcomingView.css";

const UpcomingView = () => {
  return (
    <div className="upcoming-page">
      <header className="upcoming-hero">
        <h1>Upcoming Events</h1>
        <p>See what's coming up at the church — join us!</p>
      </header>

      <main className="upcoming-container">
        <section className="events-grid">
          <article className="event-card">
            <h3>Sunday Service</h3>
            <p className="event-meta">Every Sunday • 10:00 AM</p>
            <p className="event-desc">Worship, teaching, and community fellowship.</p>
          </article>

          <article className="event-card">
            <h3>Midweek Prayer</h3>
            <p className="event-meta">Wednesdays • 7:00 PM</p>
            <p className="event-desc">Corporate prayer and encouragement.</p>
          </article>

          <article className="event-card">
            <h3>Community Outreach</h3>
            <p className="event-meta">Monthly • 2nd Saturday</p>
            <p className="event-desc">Serve local neighbors and share hope.</p>
          </article>

          {/* Add more events here */}
        </section>
      </main>
    </div>
  );
};

export default UpcomingView;
