import { useEffect } from "react";
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Detect from './components/Detection/Detect'
import Information from './components/Information/Information'
import Footer from './components/Footer/Footer'

function App() {
  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then(res => res.json())
      .then(data => console.log("Flask Response:", data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <Detect />
      <Information />
      <About />
      <Footer />
    </div>
  );
}

export default App;
