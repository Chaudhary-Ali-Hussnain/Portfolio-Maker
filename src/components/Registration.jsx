import React, { useState } from "react";
import styles from "../Registeration.module.css";
import { useNavigate } from "react-router-dom";

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

  const [personal, setPersonal] = useState({
    name: "", age: "", email: "", gender: "", field: "", picture: "", video: "", objective: "",
    contact: "",
  });
  const [education, setEducation] = useState([{ level: "", institute: "", year: "", marks: "" }]);
  const [skills, setSkills] = useState([""]);
  const [experience, setExperience] = useState([{ company: "", role: "", duration: "", achievements: "" }]);
  const [hasExperience, setHasExperience] = useState("no");
  const [additional, setAdditional] = useState({
    certifications: "", languages: "", tools: "", licenses: "", strengths: "",
  });
  const [error, setError] = useState("");
  const [portfolioType, setPortfolioType] = useState("standard");
  const [colors, setColors] = useState({
    primary: "#6c3baa", secondary: "#8b5cf6", background: "#0f0c29", textColor: "#ffffff",
  });

  const resetAll = () => {
    setPersonal({ name: "", age: "", email: "", contact: "", gender: "", field: "", picture: "", video: "", objective: "" });
    setEducation([{ level: "", institute: "", year: "", marks: "" }]);
    setSkills([""]);
    setExperience([{ company: "", role: "", duration: "", achievements: "" }]);
    setHasExperience("no");
    setAdditional({ certifications: "", languages: "", tools: "", licenses: "", strengths: "" });
    setError("");
    setPortfolioType("standard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Specific field validation
    if (!personal.name.trim()) { setError("Name is required."); return; }
    if (!personal.age) { setError("Age is required."); return; }
    if (!personal.email.trim()) { setError("Email is required."); return; }
    if (!personal.contact.trim()) { setError("Contact number is required."); return; }
    if (!personal.gender) { setError("Please select your gender."); return; }

    for (let i = 0; i < education.length; i++) {
      if (!education[i].level.trim()) { setError(`Education row ${i + 1}: Level is required.`); return; }
      if (!education[i].institute.trim()) { setError(`Education row ${i + 1}: Institute is required.`); return; }
      if (!education[i].year.trim()) { setError(`Education row ${i + 1}: Year is required.`); return; }
    }
    for (let i = 0; i < skills.length; i++) {
      if (!skills[i].trim()) { setError(`Skill row ${i + 1}: Please enter a skill or remove it.`); return; }
    }
    if (hasExperience === "yes") {
      for (let i = 0; i < experience.length; i++) {
        if (!experience[i].company.trim()) { setError(`Experience row ${i + 1}: Company is required.`); return; }
        if (!experience[i].role.trim()) { setError(`Experience row ${i + 1}: Role is required.`); return; }
        if (!experience[i].duration.trim()) { setError(`Experience row ${i + 1}: Duration is required.`); return; }
      }
    }

    navigate("/portfolio", {
      state: {
        personal, education, skills,
        experience: hasExperience === "yes" ? experience : [],
        additional,
        colors, portfolioType,
      }
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPersonal({ ...personal, picture: reader.result });
    reader.readAsDataURL(file);
  };

  const addEducation = () => setEducation([...education, { level: "", institute: "", year: "", marks: "" }]);
  const addSkill = () => setSkills([...skills, ""]);
  const addExperience = () => setExperience([...experience, { company: "", role: "", duration: "", achievements: "" }]);

  const handleFieldChange = (e) => {
    setPersonal({ ...personal, field: e.target.value });
  };

  return (
    <div>
      <header className={styles.mainHeaders}>
        <h1 className={styles.headerTitle}>Registration Form</h1>
        <h2 className={styles.headerSubtitle}>Build Your Complete Portfolio</h2>
        <img src="/head.jpg" alt="" className={styles.headersImg} />
        <img src="/logo.jpg" alt="" className={styles.logo} />
      </header>
      <div className={styles.formContainer}>
        <hr className={styles.divider} />
        {error && <p className={styles.errorMsg}>&#9888; {error}</p>}
        <form className={styles.registrationForm} onSubmit={handleSubmit}>
          <fieldset className={styles.formSection}>
            <legend>Portfolio Type</legend>
            <label className={styles.formLabel}>Choose style:</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="ptStd" name="pt" value="standard" checked={portfolioType === "standard"} onChange={() => setPortfolioType("standard")} />
              <label htmlFor="ptStd">Standard Portfolio</label>
              <input type="radio" id="ptAts" name="pt" value="ats" checked={portfolioType === "ats"} onChange={() => setPortfolioType("ats")} />
              <label htmlFor="ptAts">ATS-Friendly Resume</label>
            </div>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Personal Information</legend>
            <label className={styles.formLabel} htmlFor="pName">Full Name *</label>
            <input type="text" id="pName" className={styles.formInput} placeholder="e.g. John Doe" value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
            <label className={styles.formLabel} htmlFor="pAge">Age *</label>
            <input type="number" id="pAge" className={styles.formInput} placeholder="e.g. 25" value={personal.age} onChange={(e) => setPersonal({ ...personal, age: e.target.value })} />
            <label className={styles.formLabel} htmlFor="pEmail">Email *</label>
            <input type="email" id="pEmail" className={styles.formInput} placeholder="e.g. john@example.com" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
            <label className={styles.formLabel} htmlFor="pContact">Contact Number *</label>
            <input type="text" id="pContact" className={styles.formInput} placeholder="e.g. 0300-1234567" value={personal.contact} onChange={(e) => setPersonal({ ...personal, contact: e.target.value })} />
            <label className={styles.formLabel}>Gender *</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="male" name="gender" value="male" checked={personal.gender === "male"} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })} />
              <label htmlFor="male">Male</label>
              <input type="radio" id="female" name="gender" value="female" checked={personal.gender === "female"} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })} />
              <label htmlFor="female">Female</label>
            </div>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Professional Objective</legend>
            <label className={styles.formLabel} htmlFor="pObjective">Write a strong career objective (80–120 words recommended; leave blank to auto-generate):</label>
            <textarea className={styles.formTextarea} id="pObjective" rows="5" placeholder="e.g. Highly motivated software engineer with 3 years of experience delivering scalable web applications..." value={personal.objective} onChange={(e) => setPersonal({ ...personal, objective: e.target.value })} />
            <p className={styles.formHint}>
              {personal.objective.trim() ? `${personal.objective.trim().split(/\s+/).length} words` : "0 words"} — aim for a strong paragraph of about 80–120 words.
            </p>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Field of Study / Profession</legend>
            <label className={styles.formLabel} htmlFor="pField">Your field *</label>
            <input type="text" id="pField" className={styles.formInput} list="fieldList" placeholder="Type or select your field" value={personal.field} onChange={handleFieldChange} />
            <datalist id="fieldList">
              {FIELD_OPTIONS.map((f, i) => <option key={i} value={f} />)}
            </datalist>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Experience</legend>
            <label className={styles.formLabel}>Do you have work experience?</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="expYes" name="he" value="yes" checked={hasExperience === "yes"} onChange={() => setHasExperience("yes")} />
              <label htmlFor="expYes">Yes</label>
              <input type="radio" id="expNo" name="he" value="no" checked={hasExperience === "no"} onChange={() => setHasExperience("no")} />
              <label htmlFor="expNo">No</label>
            </div>
            {hasExperience === "yes" && (
              <>
                {experience.map((exp, i) => (
                  <div key={i} style={{ marginTop: "0.5rem" }}>
                    <div className={styles.multiRow}>
                      <input type="text" placeholder="Company *" aria-label={`Experience ${i + 1} company`} className={styles.formInput} value={exp.company} onChange={(e) => { const l = [...experience]; l[i].company = e.target.value; setExperience(l); }} />
                      <input type="text" placeholder="Role *" aria-label={`Experience ${i + 1} role`} className={styles.formInput} value={exp.role} onChange={(e) => { const l = [...experience]; l[i].role = e.target.value; setExperience(l); }} />
                      <input type="text" placeholder="Duration *" aria-label={`Experience ${i + 1} duration`} className={styles.formInput} value={exp.duration} onChange={(e) => { const l = [...experience]; l[i].duration = e.target.value; setExperience(l); }} />
                    </div>
                    <textarea
                      className={styles.formTextarea}
                      rows="3"
                      aria-label={`Experience ${i + 1} achievements`}
                      placeholder={"Key achievements & responsibilities (one per line, 4–6 lines) e.g.\nDeveloped a customer portal that reduced response time by 30%"}
                      value={exp.achievements}
                      onChange={(e) => { const l = [...experience]; l[i].achievements = e.target.value; setExperience(l); }}
                    />
                  </div>
                ))}
                <button type="button" className={styles.addBtn} onClick={addExperience}>+ Add Another Experience</button>
              </>
            )}
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Education</legend>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.multiRow}>
                  <input type="text" placeholder="Level * (e.g. Bachelor's)" aria-label={`Education ${i + 1} level`} className={styles.formInput} value={edu.level} onChange={(e) => { const l = [...education]; l[i].level = e.target.value; setEducation(l); }} />
                  <input type="text" placeholder="Institute *" aria-label={`Education ${i + 1} institute`} className={styles.formInput} value={edu.institute} onChange={(e) => { const l = [...education]; l[i].institute = e.target.value; setEducation(l); }} />
                  <input type="text" placeholder="Year *" aria-label={`Education ${i + 1} year`} className={styles.formInput} value={edu.year} onChange={(e) => { const l = [...education]; l[i].year = e.target.value; setEducation(l); }} />
                  <input type="text" placeholder="Marks/GPA (optional)" aria-label={`Education ${i + 1} marks or GPA`} className={styles.formInput} value={edu.marks} onChange={(e) => { const l = [...education]; l[i].marks = e.target.value; setEducation(l); }} />
                </div>
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addEducation}>+ Add Another Education</button>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Skills</legend>
            {skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: "0.4rem" }}>
                <input type="text" placeholder="Skill *" aria-label={`Skill ${i + 1}`} className={styles.formInput} value={skill} onChange={(e) => { const l = [...skills]; l[i] = e.target.value; setSkills(l); }} />
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addSkill}>+ Add Another Skill</button>
          </fieldset>

          {portfolioType === "ats" && (
            <fieldset className={styles.formSection}>
              <legend>Additional Information</legend>
              <p className={styles.formHint}>Separate multiple entries with commas. These appear as bullet points on your ATS resume.</p>
              <label className={styles.formLabel} htmlFor="addCerts">Certifications</label>
              <input type="text" id="addCerts" className={styles.formInput} placeholder="e.g. AWS Certified Solutions Architect, PMP" value={additional.certifications} onChange={(e) => setAdditional({ ...additional, certifications: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addLangs">Languages</label>
              <input type="text" id="addLangs" className={styles.formInput} placeholder="e.g. English, Urdu, Arabic" value={additional.languages} onChange={(e) => setAdditional({ ...additional, languages: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addTools">Technical Tools</label>
              <input type="text" id="addTools" className={styles.formInput} placeholder="e.g. React, Node.js, Docker, Git" value={additional.tools} onChange={(e) => setAdditional({ ...additional, tools: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addLicenses">Licenses</label>
              <input type="text" id="addLicenses" className={styles.formInput} placeholder="e.g. Driver's License, Certified Ethical Hacker" value={additional.licenses} onChange={(e) => setAdditional({ ...additional, licenses: e.target.value })} />
              <label className={styles.formLabel} htmlFor="addStrengths">Strengths</label>
              <input type="text" id="addStrengths" className={styles.formInput} placeholder="e.g. Leadership, Adaptability, Communication" value={additional.strengths} onChange={(e) => setAdditional({ ...additional, strengths: e.target.value })} />
            </fieldset>
          )}

          {portfolioType === "standard" && (
          <fieldset className={styles.formSection}>
            <legend>Profile Picture (Optional)</legend>
            <label className={styles.formLabel} htmlFor="pPicture">Upload Picture:</label>
            <input type="file" id="pPicture" accept=".jpg,.jpeg,.png" className={styles.formInput} onChange={handleFile} />
            {personal.picture && <p style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: "#6c3baa" }}>&#10003; Picture uploaded</p>}
          </fieldset>
          )}

          {portfolioType === "standard" && (
            <fieldset className={styles.formSection}>
              <legend>Portfolio Colors</legend>
              <label className={styles.formLabel} htmlFor="cPrimary">Primary:</label>
              <input type="color" id="cPrimary" className={styles.formInput} value={colors.primary} onChange={(e) => setColors({ ...colors, primary: e.target.value })} />
              <label className={styles.formLabel} htmlFor="cSecondary">Secondary:</label>
              <input type="color" id="cSecondary" className={styles.formInput} value={colors.secondary} onChange={(e) => setColors({ ...colors, secondary: e.target.value })} />
              <label className={styles.formLabel} htmlFor="cBackground">Background:</label>
              <input type="color" id="cBackground" className={styles.formInput} value={colors.background} onChange={(e) => setColors({ ...colors, background: e.target.value })} />
              <label className={styles.formLabel} htmlFor="cText">Text:</label>
              <input type="color" id="cText" className={styles.formInput} value={colors.textColor} onChange={(e) => setColors({ ...colors, textColor: e.target.value })} />
            </fieldset>
          )}

          <input type="submit" value={portfolioType === "ats" ? "Generate ATS Resume" : "Create Portfolio"} className={styles.formBtn} />
          <button type="button" className={styles.formBtn} onClick={resetAll}>Clear All</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
