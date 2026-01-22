import Logo3D from "../ui/3DLogo";
import AnimatedText from "../ui/AnimatedText";

export default function Hero() {
  return (
    <section className="relative h-[100dvh] w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <Logo3D />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <AnimatedText text={["HELPFUL SOLUTIONS FOR THE", "OPEN SOURCE COMMUNITY."]} />
      </div>
    </section>
  );
}


