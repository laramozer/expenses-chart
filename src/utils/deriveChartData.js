export const DAYS_ORDER = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];

const JS_TO_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export const MONTH_NUMBERS = {
  Janeiro: 1, Fevereiro: 2, Março: 3, Abril: 4, Maio: 5, Junho: 6,
  Julho: 7, Agosto: 8, Setembro: 9, Outubro: 10, Novembro: 11, Dezembro: 12,
};

export function getDayName(year, monthNum, date) {
  return JS_TO_PT[new Date(year, monthNum - 1, date).getDay()];
}

export function getDayOfWeekIndex(year, monthNum, date) {
  return new Date(year, monthNum - 1, date).getDay();
}

/** Soma gastos por dia da semana (seg–dom) ao longo de todo o mês */
export function deriveChartDays(expenses, monthNum, year) {
  const totals = Object.fromEntries(DAYS_ORDER.map((d) => [d, 0]));
  for (const expense of expenses) {
    const dayName = getDayName(year, monthNum, expense.date);
    totals[dayName] += expense.amount;
  }
  return DAYS_ORDER.map((day) => ({ day, amount: totals[day] }));
}

/** Retorna as semanas do mês como intervalos de dias */
export function getWeeksOfMonth(year, monthNum) {
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const weeks = [];
  for (let start = 1; start <= daysInMonth; start += 7) {
    weeks.push({
      num: Math.ceil(start / 7),
      start,
      end: Math.min(start + 6, daysInMonth),
    });
  }
  return weeks;
}

export function nextId(expenses) {
  return expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;
}
