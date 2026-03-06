import { useState } from 'react';
import BarChart from './BarChart';
import initialData from '../data/data.json';

const lastMonthChange = 2.4;

export default function SpendingCard() {
  const [data, setData] = useState(initialData);
  const [editOpen, setEditOpen] = useState(false);
  const [inputs, setInputs] = useState(
    Object.fromEntries(initialData.map((d) => [d.day, String(d.amount)]))
  );
  const [errors, setErrors] = useState({});

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  function handleInputChange(day, value) {
    setInputs((prev) => ({ ...prev, [day]: value }));
    setErrors((prev) => ({ ...prev, [day]: false }));
  }

  function handleSave() {
    const newErrors = {};
    const newData = data.map((d) => {
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

    setData(newData);
    setEditOpen(false);
  }

  function handleCancel() {
    setInputs(Object.fromEntries(data.map((d) => [d.day, String(d.amount)])));
    setErrors({});
    setEditOpen(false);
  }

  return (
    <div className="bg-[#FEFAF6] rounded-2xl px-6 pt-8 pb-6 w-full flex flex-col gap-6 shadow-sm">
      <h2 className="text-[#382314] text-xl sm:text-2xl font-bold">Gastos - Últimos 7 dias</h2>

      <BarChart data={data} />

      <hr className="border-[#EEE5DB]" />

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[#93857A] text-sm">Total este mês</p>
          <p className="text-[#382314] text-3xl sm:text-4xl font-bold mt-1">
            R$ {total.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#382314] text-sm font-bold">+{lastMonthChange}%</p>
          <p className="text-[#93857A] text-sm">do mês passado</p>
        </div>
      </div>

      <button
        onClick={() => setEditOpen((v) => !v)}
        className="w-full py-2.5 rounded-xl bg-[#F4EDE7] text-[#382314] text-sm font-semibold hover:bg-[#EEE5DB] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC755D] focus-visible:ring-offset-2"
      >
        {editOpen ? 'Fechar edição' : 'Editar gastos'}
      </button>

      {editOpen && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {data.map((item) => (
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
                    value={inputs[item.day]}
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
