import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "./components/header/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import FAQ from "./pages/FAQ";
import Form from "./pages/Form";
import EventPage from "./pages/EventPage";
import CreateBracket from "./pages/CreateBracket.js"
import Tags from './pages/Tags';
import TagEvents from './pages/TagEvents';
import Footer from "./components/footer/Footer"

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
    case "/Events/:id/Create":
      component = <CreateBracket />
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/form" element={<Form />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/events/:id/Create" element={<CreateBracket />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tags/:name" element={<TagEvents />} />
          </Routes>
        <Footer/>
      </div>
      
    </Router>
  );
}

export default App;
