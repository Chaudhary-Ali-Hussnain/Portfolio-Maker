import styles from "../Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.mainHeaders}>
        <h1>Welcome to QuickCv</h1>
        <h2>Create Your Personal Portfolio Easily</h2>
        <img className={styles.headersImg} src="/head.jpg" alt="Header Image" />
      </header>

      <hr />

      <section className={styles.introCard}>
        <h3>Introduction</h3>
        <p>
          <b>QuickCv</b> helps users create personal portfolios using simple forms.
        </p>
        <p>
          It allows you to add your <i>information</i>, <u>skills</u>, and experiences.
        </p>
        <p>This platform is designed for students, professionals, and freelancers.</p>
      </section>

      <section className={styles.features}>
        <h3>Features</h3>
        <ul className={styles.featuresList}>
          <li>No coding required</li>
          <li>Easy to use</li>
          <li>Free to use</li>
        </ul>
      </section>

      <section className={styles.steps}>
        <h3>Steps to Make Your Portfolio:</h3>
        <ol className={styles.stepsList}>
          <li>Register using the form</li>
          <li>Upload your photo</li>
          <li>Submit your experience and details</li>
        </ol>
      </section>

      <section className={styles.imagesRow}>
        <img src="/1.jpg" alt="Portfolio Example" />
        <img src="/2.jpg" alt="Portfolio Sample" />
        <img src="/3.jpg" alt="Portfolio Preview" />
      </section>

      <section className={styles.videoLink}>
        <h3>Watch Video Tutorial:</h3>
        <a
          href="https://www.youtube.com/watch?v=-uQIBlaZ4P0&list=PL07efmqYWHZ_rVeQ1ws0ER9eL6cxo-d5V"
          target="_blank"
          rel="noreferrer"
        >
          Watch this video on YouTube
        </a>
      </section>

      <section className={styles.audioSection}>
        <h3>Listen to Intro Audio:</h3>
        <audio controls>
          <source src="/a1.mp3" type="audio/mpeg" />
        </audio>
      </section>

      <hr />

      <footer className={styles.footer}>
        <p>© 2025 QuickCv</p>
        <p className="sv-credit">
          Website designed &amp; developed by{" "}
          <a href="https://strivers.online" target="_blank" rel="noopener noreferrer">Strivers</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
