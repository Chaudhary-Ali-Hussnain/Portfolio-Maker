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

      <section className={styles.creatorCard}>
        <img src="/chaudhary .jpg" alt="Chaudhary Ali Hussnain" className={styles.creatorImg} />
        <div className={styles.creatorInfo}>
          <h3 className={styles.creatorTitle}>About the Maker</h3>
          <p className={styles.creatorName}>Chaudhary Ali Hussnain</p>
          <p className={styles.creatorRole}>Founder &amp; Creator</p>
          <p>
            This website is designed &amp; developed by{" "}
            <a href="https://strivers.online" target="_blank" rel="noopener noreferrer">Strivers</a>.
            Explore our team, activities, and achievements to learn more.
          </p>
          <p className={styles.creatorContact}>
            Contact: <a href="mailto:striversoffical@gmail.com">striversoffical@gmail.com</a>
          </p>
        </div>
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
              <td>Chaudhary Ali Hussnain</td>
              <td>President</td>
              <td>0300-0000000</td>
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

      

      <footer className={styles.mainFooter}>
        © 2025 Military Society. All Rights Reserved
        <p className="sv-credit">
          Website designed &amp; developed by{" "}
          <a href="https://strivers.online" target="_blank" rel="noopener noreferrer">Strivers</a>
        </p>
      </footer>
    </div>
  );
};

export default About;
