import Navbar from "./Navbar";
import UserLinks from "./UserLinks";

export default function Header() {
  return (
    <>
      <UserLinks />
      <header className="l-overflow-clear no-margin" role="banner">
        <Navbar />
      </header>
    </>
  );
}
