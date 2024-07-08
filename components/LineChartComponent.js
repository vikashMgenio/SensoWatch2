import dynamic from 'next/dynamic';
import { newTable, } from '@influxdata/giraffe';
import { useEffect, useState } from 'react';
import { getInfluxData } from '../lib/influxdb';
import styles from './Dashboard.module.css';

const Plot = dynamic(() => import('@influxdata/giraffe').then(mod => mod.Plot), { ssr: false });


// import {
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
const lineLayer = {
  type: "line",
  x: "_time",
  y: "_value"
};
const LineChartComponent = ({ dataQuery, title, yField }) => {
  const [table, setTable] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await getInfluxData(dataQuery);

        if (!data || data.length === 0) {
          throw new Error('No data returned from InfluxDB');
        }
        const filteredData = data.filter(d => {
          return d._field === yField;
        });
        const tableBuilder = newTable(filteredData.length)
          .addColumn('_time', 'dateTime:RFC3339', 'time', filteredData.map(d => {
            const date = new Date(d._time);

            return date.getTime();
          }), "time")
          .addColumn("_value", "double", 'number', filteredData.map(d => parseFloat(d._value)), "yField");

        setTable(tableBuilder);
      } catch (err) {
        console.error('Data processing error:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [dataQuery, yField]);

  if (error) return <div>Error: {error}</div>;
  if (!table) return <div>Loading...</div>;


  return (
    <div >
      <h2 className={styles.chartTitle}>{title}</h2>
      <p></p>

      {table && <Plot
        config={{
          table,
          layers: [
            lineLayer
          ],

        }}
      />}
    </div>
  );
};

export default LineChartComponent;
