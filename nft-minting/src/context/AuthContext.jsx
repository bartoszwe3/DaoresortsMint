import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { magic } from '../config/magic';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAppKitAccount();
    const { disconnect: disconnectWallet } = useDisconnect();

    const [user, setUser] = useState(null);
    const [magicUser, setMagicUser] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initMagicAuth = async () => {
            try {
                if (magic) {
                    const isLoggedIn = await magic.user.isLoggedIn();
                    if (isLoggedIn) {
                        const userData = await magic.user.getInfo();
                        console.log("MAGIC USER DATA (INIT):", userData);
                        setMagicUser(userData);
                    }
                }
            } catch (error) {
                console.error('Failed to initialize Magic auth:', error);
            } finally {
                setIsInitializing(false);
            }
        };

        initMagicAuth();
    }, []);

    useEffect(() => {
        const handleUserSet = async () => {
            if (isConnected && address) {
                setUser({
                    type: 'wallet',
                    address,
                });
            } else if (magicUser) {
                // Support Magic v33+ metadata structure where address is under wallets array or object
                let publicAddress = null;
                if (magicUser.wallets) {
                    if (Array.isArray(magicUser.wallets) && magicUser.wallets.length > 0) {
                        const ethWallet = magicUser.wallets.find(w => w.network === 'ethereum' || w.walletType === 'ethereum' || w.publicAddress);
                        publicAddress = ethWallet ? ethWallet.publicAddress : magicUser.wallets[0].publicAddress;
                    } else if (!Array.isArray(magicUser.wallets) && typeof magicUser.wallets === 'object') {
                        // It's an object, e.g., { ethereum: { publicAddress: "0x..." } }
                        if (magicUser.wallets.ethereum) {
                            publicAddress = magicUser.wallets.ethereum.publicAddress;
                        } else {
                            // fallback to the first key
                            const keys = Object.keys(magicUser.wallets);
                            if (keys.length > 0) {
                                publicAddress = magicUser.wallets[keys[0]].publicAddress;
                            }
                        }
                    }
                }

                // Fallback for older Magic SDK structure
                if (!publicAddress) {
                    publicAddress = magicUser.publicAddress;
                }

                const email = magicUser.email;

                if (email && publicAddress) {
                    try {
                        const API_BASE = process.env.REACT_APP_API_BASE ?? "";
                        await fetch(`${API_BASE}/api/link-wallet`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, wallet: publicAddress })
                        });
                    } catch (error) {
                        console.error('Failed to link wallet to email backend:', error);
                    }
                }

                setUser({
                    type: 'magic',
                    email: email,
                    publicAddress: publicAddress,
                });
            } else {
                setUser(null);
            }
        };

        handleUserSet();
    }, [isConnected, address, magicUser]);

    const loginWithMagic = async (email, onEmailSent) => {
        try {
            // DEVELOPER MOCK FOR LOCALHOST TO BYPASS 400 ERRORS (Disabled to test OTP)
            /*
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn("🔐 MAGIC LINK MOCK MODE ACTIVATED 🔐");
                if (isConnected) disconnectWallet();
                if (onEmailSent) onEmailSent();

                await new Promise(r => setTimeout(r, 1500));

                const mockUserData = {
                    email: email,
                    publicAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
                    isMfaEnabled: false
                };

                console.log("MAGIC USER DATA (MOCKED):", mockUserData);
                setMagicUser(mockUserData);
                return;
            }
            */

            if (!magic) throw new Error('Magic SDK not initialized');
            // If a wallet is connected, disconnect it first to keep auth simple
            if (isConnected) {
                disconnectWallet();
            }

            const loginPromise = magic.auth.loginWithEmailOTP({ email, showUI: true });

            if (onEmailSent) {
                // Email-sent event is similar, let's just trigger it natively to switch our own UI to waiting state
                // Some SDK versions fire 'email-sent' on OTP as well, but we can call it manually to be safe.
                onEmailSent();
            }

            const didToken = await loginPromise;
            if (didToken) {
                const userData = await magic.user.getInfo();
                console.log("MAGIC USER DATA (LOGIN):", userData);
                setMagicUser(userData);
            }
        } catch (error) {
            console.error('Magic link login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (user?.type === 'magic' && magic) {
                await magic.user.logout();
                setMagicUser(null);
            } else if (user?.type === 'wallet') {
                disconnectWallet();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isInitializing,
        loginWithEmailOTP: loginWithMagic,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
