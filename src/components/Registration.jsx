import React, { useState } from "react";
import styles from "../Registeration.module.css";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState({
    name: "",
    age: "",
    email: "",
    gender: "",
    field: "Web Development",
    picture: "",
    video: "",
  });

  const [education, setEducation] = useState([
    { level: "Matric", institute: "", year: "", marks: "" },
  ]);

  const [skills, setSkills] = useState([""]);

  const [experience, setExperience] = useState([
    { company: "", role: "", duration: "" },
  ]);

  const [hasExperience, setHasExperience] = useState("no");
  const [error, setError] = useState("");

  const resetAll = () => {
    setPersonal({
      name: "",
      age: "",
      email: "",
      gender: "",
      field: "Web Development",
      picture: "",
      video: "",
    });

    setEducation([{ level: "Matric", institute: "", year: "", marks: "" }]);
    setSkills([""]);
    setExperience([{ company: "", role: "", duration: "" }]);
    setHasExperience("no");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validation
    if (
      !personal.name ||
      !personal.age ||
      !personal.email ||
      !personal.gender ||
      !personal.picture
    ) {
      setError("Please fill all required fields before submitting.");
      return;
    }

    // validation for education
    for (let i = 0; i < education.length; i++) {
      if (
        !education[i].level ||
        !education[i].institute ||
        !education[i].year ||
        !education[i].marks
      ) {
        setError("Please fill all education fields.");
        return;
      }
    }

    // validation for skills
    for (let i = 0; i < skills.length; i++) {
      if (!skills[i]) {
        setError("Please fill all skill fields.");
        return;
      }
    }

    // validation for experience if yes
    if (hasExperience === "yes") {
      for (let i = 0; i < experience.length; i++) {
        if (
          !experience[i].company ||
          !experience[i].role ||
          !experience[i].duration
        ) {
          setError("Please fill all experience fields.");
          return;
        }
      }
    }

    const portfolioData = {
      personal,
      education,
      skills,
      experience: hasExperience === "yes" ? experience : [],
    };

    navigate("/portfolio", { state: portfolioData });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPersonal({ ...personal, picture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { level: "Other", institute: "", year: "", marks: "" },
    ]);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const addExperience = () => {
    setExperience([...experience, { company: "", role: "", duration: "" }]);
  };

  return (
    <div>
      <header className={styles.mainHeaders}>
        <h1 className={styles.headerTitle}>Registration Form</h1>
        <h2 className={styles.headerSubtitle}>Join and Create Your Portfolio</h2>

        <img src="/head.jpg" alt="Header Image" className={styles.headersImg} />
        <img src="/logo.jpg" alt="Logo" className={styles.logo} />
      </header>

      <div className={styles.formContainer}>
        <hr className={styles.divider} />

        {error && <p className={styles.errorMsg}>{error}</p>}

        <form className={styles.registrationForm} onSubmit={handleSubmit}>
          <fieldset className={styles.formSection}>
            <legend>Personal Information</legend>

            <label className={styles.formLabel}>Name:</label>
            <input
              type="text"
              name="name"
              className={styles.formInput}
              value={personal.name}
              onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
            />

            <label className={styles.formLabel}>Age:</label>
            <input
              type="number"
              name="age"
              className={styles.formInput}
              value={personal.age}
              onChange={(e) => setPersonal({ ...personal, age: e.target.value })}
            />

            <label className={styles.formLabel}>Email:</label>
            <input
              type="email"
              name="email"
              className={styles.formInput}
              value={personal.email}
              onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
            />

            <label className={styles.formLabel}>Gender:</label>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={personal.gender === "male"}
                onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
              />
              <label htmlFor="male">Male</label>

              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={personal.gender === "female"}
                onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
              />
              <label htmlFor="female">Female</label>
            </div>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Experience & Field</legend>

            <label className={styles.formLabel}>Field:</label>
            <select
              name="field"
              className={styles.formSelect}
              value={personal.field}
              onChange={(e) => setPersonal({ ...personal, field: e.target.value })}
            >
              <option>Web Development</option>
              <option>Artificial Intelligence</option>
              <option>Cloud Computing</option>
              <option>Content Creation</option>
              <option>Cybersecurity</option>
              <option>Data Science</option>
              <option>Design</option>
              <option>Digital Photography</option>
              <option>Marketing</option>
              <option>Mobile App Development</option>
              <option>Project Management</option>
              <option>Software Engineering</option>
              <option>UI/UX Design</option>
              <option>Other</option>
            </select>

            <label className={styles.formLabel}>Do you have work experience?</label>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="expYes"
                name="hasExperience"
                value="yes"
                checked={hasExperience === "yes"}
                onChange={() => setHasExperience("yes")}
              />
              <label htmlFor="expYes">Yes</label>

              <input
                type="radio"
                id="expNo"
                name="hasExperience"
                value="no"
                checked={hasExperience === "no"}
                onChange={() => setHasExperience("no")}
              />
              <label htmlFor="expNo">No</label>
            </div>
          </fieldset>

          {hasExperience === "yes" && (
            <fieldset className={styles.formSection}>
              <legend>Experience</legend>

              {experience.map((exp, index) => (
                <div key={index} className={styles.multiRow}>
                  <input
                    type="text"
                    placeholder="Company"
                    className={styles.formInput}
                    value={exp.company}
                    onChange={(e) => {
                      const list = [...experience];
                      list[index].company = e.target.value;
                      setExperience(list);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    className={styles.formInput}
                    value={exp.role}
                    onChange={(e) => {
                      const list = [...experience];
                      list[index].role = e.target.value;
                      setExperience(list);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    className={styles.formInput}
                    value={exp.duration}
                    onChange={(e) => {
                      const list = [...experience];
                      list[index].duration = e.target.value;
                      setExperience(list);
                    }}
                  />
                </div>
              ))}

              <button type="button" className={styles.addBtn} onClick={addExperience}>
                Add Experience
              </button>
            </fieldset>
          )}

          <fieldset className={styles.formSection}>
            <legend>Upload Picture</legend>

            <label className={styles.formLabel}>Upload Picture (JPG only):</label>
            <input
              type="file"
              name="picture"
              accept=".jpg"
              className={styles.formInput}
              onChange={handleFile}
            />
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Education</legend>

            {education.map((edu, index) => (
              <div key={index} className={styles.multiRow}>
                <input
                  type="text"
                  placeholder="Level"
                  className={styles.formInput}
                  value={edu.level}
                  onChange={(e) => {
                    const list = [...education];
                    list[index].level = e.target.value;
                    setEducation(list);
                  }}
                />
                <input
                  type="text"
                  placeholder="Institute"
                  className={styles.formInput}
                  value={edu.institute}
                  onChange={(e) => {
                    const list = [...education];
                    list[index].institute = e.target.value;
                    setEducation(list);
                  }}
                />
                <input
                  type="text"
                  placeholder="Year"
                  className={styles.formInput}
                  value={edu.year}
                  onChange={(e) => {
                    const list = [...education];
                    list[index].year = e.target.value;
                    setEducation(list);
                  }}
                />
                <input
                  type="text"
                  placeholder="Marks"
                  className={styles.formInput}
                  value={edu.marks}
                  onChange={(e) => {
                    const list = [...education];
                    list[index].marks = e.target.value;
                    setEducation(list);
                  }}
                />
              </div>
            ))}

            <button type="button" className={styles.addBtn} onClick={addEducation}>
              Add Education
            </button>
          </fieldset>

          <fieldset className={styles.formSection}>
            <legend>Skills</legend>

            {skills.map((skill, index) => (
              <div key={index} className={styles.multiRow}>
                <input
                  type="text"
                  placeholder="Skill"
                  className={styles.formInput}
                  value={skill}
                  onChange={(e) => {
                    const list = [...skills];
                    list[index] = e.target.value;
                    setSkills(list);
                  }}
                />
              </div>
            ))}

            <button type="button" className={styles.addBtn} onClick={addSkill}>
              Add Skill
            </button>
          </fieldset>

          <input type="submit" value="Submit" className={styles.formBtn} />
          <button type="button" className={styles.formBtn} onClick={resetAll}>
            Clear
          </button>
        </form>

        <div className={styles.contactSection}>
          <h1 className={styles.contactTitle}>Contact Others</h1>
          <ul className={styles.contactList}>
            <li>Phone: 03455343433546</li>
            <li>Email: Portfolio@gmail.com</li>
            <li>Address: 23-D Bahria Town, Lahore</li>
          </ul>
        </div>

        <footer className={styles.mainFooter}>
          <p>Register now and make your professional portfolio!</p>
        </footer>
      </div>
    </div>
  );
};

export default Registration;
