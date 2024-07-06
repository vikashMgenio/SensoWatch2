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
        resolve(result);
      },
    });
  });
};

// Query for machine_data
export const getMachineDataQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "machine_data")
  |> filter(fn: (r) => r._field == "load" or r._field == "power" or r._field == "temperature" or r._field == "vibration")
  |> aggregateWindow(every: 1m, fn: mean)
  |> yield(name: "mean")`;

// Query for mlresult
export const getMLResultQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "mlresult")
  |> filter(fn: (r) => r._field == "is_anomalous" or r._field == "mse_percentage" or r._field == "stream_id" or r._field == "vibration")
  |> aggregateWindow(every: 1m, fn: mean)
  |> yield(name: "mean")`;
