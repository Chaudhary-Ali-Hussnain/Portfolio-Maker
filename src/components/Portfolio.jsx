import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../Portfolio.module.css";
import jsPDF from "jspdf";

const A4_W = 595.28; // pt
const A4_H = 841.89; // pt
const MARGIN = 40;   // pt

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

  const additionalSections = [
    { title: "Certifications", items: toList(additional?.certifications) },
    { title: "Languages", items: toList(additional?.languages) },
    { title: "Technical Tools", items: toList(additional?.tools) },
    { title: "Licenses", items: toList(additional?.licenses) },
    { title: "Strengths", items: toList(additional?.strengths) },
  ].filter((sec) => sec.items.length > 0);

  const downloadPDF = async () => {
    if (portfolioType === "ats") {
      generateAtsPdf();
      return;
    }

    // Standard portfolio: rasterize via html2canvas (loaded on demand).
    // The sheet is fluid on screen, so force a fixed 794px width in the clone
    // to capture an A4-shaped image regardless of the current viewport.
    const html2canvas = (await import("html2canvas")).default;
    const el = document.getElementById("portfolioBox");
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
      onclone: (doc) => {
        const box = doc.getElementById("portfolioBox");
        if (box) {
          box.style.width = "794px";
          box.style.maxWidth = "794px";
        }
      },
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pw = pdf.getPageWidth();
    const ph = (imgProps.height * pw) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pw, ph);
    pdf.save("portfolio.pdf");
  };

  // ── Text-based ATS PDF export ──
  // Unlike the standard template, the ATS resume is written into the PDF as
  // real, selectable text (no rasterization) so ATS parsers can read it.
  const generateAtsPdf = () => {
    const objective = (personal.objective || "").trim() || buildObjective(personal, skills, experience);
    const doc = new jsPDF("p", "pt", "a4");
    const contentW = A4_W - MARGIN * 2;
    let y = MARGIN;

    const ensure = (needed) => {
      if (y + needed > A4_H - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }
    };

    const sectionTitle = (title) => {
      ensure(26);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text(title.toUpperCase(), MARGIN, y);
      y += 6;
      doc.setDrawColor(20, 20, 20);
      doc.setLineWidth(0.8);
      doc.line(MARGIN, y, A4_W - MARGIN, y);
      y += 16;
    };

    const bodyText = (text, { size = 10.5, bold = false, color = [50, 50, 50], x = MARGIN, width = contentW, indent = 0, after = 4, align = "left" } = {}) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, width);
      for (const ln of lines) {
        ensure(size + 4);
        doc.text(ln, x + indent, y, { align });
        y += size + 3;
      }
      y += after;
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(20, 20, 20);
    doc.text((personal.name || "Your Name").toUpperCase(), A4_W / 2, y, { align: "center" });
    y += 16;
    const contactParts = [personal.contact, personal.email, personal.gender, personal.age ? `Age: ${personal.age}` : "", personal.field]
      .filter(Boolean);
    if (contactParts.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(contactParts.join("   |   "), contentW);
      for (const ln of lines) {
        doc.text(ln, A4_W / 2, y, { align: "center" });
        y += 12;
      }
    }
    y += 10;

    // Professional Objective
    sectionTitle("Professional Objective");
    bodyText(objective, { after: 8 });

    // Core Skills — balanced two columns
    sectionTitle("Core Skills");
    if (skills.length) {
      const colW = (contentW - 16) / 2;
      const colX = [MARGIN, MARGIN + contentW / 2];
      const colY = [y, y];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(50, 50, 50);
      skills.forEach((skill) => {
        const lines = doc.splitTextToSize("• " + skill, colW);
        const col = colY[0] <= colY[1] ? 0 : 1;
        for (const ln of lines) {
          if (colY[col] > A4_H - MARGIN) {
            doc.addPage();
            colY[0] = MARGIN;
            colY[1] = MARGIN;
          }
          doc.text(ln, colX[col], colY[col]);
          colY[col] += 13;
        }
      });
      y = Math.max(colY[0], colY[1]) + 8;
    } else {
      bodyText("No skills provided.", { size: 10, after: 8 });
    }

    // Professional Experience
    sectionTitle("Professional Experience");
    if (experience.length === 0) {
      bodyText("No professional experience provided.", { size: 10, after: 8 });
    } else {
      experience.forEach((exp) => {
        ensure(24);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(20, 20, 20);
        doc.text(exp.company || "", MARGIN, y);
        if (exp.duration) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(90, 90, 90);
          doc.text(exp.duration, A4_W - MARGIN, y, { align: "right" });
        }
        y += 14;
        if (exp.role) {
          doc.setFont("helvetica", "bolditalic");
          doc.setFontSize(10.5);
          doc.setTextColor(60, 60, 60);
          const roleLines = doc.splitTextToSize(exp.role, contentW);
          for (const ln of roleLines) {
            ensure(13);
            doc.text(ln, MARGIN, y);
            y += 12;
          }
        }
        const bullets = toList(exp.achievements);
        bullets.forEach((b) => {
          bodyText("• " + b, { size: 10.5, indent: 4, after: 1 });
        });
        y += 5;
      });
    }

    // Education
    sectionTitle("Education");
    education.forEach((edu) => {
      ensure(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(20, 20, 20);
      doc.text(edu.level || "", MARGIN, y);
      if (edu.year) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);
        doc.text(edu.year, A4_W - MARGIN, y, { align: "right" });
      }
      y += 13;
      const sub = [edu.institute, edu.marks].filter(Boolean).join(" · ");
      if (sub) bodyText(sub, { size: 10, color: [60, 60, 60], after: 3 });
      else y += 3;
    });

    // Additional Information
    if (additionalSections.length) {
      sectionTitle("Additional Information");
      additionalSections.forEach((sec) => {
        bodyText(`${sec.title}: ${sec.items.join(", ")}`, { size: 10.5, indent: 4, after: 3 });
      });
    }

    doc.save("ATS_Resume.pdf");
  };

  const renderSection = (title, children) => (
    <section className={styles.atsSection}>
      <h2>{title}</h2>
      {children}
    </section>
  );

  const stdSection = (title, children) => (
    <section className={styles.stdSection}>
      <h3 className={styles.stdSectionTitle}>{title}</h3>
      {children}
    </section>
  );

  // ── Professional ATS Resume Template ──
  if (portfolioType === "ats") {
    const objective = (personal.objective || "").trim() || buildObjective(personal, skills, experience);

    return (
      <div className={styles.atsPage}>
        <div className={styles.toolbar}>
          <button className={styles.downloadBtn} onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
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
                      <span className={styles.atsExpDur}>{exp.duration}</span>
                    </div>
                    {exp.role && <div className={styles.atsExpRole}>{exp.role}</div>}
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
                <div className={styles.atsEduRow}>
                  <span className={styles.atsEduDegree}>{edu.level}</span>
                  <span className={styles.atsEduYear}>{edu.year}</span>
                </div>
                <div className={styles.atsEduSub}>
                  {edu.institute}{edu.marks ? ` · ${edu.marks}` : ""}
                </div>
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
  const contactParts = [personal.email, personal.contact, personal.gender, personal.age ? `Age: ${personal.age}` : "", personal.field]
    .filter(Boolean);

  return (
    <div className={styles.portfolioPage} style={{ background: `linear-gradient(to bottom, ${s.bg}, ${s.secondary}, ${s.bg})` }}>
      <div className={styles.toolbar}>
        <button id="downloadBtn" className={styles.downloadBtn} onClick={downloadPDF} style={{ background: s.secondary }}>
          Download PDF
        </button>
      </div>
      <div
        className={styles.portfolioBox}
        id="portfolioBox"
        style={{ background: "#fff", "--primary": s.primary, "--secondary": s.secondary }}
      >
        <header className={styles.stdHeader}>
          {personal.picture && (
            <img className={styles.stdPhoto} src={personal.picture} alt="Profile" />
          )}
          <h1>{personal.name || "Your Name"}</h1>
          {contactParts.length > 0 && <p className={styles.stdContact}>{contactParts.join("  ·  ")}</p>}
        </header>

        {personal.objective && stdSection("Professional Objective", (
          <p className={styles.stdObjective}>{personal.objective}</p>
        ))}

        {stdSection("Education", (
          education.map((item, i) => (
            <div key={i} className={styles.atsEdu}>
              <div className={styles.atsEduRow}>
                <span className={styles.atsEduDegree}>{item.level}</span>
                <span className={styles.atsEduYear}>{item.year}</span>
              </div>
              <div className={styles.atsEduSub}>
                {item.institute}{item.marks ? ` · ${item.marks}` : ""}
              </div>
            </div>
          ))
        ))}

        {stdSection("Skills", (
          <ul className={styles.stdSkills}>
            {skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        ))}

        {experience.length > 0 && stdSection("Experience", (
          experience.map((item, i) => {
            const bullets = toList(item.achievements);
            return (
              <div key={i} className={styles.atsExp}>
                <div className={styles.atsExpHeader}>
                  <span className={styles.atsExpCompany}>{item.company}</span>
                  <span className={styles.atsExpDur}>{item.duration}</span>
                </div>
                {item.role && <div className={styles.atsExpRole}>{item.role}</div>}
                {bullets.length > 0 && (
                  <ul className={styles.atsExpList}>
                    {bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            );
          })
        ))}

        <div className={styles.stdFooter}>Generated by Portfolio Maker</div>
      </div>
    </div>
  );
};

export default Portfolio;
