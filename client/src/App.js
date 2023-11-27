import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from "./header/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import FAQ from "./pages/FAQ";
import Form from "./pages/Form";
import EventPage from "./pages/EventPage";
import Footer from "./footer/Footer"

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
        <main id="main-content" class="outer-wrapper l-overflow-clear" role="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/form" element={<Form />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventPage />} />
          </Routes>
        </main>
        <Footer/>
      </div>
      
    </Router>
  );
}

export default App;
