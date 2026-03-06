import { useState } from 'react';
import BarChart from './BarChart';
import allMonths from '../data/data.json';

const CURRENT_MONTH = new Date().getMonth() + 1;
const CURRENT_YEAR = new Date().getFullYear();

const MONTH_NUMBERS = {
  Janeiro: 1, Fevereiro: 2, Março: 3, Abril: 4, Maio: 5, Junho: 6,
  Julho: 7, Agosto: 8, Setembro: 9, Outubro: 10, Novembro: 11, Dezembro: 12,
};

function isCurrentMonth(month) {
  return (
    MONTH_NUMBERS[month.month] === CURRENT_MONTH &&
    month.year === CURRENT_YEAR
  );
}

const initialIndex = allMonths.findIndex(isCurrentMonth);
const defaultIndex = initialIndex !== -1 ? initialIndex : allMonths.length - 1;

export default function SpendingCard() {
  const [monthIndex, setMonthIndex] = useState(defaultIndex);
  const [monthsData, setMonthsData] = useState(allMonths);
  const [editOpen, setEditOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});

  const current = monthsData[monthIndex];
  const total = current.days.reduce((sum, d) => sum + d.amount, 0);
  const isFirst = monthIndex === 0;
  const isLast = monthIndex === monthsData.length - 1;
  const isCurrent = isCurrentMonth(current);

  function openEdit() {
    setInputs(Object.fromEntries(current.days.map((d) => [d.day, String(d.amount)])));
    setErrors({});
    setEditOpen(true);
  }

  function handleInputChange(day, value) {
    setInputs((prev) => ({ ...prev, [day]: value }));
    setErrors((prev) => ({ ...prev, [day]: false }));
  }

  function handleSave() {
    const newErrors = {};
    const newDays = current.days.map((d) => {
      const parsed = parseFloat(inputs[d.day]?.replace(',', '.'));
      if (isNaN(parsed) || parsed < 0) {
        newErrors[d.day] = true;
        return d;
      }
      return { ...d, amount: parsed };
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setMonthsData((prev) =>
      prev.map((m, i) => (i === monthIndex ? { ...m, days: newDays } : m))
    );
    setEditOpen(false);
  }

  function handleCancel() {
    setErrors({});
    setEditOpen(false);
  }

  return (
    <div className="bg-[#FEFAF6] rounded-2xl px-6 pt-8 pb-6 w-full flex flex-col gap-6 shadow-sm">

      {/* Cabeçalho com navegação de meses */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => { setMonthIndex((i) => i - 1); setEditOpen(false); }}
          disabled={isFirst}
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
          <p className="text-[#93857A] text-xs mt-0.5">Gastos — últimos 7 dias</p>
        </div>

        <button
          onClick={() => { setMonthIndex((i) => i + 1); setEditOpen(false); }}
          disabled={isLast}
          aria-label="Próximo mês"
          className="p-1.5 rounded-lg text-[#93857A] hover:text-[#382314] hover:bg-[#F4EDE7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Indicador de posição dos meses */}
      <div className="flex justify-center gap-1.5 -mt-3">
        {monthsData.map((m, i) => (
          <button
            key={`${m.month}-${m.year}`}
            onClick={() => { setMonthIndex(i); setEditOpen(false); }}
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

      <BarChart data={current.days} />

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
        onClick={editOpen ? handleCancel : openEdit}
        className="w-full py-2.5 rounded-xl bg-[#F4EDE7] text-[#382314] text-sm font-semibold hover:bg-[#EEE5DB] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus-visible:ring-offset-2"
      >
        {editOpen ? 'Fechar edição' : 'Editar gastos'}
      </button>

      {editOpen && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {current.days.map((item) => (
              <div key={item.day} className="flex flex-col gap-1">
                <label
                  htmlFor={`input-${item.day}`}
                  className="text-[#93857A] text-xs font-medium uppercase tracking-wide"
                >
                  {item.day}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93857A] text-sm pointer-events-none">
                    R$
                  </span>
                  <input
                    id={`input-${item.day}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={inputs[item.day] ?? ''}
                    onChange={(e) => handleInputChange(item.day, e.target.value)}
                    className={[
                      'w-full pl-9 pr-3 py-2 rounded-lg border text-[#382314] text-sm font-medium bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus-visible:ring-offset-1',
                      errors[item.day]
                        ? 'border-red-400 bg-red-50'
                        : 'border-[#EEE5DB] focus:border-[#EC755D]',
                    ].join(' ')}
                  />
                </div>
                {errors[item.day] && (
                  <p className="text-red-500 text-xs">Valor inválido</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 rounded-xl border border-[#EEE5DB] text-[#93857A] text-sm font-semibold hover:bg-[#F4EDE7] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#93857A] focus-visible:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-[#EC755D] text-white text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus-visible:ring-offset-2"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
