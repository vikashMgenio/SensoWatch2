import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getInfluxData } from '../lib/influxdb';

const Gauge = dynamic(() => import('@influxdata/giraffe').then(mod => mod.Gauge), { ssr: false });

const GaugeComponent = ({ dataQuery, title }) => {
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
        const latestValue = data[data.length - 1]._value;
        setValue(latestValue !== null ? latestValue : -1);
      } catch (err) {
        console.error('Data processing error:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [dataQuery]);

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
