// utilidades e cálculo de status dos plantões

import type { Appointment as DTOAppointment } from '../dtos';

export type Status =
  | 'ATIVO'
  | 'ATRASADO'
  | 'CONCLUIDO'
  | 'AUSENTE'
  | 'PENDENTE'
  | string;

export function addHours(date: Date | string, hours: number) {
  const d = new Date(date);
  return new Date(d.getTime() + hours * 60 * 60 * 1000);
}
export function addMinutes(date: Date | string, minutes: number) {
  const d = new Date(date);
  return new Date(d.getTime() + minutes * 60 * 1000);
}

export type Appointment = DTOAppointment & {
  status?: Status;
  _lateStart?: boolean;
  _earlyStop?: boolean;
};

export function computeStatus(a: DTOAppointment): Appointment {
  const now = new Date();

  const scheduledStart = new Date(a.date);
  const scheduledEnd = addHours(a.date, (a.duration as number) ?? 0);

  const start = a.start_checkin ? new Date(a.start_checkin) : null;
  const stop = a.stop_checkin ? new Date(a.stop_checkin) : null;

  // tolerância em minutos, default 0
  const tolMin = Number(a?.hospital?.min_tolerance ?? 0);
  const startWithTol = addMinutes(scheduledStart, tolMin);
  const endMinusTol = addMinutes(scheduledEnd, -tolMin);

  let status: Status = 'PENDENTE';
  let _lateStart = false;
  let _earlyStop = false;

  if (start && stop) {
    status = 'CONCLUIDO';
    _lateStart = start > startWithTol;
    _earlyStop = stop < endMinusTol;
    return { ...(a as Appointment), status, _lateStart, _earlyStop };
  }

  if (start && !stop && now < scheduledEnd) {
    status = 'ATIVO';
    return { ...(a as Appointment), status };
  }

  if (!start && now > startWithTol && now < scheduledEnd) {
    status = 'ATRASADO';
    return { ...(a as Appointment), status };
  }

  if (!start && now >= scheduledEnd) {
    status = 'AUSENTE';
    return { ...(a as Appointment), status };
  }

  return { ...(a as Appointment), status };
}
