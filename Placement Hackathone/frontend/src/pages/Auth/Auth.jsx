import { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            console.log('Success:', data);
            localStorage.setItem('token', data.token);

            toast.success(data.message || (isLogin ? 'Login successful!' : 'Account created successfully!'));

            // Reset form if signup was successful
            if (!isLogin) {
                setIsLogin(true);
                setFormData({ name: '', email: '', password: '' });
            }

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container">
            {/* Background decoration elements */}
            <div className="auth-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Join us today and start your journey'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" disabled={loading} />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        {!loading && <ArrowRight size={20} className="btn-icon" />}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            className="toggle-auth-mode"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
