import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export function useUserStatus() {
    const { user, isAuthenticated } = useAuth();
    const address = user?.address || user?.publicAddress;
    const [isRegistered, setIsRegistered] = useState(false);
    const [userRecord, setUserRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const OWNER_ADDRESS = (process.env.REACT_APP_OWNER_ADDRESS || "").toLowerCase();

    useEffect(() => {
        const checkReg = async () => {
            if (!isAuthenticated || !address) {
                setIsRegistered(false);
                setUserRecord(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const API_BASE = process.env.REACT_APP_API_BASE ?? "";
                const res = await fetch(`${API_BASE}/api/status/${address}`);
                if (res.ok) {
                    const data = await res.json();
                    setIsRegistered(data.registered || false);
                    setUserRecord(data);
                } else {
                    setIsRegistered(false);
                    setUserRecord(null);
                }
            } catch (err) {
                console.error("User status check error:", err);
                setIsRegistered(false);
                setUserRecord(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkReg();
    }, [isAuthenticated, address]);

    const isAdmin = useMemo(() => {
        if (!isAuthenticated || !address || !OWNER_ADDRESS) return false;
        return address.toLowerCase() === OWNER_ADDRESS;
    }, [isAuthenticated, address, OWNER_ADDRESS]);

    const isState3Member = !!userRecord?.membershipTokenId || isAdmin;
    const isReserved = userRecord?.status === 'reserved';
    const isPendingPayment = userRecord?.status === 'pending_payment';
    const pnbObtained = userRecord?.pnbObtained || false;

    return {
        user,
        address,
        isAuthenticated,
        isRegistered,
        userRecord,
        isAdmin,
        isState3Member,
        isReserved,
        isPendingPayment,
        pnbObtained,
        isLoading
    };
}
