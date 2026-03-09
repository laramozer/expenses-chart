export const CATEGORIES = [
  { id: 'alimentacao', label: 'Alimentação',  color: 'bg-orange-100 text-orange-700 border-orange-200',  dot: 'bg-orange-400' },
  { id: 'mercado',     label: 'Mercado',       color: 'bg-green-100 text-green-700 border-green-200',     dot: 'bg-green-500' },
  { id: 'transporte',  label: 'Transporte',    color: 'bg-blue-100 text-blue-700 border-blue-200',        dot: 'bg-blue-400' },
  { id: 'saude',       label: 'Saúde',         color: 'bg-red-100 text-red-700 border-red-200',           dot: 'bg-red-400' },
  { id: 'lazer',       label: 'Lazer',         color: 'bg-purple-100 text-purple-700 border-purple-200',  dot: 'bg-purple-400' },
  { id: 'casa',        label: 'Casa',          color: 'bg-amber-100 text-amber-700 border-amber-200',     dot: 'bg-amber-500' },
  { id: 'educacao',    label: 'Educação',      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',  dot: 'bg-yellow-500' },
  { id: 'outros',      label: 'Outros',        color: 'bg-gray-100 text-gray-600 border-gray-200',        dot: 'bg-gray-400' },
];

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
