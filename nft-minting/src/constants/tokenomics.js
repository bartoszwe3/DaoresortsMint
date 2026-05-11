// Model dwuetapowy (Legacy)
export const RESERVATION_FEE = 2000;        // kaucja rezerwacyjna PLN
export const MEMBERSHIP_REMAINING = 23900;  // dopłata po PNB PLN

// Model 4-etapowy
export const STAGE_0_RESERVATION = 2000;
export const STAGE_1_STRUCTURE_CLOSED = 12000;
export const STAGE_2_DEVELOPER_STATE = 8900;
export const STAGE_3_ACTIVATION = 3000;

export const PAYMENT_STAGES = [
    { id: 0, amount: STAGE_0_RESERVATION, label_pl: "Etap 0 — Rezerwacja", desc_pl: "Teraz", char_pl: "Zwrotna (wpisowe)" },
    { id: 1, amount: STAGE_1_STRUCTURE_CLOSED, label_pl: "Etap 1 — Stan surowy zamknięty", desc_pl: "Po wylaniu fundamentów", char_pl: "Uruchomienie budowy" },
    { id: 2, amount: STAGE_2_DEVELOPER_STATE, label_pl: "Etap 2 — Stan deweloperski", desc_pl: "Po stanie surowym zamkniętym", char_pl: "Postęp prac" },
    { id: 3, amount: STAGE_3_ACTIVATION, label_pl: "Etap 3 — Aktywacja członkostwa", desc_pl: "Po otwarciu resortu", char_pl: "Finalizacja" }
];

export const MEMBERSHIP_TOTAL = 25900;      // łączna cena PLN

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
