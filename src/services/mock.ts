import type { ExamDTO } from '../dtos';

export const examsMock: ExamDTO[] = [
  {
    id: 2387726,
    modality: 'CT',
    examName: 'TC ABDOME TOTAL',
    patientName: 'CARMEM LUCIA CASTRO',
    patientId: '495999',
    examDate: '2025-09-18T15:33:00-03:00',
    type: 'Eletivo',
    criticalFindings: false,
    images: 1757,
    status: 'pending',
  },
  {
    id: 2387895,
    modality: 'CT',
    examName: 'TC TÓRAX',
    patientName: 'BALDUINO DE CARVALHO',
    patientId: '270692',
    examDate: '2025-09-18T08:03:00-03:00',
    type: 'Urgente',
    criticalFindings: true,
    images: 1420,
    status: 'in_process',
  },
  // …adicione quantos quiser
];
