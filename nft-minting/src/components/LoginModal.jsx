import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppKit } from '@reown/appkit/react'; // From AppKit if that's what is being used, or use Web3Modal
import { useAccount } from 'wagmi';
import { X, Mail, Wallet } from 'lucide-react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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
        setIsSuccess(false);

        try {
            await loginWithMagic(email, () => setIsSuccess(true));
            // After loginWithMagic resolves, the user is authed and magicUser in context updates
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Błąd logowania. Spróbuj ponownie.');
            setIsSuccess(false);
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
            setError('Nie udało się otworzyć portfela.');
        }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="modal-title font-playfair">Zaloguj się</h2>
                <p className="modal-subtitle font-sans">Wybierz sposób połączenia</p>

                <div className="login-options-container">

                    {/* Wallet Login Section (Priority as per prompt qr/brave/metamask handled by AppKit) */}
                    <div className="login-section">
                        <button
                            onClick={handleWalletConnect}
                            className="login-btn wallet-btn"
                            type="button"
                        >
                            <Wallet size={20} className="btn-icon" />
                            Połącz Portfel
                        </button>
                    </div>

                    <div className="divider">
                        <span>lub zaloguj się emailem</span>
                    </div>

                    {/* Email Login Section */}
                    <div className="login-section">
                        <form onSubmit={handleEmailLogin} className="email-login-form">
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="twój@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading || isSuccess}
                                    required
                                    className="email-input"
                                />
                            </div>
                            {!isSuccess && (
                                <button
                                    type="submit"
                                    className={`login-btn email-btn ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? 'Wysyłanie...' : 'Wyślij link →'}
                                </button>
                            )}
                        </form>

                        {isSuccess && (
                            <div className="success-badge">
                                <span>✓ Sprawdź swoją skrzynkę — wysłaliśmy link</span>
                            </div>
                        )}
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default LoginModal;
