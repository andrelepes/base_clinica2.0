export const patientListPermissions = {
  psicologo_vinculado: {
    cantAdd: true,
  },
  secretario_vinculado: {
    cantEnter: true,
    cantCharge: true,
  },
};

export const patientDetailsPermissions = {
  psicologo_vinculado: {
    canEdit: (userId, psychologistId, isLocked) =>
      userId === psychologistId && !isLocked,
    canSign: (signList, userId, isLocked) =>
      !signList.some((item) => item.usuario_id === userId && item.status) &&
      !isLocked,
    cantDownload: true,
  },
  supervisor: {
    canEdit: (_, __, isLocked) => !isLocked,
    canSign: (signList, userId, isLocked) =>
      !signList.some((item) => item.usuario_id === userId && item.status) &&
      !isLocked,
  },
  clinica: {
    canEdit: () => true,
    canSign: () => true,
  },
  responsavel_tecnico:{
    canEdit: () => false,
    canSign: () => false,
  }
};
