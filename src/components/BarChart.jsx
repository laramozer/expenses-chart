import { useState } from 'react';

const MAX_BAR_HEIGHT = 130;

export default function BarChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div
      className="flex items-end justify-between gap-2 sm:gap-4 w-full"
      style={{ height: `${MAX_BAR_HEIGHT + 32}px` }}
      role="img"
      aria-label="Gráfico de barras de gastos dos últimos 7 dias"
    >
      {data.map((item, index) => {
        const isMax = item.amount === maxAmount;
        const isHovered = hoveredIndex === index;
        const barHeight = Math.max(Math.round((item.amount / maxAmount) * MAX_BAR_HEIGHT), 8);

        return (
          <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative flex justify-center w-full">
              {isHovered && (
                <div
                  className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#382314] text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap z-10 pointer-events-none"
                  role="tooltip"
                >
                  R$ {item.amount.toFixed(2).replace('.', ',')}
                </div>
              )}
              <button
                className={[
                  'w-full rounded-md sm:rounded-lg transition-opacity duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  isMax
                    ? 'bg-[#76B5BC] focus-visible:ring-[#76B5BC]'
                    : 'bg-[#EC755D] focus-visible:ring-[#EC755D]',
                  isHovered ? 'opacity-70' : 'opacity-100',
                ].join(' ')}
                style={{ height: `${barHeight}px` }}
                aria-label={`${item.day}: R$ ${item.amount.toFixed(2).replace('.', ',')}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
              />
            </div>
            <span className="text-[#93857A] text-xs sm:text-sm select-none">{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}
