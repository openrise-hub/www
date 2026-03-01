import { CircularText3D } from "../ui";

export default function Objective() {
  return (
    <section id="thegoal" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="relative order-2 lg:order-1 flex justify-center">
          <CircularText3D />
        </div>
        
        <article className="order-1 lg:order-2">
          
          <p className="objective-text text-xl md:text-2xl leading-relaxed text-foreground/90 max-w-2xl">
            Our mission is simple: to help the open-source community by building useful tools. 
            Beyond code, we want to provide an environment where junior developers can learn, 
            master GitHub workflows, and experience real collaboration in open-source projects.
          </p>
        </article>
      </div>
    </section>
  );
}
