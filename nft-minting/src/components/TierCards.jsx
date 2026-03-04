import React from "react";

const tiers = [
  {
    name: "BRONZE",
    wager: "$10k",
    benefits: ["Monthly Bonuses", "Level Up Bonuses", "Rakeback", "Weekly Bonuses"],
  },
  {
    name: "SILVER",
    wager: "$50k - $100k",
    benefits: [
      "Monthly Bonuses",
      "Level Up Bonuses",
      "Rakeback",
      "Weekly Bonuses",
      "Bonus Growth",
    ],
  },
  {
    name: "GOLD",
    wager: "$100k - $250k",
    benefits: [
      "Monthly Bonuses",
      "Level Up Bonuses",
      "Rakeback",
      "Weekly Bonuses",
      "Bonus Growth",
    ],
  },
  {
    name: "PLATINUM I-III",
    wager: "$250k - 1M",
    benefits: [
      "Monthly Bonuses",
      "Level Up Bonuses",
      "Rakeback",
      "Weekly Bonuses",
      "Bonus Growth",
      "Daily Bonuses / Reload",
    ],
  },
];

export default function BlackClub() {
  return (
    <section className="w-full py-20 text-white flex flex-col items-center">

      {/* Title */}
      <h2 className="text-5xl font-semibold tracking-tight text-center mb-4 text-white">
        Exclusive Benefits For Large-Scale Traders – DTX Black Club
      </h2>

      <p className="text-center text-gray-300 max-w-2xl mb-16">
        Join the elite trading ranks with exclusive benefits, prioritized feature rollout,
        and active profit shares from DTX Exchange.
      </p>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full max-w-7xl px-6">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="dtx-glass p-8 rounded-2xl w-full transition-all duration-300"
          >
            {/* Title */}
            <p className="text-sm font-semibold text-gray-300 mb-2">{tier.name}</p>

            <p className="text-xl font-bold text-[#57f500] mb-6">
              Wager amount<br />{tier.wager}
            </p>

            <ul className="space-y-4">
              {tier.benefits.map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">

                  {/* Pointer ✓ */}
                  <span className="pointer-base pointer-green">✓</span>

                  {/* Text */}
                  <p className="text-gray-300 text-sm">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
