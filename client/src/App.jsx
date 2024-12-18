import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import HeroSection from "./pages/students/HeroSection";

function App() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <Login />
    </main>
  );
}

export default App;
