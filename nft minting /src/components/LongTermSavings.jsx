// src/components/LongTermSavings.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowRight, Calculator, TrendingUp } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

export default function LongTermSavings({ onConnect, hasNft, onNavigate }) {
    const { t } = useTranslation();
    const [dailyRate, setDailyRate] = useState(600);
    const [years, setYears] = useState(10);
    const [chartData, setChartData] = useState([]);

    const DAYS_PER_YEAR = 14;
    const NFT_PRICE = 18900;
    const MANAGEMENT_FEE_PERCENT = 0.20; // 20% covers media + 15% management fee
    const INFLATION_RATE = 0.05; // 5% annual inflation

    // Calculation Logic for CURRENT year (for display)
    const annualHotelCost = dailyRate * DAYS_PER_YEAR;
    const annualDaoCost = annualHotelCost * MANAGEMENT_FEE_PERCENT;
    const annualSavings = annualHotelCost - annualDaoCost;
    const roiSeasons = (NFT_PRICE / annualSavings).toFixed(1);

    // Update Chart Data with Inflation
    useEffect(() => {
        const data = [];
        let cumulativeHotel = 0;
        let cumulativeDao = NFT_PRICE; // Star with NFT cost
        let currentDailyRate = dailyRate;

        // Calculate total savings over the full period for display
        // We need to sum up inflation-adjusted savings

        for (let i = 1; i <= years; i++) {
            // Apply inflation for this year
            const yearHotelCost = currentDailyRate * DAYS_PER_YEAR;
            const yearDaoCost = yearHotelCost * MANAGEMENT_FEE_PERCENT;

            cumulativeHotel += yearHotelCost;
            cumulativeDao += yearDaoCost;

            data.push({
                year: `${t("calculator_chart_year")} ${i}`,
                Hotel: Math.round(cumulativeHotel),
                DAO: Math.round(cumulativeDao),
                Savings: Math.round(cumulativeHotel - cumulativeDao)
            });

            // Increase rate for next year
            currentDailyRate = currentDailyRate * (1 + INFLATION_RATE);
        }
        setChartData(data);
    }, [dailyRate, years, t]);


    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117]/80 backdrop-blur-xl">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 p-6 md:p-10">

                    {/* LEFT COLUMN: Inputs & Results */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                                <Calculator className="text-neon-cyan" /> {t("calculator_title")}
                            </h2>
                            <p className="text-gray-400">{t("calculator_subtitle")}</p>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-8">
                            {/* Daily Rate Slider */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-white font-medium">{t("calculator_daily_rate")}</label>
                                    <span className="text-neon-cyan font-bold text-xl">{dailyRate} PLN</span>
                                </div>
                                <input
                                    type="range"
                                    min="300"
                                    max="2500"
                                    step="50"
                                    value={dailyRate}
                                    onChange={(e) => setDailyRate(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>300 PLN</span>
                                    <span>2500 PLN</span>
                                </div>
                            </div>

                            {/* Years Slider */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-white font-medium">{t("calculator_years")}</label>
                                    <span className="text-neon-purple font-bold text-xl">{years} {t("calculator_chart_year").toLowerCase().startsWith("r") ? "lat" : "years"}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    step="1"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>1 {t("calculator_chart_year")}</span>
                                    <span>30 {t("calculator_chart_year").toLowerCase().startsWith("r") ? "lat" : "years"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-white/5 to-white/0 p-4 rounded-xl border border-white/10">
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t("calculator_roi")}</div>
                                <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                                    {roiSeasons} <span className="text-sm font-normal text-gray-400">{t("calculator_roi_unit")}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-white/5 to-white/0 p-4 rounded-xl border border-white/10">
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t("calculator_annual_savings")}</div>
                                <div className="text-2xl font-bold text-neon-cyan">
                                    {annualSavings.toLocaleString()} PLN
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => {
                                    if (hasNft && onNavigate) {
                                        onNavigate("projects");
                                    } else if (onNavigate) {
                                        onNavigate("mint");
                                    } else {
                                        onConnect();
                                    }
                                }}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-cyan via-purple-500 to-neon-purple text-white font-bold text-lg shadow-lg shadow-neon-cyan/20 hover:shadow-neon-cyan/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                {hasNft ? "Zobacz nasz projekt!" : t("calculator_get_passport")} <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visualization */}
                    <div className="relative bg-black/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/5">
                        {/* Header Result */}
                        <div className="mb-8 text-center">
                            <p className="text-gray-400 mb-2 font-medium">
                                {t("calculator_total_savings_p1")} {years} {t("calculator_total_savings_p2")}
                                <span className="block text-xs text-gray-500">{t("calculator_inflation_note")}</span>
                            </p>
                            <motion.div
                                key={chartData.length > 0 ? chartData[chartData.length - 1].Savings : 0}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple"
                            >
                                {(chartData.length > 0 ? chartData[chartData.length - 1].Savings : 0).toLocaleString()} PLN
                            </motion.div>
                            <p className="text-sm text-green-400 mt-2 flex items-center justify-center gap-1">
                                <TrendingUp size={14} /> {t("calculator_investment_return")} {roiSeasons} {t("calculator_roi_unit")}
                            </p>
                        </div>

                        {/* Chart */}
                        <div className="h-[300px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <XAxis
                                        dataKey="year"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={years > 15 ? 4 : years > 8 ? 2 : 0}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        formatter={(value) => `${value.toLocaleString()} PLN`}
                                    />
                                    <Bar dataKey="Hotel" stackId="a" fill="#374151" name={t("calculator_chart_hotel")} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="DAO" stackId="b" fill="url(#colorDao)" name={t("calculator_chart_dao")} radius={[4, 4, 0, 0]} >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#A020F0' : '#89CFF0'} />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="colorDao" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#A020F0" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#89CFF0" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex justify-center gap-6 mt-6 text-xs text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-700 rounded-sm"></div> {t("calculator_chart_hotel")}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-sm"></div> {t("calculator_chart_dao_invest")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
