import logo from "../../img/logo.svg";
import "../../css/Navbar.css";

export default function Navbar() {
  return (
    <nav role="navigation" aria-label="Main navigation">
      <a id="aadl-logo-text" href="/">
        <img src={logo} alt="AADLGT Logo" />
        <span id="gtsystem-logo-1">GT</span>
        <span id="gtsystem-logo-2">SYSTEM</span>
      </a>
      <div className="nav-item-group">
        <li className="main-nav-item">
          <a href="/">Home</a>
        </li>
        <li className="main-nav-item">
          <a href="/Events">Events</a>
        </li>
        <li className="main-nav-item">
          <a href="/About">About Us</a>
        </li>
        <li className="main-nav-item">
          <a href="/FAQ">FAQ</a>
        </li>
      </div>
    </nav>
  );
}
