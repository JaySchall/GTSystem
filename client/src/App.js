import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "./components/header/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import FAQ from "./pages/FAQ";
import EventPage from "./pages/EventPage";
import { CreateEvent, EditEvent } from "./pages/ManageEvents.js";
import BracketPage from "./pages/BracketPage.js"
import CreateBracket from "./pages/CreateBracket.js";
import ManageBracket from "./pages/ManageBracket.js"
import Tags from './pages/Tags';
import Login from './pages/Login'
import TagEvents from './pages/TagEvents';
import Footer from "./components/footer/Footer"
import EventRegistration from "./pages/EventRegistration.js";
import BracketRegistration from "./pages/BracketRegistration.js";

function App() {
  let component
  switch (window.location.pathname) {
    case "/":
      component = <Home />
      break;
    case "/About":
      component = <About />
      break;
    case "/Events":
      component = <Events />
      break;
    case "/FAQ":
      component = <FAQ />
      break;
    case "/Create/Event":
      component = <CreateEvent />
      break;
    case "/events/:id/new-bracket":
      component = <CreateBracket />
      break;
    case "/User/Login":
      component = <Login />
      break;
    case "/vents/:id/edit":
      component = <EditEvent />
      break;
    case "/events/:id/bracket/:bid/edit":
      component = <ManageBracket />
      break;
    default:
      break;
  }
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    
    <Router>
      <div className="page outer-wrapper" role="document"> 
        <Header/>
          <main id="main-content" className="outer-wrapper l-overflow-clear" role="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventPage />} />
              <Route path="/events/:id/edit" element={<EditEvent />} />
              <Route path="/events/:id/registration" element={<EventRegistration />} />
              <Route path="/create/event" element={<CreateEvent />} />
              <Route path="/events/:id/new-bracket" element={<CreateBracket />} />
              <Route path="/user/login" element={<Login />} />
              <Route path="/events/:id/bracket/:bid" element={<BracketPage />} />
              <Route path="/events/:id/bracket/:bid/registration" element={<BracketRegistration />} />
              <Route path="/events/:id/bracket/:bid/edit" element={<ManageBracket />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/tags/:name" element={<TagEvents />} />
            </Routes>
          </main>
        <Footer/>
      </div>
      
    </Router>
  );
}

export default App;
