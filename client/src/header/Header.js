import Navbar from "./Navbar";
import UserLinks from "./UserLinks"

export default function Header(){
    return(
        <header class="l-overflow-clear no-margin" role="banner">
            <UserLinks/>
            <Navbar/>
        </header>
    )
}