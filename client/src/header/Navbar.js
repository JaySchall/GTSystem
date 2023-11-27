import logo from '../logo.svg';
import './Navbar.css';

export default function Navbar(){
    return(
        <nav role="navigation" aria-label="Main navigation">
            <a id="aadl-logo-text" href="/">
                <img src={ logo } alt="AADLGT Logo"/>
                <span id="gtsystem-logo-1">GT</span>
                <span id="gtsystem-logo-2">SYSTEM</span>
            </a>
            <ul>
                <li class="main-nav-item"><a href="/About">About Us</a></li>
                <li class="main-nav-item"><a href="/Events">Events</a></li>
                <li class="main-nav-item"><a href="/FAQ">FAQ</a></li>
            </ul>
        </nav>
    )
}