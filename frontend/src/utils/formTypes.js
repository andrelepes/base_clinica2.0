const attendedOptions = [
  { id: '1', title: 'Sim' },
  { id: '2', title: 'Não, reagendado' },
  { id: '3', title: 'Não, mas cancelado antes de 24h' },
  { id: '4', title: 'Não comparecimento' },
  { id: '5', title: 'Desmarcado pelo psicoterapeuta' },
  { id: '6', title: 'Outro' },
];

const punctualityOptions = [
  { id: '1', title: 'No horário' },
  { id: '2', title: 'Antecipado' },
  { id: '3', title: 'Atrasado' },
];

const moodStates = [
  { id: 1, value: 0.5, title: 'Muito Ruim' },
  { id: 2, value: 1.0, title: 'Ruim' },
  { id: 3, value: 1.5, title: 'Insatisfatório' },
  { id: 4, value: 2.0, title: 'Abaixo da Média' },
  { id: 5, value: 2.5, title: 'Médio' },
  { id: 6, value: 3.0, title: 'Razoável' },
  { id: 7, value: 3.5, title: 'Bom' },
  { id: 8, value: 4.0, title: 'Muito Bom' },
  { id: 9, value: 4.5, title: 'Excelente' },
  { id: 10, value: 5.0, title: 'Fantástico' },
];

const satisfactionStates = [
  { id: 1, value: 1, title: 'Muito Insatisfatório' },
  { id: 2, value: 2, title: 'Insatisfatório' },
  { id: 3, value: 3, title: 'Mediano' },
  { id: 4, value: 4, title: 'Satisfatório' },
  { id: 5, value: 5, title: 'Muito Satisfatório' },
];

const recurrenceOptions = [
  { id: 1, title: 'Nenhuma', intervals: [0] },
  { id: 2, title: 'Semanal', intervals: [7, 14, 21, 28, 35] },
  { id: 3, title: 'Quinzenal', intervals: [14, 28, 42] },
  { id: 4, title: 'Mensal', intervals: [28, 56] },
];

export {
  attendedOptions,
  punctualityOptions,
  moodStates,
  satisfactionStates,
  recurrenceOptions,
};
