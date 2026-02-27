import React, { useState } from "react";

const roadmapData = [
  {
    quarter: "Q1 - 2024",
    title: "Initial Conception and Research",
    items: [
      "Defining the initial vision for the DTX ecosystem and the VulcanX blockchain.",
      "Initiate research and development segment for technical infrastructure.",
      "Outline timelines for key objectives and allocate resources towards team expansion.",
      "Secure $2.05 Million private funding for project development and launch.",
    ],
  },
  {
    quarter: "Q2 - 2024",
    title: "Team Formation & Ground Development",
    items: [
      "Recruit industry-leading experts from finance, tech, cybersecurity, and crypto.",
      "Publish the initial whitepaper and build pre-launch community.",
      "Finalize the developmental objectives of the DTX platform and the scope of the blockchain products.",
      "Publish KYC verification from SolidProof and partner with Cloudflare for expansive security.",
    ],
  },
  {
    quarter: "Q3 - 2024",
    title: "Technical Expansion and Community Building",
    items: [
      "Begin the technical development of the VulcanX blockchain.",
      "Start live-trading platform development & update user interface.",
      "Develop the DTX Unified Wallet for secure asset management.",
      "Upgrade back-end infrastructure to handle over 10 million live users.",
    ],
  },
];

export default function Roadmap() {
  const [selected, setSelected] = useState(0); // first card active by default

  return (
    <section className="w-full py-20 text-white flex flex-col items-center">

      {/* Title */}
      <h2 className="text-5xl font-semibold mb-12 tracking-tight text-center text-white">
        DTX Exchange – Roadmap
      </h2>

      {/* Timeline Row */}
      <div className="relative w-full max-w-5xl flex items-center justify-between mb-16">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-700"></div>

        {roadmapData.map((_, index) => (
          <div
            key={index}
            className="relative z-10 w-5 h-5 bg-[#57f500] rounded-full"
          ></div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full px-6">
        {roadmapData.map((item, index) => {
          const isActive = index === selected;

          return (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className={`dtx-glass p-8 h-[595px] w-full cursor-pointer transition-all duration-300 ${
                isActive ? "shadow-[0_0_20px_#57f50055]" : "opacity-80"
              }`}
            >
              {/* Quarter */}
              <p className="text-center text-xl font-semibold opacity-80 mb-4">
                {item.quarter}
              </p>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-6 text-white">{item.title}</h3>

              {/* Bullet List */}
              <ul className="space-y-4 flex-1">
                {item.items.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3">

                    {/* Pointer */}
                    <span
                      className={`pointer-base ${
                        isActive ? "pointer-green" : "pointer-white"
                      }`}
                    >
                      ✓
                    </span>

                    {/* Text */}
                    <p className="text-sm leading-relaxed text-gray-300">{text}</p>
                  </li>
                ))}
              </ul>

              {/* Expand Button */}
              <button className="mt-6 text-[#57f500] font-medium hover:underline">
                Expand
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
