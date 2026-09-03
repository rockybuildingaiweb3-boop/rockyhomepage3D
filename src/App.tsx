import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import { Footer, Navbar } from "./components";
import { About, Contact, Home, Projects } from "./pages";

// Helper to scroll to top on route transition
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <main className='bg-[#F5F5F0] min-h-screen text-[#263746] antialiased selection:bg-[#E9A84A] selection:text-[#263746] font-worksans'>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/about'
            element={
              <div className='flex flex-col min-h-screen'>
                <About />
                <Footer />
              </div>
            }
          />
          <Route
            path='/projects'
            element={
              <div className='flex flex-col min-h-screen'>
                <Projects />
                <Footer />
              </div>
            }
          />
          <Route
            path='/contact'
            element={
              <div className='flex flex-col min-h-screen'>
                <Contact />
                <Footer />
              </div>
            }
          />
          <Route
            path='*'
            element={
              <div className='flex flex-col min-h-screen'>
                <Home />
              </div>
            }
          />
        </Routes>
      </Router>
    </main>
  );
}
