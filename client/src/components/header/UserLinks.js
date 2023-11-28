import '../../css/UserLinks.css';

export default function Navbar(){
    return(
        <div>
            <span className="contact-links contact-links-1">
                <ul>
                    <li>
                        <a href="/create/event">Create Event</a>
                    </li>
                </ul>
            </span>
            <span className="contact-links contact-links-2">
                <ul>
                    <li>
                        <a href="/user/login">Sign In</a>
                    </li>
                </ul>
            </span>
        </div>
    )
}