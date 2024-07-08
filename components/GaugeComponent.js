import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getInfluxData } from '../lib/influxdb';
import styles from './Dashboard.module.css';
import { newTable, } from '@influxdata/giraffe';

const Gauge = dynamic(() => import('@influxdata/giraffe').then(mod => mod.Gauge), { ssr: false });

// function getRandomNumber(min, max) {
//   return Math.random() * (max - min) + min
// }
// const createColumns = (minValue, maxValue) => {
//   TIME_COL = []
//   VALUE_COL = []
//   for (let i = 0; i < numberOfRecords; i += 1) {
//     VALUE_COL.push(getRandomNumber(minValue, maxValue))
//     TIME_COL.push(now + (i % recordsPerLine) * 1000 * 60)
//   }
// }

// export const gaugeTable = memoizeOne(
//   (minValue, maxValue) => {
//     createColumns(minValue, maxValue)
//     return newTable(numberOfRecords)
//       .addColumn('_time', 'dateTime:RFC3339', 'time', TIME_COL)
//       .addColumn('_value', 'system', 'number', VALUE_COL)
//   }
// )


const GaugeComponent = ({ dataQuery, title, yField }) => {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfluxData(dataQuery);
        console.log('Fetched data:', data);
        if (!data || data.length === 0) {
          throw new Error('No data returned from InfluxDB');
        }


        const filteredData = data.filter(d => {
          return d._field === yField;
        });
        const latestValue = newTable(filteredData.length)
          .addColumn('_time', 'dateTime:RFC3339', 'time', filteredData.map(d => {
            const date = new Date(d._time);
            return date.getTime();
          }), "time")
          .addColumn("_value", "system", 'number', filteredData.map(d => parseFloat(d._value)), "yField");


        console.log("temp_data::::::", latestValue);
        setValue(latestValue);
      } catch (err) {
        console.error('Data processing error:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [dataQuery, yField]);
  const validGaugeSize = Number(
    Math.min(Math.max(3, Math.PI), 2 * Math.PI).toFixed(3)
  )

  // if (error) return <div>Error: {error}</div>;
  // if (value === null) return <div>Loading...</div>;
  console.log("value::::::", value);
  return (
    <div className="bg-white">
      <h2 className={styles.chartTitle}>{title}</h2>
      {/* <Gauge
        value={value}
        colors={['#00ff00', '#ff0000']}
        label={title}
        gaugeSize={validGaugeSize}
        gaugePosition={3}
      />
       */}

      {/* <Gauge
        width={100}
        height={100}
        // colors={gaugeColors}
        // prefix={prefix}
        // tickPrefix={tickPrefix}
        // suffix={suffix}
        // tickSuffix={tickSuffix}
        gaugePosition={value}
        decimalPlaces={decimalPlaces}
        gaugeSize={validGaugeSize}
        theme={{ ...GAUGE_THEME_DARK, ...gaugeTheme }}
      /> */}


    </div>
  );
};

export default GaugeComponent;
