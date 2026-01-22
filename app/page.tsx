import { Footer, Hero, Objective, Repositories, Community, Blog, Contact } from "@/components";
import FloatingLines from "@/components/ui/LinesBackground";

export default function Home() {
  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <FloatingLines
          linesGradient={["#191a1b", "#181817"]}
          animationSpeed={1}
          interactive={false}
          parallax={false}
        />
      </div>

      <main className="flex-1">
        <Hero />
        <Objective />
        <Repositories />
        <Community />
        <Blog />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
