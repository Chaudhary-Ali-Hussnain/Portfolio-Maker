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

  const { personal, education, skills, experience, additional, colors, portfolioType } = data;
  const c = colors || { primary: "#6c3baa", secondary: "#8b5cf6", background: "#0f0c29", textColor: "#ffffff" };

  const downloadPDF = async () => {
    const btn = document.getElementById("downloadBtn");
    if (btn) btn.style.display = "none";
    const el = document.getElementById("portfolioBox");
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pw = pdf.internal.pageSize.getWidth();
    const ph = (imgProps.height * pw) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pw, ph);
    pdf.save("portfolio.pdf");
    if (btn) btn.style.display = "block";
  };

  // Split a comma / semicolon / newline-separated string into a clean list.
  const toList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
    return String(value).split(/\n|,|;/).map((s) => s.trim()).filter(Boolean);
  };

  // Fallback: build a strong professional objective when the user leaves it blank.
  const buildObjective = (p, skillList, expList) => {
    const role = (p.field || "professional").trim();
    const exp = expList[0];
    const expText =
      exp && exp.duration
        ? ` with ${exp.duration} of hands-on experience as a ${exp.role || "professional"} at ${exp.company || "a leading organization"}`
        : "";
    const skillText = skillList.length ? ` and a strong command of ${skillList.slice(0, 4).join(", ")}` : "";
    return (
      `Highly motivated and detail-oriented ${role}${expText} seeking a challenging position where I can apply my expertise and add measurable value to the organization. ` +
      `Known for strong problem-solving abilities, clear communication, and a commitment to continuous learning${skillText}. ` +
      `Aim to collaborate with cross-functional teams, deliver high-quality results, and grow into a trusted ${role} within a dynamic, results-driven environment.`
    );
  };

  // ── Professional ATS Resume Template ──
  if (portfolioType === "ats") {
    const objective = (personal.objective || "").trim() || buildObjective(personal, skills, experience);

    const additionalSections = [
      { title: "Certifications", items: toList(additional?.certifications) },
      { title: "Languages", items: toList(additional?.languages) },
      { title: "Technical Tools", items: toList(additional?.tools) },
      { title: "Licenses", items: toList(additional?.licenses) },
      { title: "Strengths", items: toList(additional?.strengths) },
    ].filter((sec) => sec.items.length > 0);

    const renderSection = (title, children) => (
      <section className={styles.atsSection}>
        <h2>{title}</h2>
        {children}
      </section>
    );

    return (
      <div className={styles.atsPage}>
        <div className={styles.atsSheet}>
          <button className={styles.downloadBtn} onClick={downloadPDF}>
            Download PDF
          </button>
          <div className={styles.atsBox} id="portfolioBox">
            <header className={styles.atsHeader}>
              <h1>{personal.name || "Your Name"}</h1>
              <p className={styles.atsContact}>
                {[personal.contact, personal.email, personal.gender, personal.age ? `Age: ${personal.age}` : "", personal.field]
                  .filter(Boolean)
                  .join("   |   ")}
              </p>
            </header>

            {renderSection("Professional Objective", <p className={styles.atsObjective}>{objective}</p>)}

            {renderSection("Core Skills", (
              <ul className={styles.atsSkills}>
                {skills.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            ))}

            {renderSection("Professional Experience", (
              experience.length === 0 ? (
                <p className={styles.atsMuted}>No professional experience provided.</p>
              ) : (
                experience.map((exp, i) => {
                  const bullets = toList(exp.achievements);
                  return (
                    <div key={i} className={styles.atsExp}>
                      <div className={styles.atsExpHeader}>
                        <span className={styles.atsExpCompany}>{exp.company}</span>
                        <span className={styles.atsExpRole}>{exp.role}</span>
                        <span className={styles.atsExpDur}>{exp.duration}</span>
                      </div>
                      {bullets.length > 0 && (
                        <ul className={styles.atsExpList}>
                          {bullets.map((b, j) => <li key={j}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  );
                })
              )
            ))}

            {renderSection("Education", (
              education.map((edu, i) => (
                <div key={i} className={styles.atsEdu}>
                  <span className={styles.atsEduDegree}>{edu.level}</span>
                  <span className={styles.atsEduInst}>{edu.institute}</span>
                  <span className={styles.atsEduYear}>{edu.year}</span>
                  {edu.marks && <span className={styles.atsEduMarks}>{edu.marks}</span>}
                </div>
              ))
            ))}

            {additionalSections.length > 0 && renderSection("Additional Information", (
              <ul className={styles.atsAddList}>
                {additionalSections.map((sec, i) => (
                  <li key={i}>
                    <span className={styles.atsAddTitle}>{sec.title}:</span> {sec.items.join(", ")}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Standard Portfolio Template (with dynamic colors) ──
  const s = {
    primary: c.primary,
    secondary: c.secondary,
    bg: c.background,
    text: c.textColor,
    lightBg: c.background + "15",
  };

  return (
    <div className={styles.portfolioPage} style={{ background: `linear-gradient(to bottom, ${s.bg}, ${s.secondary}, ${s.bg})` }}>
      <div style={{ width: "794px", margin: "0 auto" }}>
        <div className={styles.portfolioBox} id="portfolioBox" style={{ background: "#fff" }}>
        <div className={styles.portfolioHeader}>
          <h1 className={styles.portfolioTitle} style={{ color: s.primary }}>Portfolio</h1>
          <button id="downloadBtn" className={styles.downloadBtn} onClick={downloadPDF}
            style={{ background: s.secondary }}>
            Download PDF
          </button>
        </div>

        <div className={styles.profileRow}>
          {personal.picture && (
            <div className={styles.profileImg}>
              <img src={personal.picture} alt="Profile" style={{ border: `3px solid ${s.primary}` }} />
            </div>
          )}
          <div className={styles.profileInfo}>
            <h2 style={{ color: s.primary }}>{personal.name}</h2>
            <p>Email: {personal.email}</p>
            {personal.contact && <p>Contact: {personal.contact}</p>}
            <p>Age: {personal.age}</p>
            <p>Gender: {personal.gender}</p>
            {personal.field && <p>Field: {personal.field}</p>}
          </div>
        </div>

        {personal.objective && (
          <div className={styles.section}>
            <h3 style={{ color: s.primary, borderBottom: `2px solid ${s.secondary}` }}>Objective</h3>
            <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#333" }}>{personal.objective}</p>
          </div>
        )}

        <div className={styles.section}>
          <h3 style={{ color: s.primary, borderBottom: `2px solid ${s.secondary}` }}>Education</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr>
                <th style={{ background: s.primary }}>Level</th>
                <th style={{ background: s.primary }}>Institute</th>
                <th style={{ background: s.primary }}>Year</th>
                <th style={{ background: s.primary }}>Marks/GPA</th>
              </tr></thead>
              <tbody>
                {education.map((item, i) => (
                  <tr key={i}>
                    <td>{item.level}</td>
                    <td>{item.institute}</td>
                    <td>{item.year}</td>
                    <td>{item.marks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.section}>
          <h3 style={{ color: s.primary, borderBottom: `2px solid ${s.secondary}` }}>Skills</h3>
          <ul className={styles.skillsList}>
            {skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        {experience.length > 0 && (
          <div className={styles.section}>
            <h3 style={{ color: s.primary, borderBottom: `2px solid ${s.secondary}` }}>Experience</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr>
                  <th style={{ background: s.primary }}>Company</th>
                  <th style={{ background: s.primary }}>Role</th>
                  <th style={{ background: s.primary }}>Duration</th>
                </tr></thead>
                <tbody>
                  {experience.map((item, i) => (
                    <tr key={i}>
                      <td>{item.company}</td>
                      <td>{item.role}</td>
                      <td>{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "1.5rem", color: s.secondary, fontSize: "0.85rem" }}>
          Generated by Portfolio Maker
        </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
