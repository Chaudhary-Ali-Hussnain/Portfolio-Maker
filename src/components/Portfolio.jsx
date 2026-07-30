import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../Portfolio.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Portfolio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className={styles.noData}>
        <h2>No data found</h2>
        <button onClick={() => navigate("/registration")} className={styles.backBtn}>
          Go to Registration
        </button>
      </div>
    );
  }

  const downloadPDF = async () => {
    const button = document.getElementById("downloadBtn");
    button.style.display = "none";
    const element = document.getElementById("portfolioBox");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("portfolio.pdf");
    button.style.display = "block";
  };

  return (
    <div className={styles.portfolioPage}>
      <div className={styles.portfolioBox} id="portfolioBox">
        <div className={styles.portfolioHeader}>
          <h1 className={styles.portfolioTitle}>Portfolio</h1>
          <button id="downloadBtn" className={styles.downloadBtn} onClick={downloadPDF}>
            Download PDF
          </button>
        </div>

        <div className={styles.profileRow}>
          <div className={styles.profileImg}>
            {data.personal.picture ? (
              <img src={data.personal.picture} alt="Profile" />
            ) : (
              <div className={styles.noImg}>No Image</div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h2>{data.personal.name}</h2>
            <p>Email: {data.personal.email}</p>
            <p>Age: {data.personal.age}</p>
            <p>Gender: {data.personal.gender}</p>
            <p>Field: {data.personal.field}</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Education</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Institute</th>
                  <th>Year</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {data.education.map((item, index) => (
                  <tr key={index}>
                    <td>{item.level}</td>
                    <td>{item.institute}</td>
                    <td>{item.year}</td>
                    <td>{item.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Skills</h3>
          <ul className={styles.skillsList}>
            {data.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Experience</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {data.experience.map((item, index) => (
                  <tr key={index}>
                    <td>{item.company}</td>
                    <td>{item.role}</td>
                    <td>{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
