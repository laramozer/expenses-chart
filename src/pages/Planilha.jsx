import { useState } from 'react';
import {
  MONTH_NUMBERS,
  DAYS_ORDER,
  getDayName,
  getWeeksOfMonth,
  nextId,
} from '../utils/deriveChartData';
import { CATEGORIES, getCategoryById } from '../utils/categories';

const CURRENT_MONTH = new Date().getMonth() + 1;
const CURRENT_YEAR = new Date().getFullYear();

const DAY_COLORS = {
  seg: 'bg-orange-100 text-orange-700',
  ter: 'bg-yellow-100 text-yellow-700',
  qua: 'bg-green-100 text-green-700',
  qui: 'bg-teal-100 text-teal-700',
  sex: 'bg-blue-100 text-blue-700',
  'sáb': 'bg-purple-100 text-purple-700',
  dom: 'bg-rose-100 text-rose-700',
};

const EMPTY_FORM = { date: '', description: '', category: 'alimentacao', amount: '' };

export default function Planilha({ months, updateMonth, onBack }) {
  const defaultIndex = (() => {
    const i = months.findIndex(
      (m) => MONTH_NUMBERS[m.month] === CURRENT_MONTH && m.year === CURRENT_YEAR
    );
    return i !== -1 ? i : months.length - 1;
  })();

  const [monthIndex, setMonthIndex] = useState(defaultIndex);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [openWeeks, setOpenWeeks] = useState(new Set([1, 2, 3, 4, 5]));

  const current = months[monthIndex];
  const monthNum = MONTH_NUMBERS[current.month];
  const daysInMonth = new Date(current.year, monthNum, 0).getDate();
  const weeks = getWeeksOfMonth(current.year, monthNum);
  const total = current.expenses.reduce((sum, e) => sum + e.amount, 0);

  function toggleWeek(num) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  }

  function changeMonth(newIndex) {
    setMonthIndex(newIndex);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setOpenWeeks(new Set([1, 2, 3, 4, 5]));
  }

  function handleAdd(e) {
    e.preventDefault();
    const dateNum = parseInt(form.date);
    const amount = parseFloat(form.amount.replace(',', '.'));

    if (!form.date || isNaN(dateNum) || dateNum < 1 || dateNum > daysInMonth) {
      setFormError(`Informe um dia válido (1 a ${daysInMonth}).`);
      return;
    }
    if (!form.description.trim()) {
      setFormError('Informe a descrição.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setFormError('Informe um valor válido.');
      return;
    }

    updateMonth(monthIndex, (m) => ({
      ...m,
      expenses: [
        ...m.expenses,
        { id: nextId(m.expenses), date: dateNum, description: form.description.trim(), category: form.category, amount },
      ],
    }));
    setForm(EMPTY_FORM);
    setFormError('');

    // Abre a semana do dia adicionado
    const weekNum = Math.ceil(dateNum / 7);
    setOpenWeeks((prev) => new Set([...prev, weekNum]));
  }

  function handleDelete(id) {
    updateMonth(monthIndex, (m) => ({
      ...m,
      expenses: m.expenses.filter((e) => e.id !== id),
    }));
    if (editingId === id) setEditingId(null);
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditForm({ date: String(entry.date), description: entry.description, category: entry.category ?? 'outros', amount: String(entry.amount) });
  }

  function saveEdit(id) {
    const dateNum = parseInt(editForm.date);
    const amount = parseFloat(editForm.amount.replace(',', '.'));
    if (!editForm.description.trim() || isNaN(amount) || amount <= 0) return;
    if (isNaN(dateNum) || dateNum < 1 || dateNum > daysInMonth) return;

    updateMonth(monthIndex, (m) => ({
      ...m,
      expenses: m.expenses.map((e) =>
        e.id === id
          ? { ...e, date: dateNum, description: editForm.description.trim(), category: editForm.category, amount }
          : e
      ),
    }));
    setEditingId(null);
  }

  return (
    <div className="w-full max-w-lg sm:max-w-2xl flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white/60 hover:bg-white text-[#382314] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]"
          aria-label="Voltar"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className="text-[#382314] text-xl font-bold leading-tight">Planilha de Gastos</h1>
          <p className="text-[#93857A] text-xs">Lançamentos por semana · o gráfico soma por dia da semana</p>
        </div>
      </div>

      {/* Seletor de mês */}
      <div className="bg-white/70 rounded-2xl px-4 py-3 flex items-center justify-between gap-2">
        <button
          onClick={() => changeMonth(monthIndex - 1)}
          disabled={monthIndex === 0}
          aria-label="Mês anterior"
          className="p-1.5 rounded-lg text-[#93857A] hover:text-[#382314] hover:bg-[#F4EDE7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="text-center">
          <p className="text-[#382314] font-bold text-base">{current.month} {current.year}</p>
          <p className="text-[#93857A] text-xs">
            {current.expenses.length} lançamento{current.expenses.length !== 1 ? 's' : ''} · Total: R$ {total.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <button
          onClick={() => changeMonth(monthIndex + 1)}
          disabled={monthIndex === months.length - 1}
          aria-label="Próximo mês"
          className="p-1.5 rounded-lg text-[#93857A] hover:text-[#382314] hover:bg-[#F4EDE7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Formulário de novo lançamento */}
      <form onSubmit={handleAdd} className="bg-[#FEFAF6] rounded-2xl px-5 py-5 flex flex-col gap-4 shadow-sm">
        <h2 className="text-[#382314] font-bold text-sm">Novo lançamento</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          <div className="flex flex-col gap-1">
            <label className="text-[#93857A] text-xs font-medium uppercase tracking-wide">
              Dia do mês
            </label>
            <input
              type="number"
              min="1"
              max={daysInMonth}
              placeholder={`1–${daysInMonth}`}
              value={form.date}
              onChange={(e) => { setForm((f) => ({ ...f, date: e.target.value })); setFormError(''); }}
              className="border border-[#EEE5DB] rounded-lg px-3 py-2 text-[#382314] text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus:border-[#EC755D]"
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-[#93857A] text-xs font-medium uppercase tracking-wide">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Almoço, Mercado..."
              value={form.description}
              onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setFormError(''); }}
              className="border border-[#EEE5DB] rounded-lg px-3 py-2 text-[#382314] text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus:border-[#EC755D]"
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2 sm:col-span-2">
            <label className="text-[#93857A] text-xs font-medium uppercase tracking-wide">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="border border-[#EEE5DB] rounded-lg pl-3 pr-8 py-2 text-[#382314] text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus:border-[#EC755D] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%20stroke%3D%22%2393857A%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 col-span-2 sm:col-span-2">
            <label className="text-[#93857A] text-xs font-medium uppercase tracking-wide">Valor</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93857A] text-xs pointer-events-none">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) => { setForm((f) => ({ ...f, amount: e.target.value })); setFormError(''); }}
                className="w-full pl-8 pr-3 py-2 border border-[#EEE5DB] rounded-lg text-[#382314] text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus:border-[#EC755D]"
              />
            </div>
          </div>
        </div>

        {formError && <p className="text-red-500 text-xs -mt-1">{formError}</p>}

        <button
          type="submit"
          className="self-end px-6 py-2.5 rounded-xl bg-[#EC755D] text-white text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus-visible:ring-offset-2"
        >
          Adicionar
        </button>
      </form>

      {/* Semanas */}
      {weeks.map((week) => {
        const weekExpenses = current.expenses
          .filter((e) => e.date >= week.start && e.date <= week.end)
          .sort((a, b) => a.date - b.date);

        const weekTotal = weekExpenses.reduce((s, e) => s + e.amount, 0);
        const isOpen = openWeeks.has(week.num);

        // Agrupa por data
        const dateMap = new Map();
        for (const exp of weekExpenses) {
          if (!dateMap.has(exp.date)) dateMap.set(exp.date, []);
          dateMap.get(exp.date).push(exp);
        }
        const dateGroups = Array.from(dateMap.entries()).sort((a, b) => a[0] - b[0]);

        return (
          <div key={week.num} className="bg-[#FEFAF6] rounded-2xl shadow-sm overflow-hidden">
            {/* Header da semana */}
            <button
              onClick={() => toggleWeek(week.num)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FFF8F5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EC755D]"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#EC755D] font-bold text-sm">Semana {week.num}</span>
                <span className="text-[#93857A] text-xs">
                  dias {week.start} a {week.end}
                </span>
                {weekExpenses.length > 0 && (
                  <span className="text-xs bg-[#F4EDE7] text-[#93857A] px-2 py-0.5 rounded-full">
                    {weekExpenses.length} lançamento{weekExpenses.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {weekExpenses.length > 0 && (
                  <span className="text-[#382314] text-sm font-semibold">
                    R$ {weekTotal.toFixed(2).replace('.', ',')}
                  </span>
                )}
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className={`text-[#93857A] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {/* Conteúdo da semana */}
            {isOpen && (
              dateGroups.length === 0 ? (
                <div className="px-5 py-4 border-t border-[#EEE5DB] text-[#93857A] text-xs text-center">
                  Nenhum lançamento nesta semana.
                </div>
              ) : (
                <table className="w-full text-sm border-t border-[#EEE5DB]">
                  <tbody>
                    {dateGroups.map(([date, entries]) => {
                      const dayName = getDayName(current.year, monthNum, date);
                      const dayTotal = entries.reduce((s, e) => s + e.amount, 0);

                      const rows = entries.map((entry, idx) => (
                        editingId === entry.id ? (
                          <tr key={entry.id} className="bg-[#FFF8F5] border-b border-[#EEE5DB]">
                            <td className="px-4 py-2 w-24">
                              <input
                                type="number"
                                min="1"
                                max={daysInMonth}
                                value={editForm.date}
                                onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                                className="border border-[#EEE5DB] rounded-lg px-2 py-1 text-[#382314] text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={editForm.description}
                                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                className="border border-[#EEE5DB] rounded-lg px-2 py-1 text-[#382314] text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] w-full"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={editForm.category}
                                onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                                className="border border-[#EEE5DB] rounded-lg pl-2 pr-7 py-1 text-[#382314] text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] w-full appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%20stroke%3D%22%2393857A%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center]"
                              >
                                {CATEGORIES.map((c) => (
                                  <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.amount}
                                onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))}
                                className="border border-[#EEE5DB] rounded-lg px-2 py-1 text-[#382314] text-xs bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] w-full text-right"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex gap-1 justify-end">
                                <button onClick={() => saveEdit(entry.id)} aria-label="Salvar"
                                  className="p-1.5 rounded-lg bg-[#EC755D] text-white hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]">
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button onClick={() => setEditingId(null)} aria-label="Cancelar"
                                  className="p-1.5 rounded-lg bg-[#F4EDE7] text-[#93857A] hover:bg-[#EEE5DB] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#93857A]">
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={entry.id} className="border-b border-[#EEE5DB] hover:bg-[#FFF8F5] transition-colors group">
                            <td className="px-5 py-3 w-28">
                              {idx === 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[#382314] font-bold text-sm">{date}</span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${DAY_COLORS[dayName]}`}>
                                    {dayName}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[#D9CFC9] text-xs pl-4">·</span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[#382314]">{entry.description}</span>
                                {(() => {
                                  const cat = getCategoryById(entry.category);
                                  return (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.color}`}>
                                      {cat.label}
                                    </span>
                                  );
                                })()}
                              </div>
                            </td>
                            <td className="px-5 py-3 text-right font-semibold text-[#382314] whitespace-nowrap">
                              R$ {entry.amount.toFixed(2).replace('.', ',')}
                            </td>
                            <td className="px-3 py-3 w-16">
                              <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(entry)} aria-label={`Editar ${entry.description}`}
                                  className="p-1.5 rounded-lg text-[#93857A] hover:bg-[#F4EDE7] hover:text-[#382314] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D]">
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M9 2L11 4L4 11H2V9L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <button onClick={() => handleDelete(entry.id)} aria-label={`Excluir ${entry.description}`}
                                  className="p-1.5 rounded-lg text-[#93857A] hover:bg-red-50 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M2 3.5H11M5 3.5V2H8V3.5M4.5 3.5V10.5H8.5V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ));

                      if (entries.length > 1) {
                        rows.push(
                          <tr key={`subtotal-${date}`} className="border-b border-[#EEE5DB] bg-[#FAF5F1]">
                            <td className="px-5 py-2 w-28" />
                            <td className="px-5 py-2 text-[#93857A] text-xs italic">subtotal do dia {date}</td>
                            <td className="px-5 py-2 text-right text-xs font-semibold text-[#93857A] whitespace-nowrap">
                              R$ {dayTotal.toFixed(2).replace('.', ',')}
                            </td>
                            <td className="px-3 py-2 w-16" />
                          </tr>
                        );
                      }

                      return rows;
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>
        );
      })}

      {/* Rodapé total */}
      <div className="bg-[#EC755D] rounded-2xl px-5 py-4 flex items-center justify-between">
        <p className="text-white/80 text-sm font-medium">Total em {current.month}</p>
        <p className="text-white text-xl font-bold">R$ {total.toFixed(2).replace('.', ',')}</p>
      </div>
    </div>
  );
}
