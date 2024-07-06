import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getInfluxData } from '../lib/influxdb';

const Gauge = dynamic(() => import('@influxdata/giraffe').then(mod => mod.Gauge), { ssr: false });

const GaugeComponent = ({ dataQuery, title, yField }) => {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfluxData(dataQuery);
        console.log('Fetched data:', data); // Log fetched data
        if (!data || data.length === 0) {
          throw new Error('No data returned from InfluxDB');
        }

        const filteredData = data.filter(d => d[yField] !== null && d[yField] !== undefined);
        const latestValue = filteredData[filteredData.length - 1]?.[yField] ?? 0; // Default to 0 if null or undefined
        setValue(latestValue);
      } catch (err) {
        console.error('Data processing error:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [dataQuery, yField]);

  if (error) return <div>Error: {error}</div>;
  if (value === null) return <div>Loading...</div>;

  return (
    <div>
      <h2>{title}</h2>
      <Gauge
        value={value}
        max={100}
        colors={['#00ff00', '#ff0000']}
        label={title}
      />
    </div>
  );
};

export default GaugeComponent;
