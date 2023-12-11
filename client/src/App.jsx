import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import FAQ from "./pages/FAQ";
import EventPage from "./pages/EventPage";
import { CreateEvent, EditEvent } from "./pages/ManageEvents";
import BracketPage from "./pages/BracketPage";
import CreateBracket from "./pages/CreateBracket";
import ManageBracket from "./pages/ManageBracket";
import Tags from "./pages/Tags";
import Login from "./pages/Login";
import TagEvents from "./pages/TagEvents";
import Footer from "./components/footer/Footer";
import EventRegistration from "./pages/EventRegistration";
import BracketRegistration from "./pages/BracketRegistration";
import AuthProvider from "./components/AuthContext.jsx";
import ProtectedLoginRoute from "./components/ProtectedLoginRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="page outer-wrapper" role="document">
          <Header />
          <main
            id="main-content"
            className="outer-wrapper l-overflow-clear"
            role="main"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventPage />} />
              <Route
                path="/events/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id/registration"
                element={
                  <ProtectedRoute>
                    <EventRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/event"
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id/new-bracket"
                element={<CreateBracket />}
              />
              <Route
                path="/user/login"
                element={
                  <ProtectedLoginRoute>
                    <Login />
                  </ProtectedLoginRoute>
                }
              />
              <Route
                path="/events/:id/bracket/:bid"
                element={<BracketPage />}
              />
              <Route
                path="/events/:id/bracket/:bid/registration"
                element={
                  <ProtectedRoute>
                    <BracketRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id/bracket/:bid/edit"
                element={
                  <ProtectedRoute>
                    <ManageBracket />
                  </ProtectedRoute>
                }
              />
              <Route path="/tags" element={<Tags />} />
              <Route path="/tags/:name" element={<TagEvents />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
