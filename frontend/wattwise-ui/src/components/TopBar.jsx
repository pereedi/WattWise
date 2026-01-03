export default function TopBar({
  homes,
  selectedHome,
  onHomeChange,
  start,
  end,
  onStartChange,
  onEndChange,
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderBottom: "1px solid #eee" }}>
      <div style={{ fontWeight: 700 }}>WattWise</div>

      <label>
        Home{" "}
        <select value={selectedHome} onChange={(e) => onHomeChange(e.target.value)}>
          {homes.map((h) => (
            <option key={h.home_id} value={h.home_id}>
              {h.home_id} • {h.home_type}
            </option>
          ))}
        </select>
      </label>

      <label>
        Start{" "}
        <input type="date" value={start} onChange={(e) => onStartChange(e.target.value)} />
      </label>

      <label>
        End{" "}
        <input type="date" value={end} onChange={(e) => onEndChange(e.target.value)} />
      </label>
    </div>
  );
}
