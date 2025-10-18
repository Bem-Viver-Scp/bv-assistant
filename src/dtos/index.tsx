export type SelectProps = {
  label: string;
  value: string;
};
export interface User {
  id: string;
  name: string;
  cellphone: string;
  logo_url: string;
  avatar: string;
  avatar_url: string;
  verified: boolean;
  role: string;
  email: string;
  cpf: string;
  rg: string;
  crm: string;
  sus: string;
  bank: string;
  agency: string;
  account: string;
  street: string;
  complemento: string;
  number: string;
  cep: string;
  bairro: string;
  cidade: string;
  uf: string;
  created_at: Date;
  updated_at: Date;
  birthday: Date;
}

export interface Hospital {
  id: string;
  code: string;
  qrcode: string;
  name: string;
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  uf: string;
  cep: number;
  qr_url: string;
  min_hours?: number;
  min_tolerance?: number;
  adminFee?: number;
  logo_url: string;
  latitude: string;
  longitude: string;
  tax: number;
}

export interface Appointment {
  id: string;
  user_id: string;
  hospital_id: string;
  expertise_id: string;
  title: string;
  transfering: boolean;
  start_checkin: Date;
  stop_checkin: Date;
  doctor_price: number;
  total_price: number;
  solicitation?: boolean;
  date: Date;
  hospital: Hospital;
  expertise: Expertise;
  user: User;
  duration: number;
  discount_exit: boolean;
  discount_entry: boolean;
  hours_to_transfer: number;
  transfer_first_hours: boolean;
  start_checkin_by: string;
  stop_checkin_by: string;
}

export interface Expertise {
  id: string;
  name: string;
  userExperises: UserExpertise[];
  late_entry_justification: boolean;
  early_exit_justification: boolean;
  type: number;
  modality_worker: string;
  price: Price;
}

export interface UserExpertise {
  id: string;
  user_id: string;
  expertise_id: string;
  expertise: Expertise;
  user: User;
  coordinator: boolean;
  coordinator_salary?: number;
  coordinator_total_salary?: number;
  monthly_doctor_price?: number;
  monthly_total_price?: number;
}

export interface Price {
  id: string;
  hospital_id: string;
  expertise_id: string;
  doctor_price: number;
  doctor_fds_price: number;
  total_price: number;
  total_fds_price: number;
  expertise: Expertise;
  hospital: Hospital;
  monthly_total_price: number;
  monthly_doctor_price: number;
}
