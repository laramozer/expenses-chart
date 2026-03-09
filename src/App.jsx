import { useState } from 'react';
import BalanceCard from './components/BalanceCard';
import SpendingCard from './components/SpendingCard';
import Planilha from './pages/Planilha';
import initialData from './data/data.json';

export default function App() {
  const [page, setPage] = useState('home');
  const [months, setMonths] = useState(initialData);

  function updateMonth(monthIndex, updater) {
    setMonths((prev) =>
      prev.map((m, i) => (i === monthIndex ? updater(m) : m))
    );
  }

  return (
    <main className="min-h-screen bg-[#F8E9D9] flex items-center justify-center px-4 py-10">
      {page === 'home' && (
        <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md">
          <BalanceCard />
          <SpendingCard
            months={months}
            updateMonth={updateMonth}
            onOpenPlanilha={() => setPage('planilha')}
          />
        </div>
      )}

      {page === 'planilha' && (
        <Planilha
          months={months}
          updateMonth={updateMonth}
          onBack={() => setPage('home')}
        />
      )}
    </main>
  );
}
