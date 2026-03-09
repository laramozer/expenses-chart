import { useState } from 'react';
import BarChart from './BarChart';
import { deriveChartDays, MONTH_NUMBERS } from '../utils/deriveChartData';

const CURRENT_MONTH = new Date().getMonth() + 1;
const CURRENT_YEAR = new Date().getFullYear();

function isCurrentMonth(m) {
  return MONTH_NUMBERS[m.month] === CURRENT_MONTH && m.year === CURRENT_YEAR;
}

export default function SpendingCard({ months, onOpenPlanilha }) {
  const defaultIndex = (() => {
    const i = months.findIndex(isCurrentMonth);
    return i !== -1 ? i : months.length - 1;
  })();

  const [monthIndex, setMonthIndex] = useState(defaultIndex);

  const current = months[monthIndex];
  const monthNum = MONTH_NUMBERS[current.month];
  const chartDays = deriveChartDays(current.expenses, monthNum, current.year);
  const total = current.expenses.reduce((sum, e) => sum + e.amount, 0);
  const isCurrent = isCurrentMonth(current);

  return (
    <div className="bg-[#FEFAF6] rounded-2xl px-6 pt-8 pb-6 w-full flex flex-col gap-6 shadow-sm">

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setMonthIndex((i) => i - 1)}
          disabled={monthIndex === 0}
          aria-label="Mês anterior"
          className="p-1.5 rounded-lg text-[#93857A] hover:text-[#382314] hover:bg-[#F4EDE7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[#382314] text-lg sm:text-xl font-bold">
              {current.month} {current.year}
            </h2>
            {isCurrent && (
              <span className="text-[10px] font-bold bg-[#EC755D] text-white px-2 py-0.5 rounded-full leading-none">
                Atual
              </span>
            )}
          </div>
          <p className="text-[#93857A] text-xs mt-0.5">Gastos por dia da semana</p>
        </div>

        <button
          onClick={() => setMonthIndex((i) => i + 1)}
          disabled={monthIndex === months.length - 1}
          aria-label="Próximo mês"
          className="p-1.5 rounded-lg text-[#93857A] hover:text-[#382314] hover:bg-[#F4EDE7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-1.5 -mt-3">
        {months.map((m, i) => (
          <button
            key={`${m.month}-${m.year}`}
            onClick={() => setMonthIndex(i)}
            aria-label={`${m.month} ${m.year}`}
            className={[
              'rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]',
              i === monthIndex
                ? 'w-5 h-2 bg-[#EC755D]'
                : 'w-2 h-2 bg-[#D9CFC9] hover:bg-[#B5A89E]',
            ].join(' ')}
          />
        ))}
      </div>

      <BarChart data={chartDays} />

      <hr className="border-[#EEE5DB]" />

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[#93857A] text-sm">Total em {current.month}</p>
          <p className="text-[#382314] text-3xl sm:text-4xl font-bold mt-1">
            R$ {total.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${current.lastMonthChange >= 0 ? 'text-[#382314]' : 'text-red-500'}`}>
            {current.lastMonthChange >= 0 ? '+' : ''}{current.lastMonthChange}%
          </p>
          <p className="text-[#93857A] text-sm">do mês passado</p>
        </div>
      </div>

      <button
        onClick={onOpenPlanilha}
        className="w-full py-2.5 rounded-xl bg-[#F4EDE7] text-[#382314] text-sm font-semibold hover:bg-[#EEE5DB] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus-visible:ring-offset-2 flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M1 5H15M1 9H15M1 13H15M5 1V15M11 1V15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Ver planilha de gastos
      </button>
    </div>
  );
}
