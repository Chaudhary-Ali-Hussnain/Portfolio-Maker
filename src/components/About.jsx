import styles from "../About.module.css";

const About = () => {
  return (
    <div>
      <header className={styles.mainHeader}>
        <h1 className={styles.headerTitle}>Welcome to My Portfolio</h1>
        <h2 className={styles.headerSubtitle}>Showcasing Skills, Team & Achievements</h2>
        <img src="/head.jpg" alt="Header Image" className={styles.headerImg} />
        <img src="/logo.jpg" alt="Logo" className={styles.logo} />
      </header>

      <hr className={styles.divider} />

      <section className={styles.aboutText}>
        <p>
          Welcome to the Portfolio Maker. Here you can explore our team, activities, achievements,
          and contact information to all designed in a structured and professional format
        </p>
      </section>

      <div className={styles.teamTableContainer}>
        <table className={styles.teamTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src="/chaudhary .jpg" width="70" alt="Ali" />
              </td>
              <td>Ali Hassanain</td>
              <td>President</td>
              <td>0300-0000000</td>
            </tr>
            <tr>
              <td>
                <img src="/hassan.jpg" width="70" alt="Ahmed" />
              </td>
              <td>Ahmed Khan</td>
              <td>Vice President</td>
              <td>0311-1111111</td>
            </tr>
            <tr>
              <td>
                <img src="/fatima.jpg" width="70" alt="Fatima" />
              </td>
              <td>Fatima Noor</td>
              <td>Coordinator</td>
              <td>0322-2222222</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className={styles.infoSection}>
        <h1>Contact Details</h1>
        <ul>
          <li>Email: example@gmail.com</li>
          <li>Phone: 0322-4550150</li>
          <li>Location: University of Central Punjab</li>
        </ul>
      </section>

      <footer className={styles.mainFooter}>
        © 2025 Military Society — All Rights Reserved
      </footer>
    </div>
  );
};

export default About;
