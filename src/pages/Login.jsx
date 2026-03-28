import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user, res.data.business);
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'employee') navigate('/employee');
      else if (role === 'superadmin') navigate('/superadmin');
      else navigate('/my-appointments');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎲</div>
          <h1>KDice POS</h1>
          <p>Sistema de gestión de citas y pagos</p>
        </div>
        {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-group">
              <Mail className="input-icon" size={16} />
              <input type="email" placeholder="tu@correo.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-group" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={16} />
              <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: 40 }} required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', padding: 4, color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full"
            style={{ marginTop: 8, justifyContent: 'center', height: 44 }} disabled={loading}>
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Ingresando...</>
              : <><LogIn size={16} /> Iniciar sesión</>}
          </button>
        </form>
        <div className="divider" />
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}
