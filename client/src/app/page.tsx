import Hero from "../../components/mod/Home/Hero";
import Navbar from "../../components/Navbar";




export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar/>
      <Hero/>
    </div>  
  );
} 