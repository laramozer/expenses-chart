export default function BalanceCard() {
  return (
    <div className="bg-[#EC755D] rounded-2xl px-6 py-5 flex items-center justify-between w-full">
      <div>
        <p className="text-[#F9E4D4] text-sm font-medium">Meu saldo</p>
        <p className="text-white text-3xl font-bold mt-1">R$ 921,48</p>
      </div>
      <div className="flex items-center justify-center">
        <svg width="72" height="48" viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="26" cy="24" r="24" fill="#382314" />
          <circle cx="46" cy="24" r="24" fill="#F96B2B" fillOpacity="0.85" />
        </svg>
      </div>
    </div>
  );
}
