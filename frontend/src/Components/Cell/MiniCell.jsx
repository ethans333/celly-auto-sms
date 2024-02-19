export default function ({ title, emoji }) {
  return (
    <div className="mini-cell-card">
      <div className="flex">
        <p className="card-emoji">{emoji}</p>
        <h1 className="card-title">{title}</h1>
      </div>
    </div>
  );
}

export function EmptyMiniCard() {
  return (
    <div className="empty-mini-cell">
      <p className="text-gray-200 font-semibold text-center mt-6">
        Connect to Add
      </p>
    </div>
  );
}
