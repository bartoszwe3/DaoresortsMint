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

            setUser({
                type: 'magic',
                email: magicUser.email,
                publicAddress: publicAddress,
            });
        } else {
            setUser(null);
        }
    }, [isConnected, address, magicUser]);

    const loginWithMagic = async (email) => {
        try {
            if (!magic) throw new Error('Magic SDK not initialized');
            // If a wallet is connected, disconnect it first to keep auth simple
            if (isConnected) {
                disconnectWallet();
            }

            const didToken = await magic.auth.loginWithMagicLink({ email });
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
        loginWithMagic,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
