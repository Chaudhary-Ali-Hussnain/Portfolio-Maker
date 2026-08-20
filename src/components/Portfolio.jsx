import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../Portfolio.module.css";
import jsPDF from "jspdf";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

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

  const { personal, education, skills, experience, additional, colors, portfolioType, projects = [], languages = [], professionalLinks = [], additionalInfo = [] } = data;
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
      `Highly motivated and detail oriented ${role}${expText} seeking a challenging position where I can apply my expertise and add measurable value to the organization. ` +
      `Known for strong problem solving, clear communication, and a commitment to continuous learning${skillText}. ` +
      `Aim to collaborate across teams, deliver consistently high quality work, and grow into a trusted ${role} within a dynamic and focused environment.`
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
    // to capture A4 proportions regardless of the current viewport. If the
    // content is taller than one A4 page it is sliced into full A4 pages, so
    // nothing is ever shrunk, clipped, or cut off.
    const html2canvas = (await import("html2canvas")).default;
    const el = document.getElementById("portfolioBox");
    const scale = 2;
    const canvas = await html2canvas(el, {
      scale,
      backgroundColor: "#ffffff",
      onclone: (doc) => {
        const box = doc.getElementById("portfolioBox");
        if (box) {
          box.style.width = "794px";
          box.style.maxWidth = "794px";
          box.style.margin = "0";
          box.style.boxShadow = "none";
        }
      },
    });
    const pdf = new jsPDF("p", "pt", "a4");
    const pw = pdf.getPageWidth();  // 595.28pt
    const pageHpx = 1123 * scale;   // A4 height in captured pixels
    const totalH = canvas.height;
    let y = 0;
    let first = true;
    while (y < totalH) {
      if (!first) pdf.addPage();
      first = false;
      const sliceH = Math.min(pageHpx, totalH - y);
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = sliceH;
      const ctx = slice.getContext("2d");
      ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      const img = slice.toDataURL("image/png");
      const hPt = (sliceH / canvas.width) * pw;
      pdf.addImage(img, "PNG", 0, 0, pw, hPt);
      y += pageHpx;
    }
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
  // Sidebar contact: only real contact fields, never labels/placeholders.
  const contactItems = [];
  if (String(personal.email || "").trim()) contactItems.push({ icon: <MailIcon />, text: personal.email });
  if (String(personal.contact || "").trim()) contactItems.push({ icon: <PhoneIcon />, text: personal.contact });
  const cleanProjects = (Array.isArray(projects) ? projects : []).filter((pr) => pr && String(pr.title || "").trim());
  const cleanLanguages = (Array.isArray(languages) ? languages : []).map((l) => String(l || "").trim()).filter(Boolean);
  const cleanLinks = (Array.isArray(professionalLinks) ? professionalLinks : []).filter((l) => l && String(l.url || "").trim());
  const cleanAddInfo = (Array.isArray(additionalInfo) ? additionalInfo : []).filter((a) => a && String(a.title || "").trim());

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
        <div className={styles.sidebarLayout}>
          <aside className={styles.sidebar} style={{ background: `linear-gradient(180deg, ${s.primary}, ${s.secondary})` }}>
            <div className={styles.sidebarInner}>
              <div className={styles.sidebarProfile}>
                {personal.picture && (
                  <img className={styles.sidebarPhoto} src={personal.picture} alt="Profile" />
                )}
                {personal.name && <h1 className={styles.sidebarName}>{personal.name}</h1>}
                {personal.field && <p className={styles.sidebarRole}>{personal.field}</p>}
              </div>

              {contactItems.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h3 className={styles.sidebarHeading}>Contact</h3>
                  <ul className={styles.sidebarContactList}>
                    {contactItems.map((item, i) => (
                      <li key={i} className={styles.sidebarContactItem}>
                        <span className={styles.sidebarContactIcon} aria-hidden="true">{item.icon}</span>
                        <span className={styles.sidebarContactText}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {skills.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h3 className={styles.sidebarHeading}>Skills</h3>
                  <ul className={styles.sidebarSkillChips}>
                    {skills.map((skill, i) => <li key={i}>{skill}</li>)}
                  </ul>
                </div>
              )}

              {cleanLanguages.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h3 className={styles.sidebarHeading}>Languages</h3>
                  <p className={styles.sidebarLangText}>{cleanLanguages.join(", ")}</p>
                </div>
              )}

              {cleanLinks.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h3 className={styles.sidebarHeading}>Professional Links</h3>
                  <ul className={styles.sidebarList}>
                    {cleanLinks.map((lnk, i) => {
                      const label = String(lnk.type || "").trim();
                      const cleanLabel = label && label !== "Other Professional Link" ? label : "";
                      return (
                        <li key={i} className={styles.sidebarLinkItem}>
                          {cleanLabel && <span className={styles.sidebarLinkLabel}>{cleanLabel}</span>}
                          <span className={styles.sidebarLinkUrl}>{lnk.url}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {cleanAddInfo.length > 0 && (
                <div className={styles.sidebarBlock}>
                  <h3 className={styles.sidebarHeading}>Additional Information</h3>
                  <ul className={styles.sidebarList}>
                    {cleanAddInfo.map((a, i) => (
                      <li key={i}>
                        <span className={styles.sidebarAddTitle}>{a.title}</span>
                        {a.details && <span className={styles.sidebarAddDetails}>{a.details}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          <main className={styles.sidebarMain}>
            {personal.objective && stdSection("Professional Summary", (
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

            {cleanProjects.length > 0 && stdSection("Projects", (
              cleanProjects.map((pr, i) => (
                <div key={i} className={styles.stdProject}>
                  <div className={styles.stdProjectTitle}>{pr.title}</div>
                  {pr.description && <p className={styles.stdProjectText}>{pr.description}</p>}
                </div>
              ))
            ))}

            <div className={styles.stdFooter}>Generated by QuickCv</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
