import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppKit } from '@reown/appkit/react'; // From AppKit if that's what is being used, or use Web3Modal
import { useAccount } from 'wagmi';
import { X, Mail, Wallet } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { loginWithMagic } = useAuth();

    // AppKit / Web3Modal hooks for wallet connection
    const { open } = useAppKit();

    if (!isOpen) return null;

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError('');

        try {
            await loginWithMagic(email);
            onClose(); // Close modal on successful login
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to login with expected email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWalletConnect = async () => {
        try {
            await open();
            onClose(); // Modal will close, AppKit will open
        } catch (err) {
            console.error(err);
            setError('Failed to open wallet connection modal.');
        }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="modal-title">Sign In</h2>
                <p className="modal-subtitle">Choose how you want to connect</p>

                <div className="login-options-container">

                    {/* Email Login Section */}
                    <div className="login-section">
                        <form onSubmit={handleEmailLogin} className="email-login-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    className="email-input"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`login-btn email-btn ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading || !email}
                            >
                                <Mail size={20} className="btn-icon" />
                                {isLoading ? 'Sending Link...' : 'Continue with Email'}
                            </button>
                        </form>
                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    {/* Wallet Login Section */}
                    <div className="login-section">
                        <button
                            onClick={handleWalletConnect}
                            className="login-btn wallet-btn"
                            type="button"
                        >
                            <Wallet size={20} className="btn-icon" />
                            Connect Wallet
                        </button>
                    </div>

                </div>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default LoginModal;
