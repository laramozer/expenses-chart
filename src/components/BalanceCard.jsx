import { useState, useRef, useEffect } from 'react';

const BALANCE_KEY = 'expenses-chart-balance';

export default function BalanceCard() {
  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(BALANCE_KEY);
      return saved !== null ? parseFloat(saved) : 921.48;
    } catch {
      return 921.48;
    }
  });
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setInputValue(String(balance));
      setError(false);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function handleSave() {
    const parsed = parseFloat(inputValue.replace(',', '.'));
    if (isNaN(parsed) || parsed < 0) {
      setError(true);
      return;
    }
    setBalance(parsed);
    localStorage.setItem(BALANCE_KEY, String(parsed));
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  }

  const formatted = balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-[#EC755D] rounded-2xl px-6 py-5 flex items-center justify-between w-full gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[#F9E4D4] text-sm font-medium">Meu saldo</p>

        {editing ? (
          <div className="mt-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold shrink-0">R$</span>
              <input
                ref={inputRef}
                type="number"
                min="0"
                step="0.01"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setError(false); }}
                onKeyDown={handleKeyDown}
                className={[
                  'w-full bg-white/20 text-white placeholder-white/60 text-xl font-bold rounded-lg px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors',
                  error ? 'ring-2 ring-red-300' : '',
                ].join(' ')}
              />
            </div>
            {error && <p className="text-white/80 text-xs">Valor inválido</p>}
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-1 rounded-lg bg-white/30 hover:bg-white/40 text-white text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-white text-3xl font-bold mt-1 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
            aria-label="Editar saldo"
          >
            R$ {formatted}
          </button>
        )}
      </div>

      <div className="flex items-center justify-center shrink-0">
        <svg width="72" height="48" viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="26" cy="24" r="24" fill="#382314" />
          <circle cx="46" cy="24" r="24" fill="#F96B2B" fillOpacity="0.85" />
        </svg>
      </div>
    </div>
  );
}
