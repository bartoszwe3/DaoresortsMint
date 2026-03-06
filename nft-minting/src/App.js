// src/App.jsx
import React, { useEffect, useState } from "react";
import RoutesFile from "./RoutesFile";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { polygon } from "@reown/appkit/networks";
import MouseGlow from "./components/MouseGlow";

// ------------------ APPKIT CONFIG ------------------
const projectId = "0a73e16ce970156d6e7411b10a4c5324";

const metadata = {
  name: "DAOResorts Club",
  description: "DAOResorts Membership & Passport",
  url: "https://daoresorts.club",
  icons: ["https://daoresorts.club/logo.png"],
};

// Define Localhost
const localhost = {
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

export const config = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [polygon],
  metadata,
  projectId,
  enableNetworkSwitch: true,
  features: {
    analytics: true,
    email: false, // Handle email via Magic Link SDK UI instead of AppKit default
    socials: false, // Disable Google, X, etc. as requested
    send: false,
  },
});

// ------------------ APP COMPONENT ------------------
function App() {
  const [toastPosition, setToastPosition] = useState("bottom-right");

  // Detect screen size and adjust toast position
  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setToastPosition("top-center"); // Mobile: center top
      } else {
        setToastPosition("bottom-right"); // Desktop: right corner
      }
    };

    updatePosition(); // run once
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <>
      <MouseGlow />
      <RoutesFile />
      {/* 🟢 Responsive Toast System */}
      <Toaster
        position={toastPosition}
        reverseOrder={false}
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
          pointerEvents: 'none',
        }}
        toastOptions={{
          style: {
            background: "#0E1208", // dark forest
            color: "#F5F0E8", // cream
            borderRadius: "12px",
            padding: "12px 18px",
            border: "1px solid rgba(201, 168, 76, 0.15)",
            fontSize: "0.9rem",
            fontWeight: 500,
            pointerEvents: 'auto',
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#111827" }, // Green success
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#111827" }, // Red error
          },
        }}
      />
    </>
  );
}

export default App;
