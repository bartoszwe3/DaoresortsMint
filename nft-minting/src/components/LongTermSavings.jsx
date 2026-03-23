// src/components/LongTermSavings.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ComposedChart, Bar, Line, XAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { ArrowRight, Calculator, TrendingUp, Users, Coffee, Check, X, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MEMBERSHIP_TOTAL, MANAGEMENT_FEE_PERCENT, BASE_OPERATIONAL_COST } from "../constants/tokenomics";

export default function LongTermSavings({ onConnect, hasNft, onNavigate }) {
    const { t } = useTranslation();
    const [dailyRate, setDailyRate] = useState(800);
    const [purchasePrice, setPurchasePrice] = useState(500000);
    const [years, setYears] = useState(10);
    const [peopleCount, setPeopleCount] = useState(6);
    const [chartData, setChartData] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const DAYS_PER_YEAR = 14;
    const HOUSING_INFLATION = 0.05;
    const DAO_HOUSING_INFLATION = 0.02;
    const WEEKLY_DAO_COST = 667;
    const ANNUAL_FIXED_OWN = 7150;
    const WEEKLY_VAR_OWN_AVG = 280;
    const OWN_VAR_INFLATION = 0.05;

    // Calculation Logic
    useEffect(() => {
        const data = [];
        let cumulativeHotel = 0;
        let cumulativeDao = MEMBERSHIP_TOTAL;
        let cumulativeOwn = purchasePrice;

        let currentDailyRate = dailyRate;

        for (let i = 1; i <= years; i++) {
            // Hotel
            const yearHotel = currentDailyRate * DAYS_PER_YEAR;
            cumulativeHotel += yearHotel;

            // DAO
            const yearDao = WEEKLY_DAO_COST * 2 * Math.pow(1 + DAO_HOUSING_INFLATION, i - 1);
            cumulativeDao += yearDao;

            // Own Cottage
            const yearOwnFixed = ANNUAL_FIXED_OWN;
            const yearOwnVar = (WEEKLY_VAR_OWN_AVG * 2) * Math.pow(1 + OWN_VAR_INFLATION, i - 1);
            cumulativeOwn += (yearOwnFixed + yearOwnVar);

            data.push({
                year: `${t("calculator_chart_year")} ${i}`,
                Hotel: Math.round(cumulativeHotel),
                DAO: Math.round(cumulativeDao),
                Own: Math.round(cumulativeOwn),
                Savings: Math.round(cumulativeHotel - cumulativeDao),
                BreakfastSavings: 0
            });

            currentDailyRate *= (1 + HOUSING_INFLATION);
        }
        setChartData(data);
    }, [dailyRate, purchasePrice, years, peopleCount, t]);

    const totalSavings = chartData.length > 0 ? chartData[chartData.length - 1].Savings : 0;

    // First year metrics for the little boxes
    const firstYearHotelHousing = dailyRate * DAYS_PER_YEAR;
    const firstYearDaoHousing = BASE_OPERATIONAL_COST * (DAYS_PER_YEAR / 7) * (1 + MANAGEMENT_FEE_PERCENT);

    const firstYearSavings = firstYearHotelHousing - firstYearDaoHousing;
    const roiSeasons = (MEMBERSHIP_TOTAL / firstYearSavings).toFixed(1);

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
                            <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
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

                            {/* Purchase Price Slider (Own Cottage) */}
                            <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                                    <label className="text-white font-medium">Cena zakupu własnego domku</label>
                                    <span className="text-[#E74C3C] font-bold text-xl">{purchasePrice.toLocaleString()} PLN</span>
                                </div>
                                <input
                                    type="range"
                                    min="300000"
                                    max="500000"
                                    step="10000"
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#E74C3C]"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>300 000 PLN</span>
                                    <span>500 000 PLN</span>
                                </div>
                            </div>

                            {/* Years Slider */}
                            <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
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
                            <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
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
                    <div className="relative bg-black/40 rounded-3xl p-6 md:p-8 flex flex-col border border-white/5 min-h-[500px]">
                        {/* Header Result */}
                        <div className="mb-8 text-center text-left">
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

                            <p className="text-sm text-green-400 mt-4 flex items-center justify-center gap-1 font-medium">
                                <TrendingUp size={14} /> {t("calculator_investment_return")} {roiSeasons} {t("calculator_roi_unit")}
                            </p>
                        </div>

                        {/* Chart */}
                        <div className="h-[350px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <XAxis
                                        dataKey="year"
                                        stroke="#6b7280"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={isMobile ? Math.ceil(years / 5) : (years > 15 ? 4 : years > 8 ? 2 : 0)}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        formatter={(value, name) => [`${value.toLocaleString()} PLN`, name]}
                                        labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-xs text-gray-400 uppercase tracking-widest ml-1">{value}</span>}
                                    />
                                    <Bar dataKey="DAO" fill="#C9A84C" name="DAOResorts" radius={[4, 4, 0, 0]} barSize={isMobile ? 10 : 20} />
                                    <Bar dataKey="Hotel" fill="#2D5A3D" name="Hotel" radius={[4, 4, 0, 0]} barSize={isMobile ? 10 : 20} />
                                    <Bar dataKey="Own" fill="#E74C3C" name="Własny domek" radius={[4, 4, 0, 0]} barSize={isMobile ? 10 : 20} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* BREAKDOWN SECTION: "Skąd te liczby?" */}
            <div className="mt-16 space-y-8">
                <h3 className="text-2xl font-bold text-white text-center font-playfair uppercase tracking-widest">
                    Skąd te liczby?
                </h3>

                <div className="grid md:grid-cols-3 gap-6 text-left">
                    {/* CARD 1: DAOResorts */}
                    <div className="border border-[#C9A84C]/40 bg-[#1C2614] rounded-2xl p-6 shadow-xl flex flex-col">
                        <div className="mb-4">
                            <h4 className="text-[#C9A84C] font-bold text-xl uppercase tracking-tighter">DAOResorts</h4>
                            <p className="text-[#8A9E8A] text-sm">667 PLN / tydzień — wszystko wliczone</p>
                        </div>
                        <ul className="space-y-3 mb-6 flex-1">
                            {[
                                { text: "Energia elektryczna", price: "~208 PLN" },
                                { text: "Woda (4 osoby)", price: "~42 PLN" },
                                { text: "Jacuzzi prywatne (napełnienie, chemia)", price: "~131 PLN" },
                                { text: "Sprzątanie końcowe", price: "~175 PLN" },
                                { text: "Zarządzanie i serwis", price: "~111 PLN" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                    <Check size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                                    <span className="flex-1">{item.text}</span>
                                    <span className="text-gray-400 font-mono text-xs">{item.price}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-[#C9A84C]/30 pt-4">
                            <div className="text-[#C9A84C] font-bold text-2xl mb-1">667 PLN łącznie</div>
                            <p className="text-[#8A9E8A] text-[10px] leading-relaxed">
                                Płacisz tylko gdy przyjeżdżasz. Zero kosztów stałych.
                            </p>
                        </div>
                    </div>

                    {/* CARD 2: Hotel */}
                    <div className="border border-[#2D5A3D]/40 bg-[#1C2614] rounded-2xl p-6 shadow-xl flex flex-col">
                        <div className="mb-4">
                            <h4 className="text-green-500 font-bold text-xl uppercase tracking-tighter">Hotel premium</h4>
                            <p className="text-[#8A9E8A] text-sm">{dailyRate} PLN / dobę</p>
                        </div>
                        <ul className="space-y-3 mb-6 flex-1">
                            <li className="flex justify-between text-sm text-gray-300">
                                <span>Cena doby:</span>
                                <span>{dailyRate} PLN</span>
                            </li>
                            <li className="flex justify-between text-sm text-gray-300">
                                <span>Tydzień dla 4 osób:</span>
                                <span>{(dailyRate * 7).toLocaleString()} PLN</span>
                            </li>
                            <li className="text-xs text-gray-500 italic pt-2">
                                - Śniadania: często dodatkowe<br />
                                - Parking: 30-80 PLN/dobę<br />
                                - Brak prywatności<br />
                                - Inna cena każdego roku<br />
                                - Zero prawa głosu nad obiektem
                            </li>
                        </ul>
                        <div className="border-t border-[#2D5A3D]/30 pt-4">
                            <p className="text-[#8A9E8A] text-xs leading-relaxed">
                                Przez {years} lat z inflacją 5%:<br />
                                <span className="text-green-500 font-bold text-lg">
                                    {chartData.length > 0 ? chartData[chartData.length - 1].Hotel.toLocaleString() : "-"} PLN
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* CARD 3: Own Cottage */}
                    <div className="border border-[#E74C3C]/40 bg-[#1C2614] rounded-2xl p-6 shadow-xl flex flex-col">
                        <div className="mb-4">
                            <h4 className="text-[#E74C3C] font-bold text-xl uppercase tracking-tighter">Własny domek</h4>
                            <p className="text-[#8A9E8A] text-sm">Prawdziwy koszt posiadania</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-[#8A9E8A] text-[10px] uppercase font-bold mb-2">Płacisz zawsze — nawet gdy nie przyjeżdżasz:</p>
                            <ul className="space-y-1">
                                {[
                                    { t: "Podatek od nieruchom.", p: "~500 PLN" },
                                    { t: "Wywóz nieczystości", p: "~400 PLN" },
                                    { t: "Prąd — opłaty stałe", p: "~540 PLN" },
                                    { t: "Woda — abonament", p: "~180 PLN" },
                                    { t: "Ubezpieczenie", p: "~550 PLN" },
                                    { t: "Ogrzewanie dyżurne", p: "~1 600 PLN" },
                                    { t: "Remonty i utrzymanie", p: "~3 000 PLN" }
                                ].map((item, i) => (
                                    <li key={i} className="flex justify-between text-[11px] text-gray-400">
                                        <span className="flex items-center gap-1"><X size={10} className="text-[#E74C3C]" /> {item.t}</span>
                                        <span>{item.p}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-[#E74C3C]/30 mt-2 pt-1 text-[#E74C3C] font-bold text-xs uppercase text-right">
                                ~7 150 PLN/rok stałych kosztów
                            </div>
                        </div>

                        <div className="mt-auto">
                            <p className="text-[#8A9E8A] text-[10px] uppercase font-bold mb-1">Koszt tygodnia pobytu:</p>
                            <div className="text-xs text-gray-300 space-y-1">
                                <div className="flex justify-between"><span>Lato / Zima (średnia):</span> <span>~280 PLN</span></div>
                                <div className="border-t border-white/5 pt-1 flex justify-between font-bold text-[#E74C3C]">
                                    <span>+ zakup:</span>
                                    <span>~{purchasePrice.toLocaleString()} PLN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUMMARY BANNER */}
                <div className="bg-[#1C2614] border border-[#C9A84C]/40 rounded-2xl p-8 shadow-2xl relative overflow-hidden text-center">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <h4 className="font-playfair text-xl md:text-2xl text-[#F5F0E8] mb-6 leading-relaxed">
                            Własny domek kosztuje <span className="text-gold-500 font-bold">
                                {chartData.length > 0 ? (chartData[chartData.length - 1].Own / chartData[chartData.length - 1].DAO).toFixed(1) : "-"} razy
                            </span> więcej niż Członkostwo DAOResorts przez {years} lat.
                            <br />
                            <span className="text-sm text-gray-400 italic">I stoi pusty przez 50 tygodni w roku.</span>
                        </h4>

                        <button
                            onClick={() => (window.location.href = "/#register")}
                            className="bg-gold-500 text-[#0E1208] font-bold px-10 py-4 rounded-xl hover:bg-gold-400 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-gold-500/20"
                        >
                            Zarezerwuj miejsce — 2 000 PLN <ArrowRight size={20} />
                        </button>

                        <p className="text-[#8A9E8A] text-xs mt-4">
                            Zwrotne · Blokuje 1 z 150 miejsc
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
