import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faSquareYoutube } from "@fortawesome/free-brands-svg-icons";
import aadlLogo from "../../img/aadl-logo.png";

export default function Connect(){
    return(
      <div className="connect-links l-overflow-clear">
        <p className="t-center">LET'S CONNECT!</p>
        <div className="connect-links-1">
          <a href="https://aadl.org/">
            <img src={ aadlLogo } alt="AADL Logo" />
            AADL.org
          </a>
          <a href="https://twitter.com/aadl">
            <FontAwesomeIcon icon={ faTwitterSquare } className="fa" />
            Twitter
          </a>
          <a href="https://youtube.com/user/aadldotorg">
            <FontAwesomeIcon icon={ faSquareYoutube } className="fa" />
            YouTube
          </a>
        </div>
        <div className="connect-links-2">
          <a href="https://instagram.com/aadlgram">
            <FontAwesomeIcon icon={ faInstagramSquare } className="fa" />
            Instagram
          </a>
          <a href="https://facebook.com/aadl.org">
            <FontAwesomeIcon icon={ faFacebookSquare } className="fa" />
            Facebook
          </a>
        </div>
      </div>
    )
}