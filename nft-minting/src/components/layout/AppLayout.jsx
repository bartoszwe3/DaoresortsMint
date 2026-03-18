import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopNavbar from "../TopNavbar";
import Footer from "../Footer";
import { useUserStatus } from "../../hooks/useUserStatus";
import { useAppKit } from "@reown/appkit/react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AppLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { open } = useAppKit();
    const { logout } = useAuth();

    const {
        address,
        isAuthenticated,
        isRegistered,
        isAdmin,
        isState3Member
    } = useUserStatus();

    // Map current path to a 'selected' state for the navbar highlight
    const [selected, setSelected] = useState("home");

    useEffect(() => {
        const path = location.pathname;
        if (path === "/") setSelected("home");
        else if (path === "/founder") setSelected("founder");
        else if (path === "/mint") setSelected("mint");
        else if (path === "/voting") setSelected("voting");
        else if (path === "/projects") setSelected("projects");
        else if (path === "/team") setSelected("team");
        // ... add more as needed
    }, [location]);

    const handleNavigate = (id) => {
        setSelected(id);
        if (id === "home") navigate("/");
        else if (id === "mynfts") navigate("/my-collection");
        else if (id === "checkout/reserve") navigate("/checkout/reserve");
        else if (["founder", "mint", "voting", "projects", "team", "faq"].includes(id)) {
            // Check if it's a direct route or a section on home
            if (id === "founder") navigate("/founder");
            else if (id === "mint") navigate("/mint");
            else if (id === "voting") navigate("/voting");
            else if (id === "projects") navigate("/projects");
            else if (id === "team") navigate("/team");
            else if (id === "faq") navigate("/#faq");
            else navigate("/");
        } else {
            navigate("/");
        }
    };

    const handleConnect = () => {
        if (!isAuthenticated) {
            navigate("/?tab=register");
        } else {
            logout();
            toast.success("Wylogowano");
        }
    };

    // Simplified handleConnect for the layout level
    const onConnect = () => {
        if (!isAuthenticated) {
            navigate("/?tab=register");
        } else {
            // This is actually handled inside handleConnect if we pass it, 
            // but TopNavbar handles its own clicks too.
        }
    };

    return (
        <div className="min-h-screen bg-[#0E1208] text-white flex flex-col">
            <TopNavbar
                onNavigate={handleNavigate}
                activeTab={selected}
                isRegistered={isRegistered}
                address={address}
                isState3Member={isState3Member}
                isAdmin={isAdmin}
                onConnect={onConnect}
            />

            <main className="flex-1 pt-[72px]">
                {children}
            </main>

            <Footer />
        </div>
    );
}
