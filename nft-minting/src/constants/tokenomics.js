// Model dwuetapowy (Legacy)
export const RESERVATION_FEE = 2000;        // kaucja rezerwacyjna PLN
export const MEMBERSHIP_REMAINING = 17990;  // dopłata po PNB PLN

// Model 5-etapowy
export const STAGE_0_RESERVATION = 2000;
export const STAGE_1_FOUNDATION = 5000;
export const STAGE_2_STRUCTURE = 5000;
export const STAGE_3_FINISHING = 3000;
export const STAGE_4_ACTIVATION = 4990;

export const PAYMENT_STAGES = [
    { id: 0, amount: STAGE_0_RESERVATION, label_pl: "Rezerwacja", desc_pl: "Wpisowe rezerwacyjne (zwrotne)" },
    { id: 1, amount: STAGE_1_FOUNDATION, label_pl: "Fundamenty", desc_pl: "Po uzyskaniu PNB" },
    { id: 2, amount: STAGE_2_STRUCTURE, label_pl: "Konstrukcja", desc_pl: "Stan surowy otwarty" },
    { id: 3, amount: STAGE_3_FINISHING, label_pl: "Wykończenie", desc_pl: "Instalacje i stolarka" },
    { id: 4, amount: STAGE_4_ACTIVATION, label_pl: "Aktywacja", desc_pl: "Odbiór i aktywacja NFT" }
];

export const MEMBERSHIP_TOTAL = 19990;      // łączna cena PLN

// Supply
export const TOTAL_PASSPORT_SUPPLY = 5000;
export const TOTAL_MEMBERSHIP_SUPPLY = 150;

// Operacyjne
export const MANAGEMENT_FEE_PERCENT = 0.20;
export const BASE_OPERATIONAL_COST = 577;
export const ANNUAL_STAYS = 2;
export const NIGHTS_PER_YEAR = 14;

// Warunki rezerwacji
export const RESERVATION_VALID_DAYS = 14;   // dni na rezygnację
export const PAYMENT_DEADLINE_DAYS = 30;    // dni na dopłatę po PNB
export const ROYALTY_FEE_PERCENT = 0.10;    // 10% przy wtórnej sprzedaży
