import React, { useState } from "react";
import styles from "../Registeration.module.css";
import { useNavigate } from "react-router-dom";
import { usePortfolioForm, LINK_TYPES } from "../PortfolioFormContext";

const FIELD_OPTIONS = [
  "Web Development", "Artificial Intelligence", "Cloud Computing", "Cybersecurity",
  "Data Science", "Mobile App Development", "Software Engineering", "UI/UX Design",
  "Graphic Design", "Digital Marketing", "Content Creation", "Project Management",
  "Business Administration", "Finance", "Accounting", "Healthcare", "Education",
  "Engineering", "Architecture", "Law", "Media & Communication", "Psychology",
  "Social Work", "Research", "Consulting", "Entrepreneurship", "Other",
];

const Registration = () => {
  const navigate = useNavigate();
  const { drafts, activeType, setActiveType, updateDraft, resetDraft } = usePortfolioForm();
  const portfolioType = activeType;
  const [error, setError] = useState("");

  const draft = drafts[portfolioType];

  const patch = (updater) => updateDraft(portfolioType, updater);
  const setPersonal = (p) => patch((d) => ({ ...d, personal: typeof p === "function" ? p(d.personal) : p }));
  const setEdu = (arr) => patch((d) => ({ ...d, education: arr }));
  const setSkills = (arr) => patch((d) => ({ ...d, skills: arr }));
  const setExp = (arr) => patch((d) => ({ ...d, experience: arr }));
  const setAdditional = (a) => patch((d) => ({ ...d, additional: a }));
  const setColors = (c) => patch((d) => ({ ...d, colors: c }));
  const setHasExperience = (v) => patch((d) => ({ ...d, hasExperience: v }));

  const addEducation = () => setEdu([...draft.education, { level: "", institute: "", year: "", marks: "" }]);
  const addSkill = () => setSkills([...draft.skills, ""]);
  const addExperience = () => setExp([...draft.experience, { company: "", role: "", duration: "", achievements: "" }]);

  // Optional: Projects
  const addProject = () => patch((d) => ({ ...d, projects: [...d.projects, { title: "", description: "" }] }));
  const setProject = (i, updater) => patch((d) => {
    const list = [...d.projects];
    list[i] = typeof updater === "function" ? updater(list[i]) : updater;
    return { ...d, projects: list };
  });
  const removeProject = (i) => patch((d) => ({ ...d, projects: d.projects.filter((_, j) => j !== i) }));

  // Optional: Languages
  const addLanguage = () => patch((d) => ({ ...d, languages: [...d.languages, ""] }));
  const setLanguage = (i, v) => patch((d) => {
    const list = [...d.languages];
    list[i] = v;
    return { ...d, languages: list };
  });
  const removeLanguage = (i) => patch((d) => ({ ...d, languages: d.languages.filter((_, j) => j !== i) }));

  // Optional: Professional Links
  const addLink = () => patch((d) => ({ ...d, professionalLinks: [...d.professionalLinks, { type: LINK_TYPES[0].label, url: "" }] }));
  const setLink = (i, updater) => patch((d) => {
    const list = [...d.professionalLinks];
    list[i] = typeof updater === "function" ? updater(list[i]) : updater;
    return { ...d, professionalLinks: list };
  });
  const removeLink = (i) => patch((d) => ({ ...d, professionalLinks: d.professionalLinks.filter((_, j) => j !== i) }));

  // Optional: Additional Information
  const addAddInfo = () => patch((d) => ({ ...d, additionalInfo: [...d.additionalInfo, { title: "", details: "" }] }));
  const setAddInfo = (i, updater) => patch((d) => {
    const list = [...d.additionalInfo];
    list[i] = typeof updater === "function" ? updater(list[i]) : updater;
    return { ...d, additionalInfo: list };
  });
  const removeAddInfo = (i) => patch((d) => ({ ...d, additionalInfo: d.additionalInfo.filter((_, j) => j !== i) }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPersonal((p) => ({ ...p, picture: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (e) => setPersonal((p) => ({ ...p, field: e.target.value }));

  const setType = (t) => {
    setActiveType(t);
    setError("");
  };

  const requiredMissing = (d) => {
    const p = d.personal;
    const missing = [];
    if (!String(p.name || "").trim()) missing.push("Full Name");
    if (!String(p.age || "").trim()) missing.push("Age");
    if (!String(p.field || "").trim()) missing.push("Professional Title");
    if (!String(p.email || "").trim() && !String(p.contact || "").trim()) missing.push("a contact method (Email or Phone)");
    if (!String(p.objective || "").trim()) missing.push("Professional Summary");
    const eduOk = d.education.some((x) => String(x.level || "").trim() && String(x.institute || "").trim() && String(x.year || "").trim());
    if (!eduOk) missing.push("at least one complete Education entry");
    const skillOk = d.skills.some((x) => String(x || "").trim());
    if (!skillOk) missing.push("at least one Skill");
    return missing;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const d = drafts[portfolioType];
    const p = d.personal;

    // ATS keeps its existing validation behaviour.
    if (portfolioType === "ats") {
      if (!String(p.name || "").trim()) { setError("Name is required."); return; }
      if (!String(p.age || "").trim()) { setError("Age is required."); return; }
      if (!String(p.email || "").trim()) { setError("Email is required."); return; }
      if (!String(p.contact || "").trim()) { setError("Contact number is required."); return; }
      if (!String(p.gender || "").trim()) { setError("Please select your gender."); return; }
      for (let i = 0; i < d.education.length; i++) {
        if (!String(d.education[i].level || "").trim()) { setError(`Education row ${i + 1}: Level is required.`); return; }
        if (!String(d.education[i].institute || "").trim()) { setError(`Education row ${i + 1}: Institute is required.`); return; }
        if (!String(d.education[i].year || "").trim()) { setError(`Education row ${i + 1}: Year is required.`); return; }
      }
      for (let i = 0; i < d.skills.length; i++) {
        if (!String(d.skills[i] || "").trim()) { setError(`Skill row ${i + 1}: Please enter a skill or remove it.`); return; }
      }
      if (d.hasExperience === "yes") {
        for (let i = 0; i < d.experience.length; i++) {
          if (!String(d.experience[i].company || "").trim()) { setError(`Experience row ${i + 1}: Company is required.`); return; }
          if (!String(d.experience[i].role || "").trim()) { setError(`Experience row ${i + 1}: Role is required.`); return; }
          if (!String(d.experience[i].duration || "").trim()) { setError(`Experience row ${i + 1}: Duration is required.`); return; }
        }
      }
    } else {
      const missing = requiredMissing(d);
      if (missing.length) {
        setError("A few required details are missing: " + missing.join(", ") + ".");
        return;
      }
    }

    const data = {
      personal: p,
      education: d.education
        .filter((x) => String(x.level || "").trim())
        .map((x) => ({
          level: String(x.level || "").trim(),
          institute: String(x.institute || "").trim(),
          year: String(x.year || "").trim(),
          marks: String(x.marks || "").trim(),
        })),
      skills: d.skills.map((s) => String(s || "").trim()).filter(Boolean),
      experience: d.hasExperience === "yes"
        ? d.experience
            .filter((x) => String(x.company || "").trim())
            .map((x) => ({
              company: String(x.company || "").trim(),
              role: String(x.role || "").trim(),
              duration: String(x.duration || "").trim(),
              achievements: String(x.achievements || "").trim(),
            }))
        : [],
      additional: d.additional,
      professionalLinks: d.professionalLinks
        .filter((l) => String(l.url || "").trim())
        .map((l) => ({ type: l.type, url: String(l.url || "").trim() })),
      projects: d.projects
        .filter((pr) => String(pr.title || "").trim())
        .map((pr) => ({ title: String(pr.title || "").trim(), description: String(pr.description || "").trim() })),
      languages: d.languages.map((s) => String(s || "").trim()).filter(Boolean),
      additionalInfo: d.additionalInfo
        .filter((a) => String(a.title || "").trim())
        .map((a) => ({ title: String(a.title || "").trim(), details: String(a.details || "").trim() })),
      colors: d.colors,
      portfolioType,
    };
    navigate("/portfolio", { state: data });
  };

  const handleClear = () => {
    resetDraft(portfolioType);
    setError("");
  };

  return (
    <div>
      <header className={styles.mainHeaders}>
        <h1 className={styles.headerTitle}>Registration Form</h1>
        <h2 className={styles.headerSubtitle}>Build Your Complete QuickCv</h2>
        <img src="/head.jpg" alt="" className={styles.headersImg} />
      </header>
      <div className={styles.formContainer}>
        <hr className={styles.divider} />
        {error && <p className={styles.errorMsg}>&#9888; {error}</p>}
        <form className={styles.registrationForm} onSubmit={handleSubmit}>
          <fieldset className={styles.formSection}>
            <legend>QuickCv Type</legend>
            <label className={styles.formLabel}>Choose style:</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="ptStd" name="pt" value="standard" checked={portfolioType === "standard"} onChange={() => setType("standard")} />
              <label htmlFor="ptStd">Standard QuickCv</label>
              <input type="radio" id="ptAts" name="pt" value="ats" checked={portfolioType === "ats"} onChange={() => setType("ats")} />
              <label htmlFor="ptAts">ATS Friendly Resume</label>
            </div>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Personal Information</legend>
            <label className={styles.formLabel} htmlFor="pName">Full Name *</label>
            <input type="text" id="pName" className={styles.formInput} placeholder="e.g. John Doe" value={draft.personal.name} onChange={(e) => setPersonal({ ...draft.personal, name: e.target.value })} />
            <label className={styles.formLabel} htmlFor="pAge">Age *</label>
            <input type="number" id="pAge" className={styles.formInput} placeholder="e.g. 25" value={draft.personal.age} onChange={(e) => setPersonal({ ...draft.personal, age: e.target.value })} />
            <label className={styles.formLabel} htmlFor="pEmail">Email</label>
            <input type="email" id="pEmail" className={styles.formInput} placeholder="e.g. john@example.com" value={draft.personal.email} onChange={(e) => setPersonal({ ...draft.personal, email: e.target.value })} />
            <label className={styles.formLabel} htmlFor="pContact">Contact Number</label>
            <input type="text" id="pContact" className={styles.formInput} placeholder="e.g. 0300-1234567" value={draft.personal.contact} onChange={(e) => setPersonal({ ...draft.personal, contact: e.target.value })} />
            <label className={styles.formLabel}>Gender</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="male" name="gender" value="male" checked={draft.personal.gender === "male"} onChange={(e) => setPersonal({ ...draft.personal, gender: e.target.value })} />
              <label htmlFor="male">Male</label>
              <input type="radio" id="female" name="gender" value="female" checked={draft.personal.gender === "female"} onChange={(e) => setPersonal({ ...draft.personal, gender: e.target.value })} />
              <label htmlFor="female">Female</label>
            </div>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Professional Title</legend>
            <label className={styles.formLabel} htmlFor="pField">Your professional title *</label>
            <input type="text" id="pField" className={styles.formInput} list="fieldList" placeholder="e.g. Software Engineer" value={draft.personal.field} onChange={handleFieldChange} />
            <datalist id="fieldList">
              {FIELD_OPTIONS.map((f, i) => <option key={i} value={f} />)}
            </datalist>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Professional Summary</legend>
            <label className={styles.formLabel} htmlFor="pObjective">Write a strong professional summary (80 to 120 words recommended):</label>
            <textarea className={styles.formTextarea} id="pObjective" rows="5" placeholder="e.g. Highly motivated software engineer with 3 years of experience delivering scalable web applications..." value={draft.personal.objective} onChange={(e) => setPersonal({ ...draft.personal, objective: e.target.value })} />
            <p className={styles.formHint}>
              {String(draft.personal.objective || "").trim() ? `${String(draft.personal.objective).trim().split(/\s+/).length} words` : "0 words"}. Aim for a clear summary of your career.
            </p>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Experience</legend>
            <label className={styles.formLabel}>Do you have work experience?</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="expYes" name="he" value="yes" checked={draft.hasExperience === "yes"} onChange={() => setHasExperience("yes")} />
              <label htmlFor="expYes">Yes</label>
              <input type="radio" id="expNo" name="he" value="no" checked={draft.hasExperience === "no"} onChange={() => setHasExperience("no")} />
              <label htmlFor="expNo">No</label>
            </div>
            {draft.hasExperience === "yes" && (
              <>
                {draft.experience.map((exp, i) => (
                  <div key={i} style={{ marginTop: "0.5rem" }}>
                    <div className={styles.multiRow}>
                      <input type="text" placeholder="Company *" aria-label={`Experience ${i + 1} company`} className={styles.formInput} value={exp.company} onChange={(e) => { const l = [...draft.experience]; l[i].company = e.target.value; setExp(l); }} />
                      <input type="text" placeholder="Role *" aria-label={`Experience ${i + 1} role`} className={styles.formInput} value={exp.role} onChange={(e) => { const l = [...draft.experience]; l[i].role = e.target.value; setExp(l); }} />
                      <input type="text" placeholder="Duration *" aria-label={`Experience ${i + 1} duration`} className={styles.formInput} value={exp.duration} onChange={(e) => { const l = [...draft.experience]; l[i].duration = e.target.value; setExp(l); }} />
                    </div>
                    <textarea
                      className={styles.formTextarea}
                      rows="3"
                      aria-label={`Experience ${i + 1} achievements`}
                      placeholder={"Key achievements & responsibilities (one per line, 4 to 6 lines) e.g.\nDeveloped a customer portal that reduced response time by 30%"}
                      value={exp.achievements}
                      onChange={(e) => { const l = [...draft.experience]; l[i].achievements = e.target.value; setExp(l); }}
                    />
                  </div>
                ))}
                <button type="button" className={styles.addBtn} onClick={addExperience}>+ Add Another Experience</button>
              </>
            )}
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Education</legend>
            {draft.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.multiRow}>
                  <input type="text" placeholder="Level * (e.g. Bachelor's)" aria-label={`Education ${i + 1} level`} className={styles.formInput} value={edu.level} onChange={(e) => { const l = [...draft.education]; l[i].level = e.target.value; setEdu(l); }} />
                  <input type="text" placeholder="Institute *" aria-label={`Education ${i + 1} institute`} className={styles.formInput} value={edu.institute} onChange={(e) => { const l = [...draft.education]; l[i].institute = e.target.value; setEdu(l); }} />
                  <input type="text" placeholder="Year *" aria-label={`Education ${i + 1} year`} className={styles.formInput} value={edu.year} onChange={(e) => { const l = [...draft.education]; l[i].year = e.target.value; setEdu(l); }} />
                  <input type="text" placeholder="Marks/GPA (optional)" aria-label={`Education ${i + 1} marks or GPA`} className={styles.formInput} value={edu.marks} onChange={(e) => { const l = [...draft.education]; l[i].marks = e.target.value; setEdu(l); }} />
                </div>
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addEducation}>+ Add Another Education</button>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Skills</legend>
            {draft.skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: "0.4rem" }}>
                <input type="text" placeholder="Skill *" aria-label={`Skill ${i + 1}`} className={styles.formInput} value={skill} onChange={(e) => { const l = [...draft.skills]; l[i] = e.target.value; setSkills(l); }} />
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addSkill}>+ Add Another Skill</button>
          </fieldset>

          {portfolioType === "standard" && (
            <>
              <fieldset className={styles.formSection}>
                <legend>Projects</legend>
                <label className={styles.formLabel}>Projects (optional)</label>
                {draft.projects.map((pr, i) => (
                  <div key={i} style={{ marginBottom: "0.9rem" }}>
                    <div className={styles.multiRow}>
                      <input type="text" placeholder="Project title" className={styles.formInput} value={pr.title} onChange={(e) => setProject(i, (x) => ({ ...x, title: e.target.value }))} />
                    </div>
                    <textarea className={styles.formTextarea} rows="2" placeholder="What did you do? One short paragraph" value={pr.description} onChange={(e) => setProject(i, (x) => ({ ...x, description: e.target.value }))} />
                    <button type="button" className={styles.removeBtn} onClick={() => removeProject(i)}>Remove</button>
                  </div>
                ))}
                <button type="button" className={styles.addBtn} onClick={addProject}>+ Add Project</button>
              </fieldset>

              <fieldset className={styles.formSection}>
                <legend>Languages</legend>
                <label className={styles.formLabel}>Languages (optional)</label>
                {draft.languages.map((lang, i) => (
                  <div key={i} style={{ marginBottom: "0.5rem" }}>
                    <div className={styles.multiRow}>
                      <input type="text" placeholder="e.g. English" className={styles.formInput} value={lang} onChange={(e) => setLanguage(i, e.target.value)} />
                      <button type="button" className={styles.removeBtn} onClick={() => removeLanguage(i)}>Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" className={styles.addBtn} onClick={addLanguage}>+ Add Language</button>
              </fieldset>

              <fieldset className={styles.formSection}>
                <legend>Professional Links</legend>
                <label className={styles.formLabel}>Add links relevant to your profession (optional)</label>
                {draft.professionalLinks.map((lnk, i) => (
                  <div key={i} style={{ marginBottom: "0.6rem" }}>
                    <div className={styles.multiRow}>
                      <select className={styles.formInput} value={lnk.type} onChange={(e) => setLink(i, (l) => ({ ...l, type: e.target.value }))}>
                        {LINK_TYPES.map((t) => <option key={t.id} value={t.label}>{t.label}</option>)}
                      </select>
                      <input type="text" placeholder="https://..." className={styles.formInput} value={lnk.url} onChange={(e) => setLink(i, (l) => ({ ...l, url: e.target.value }))} />
                      <button type="button" className={styles.removeBtn} onClick={() => removeLink(i)}>Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" className={styles.addBtn} onClick={addLink}>+ Add Professional Link</button>
              </fieldset>

              <fieldset className={styles.formSection}>
                <legend>Additional Information</legend>
                <label className={styles.formLabel}>Anything that adds to your profile (optional). Examples: professional memberships, volunteer work, awards, publications, interests.</label>
                {draft.additionalInfo.map((info, i) => (
                  <div key={i} style={{ marginBottom: "0.9rem" }}>
                    <div className={styles.multiRow}>
                      <input type="text" placeholder="Heading e.g. Professional Memberships" className={styles.formInput} value={info.title} onChange={(e) => setAddInfo(i, (a) => ({ ...a, title: e.target.value }))} />
                    </div>
                    <textarea className={styles.formTextarea} rows="2" placeholder="Details ..." value={info.details} onChange={(e) => setAddInfo(i, (a) => ({ ...a, details: e.target.value }))} />
                    <button type="button" className={styles.removeBtn} onClick={() => removeAddInfo(i)}>Remove</button>
                  </div>
                ))}
                <button type="button" className={styles.addBtn} onClick={addAddInfo}>+ Add Additional Information</button>
              </fieldset>
            </>
          )}

          {portfolioType === "ats" && (
            <fieldset className={styles.formSection}>
              <legend>Additional Information</legend>
              <p className={styles.formHint}>Separate multiple entries with commas. These appear as bullet points on your ATS resume.</p>
              <label className={styles.formLabel} htmlFor="addCerts">Certifications</label>
              <input type="text" id="addCerts" className={styles.formInput} placeholder="e.g. AWS Certified Solutions Architect, PMP" value={draft.additional.certifications} onChange={(e) => setAdditional({ ...draft.additional, certifications: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addLangs">Languages</label>
              <input type="text" id="addLangs" className={styles.formInput} placeholder="e.g. English, Urdu, Arabic" value={draft.additional.languages} onChange={(e) => setAdditional({ ...draft.additional, languages: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addTools">Technical Tools</label>
              <input type="text" id="addTools" className={styles.formInput} placeholder="e.g. React, Node.js, Docker, Git" value={draft.additional.tools} onChange={(e) => setAdditional({ ...draft.additional, tools: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addLicenses">Licenses</label>
              <input type="text" id="addLicenses" className={styles.formInput} placeholder="e.g. Driver's License, Certified Ethical Hacker" value={draft.additional.licenses} onChange={(e) => setAdditional({ ...draft.additional, licenses: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addStrengths">Strengths</label>
              <input type="text" id="addStrengths" className={styles.formInput} placeholder="e.g. Leadership, Adaptability, Communication" value={draft.additional.strengths} onChange={(e) => setAdditional({ ...draft.additional, strengths: e.target.value })} />
            </fieldset>
          )}

          {portfolioType === "standard" && (
            <fieldset className={styles.formSection}>
              <legend>Profile Picture (Optional)</legend>
              <label className={styles.formLabel} htmlFor="pPicture">Upload Picture:</label>
              <input type="file" id="pPicture" accept=".jpg,.jpeg,.png" className={styles.formInput} onChange={handleFile} />
              {draft.personal.picture && <p style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: "#6c3baa" }}>&#10003; Picture uploaded</p>}
            </fieldset>
          )}

          {portfolioType === "standard" && (
            <fieldset className={styles.formSection}>
              <legend>QuickCv Colors</legend>
              <label className={styles.formLabel} htmlFor="cPrimary">Primary:</label>
              <input type="color" id="cPrimary" className={styles.formInput} value={draft.colors.primary} onChange={(e) => setColors({ ...draft.colors, primary: e.target.value })} />
              <label className={styles.formLabel} htmlFor="cSecondary">Secondary:</label>
              <input type="color" id="cSecondary" className={styles.formInput} value={draft.colors.secondary} onChange={(e) => setColors({ ...draft.colors, secondary: e.target.value })} />
              <label className={styles.formLabel} htmlFor="cBackground">Background:</label>
              <input type="color" id="cBackground" className={styles.formInput} value={draft.colors.background} onChange={(e) => setColors({ ...draft.colors, background: e.target.value })} />
              <label className={styles.formLabel} htmlFor="cText">Text:</label>
              <input type="color" id="cText" className={styles.formInput} value={draft.colors.textColor} onChange={(e) => setColors({ ...draft.colors, textColor: e.target.value })} />
            </fieldset>
          )}

          <input type="submit" value={portfolioType === "ats" ? "Generate ATS Resume" : "Create QuickCv"} className={styles.formBtn} />
          <button type="button" className={styles.formBtn} onClick={handleClear}>Clear Form</button>
        </form>
      </div>

      <footer className="sv-footer">
        <p className="sv-credit">
          Website designed &amp; developed by{" "}
          <a href="https://strivers.online" target="_blank" rel="noopener noreferrer">Strivers</a>
        </p>
      </footer>
    </div>
  );
};

export default Registration;