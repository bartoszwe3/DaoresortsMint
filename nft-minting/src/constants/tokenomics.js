// Model dwuetapowy (Legacy)
export const RESERVATION_FEE = 2000;        // kaucja rezerwacyjna PLN
export const MEMBERSHIP_REMAINING = 23900;  // dopłata po PNB PLN

// Model 8-etapowy
export const STAGE_0_RESERVATION = 2000;
export const STAGE_1_INFRASTRUCTURE = 3000;
export const STAGE_2_FOUNDATION = 3000;
export const STAGE_3_STRUCTURE = 3000;
export const STAGE_4_STRUCTURE_CLOSED = 3000;
export const STAGE_5_DEVELOPER_STATE = 3000;
export const STAGE_6_FINISHING = 6000;
export const STAGE_7_OPENING = 2000;

export const PAYMENT_STAGES = [
    { id: 0, amount: STAGE_0_RESERVATION, label_pl: "Etap 0 — Rezerwacja", desc_pl: "Rezerwacja/Fundamenty", char_pl: "Zwrotna (wpisowe)" },
    { id: 1, amount: STAGE_1_INFRASTRUCTURE, label_pl: "Etap 1 — Infrastruktura", desc_pl: "przyłącza, drogi", char_pl: "Postęp budowy" },
    { id: 2, amount: STAGE_2_FOUNDATION, label_pl: "Etap 2 — Fundament", desc_pl: "wylewka", char_pl: "Postęp budowy" },
    { id: 3, amount: STAGE_3_STRUCTURE, label_pl: "Etap 3 — Stan surowy", desc_pl: "konstrukcja", char_pl: "Postęp budowy" },
    { id: 4, amount: STAGE_4_STRUCTURE_CLOSED, label_pl: "Etap 4 — Stan surowy zamknięty", desc_pl: "okna, dach", char_pl: "Postęp budowy" },
    { id: 5, amount: STAGE_5_DEVELOPER_STATE, label_pl: "Etap 5 — Stan deweloperski", desc_pl: "elewacja, instalacje", char_pl: "Postęp budowy" },
    { id: 6, amount: STAGE_6_FINISHING, label_pl: "Etap 6 — Wykończenie", desc_pl: "wnętrza, wyposażenie", char_pl: "Postęp budowy" },
    { id: 7, amount: STAGE_7_OPENING, label_pl: "Etap 7 — Otwarcie", desc_pl: "resort gotowy", char_pl: "Finalizacja" }
];

export const MEMBERSHIP_TOTAL = 27000;      // łączna cena PLN

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
