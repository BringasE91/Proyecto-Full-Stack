const PresupuestoCard = ({ presupuesto }) => {
  return (
    <div style={{ border: '1px solid gray', padding: '1rem', marginBottom: '1rem' }}>
      <h2>{presupuesto.nombre_presupuesto}</h2>
      <p>Fecha: {presupuesto.fecha_inicio} a {presupuesto.fecha_fin}</p>
      <p>Monto total: S/ {presupuesto.monto_total}</p>
      <p>Restante: S/ {presupuesto.monto_restante}</p>
    </div>
  );
};

export default PresupuestoCard;
