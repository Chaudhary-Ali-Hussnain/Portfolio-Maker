/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

// In-memory only: state lives in the provider, survives SPA navigation,
// resets on page reload. No storage, no network, no sensitive data kept.
const emptyDraft = () => ({
  personal: {
    name: "",
    age: "",
    email: "",
    contact: "",
    gender: "",
    field: "",
    picture: "",
    objective: "",
  },
  education: [{ level: "", institute: "", year: "", marks: "" }],
  skills: [""],
  experience: [{ company: "", role: "", duration: "", achievements: "" }],
  hasExperience: "no",
  additional: {
    certifications: "",
    languages: "",
    tools: "",
    licenses: "",
    strengths: "",
  },
  professionalLinks: [],
  projects: [],
  languages: [],
  additionalInfo: [],
  colors: {
    primary: "#6c3baa",
    secondary: "#8b5cf6",
    background: "#0f0c29",
    textColor: "#ffffff",
  },
});

const PortfolioFormContext = createContext(null);

export const LINK_TYPES = [
  { id: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username" },
  { id: "website", label: "Personal Website", placeholder: "https://yourwebsite.com" },
  { id: "behance", label: "Behance", placeholder: "behance.net/username" },
  { id: "dribbble", label: "Dribbble", placeholder: "dribbble.com/username" },
  { id: "researchgate", label: "ResearchGate", placeholder: "researchgate.net/profile/name" },
  { id: "scholar", label: "Google Scholar", placeholder: "scholar.google.com/citations?user=..." },
  { id: "other", label: "Other Professional Link", placeholder: "https://..." },
];

export const PortfolioFormProvider = ({ children }) => {
  const [standard, setStandard] = useState(emptyDraft);
  const [ats, setAts] = useState(emptyDraft);
  const [activeType, setActiveType] = useState("standard");

  const updateDraft = (type, updater) => {
    const setter = type === "ats" ? setAts : setStandard;
    setter((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  const resetDraft = (type) => {
    if (type === "ats") setAts(emptyDraft());
    else setStandard(emptyDraft());
  };

  return (
    <PortfolioFormContext.Provider
      value={{ drafts: { standard, ats }, activeType, setActiveType, updateDraft, resetDraft }}
    >
      {children}
    </PortfolioFormContext.Provider>
  );
};

export const usePortfolioForm = () => useContext(PortfolioFormContext);