import { Footer, Community, Blog, Contact } from "@/components";
import ScrollytellingSingularity from "@/components/scrollytelling/ScrollytellingSingularity";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[#242423]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(249,233,0,0.06)_0%,transparent_70%)]" />
      </div>

      <main className="flex-1">
        <ScrollytellingSingularity />
        <Community />
        <Blog />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
