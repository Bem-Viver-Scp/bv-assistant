import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth as useAuthContext } from '../../hooks/auth';
import { key } from '../../config/key';
import { useHospital } from '../../contexts/HospitalContext';

function HospitalSelectSkeleton() {
  return (
    <div className="h-9 w-48 md:w-56 rounded-lg bg-white/15 animate-pulse" />
  );
}

export default function PrivateLayout() {
  // --- usuário do localStorage (nome e avatar, se existir) ---
  const storedUser = localStorage.getItem(key.user);
  let userName = '';
  let userAvatar = '';

  try {
    const parsed = storedUser ? JSON.parse(storedUser) : null;
    userName = parsed?.name ?? '';
    userAvatar = parsed?.avatar_url ?? parsed?.avatar ?? ''; // fallback comum
  } catch {
    userName = '';
    userAvatar = '';
  }

  const { signOut } = useAuthContext();

  // --- hospitais do contexto ---
  const {
    isLoading,
    hospitals,
    currentHospital,
    setLocalStorageWithCurrentHospital,
  } = useHospital();

  const hasHospitals = Array.isArray(hospitals) && hospitals.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-[var(--primary)]">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* esquerda */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Bem Viver Logotipo"
              width={36}
              height={36}
            />
            <span className="font-semibold text-white">Bem Viver</span>
          </div>

          {/* direita: empilha no mobile */}
          <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3 text-sm text-white/80">
            {/* seletor de hospital */}
            {isLoading ? (
              <HospitalSelectSkeleton />
            ) : hasHospitals ? (
              <select
                value={currentHospital?.value || ''}
                onChange={(e) => {
                  const selected = hospitals.find(
                    (h) => h.value === e.target.value
                  );
                  if (selected) setLocalStorageWithCurrentHospital(selected);
                }}
                className="rounded-lg bg-white/10 border border-white/20 text-white px-3 py-1.5 text-sm outline-none hover:bg-white/20 transition max-w-60"
                aria-label="Selecionar hospital"
              >
                {hospitals.map((h) => (
                  <option
                    key={h.value}
                    value={h.value}
                    className="text-gray-900"
                  >
                    {h.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                disabled
                className="rounded-lg bg-white/10/50 border border-white/10 text-white/60 px-3 py-1.5 text-sm cursor-not-allowed"
                aria-label="Sem hospitais disponíveis"
              >
                <option>Sem hospitais</option>
              </select>
            )}

            {/* usuário + avatar (opcional) */}
            <div className="flex items-center gap-2">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName ? `Avatar de ${userName}` : 'Avatar do usuário'}
                  className="w-7 h-7 rounded-full ring-2 ring-white/20 object-cover"
                />
              ) : null}
              <span className="truncate max-w-[60vw] md:max-w-none">
                Olá, {userName || 'usuário'}
              </span>
            </div>

            {/* sair */}
            <button
              onClick={signOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 hover:bg-white/20 transition text-white cursor-pointer max-w-60"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut className="size-4" />
              <span className="md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-[var(--on-secondary)]">
        <div className="mx-auto max-w-7xl p-4 md:p-6 text-[var(--fg)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
