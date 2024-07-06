import { InfluxDB } from '@influxdata/influxdb-client';

const url = process.env.NEXT_PUBLIC_INFLUXDB_URL;
const token = process.env.NEXT_PUBLIC_INFLUXDB_TOKEN;
const org = process.env.NEXT_PUBLIC_INFLUXDB_ORG;
const bucket = process.env.NEXT_PUBLIC_INFLUXDB_BUCKET;

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export const getInfluxData = async (query) => {
  const result = [];
  return new Promise((resolve, reject) => {
    console.log("Executing query:", query);
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push(o);
      },
      error(error) {
        console.error('Query error:', error);
        reject(error);
      },
      complete() {
        console.log('Query complete:', result);
        resolve(result.filter(d => d._value !== null)); // Filter out null values
      },
    });
  });
};

// Specific queries for each field and measurement without aggregation
export const getLoadDataQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "machine_data" and r._field == "load")`;

export const getPowerDataQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "machine_data" and r._field == "power")`;

export const getTemperatureDataQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "machine_data" and r._field == "temperature")`;

export const getVibrationDataQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "machine_data" and r._field == "vibration")`;

export const getMsePercentageDataQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "mlresult" and r._field == "mse_percentage")`;

export const getMlVibrationDataQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "mlresult" and r._field == "vibration")`;
