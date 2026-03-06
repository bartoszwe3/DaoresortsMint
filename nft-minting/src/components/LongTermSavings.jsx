// src/components/LongTermSavings.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowRight, Calculator, TrendingUp, Users, Coffee } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LongTermSavings({ onConnect, hasNft, onNavigate }) {
    const { t } = useTranslation();
    const [dailyRate, setDailyRate] = useState(800);
    const [years, setYears] = useState(10);
    const [peopleCount, setPeopleCount] = useState(6);
    const [includeBreakfast, setIncludeBreakfast] = useState(true);
    const [breakfastType, setBreakfastType] = useState('dao'); // 'self', 'dao', 'hotel'
    const [chartData, setChartData] = useState([]);

    const DAYS_PER_YEAR = 14;
    const NFT_PRICE = 18900;
    const MANAGEMENT_FEE_PERCENT = 0.20;
    const HOUSING_INFLATION = 0.03;
    const HOTEL_BREAKFAST_RATE = 70;
    const DAO_BREAKFAST_RATE = 12.53;
    const SELF_BREAKFAST_RATE = 5;
    const HOTEL_BREAKFAST_INFLATION = 0.05;
    const DAO_BREAKFAST_INFLATION = 0.02;

    // Calculation Logic
    useEffect(() => {
        const data = [];
        let cumulativeHotelHousing = 0;
        let cumulativeHotelBreakfast = 0;
        let cumulativeDaoHousing = NFT_PRICE;
        let cumulativeDaoBreakfast = 0;

        let currentDailyRate = dailyRate;

        for (let i = 1; i <= years; i++) {
            // Housing
            const yearHotelHousing = currentDailyRate * DAYS_PER_YEAR;
            const yearDaoHousing = yearHotelHousing * MANAGEMENT_FEE_PERCENT;
            cumulativeHotelHousing += yearHotelHousing;
            cumulativeDaoHousing += yearDaoHousing;

            // Breakfast
            if (includeBreakfast) {
                // Hotel baseline is always 70 PLN with 5% inflation
                const yearHotelBF = HOTEL_BREAKFAST_RATE * peopleCount * DAYS_PER_YEAR * Math.pow(1 + HOTEL_BREAKFAST_INFLATION, i - 1);

                // DAO cost depends on type
                const bfRate = breakfastType === 'dao' ? DAO_BREAKFAST_RATE : (breakfastType === 'self' ? SELF_BREAKFAST_RATE : HOTEL_BREAKFAST_RATE);
                const bfInflation = breakfastType === 'dao' ? DAO_BREAKFAST_INFLATION : (breakfastType === 'hotel' ? HOTEL_BREAKFAST_INFLATION : 0);
                const yearDaoBF = bfRate * peopleCount * DAYS_PER_YEAR * Math.pow(1 + bfInflation, i - 1);

                cumulativeHotelBreakfast += yearHotelBF;
                cumulativeDaoBreakfast += yearDaoBF;
            }

            data.push({
                year: `${t("calculator_chart_year")} ${i}`,
                Hotel: Math.round(cumulativeHotelHousing + cumulativeHotelBreakfast),
                DAO: Math.round(cumulativeDaoHousing + cumulativeDaoBreakfast),
                Savings: Math.round((cumulativeHotelHousing + cumulativeHotelBreakfast) - (cumulativeDaoHousing + cumulativeDaoBreakfast)),
                BreakfastSavings: includeBreakfast ? Math.round(cumulativeHotelBreakfast - cumulativeDaoBreakfast) : 0
            });

            currentDailyRate *= (1 + HOUSING_INFLATION);
        }
        setChartData(data);
    }, [dailyRate, years, peopleCount, includeBreakfast, breakfastType, t]);

    const totalSavings = chartData.length > 0 ? chartData[chartData.length - 1].Savings : 0;
    const bfSavings = chartData.length > 0 ? chartData[chartData.length - 1].BreakfastSavings : 0;

    // First year metrics for the little boxes
    const firstYearHotelHousing = dailyRate * DAYS_PER_YEAR;
    const firstYearDaoHousing = firstYearHotelHousing * MANAGEMENT_FEE_PERCENT;
    const firstYearHotelBF = includeBreakfast ? HOTEL_BREAKFAST_RATE * peopleCount * DAYS_PER_YEAR : 0;
    const bfRate = breakfastType === 'dao' ? DAO_BREAKFAST_RATE : (breakfastType === 'self' ? SELF_BREAKFAST_RATE : HOTEL_BREAKFAST_RATE);
    const firstYearDaoBF = includeBreakfast ? bfRate * peopleCount * DAYS_PER_YEAR : 0;

    const firstYearSavings = (firstYearHotelHousing + firstYearHotelBF) - (firstYearDaoHousing + firstYearDaoBF);
    const roiSeasons = (NFT_PRICE / firstYearSavings).toFixed(1);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117]/80 backdrop-blur-xl">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 p-6 md:p-10">

                    {/* LEFT COLUMN: Inputs & Results */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                                <Calculator className="text-gold-500" /> {t("calculator_title")}
                            </h2>
                            <p className="text-gray-400">{t("calculator_subtitle")}</p>
                        </div>

                        {/* Sliders Area */}
                        <div className="space-y-6">
                            {/* Daily Rate Slider */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-white font-medium">{t("calculator_daily_rate")}</label>
                                    <span className="text-gold-500 font-bold text-xl">{dailyRate} PLN</span>
                                </div>
                                <input
                                    type="range"
                                    min="600"
                                    max="2500"
                                    step="50"
                                    value={dailyRate}
                                    onChange={(e) => setDailyRate(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>600 PLN</span>
                                    <span>2500 PLN</span>
                                </div>
                            </div>

                            {/* Years Slider */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-white font-medium">{t("calculator_years")}</label>
                                    <span className="text-gold-500 font-bold text-xl">{years} {t("calculator_chart_year").toLowerCase().startsWith("r") ? "lat" : "years"}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    step="1"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>1 {t("calculator_chart_year")}</span>
                                    <span>30 {t("calculator_chart_year").toLowerCase().startsWith("r") ? "lat" : "years"}</span>
                                </div>
                            </div>

                            {/* People Count Slider */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-white font-medium flex items-center gap-2">
                                        <Users size={18} className="text-gold-500/70" /> {t("calculator_people_count")}
                                    </label>
                                    <span className="text-gold-500 font-bold text-xl">{peopleCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min="4"
                                    max="6"
                                    step="1"
                                    value={peopleCount}
                                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>4</span>
                                    <span>6</span>
                                </div>
                            </div>

                            {/* Breakfast Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer" onClick={() => setIncludeBreakfast(!includeBreakfast)}>
                                    <label className="text-white font-medium flex items-center gap-2 cursor-pointer">
                                        <Coffee size={18} className="text-gold-500/70" /> {t("calculator_breakfast_toggle")}
                                    </label>
                                    <div className={`w-12 h-6 rounded-full transition-all relative ${includeBreakfast ? 'bg-gold-500' : 'bg-gray-700'}`}>
                                        <motion.div
                                            animate={{ x: includeBreakfast ? 24 : 4 }}
                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </div>
                                </div>

                                {includeBreakfast && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        {/* Komfort Premium Card */}
                                        <div className="bg-[#1C2614] border border-gold-500/25 p-5 rounded-xl flex gap-4 items-start shadow-xl">
                                            <div className="bg-gold-500/10 p-2 rounded-lg shrink-0">
                                                <Coffee size={20} className="text-gold-500" />
                                            </div>
                                            <p className="text-sm text-gold-500/90 leading-relaxed italic">
                                                {t("calculator_breakfast_card_text")}
                                            </p>
                                        </div>

                                        {/* Breakfast Comparison Columns */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'self', label: t("calculator_breakfast_self"), price: '5 PLN' },
                                                { id: 'dao', label: t("calculator_breakfast_dao"), price: '12,53 PLN' },
                                                { id: 'hotel', label: t("calculator_breakfast_hotel"), price: '70 PLN' }
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setBreakfastType(opt.id)}
                                                    className={`p-3 rounded-lg border text-center transition-all ${breakfastType === opt.id
                                                        ? 'bg-gold-500/10 border-gold-500 text-gold-500 shadow-lg shadow-gold-500/5'
                                                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="text-[10px] uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{opt.label}</div>
                                                    <div className="text-xs font-bold">{opt.price}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
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
                                <div className="text-2xl font-bold text-gold-500">
                                    {Math.round(firstYearSavings).toLocaleString()} PLN
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
                                className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold text-lg shadow-btn-primary hover:shadow-btn-primary-hover hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                {hasNft ? "Zobacz nasz projekt!" : t("calculator_get_passport")} <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visualization */}
                    <div className="relative bg-black/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/5 min-h-[500px]">
                        {/* Header Result */}
                        <div className="mb-8 text-center">
                            <p className="text-gray-400 mb-2 font-medium">
                                {t("calculator_total_savings_p1")} {years} {t("calculator_total_savings_p2")}
                                <span className="block text-xs text-gray-500">{t("calculator_inflation_note")}</span>
                            </p>
                            <motion.div
                                key={totalSavings}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-300"
                            >
                                {totalSavings.toLocaleString()} PLN
                            </motion.div>

                            {includeBreakfast && (
                                <p className="text-[#8A9E8A] font-sans text-sm mt-2 font-medium italic">
                                    {t("calculator_breakfast_savings")}: {Math.round(bfSavings).toLocaleString()} PLN
                                </p>
                            )}

                            <p className="text-sm text-green-400 mt-4 flex items-center justify-center gap-1 font-medium">
                                <TrendingUp size={14} /> {t("calculator_investment_return")} {roiSeasons} {t("calculator_roi_unit")}
                            </p>
                        </div>

                        {/* Chart */}
                        <div className="h-[300px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                                            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#C9A84C' : '#4A6741'} />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="colorDao" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4A6741" stopOpacity={0.8} />
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
                                <div className="w-3 h-3 bg-gradient-to-r from-gold-500 to-forest-600 rounded-sm"></div> {t("calculator_chart_dao_invest")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
