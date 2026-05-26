'use client';

interface Tab {
  id:    string;
  label: string;
}

interface Props {
  tabs:     Tab[];
  active:   string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-full mb-4 overflow-x-auto scrollbar-none w-fit max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full transition-all ${
            active === tab.id
              ? 'bg-green-700 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
