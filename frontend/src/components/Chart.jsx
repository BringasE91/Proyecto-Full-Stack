// src/components/Chart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Colores para los segmentos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

// Componente Chart que recibe props: total, gastado y restante
// y renderiza un gráfico de pastel (donut) que representa la distribución del presupuesto

const Chart = ({ total, gastado, restante }) => {
  const data = [
    { name: 'Gastado', value: gastado },
    { name: 'Disponible', value: restante },
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Distribución del presupuesto</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
