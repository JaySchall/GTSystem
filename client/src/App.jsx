import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "./components/header/Header.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Events from "./pages/Events.jsx";
import FAQ from "./pages/FAQ.jsx";
import Form from "./pages/Form.jsx";
import EventPage from "./pages/EventPage.jsx";
import CreateBracket from "./pages/CreateEvent.jsx"
import ManageBracket from "./pages/ManageBracket.jsx"
import Tags from './pages/Tags.jsx';
import Login from './pages/Login.jsx'
import TagEvents from './pages/TagEvents.jsx';
import Footer from "./components/footer/Footer.jsx"
import AuthProvider from "./components/AuthContext.jsx";

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
    case "/Form":
      component = <Form />
      break;
    case "/Create/Event":
      component = <CreateBracket />
      break;
    case "/User/Login":
      component = <Login />
      break;
    case "/Events/:id/Manage":
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
    <AuthProvider>
      <Router>
        <div className="page outer-wrapper" role="document"> 
          <Header/>
            <main id="main-content" className="outer-wrapper l-overflow-clear" role="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/form" element={<Form />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventPage />} />
                <Route path="/create/event" element={<CreateBracket />} />
                <Route path="/user/login" element={<Login />} />
                <Route path="/events/:id/Manage" element={<ManageBracket />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/tags/:name" element={<TagEvents />} />
              </Routes>
            </main>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
