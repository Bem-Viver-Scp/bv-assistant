import {
  addHours,
  addMonths,
  addYears,
  differenceInHours,
  differenceInMinutes,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  isAfter,
  isSameDay,
  isToday,
  parseISO,
  subHours,
  subMonths,
  subYears,
} from 'date-fns';

export function getWeekDay(date = new Date()) {
  const weekDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];
  const currentWeekDay = getDay(new Date(date));

  return weekDays[currentWeekDay];
}

export function getFormatDateWithTime(
  date: string | Date = new Date(),
  dateFormat = 'dd/MM/yyyy - HH:mm'
) {
  return format(new Date(date), dateFormat);
}

export function getFormatDate(date = new Date(), dateFormat = 'dd/MM/yy') {
  return format(new Date(date), dateFormat);
}

export function getFormatDay(date = new Date(), dateFormat = 'dd') {
  return format(new Date(date), dateFormat);
}

export function getFormatHours(date = new Date()) {
  return format(new Date(date), 'HH:mm');
}

export function getFormatAppointsHours(date = new Date(), hours: number) {
  return `${getFormatHours(new Date(date))} - ${getFormatHours(
    addHours(new Date(date), Number(hours))
  )}`;
}

export function getAddHoursToDate(date = new Date(), hours: number) {
  return addHours(new Date(date), hours);
}

export function getIsSameDay(date = new Date(), otherDay = new Date()) {
  return isSameDay(new Date(date), new Date(otherDay));
}

export function getIsToday(date = new Date()) {
  return isToday(new Date(date));
}

export function getIsAfter(date = new Date()) {
  return isAfter(new Date(date), new Date());
}

export function getCurrentYear(date = new Date()) {
  return getYear(new Date(date));
}

export function getCurrentMonth(date = new Date()) {
  return getMonth(new Date(date));
}

export function getCurrentDate(date = new Date()) {
  return getDate(new Date(date));
}

export function getAddYear(date = new Date(), number = 1) {
  return addYears(new Date(date), number);
}

export function getSubYear(date = new Date(), number = 1) {
  return subYears(new Date(date), number);
}

export function getAddMonth(date = new Date(), number = 1) {
  return addMonths(new Date(date), number);
}

export function getSubMonth(date = new Date(), number = 1) {
  return subMonths(new Date(date), number);
}

export function getDifferenceInHours(date = new Date()) {
  return Number(differenceInHours(new Date(date), new Date()));
}

export function getDifferenceInMinutes(dateLeft: Date, dateRight: Date) {
  return Number(differenceInMinutes(dateLeft, dateRight));
}

export function getMonthName(date = new Date()) {
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const currentMonthDay = getMonth(new Date(date));

  return monthNames[currentMonthDay];
}

export function setHoursToDate(dateFormatted: Date, hours: number) {
  const currentDate = new Date(dateFormatted);
  const dateWithTime = addHours(currentDate, hours);

  return dateWithTime;
}

export function getTransferredPeriod(
  dateStr: string,
  hoursToTransfer: number,
  transferFirstHours: boolean,
  totalDuration: number
): string {
  const baseDate = parseISO(dateStr);

  if (transferFirstHours) {
    const end = addHours(baseDate, hoursToTransfer);
    return `${format(baseDate, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  } else {
    const shiftEnd = addHours(baseDate, totalDuration);
    const start = subHours(shiftEnd, hoursToTransfer);
    return `${format(start, 'HH:mm')} - ${format(shiftEnd, 'HH:mm')}`;
  }
}
