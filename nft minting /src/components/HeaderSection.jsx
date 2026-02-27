"use client";
import React, { useState } from "react";

const Title = () => (
  <section className="flex flex-col gap-2.5 items-start w-full">
    <h1 className="text-5xl font-semibold leading-10 text-white text-center w-full mt-[-100px]">
      {"Powered by APSCCS".split("").map((char, i) => (
        <span key={i} className="whitespace-pre cursor-default">
          {char}
        </span>
      ))}
    </h1>

    <p className="text-center text-white mt-0 mx-auto text-[20px]">
      The Ultimate Security &amp; Hyper-Efficiency Engine
    </p>

    <p className="text-white text-center mt-[-0px]">
      APSCCS compresses 2GB to 80 bytes, prevents all known and unknown threats, and enables data to be accessed with precision and speed.
      
      {/* Button */}
      <button 
        onClick={() => {
          console.log("Button clicked!");
          window.location.href = 'https://apsccs.aoacorp.com/homepage';
        }} 
        className="text-blue-500 hover:text-blue-700 bg-transparent   px-4 py-2 rounded-full cursor-pointer"
        style={{ zIndex: 10, position: 'relative' }} // Ensure it's above other elements
      >
        🔷 APSCCS here
      </button>
    </p>
  </section>
);


const FeatureCard = ({ title, description, isActive, onClick }) => (
  <article className="w-full">
    <button
      onClick={onClick}
      className={`flex gap-4 items-center p-5 w-full rounded-xl transition text-left  ${
        isActive ? "bg-[linear-gradient(rgba(209,187,247,0)_0%,rgba(209,187,247,0.01)_100%)] shadow-[rgba(0,0,0,0.176)_0px_0.6px_2px_-1px,rgba(0,0,0,0.165)_0px_2.2px_7.8px_-2px,rgba(0,0,0,0.12)_0px_10px_34px_-3px,rgba(210,200,234,0.24)_0px_1px_1px_0px_inset] backdrop-blur-md" : "bg-white/5"
      }`}
    >
      <div className="flex flex-col gap-3">
        <h3 className={`text-xl ${isActive ? "text-white" : "text-neutral-400"}`}>
          {title}
        </h3>
        <p className={`text-base ${isActive ? "text-white" : "text-neutral-400"}`}>
          {description}
        </p>
      </div>
    </button>
  </article>
);

const features = [
  {
    title: "Sharing Bandwith",
    description: "Exchange your unused internet and earn passive rewards.",
    image: "EAC66252-5442-4369-A681-ED0643DCCB4B.webp",
  },
  {
    title: "Data Retrieval",
    description: "Provide real time data crawling to improve AI model output.",
    image: "EAC66252-5442-4369-A681-ED0643DCCB4B.webp",
  },
  {
    title: "Learning Reinforcement",
    description: "Earn by improving AI models with your feedback and training.",
    image: "EAC66252-5442-4369-A681-ED0643DCCB4B.webp",
  },
  {
    title: "Human Verification",
    description: "Unlock rewards by proving your humanity and enhancing AI realiability.",
    image: "EAC66252-5442-4369-A681-ED0643DCCB4B.webp",
  },
];

const FeatureList = ({ activeIndex, setActiveIndex }) => (
  <section className="flex flex-col gap-2.5 w-full max-w-[560px] ">
    {features.map((feature, index) => (
      <FeatureCard
        key={index}
        title={feature.title}
        description={feature.description}
        isActive={index === activeIndex}
        onClick={() => setActiveIndex(index)}
      />
    ))}
  </section>
);

const IllustrationSection = ({ image, altText = "Illustration" }) => (
  <section className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[0.9664/1]">
    <div className="absolute inset-0">
      <img
        src={image}
        alt={altText}
        className=" w-full h-full shadow-[0_0_30px_#87CEEB] rounded-xl"
      />
    </div>
  </section>
);



const HeaderSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <header className="flex flex-col gap-12 w-full max-w-[1000px] px-4">
      <section className="flex flex-col gap-6 w-full">
        <Title />
       
      </section>
      <section className="flex flex-col md:flex-row gap-8 w-full justify-between items-start  md:mt-[-250px] mt-[-50px] ">
        <FeatureList activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        <IllustrationSection image={features[activeIndex].image} />
      </section>
    </header>
  );
};

// Wrapper with background image
export default function HomePage() {
  return (
    <main
      className="flex items-center justify-center bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: "url('')", // this should match your uploaded image
      }}
    >
      <HeaderSection />
    </main>
  );
}
