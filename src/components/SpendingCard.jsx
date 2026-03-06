import BarChart from './BarChart';
import data from '../data/data.json';

const totalThisMonth = data.reduce((sum, d) => sum + d.amount, 0);
const lastMonthChange = 2.4;

export default function SpendingCard() {
  return (
    <div className="bg-[#FEFAF6] rounded-2xl px-6 pt-8 pb-6 w-full flex flex-col gap-6 shadow-sm">
      <h2 className="text-[#382314] text-xl sm:text-2xl font-bold">Gastos - Últimos 7 dias</h2>

      <BarChart data={data} />

      <hr className="border-[#EEE5DB]" />

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[#93857A] text-sm">Total este mês</p>
          <p className="text-[#382314] text-3xl sm:text-4xl font-bold mt-1">
            R$ {totalThisMonth.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#382314] text-sm font-bold">+{lastMonthChange}%</p>
          <p className="text-[#93857A] text-sm">do mês passado</p>
        </div>
      </div>
    </div>
  );
}
