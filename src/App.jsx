import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import Home from "./components/Home";
import About from "./components/About";
import Registration from "./components/Registration";
import ContactUs from "./components/Contactus";
import Portfolio from "./components/Portfolio";

function App() {
  return (
    <Router>
      <nav className="main-nav">
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className="nav-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/registration" className="nav-link">
              Registration
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav-link">
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link">
              About Us
            </NavLink>
          </li>
        </ul>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
