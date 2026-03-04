import React from "react";

const HeroSection = () => {
  return (
    <div className="relative w-full min-h-[80vh] md:min-h-[90vh] bg-[#070916] overflow-hidden mt-10">

      {/* CENTER GLOW */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 
                      w-[600px] h-[600px] bg-[#063225] opacity-40 blur-[200px] rounded-full"></div>

      {/* RIGHT GLOW */}
      <div className="pointer-events-none absolute top-1/4 right-[-200px] w-[700px] h-[700px]
                      bg-[#3df5c0] opacity-50 blur-[160px] rounded-full"></div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-40 flex flex-col md:flex-row 
                      items-center justify-between gap-16 md:gap-0 relative z-10">

        {/* LEFT TEXT SIDE */}
        <div className="w-full md:w-[540px] text-center md:text-left">
          <h1 className="text-white font-[600] leading-[46px] md:leading-[86px] 
                         tracking-[-1px] md:tracking-[-4px]
                         text-[36px] md:text-[72px]">
            Leading 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3E8715] to-[#37DCD0]">
              Tokenised
            </span>{" "}
           Exchange
          </h1>

        

          {/* Claim Token BUTTON */}
          <div className="flex justify-center md:justify-start">
            <button className="mt-8 px-8 py-3 rounded-full font-semibold text-white 
                               bg-gradient-to-r from-[#3E8715] to-[#37DCD0]
                               shadow-[0px_10px_54px_rgba(0,0,0,0.4)]
                               backdrop-blur-md">
              Claim Token
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE + FLOATING CARDS */}
        <div className="relative w-full md:w-[700px] flex justify-center">

          {/* MAIN 3D IMAGE */}
          <img 
            src="/Adobe Express - file.png"
            alt="ETF Visual"
            className="w-[85%] md:w-full select-none pointer-events-none"
          />

          {/* TOP FLOATING CARD */}
          <div className="absolute top-[10px] right-[10px] md:top-[60px] md:right-[80px] 
                          backdrop-blur-xl px-4 md:px-5 py-2.5 md:py-3 
                          rounded-full border border-green-400/40">
            <div className="text-white text-xs md:text-sm font-semibold">Invesco Galaxy ETF</div>
            <div className="text-white text-xs md:text-sm">
              $862.56 <span className="text-green-500 font-semibold">+18%</span>
            </div>
          </div>

          {/* BOTTOM FLOATING CARD */}
          <div className="absolute bottom-[10px] left-[10px] md:bottom-[40px] md:left-[20px] 
                          backdrop-blur-xl px-4 md:px-5 py-2.5 md:py-3 
                          rounded-full border border-green-400/40">
            <div className="text-white text-xs md:text-sm font-semibold">Bitwise ETF</div>
            <div className="text-white text-xs md:text-sm">
              $251.25 <span className="text-green-500 font-semibold">+12%</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
