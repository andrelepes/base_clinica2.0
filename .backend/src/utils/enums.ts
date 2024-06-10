enum Status {
  Active = 1,
  Inactive = 2,
  AwaitingConfirmation = 3,
  Suspended = 4,
  Archived = 5,
}

enum Roles {
  ClinicSchool = 1,
  StudentPsychologist = 2,
  MonitorPsychologist = 3,
  Patient = 4,
  Secretary = 5,
}

enum AppointmentStatus {
  Scheduled = 1,
  Confirmed = 2,
  Canceled = 3,
  Completed = 4,
  Rescheduled = 5,
}

enum AttendedOptions {
  Attended = 1,
  Rescheduled = 2,
  CanceledOnTime = 3,
  NoShow = 4,
  CanceledByTherapyst = 5,
  Other = 6,
}

enum PunctualityOptions {
  OnTime = 1,
  InAdvance = 2,
  Late = 3,
}
enum MoodStates {
  VeryBad = 1,
  Bad = 2,
  Unsatisfactory = 3,
  BelowAverage = 4,
  Average = 5,
  Fair = 6,
  Good = 7,
  VeryGood = 8,
  Excellent = 9,
  Fantastic = 10,
}
enum RecurrenceOptions {
  Nenhuma = 1,
  Semanal = 2,
  Quinzenal = 3,
  Mensal = 4,
}
