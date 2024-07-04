import dynamic from 'next/dynamic';
import { newTable } from '@influxdata/giraffe';
import { useEffect, useState } from 'react';
import { getInfluxData } from '../lib/influxdb';

const Plot = dynamic(() => import('@influxdata/giraffe').then(mod => mod.Plot), { ssr: false });

const LineChartComponent = ({ dataQuery, title }) => {
  const [table, setTable] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfluxData(dataQuery);
        console.log(data)
        if (!data || data.length === 0) {
          throw new Error('No data returned from InfluxDB');
        }
        data.filter((l)=>l._value!==null);
        console.log(data)
        const tableBuilder = newTable(data.length);
        tableBuilder.addColumn('_time', 'time', 'dateTime:RFC3339', data.map(d => new Date(d._time)));
        tableBuilder.addColumn('_value', 'number', 'number', data.map(d => d._value !==null ? d._value : -1));
        console.log("check tool")
        setTable(tableBuilder);
      } catch (err) {
        console.error('Data processing error:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [dataQuery]);

  if (error) return <div>Error: {error}</div>;
  if (!table) return <div>Loading...</div>;

  return (
    <div>
      <h2>{title}</h2>
      <Plot
        config={{
          table,
          layers: [
            {
              type: 'line',
              x: '_time',
              y: '_value',
              colors: ['#31C0F6'],
              lineWidth: 2,
              lineDash: [0],
              lineInterpolation: 'linear',
            },
          ],
          xAxisLabel: 'Time',
          yAxisLabel: 'Value',
          timeZone: 'UTC',
        }}
      />
    </div>
  );
};

export default LineChartComponent;
