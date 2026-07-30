import React, { useState } from "react";
import styles from "../Registeration.module.css";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState({
    name: "", age: "", email: "", gender: "", field: "Web Development", picture: "", video: "",
  });
  const [education, setEducation] = useState([{ level: "Matric", institute: "", year: "", marks: "" }]);
  const [skills, setSkills] = useState([""]);
  const [experience, setExperience] = useState([{ company: "", role: "", duration: "" }]);
  const [hasExperience, setHasExperience] = useState("no");
  const [error, setError] = useState("");
  const [portfolioType, setPortfolioType] = useState("standard");
  const [colors, setColors] = useState({
    primary: "#6c3baa", secondary: "#8b5cf6", background: "#0f0c29", textColor: "#ffffff",
  });

  const resetAll = () => {
    setPersonal({ name: "", age: "", email: "", gender: "", field: "Web Development", picture: "", video: "" });
    setEducation([{ level: "Matric", institute: "", year: "", marks: "" }]);
    setSkills([""]);
    setExperience([{ company: "", role: "", duration: "" }]);
    setHasExperience("no");
    setError("");
    setPortfolioType("standard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!personal.name || !personal.age || !personal.email || !personal.gender) {
      setError("Please fill all required fields before submitting."); return;
    }
    for (let i = 0; i < education.length; i++) {
      if (!education[i].level || !education[i].institute || !education[i].year || !education[i].marks) {
        setError("Please fill all education fields."); return;
      }
    }
    for (let i = 0; i < skills.length; i++) {
      if (!skills[i]) { setError("Please fill all skill fields."); return; }
    }
    if (hasExperience === "yes") {
      for (let i = 0; i < experience.length; i++) {
        if (!experience[i].company || !experience[i].role || !experience[i].duration) {
          setError("Please fill all experience fields."); return;
        }
      }
    }
    navigate("/portfolio", {
      state: {
        personal, education, skills,
        experience: hasExperience === "yes" ? experience : [],
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

  const addEducation = () => setEducation([...education, { level: "Other", institute: "", year: "", marks: "" }]);
  const addSkill = () => setSkills([...skills, ""]);
  const addExperience = () => setExperience([...experience, { company: "", role: "", duration: "" }]);

  return (
    <div>
      <header className={styles.mainHeaders}>
        <h1 className={styles.headerTitle}>Registration Form</h1>
        <h2 className={styles.headerSubtitle}>Join and Create Your Portfolio</h2>
        <img src="/head.jpg" alt="" className={styles.headersImg} />
        <img src="/logo.jpg" alt="" className={styles.logo} />
      </header>
      <div className={styles.formContainer}>
        <hr className={styles.divider} />
        {error && <p className={styles.errorMsg}>{error}</p>}
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
            <label className={styles.formLabel}>Name:</label>
            <input type="text" className={styles.formInput} value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
            <label className={styles.formLabel}>Age:</label>
            <input type="number" className={styles.formInput} value={personal.age} onChange={(e) => setPersonal({ ...personal, age: e.target.value })} />
            <label className={styles.formLabel}>Email:</label>
            <input type="email" className={styles.formInput} value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
            <label className={styles.formLabel}>Gender:</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="male" name="gender" value="male" checked={personal.gender === "male"} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })} />
              <label htmlFor="male">Male</label>
              <input type="radio" id="female" name="gender" value="female" checked={personal.gender === "female"} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })} />
              <label htmlFor="female">Female</label>
            </div>
          </fieldset>
          <fieldset className={styles.formSection}>
            <legend>Experience & Field</legend>
            <label className={styles.formLabel}>Field:</label>
            <select className={styles.formSelect} value={personal.field} onChange={(e) => setPersonal({ ...personal, field: e.target.value })}>
              <option>Web Development</option><option>AI</option><option>Cloud Computing</option><option>Design</option><option>Marketing</option><option>Other</option>
            </select>
            <label className={styles.formLabel}>Have work experience?</label>
            <div className={styles.radioGroup}>
              <input type="radio" id="expYes" name="he" value="yes" checked={hasExperience === "yes"} onChange={() => setHasExperience("yes")} />
              <label htmlFor="expYes">Yes</label>
              <input type="radio" id="expNo" name="he" value="no" checked={hasExperience === "no"} onChange={() => setHasExperience("no")} />
              <label htmlFor="expNo">No</label>
            </div>
          </fieldset>
          {hasExperience === "yes" && (
            <fieldset className={styles.formSection}>
              <legend>Experience</legend>
              {experience.map((exp, i) => (
                <div key={i} className={styles.multiRow}>
                  <input type="text" placeholder="Company" className={styles.formInput} value={exp.company} onChange={(e) => { const l = [...experience]; l[i].company = e.target.value; setExperience(l); }} />
                  <input type="text" placeholder="Role" className={styles.formInput} value={exp.role} onChange={(e) => { const l = [...experience]; l[i].role = e.target.value; setExperience(l); }} />
                  <input type="text" placeholder="Duration" className={styles.formInput} value={exp.duration} onChange={(e) => { const l = [...experience]; l[i].duration = e.target.value; setExperience(l); }} />
                </div>
              ))}
              <button type="button" className={styles.addBtn} onClick={addExperience}>Add Experience</button>
            </fieldset>
          )}
          <fieldset className={styles.formSection}>
            <legend>Upload Picture (Optional)</legend>
            <label className={styles.formLabel}>Upload Picture (JPG only):</label>
            <input type="file" accept=".jpg" className={styles.formInput} onChange={handleFile} />
          </fieldset>
          <fieldset className={styles.formSection}>
            <legend>Education</legend>
            {education.map((edu, i) => (
              <div key={i} className={styles.multiRow}>
                <input type="text" placeholder="Level" className={styles.formInput} value={edu.level} onChange={(e) => { const l = [...education]; l[i].level = e.target.value; setEducation(l); }} />
                <input type="text" placeholder="Institute" className={styles.formInput} value={edu.institute} onChange={(e) => { const l = [...education]; l[i].institute = e.target.value; setEducation(l); }} />
                <input type="text" placeholder="Year" className={styles.formInput} value={edu.year} onChange={(e) => { const l = [...education]; l[i].year = e.target.value; setEducation(l); }} />
                <input type="text" placeholder="Marks" className={styles.formInput} value={edu.marks} onChange={(e) => { const l = [...education]; l[i].marks = e.target.value; setEducation(l); }} />
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addEducation}>Add Education</button>
          </fieldset>
          <fieldset className={styles.formSection}>
            <legend>Skills</legend>
            {skills.map((skill, i) => (
              <div key={i} className={styles.multiRow}>
                <input type="text" placeholder="Skill" className={styles.formInput} value={skill} onChange={(e) => { const l = [...skills]; l[i] = e.target.value; setSkills(l); }} />
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addSkill}>Add Skill</button>
          </fieldset>
          {portfolioType === "standard" && (
            <fieldset className={styles.formSection}>
              <legend>Portfolio Colors</legend>
              <label className={styles.formLabel}>Primary:</label>
              <input type="color" className={styles.formInput} value={colors.primary} onChange={(e) => setColors({ ...colors, primary: e.target.value })} />
              <label className={styles.formLabel}>Secondary:</label>
              <input type="color" className={styles.formInput} value={colors.secondary} onChange={(e) => setColors({ ...colors, secondary: e.target.value })} />
              <label className={styles.formLabel}>Background:</label>
              <input type="color" className={styles.formInput} value={colors.background} onChange={(e) => setColors({ ...colors, background: e.target.value })} />
              <label className={styles.formLabel}>Text:</label>
              <input type="color" className={styles.formInput} value={colors.textColor} onChange={(e) => setColors({ ...colors, textColor: e.target.value })} />
            </fieldset>
          )}
          <input type="submit" value={portfolioType === "ats" ? "Generate ATS Resume" : "Create Portfolio"} className={styles.formBtn} />
          <button type="button" className={styles.formBtn} onClick={resetAll}>Clear</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
