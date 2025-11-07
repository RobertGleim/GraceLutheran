import React from "react";
import "./ContactView.css";
import HeroSection from "../components/hero/HeroSection.jsx";

const ContactView = () => {
  return (
    <>
      <HeroSection className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </HeroSection>

      <div className="contact-container">
        <div className="contact-section">
          <h2>Mailing Address</h2>
          <p className="contact-detail">
            1007 Bacon Ranch Road, Killeen, Texas 76542
          </p>
        </div>

        <div className="contact-offices">
          <div className="office-card church-office-card">
            <h3>Church Office</h3>
            <p className="phone">(254) 392-0717</p>
            <p className="hours">Mon.-Thurs. 9:00 – 2:00</p>
            <a href="mailto:church@example.com" className="email-link">
              <img
                src="/icons8-email-100.png"
                alt="Email icon"
                className="email-icon"
              />
              <span>Send Email</span>
            </a>
          </div>

          <div className="office-card school-office-card">
            <h3>School Office</h3>
            <p className="phone">(254) 441-5519</p>
            <p className="hours">Mon.-Fri. 8:30 – 3:30</p>
            <a href="mailto:school@example.com" className="email-link">
              <img
                src="/icons8-email-100.png"
                alt="Email icon"
                className="email-icon"
              />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactView;
