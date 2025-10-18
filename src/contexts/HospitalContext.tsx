import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useAuth } from '../hooks/auth';
import api from '../services/api';
import type { Hospital, SelectProps } from '../dtos';

type HospitalProviderProps = {
  children: ReactNode;
};

type HospitalContextData = {
  isLoading: boolean;
  hospitals: SelectProps[];
  setCurrentHospital: Dispatch<SetStateAction<SelectProps>>;
  currentHospital: SelectProps;
  getCurrentHospitalsData: Hospital | undefined;
  /** Define o hospital atual e salva imediatamente no localStorage */
  setLocalStorageWithCurrentHospital: (value: SelectProps) => void;
};

export const HospitalContext = createContext({} as HospitalContextData);

export const HospitalProvider = ({ children }: HospitalProviderProps) => {
  const { user, isAuthenticated } = useAuth();

  const [hospitals, setHospitals] = useState<SelectProps[]>([]);
  const [hospitalsData, setHospitalsData] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // tenta carregar o hospital salvo
  const [currentHospital, setCurrentHospital] = useState<SelectProps>(() => {
    try {
      const saved =
        localStorage.getItem('@BemViver_Assintent.currentHospital') || '';
      return saved ? JSON.parse(saved) : ({} as SelectProps);
    } catch {
      return {} as SelectProps;
    }
  });

  const LOCAL_KEY = '@BemViver_Assintent.currentHospital';

  const setLocalStorageWithCurrentHospital = (value: SelectProps) => {
    setCurrentHospital(value);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(value));
    } catch {
      /* noop */
    }
  };

  const getMyHospitals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/userHospital/my-hospitals');
      const list: Hospital[] = response.data ?? [];

      const options: SelectProps[] = list.map((h) => ({
        value: h.id,
        label: h.name,
      }));

      setHospitals(options);
      setHospitalsData(list);

      const saved = localStorage.getItem(LOCAL_KEY);

      if (saved) {
        setCurrentHospital(JSON.parse(saved));
      } else if (options.length > 0) {
        // define o primeiro por padrão
        setLocalStorageWithCurrentHospital(options[0]);
      }
    } catch (err) {
      console.error('Erro ao buscar hospitais:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // mantém localStorage sincronizado mesmo quando usar setCurrentHospital direto
  useEffect(() => {
    if (currentHospital?.value) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(currentHospital));
      } catch {
        /* noop */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHospital?.value]);

  useEffect(() => {
    if (isAuthenticated) getMyHospitals();
  }, [user, isAuthenticated]);

  const getCurrentHospitalsData = hospitalsData.find(
    (h) => h.id === currentHospital?.value
  );

  return (
    <HospitalContext.Provider
      value={{
        hospitals,
        isLoading,
        currentHospital,
        setCurrentHospital,
        getCurrentHospitalsData,
        setLocalStorageWithCurrentHospital,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export function useHospital(): HospitalContextData {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital deve ser usado dentro de um HospitalProvider');
  }
  return context;
}
