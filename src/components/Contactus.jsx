import React, { useState } from "react";
import styles from "../Contactus.module.css";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwSoQoWzVcSicFbB2i7YhGjY34DnDK2gzXTtA4NLsPunLIfMUg1UjGKOiZA908gNQh6/exec";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    fetch(scriptURL, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch(() => {
        setStatus("error");
      });
  };

  return (
    <div>
      <header className={styles.mainHeader}>
        <h1 className={styles.headerTitle}>Contact Us</h1>
        <h2 className={styles.headerSubtitle}>We'd Love to Hear From You</h2>
        <img src="/head.jpg" alt="Header Image" className={styles.headerImg} />
        <img src="/logo.jpg" alt="Logo" className={styles.logo} />
      </header>

      <hr className={styles.divider} />

      <section className={styles.formContainer}>
        <form className={styles.registrationForm} onSubmit={handleSubmit}>
          <fieldset className={styles.formSection}>
            <legend>Contact Us</legend>

            <label className={styles.formLabel}>Name:</label>
            <input
              type="text"
              className={styles.formInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className={styles.formLabel}>Email:</label>
            <input
              type="email"
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className={styles.formLabel}>Message:</label>
            <textarea
              rows="5"
              className={styles.formTextarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <button type="submit" className={styles.formBtn} disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
            {status === "success" && (
              <p className={styles.statusMsg} role="status">&#10003; Message sent successfully.</p>
            )}
            {status === "error" && (
              <p className={`${styles.statusMsg} ${styles.statusError}`} role="alert">&#9888; Failed to send message. Please try again.</p>
            )}
          </fieldset>
        </form>
      </section>

      <section className={styles.contactSection}>
        <h2 className={styles.contactTitle}>Departments</h2>
        <ul className={styles.contactList}>
          <li>
            <b>Support:</b> support@portfoliomaker.com
          </li>
          <li>
            <b>Feedback:</b> feedback@portfoliomaker.com
          </li>
        </ul>
      </section>

      <section className={styles.contactSection}>
        <h2 className={styles.contactTitle}>Contact Others</h2>
        <ul className={styles.contactList}>
          <li>Phone: 03455343433546</li>
          <li>Email: Portfolio@gmail.com</li>
          <li>Address: 23-D Bahria Town, Lahore</li>
        </ul>
      </section>

      <footer className={styles.mainFooter}>
        <p>© 2025 Portfolio Maker | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default ContactUs;
