export function Card({ children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
