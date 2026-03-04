import React from "react";

const JoinSection = () => {
  return (
    <section
      className="w-full h-[50vh] md:h-[55vh] flex items-center justify-center text-white relative overflow-hidden"
      style={{
        backgroundImage: "url('/futuristic abstract 2.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mt-[-40px]">

        {/* Badge */}
        <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-sm mb-6">
          Claim Your DTX Tokens
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
          Claim Your Tokens Now
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-sm md:text-lg mb-8 leading-relaxed">
          Claim your eligible DTX tokens instantly. Connect your wallet and receive 
          tokens directly on-chain with a single click.
        </p>

        {/* Button */}
        <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
          Claim Token
        </button>

      </div>
    </section>
  );
};

export default JoinSection;
