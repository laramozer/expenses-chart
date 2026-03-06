import BalanceCard from './components/BalanceCard';
import SpendingCard from './components/SpendingCard';

export default function App() {
  return (
    <main className="min-h-screen bg-[#F8E9D9] flex items-center justify-center px-4 py-10">
      <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md">
        <BalanceCard />
        <SpendingCard />
      </div>
    </main>
  );
}
