import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/auth';

type Errors = Record<string, string>;

export default function Login() {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });

  const nav = useNavigate();
  const loc = useLocation() as any;

  async function handleSubmit() {
    setErrors({});
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Email inválido')
          .required('Email obrigatório'),
        password: Yup.string()
          .min(6, 'Mínimo de 6 caracteres')
          .required('Senha obrigatória'),
      });

      await schema.validate(values, { abortEarly: false });
      await signIn(values);

      toast.success('Login realizado com sucesso!');

      nav('/dashboard');
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        setErrors(getValidationErrors(err));
      } else {
        toast.error(err?.response?.data?.message ?? 'Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-[var(--primary)]">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--card)] ring-1 ring-[var(--ring)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/logo.svg"
            alt="Bem Viver Logotipo"
            width={40}
            height={40}
          />
          <h1 className="text-lg font-semibold">Bem Viver • Assistente</h1>
        </div>

        <div className="space-y-3">
          {/* Email */}
          <label htmlFor="email" className="text-sm text-[var(--muted)]">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Mail className="size-4 text-[var(--muted)]" />
            </span>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl bg-white/5 px-9 py-2 ring-1 ring-[var(--ring)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--ring-2)]
                         placeholder:text-[var(--muted)]"
              placeholder="seu@email.com"
              value={values.email}
              onChange={(e) =>
                setValues((v) => ({ ...v, email: e.target.value }))
              }
              autoFocus
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400">{errors.email}</p>
          )}

          {/* Senha */}
          <label htmlFor="password" className="text-sm text-[var(--muted)]">
            Senha
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Lock className="size-4 text-[var(--muted)]" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-xl bg-white/5 px-9 py-2 ring-1 ring-[var(--ring)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--ring-2)]
                         placeholder:text-[var(--muted)]"
              placeholder="••••••••"
              value={values.password}
              onChange={(e) =>
                setValues((v) => ({ ...v, password: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1
                         hover:bg-white/10 transition"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-[var(--muted)]" />
              ) : (
                <Eye className="size-4 text-[var(--muted)]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400">{errors.password}</p>
          )}

          {/* Forgot password */}
          {/* <div className="flex justify-end">
            <a
              href="/esqueci-senha"
              className="text-sm text-[var(--muted)] hover:underline hover:text-current"
            >
              Esqueceu a senha?
            </a>
          </div> */}

          {/* Botão entrar */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] text-white px-3 py-2 hover:bg-[var(--primary)]/90 transition
                       disabled:opacity-60 hover:cursor-pointer mt-4 "
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
