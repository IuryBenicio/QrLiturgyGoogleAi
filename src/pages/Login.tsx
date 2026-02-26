import { useNavigate } from 'react-router-dom';
import { Lock, Shield, QrCode, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://qrliturgy-java.onrender.com/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      localStorage.setItem('adminData', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A] font-sans min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <main className="w-full max-w-[420px] z-10">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden px-8 py-10">
          <div className="flex flex-col items-center mb-10">
            <div className="h-16 mb-4 flex items-center justify-center">
              <div className="h-16 w-16 bg-[#a3b18a] rounded flex items-center justify-center text-white font-serif italic text-xl">
                BASE
              </div>
            </div>
            <h1 className="text-[#1A1A1A] text-xl font-bold tracking-tight text-center">
              Liturgia QR
            </h1>
            <div className="h-1 w-8 bg-primary mt-2 rounded-full"></div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 ml-1" htmlFor="username">
                Usuário ou E-mail
              </label>
              <div className="relative">
                <input 
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm" 
                  id="username" 
                  name="username" 
                  placeholder="Digite seu acesso" 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 ml-1" htmlFor="password">
                Senha
              </label>
              <div className="relative group">
                <input 
                  className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-sm" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                className="w-full h-14 bg-primary hover:bg-[#B01A1A] text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <span>Acessar Painel</span>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
              Acesso restrito ao administrador
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-500 text-[11px] font-light">
            © 2024 Igreja BASE. Sistema de Gestão Litúrgica.
          </p>
          <div className="flex justify-center gap-4 text-gray-600">
            <Shield size={16} className="opacity-30" />
            <QrCode size={16} className="opacity-30" />
          </div>
        </div>
      </main>
      
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-[#8B1515] to-primary opacity-50"></div>
      <div className="fixed bottom-0 right-0 p-8 opacity-5 select-none pointer-events-none">
        <Shield size={120} className="text-white" />
      </div>
    </div>
  );
}
