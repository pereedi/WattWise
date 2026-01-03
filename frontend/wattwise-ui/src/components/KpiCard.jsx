export default function KpiCard({ title, value, sub }) {
  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 10, minWidth: 180 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{value}</div>
      {sub ? <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{sub}</div> : null}
    </div>
  );
}
