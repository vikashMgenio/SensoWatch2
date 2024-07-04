import { InfluxDB } from '@influxdata/influxdb-client';

const url = process.env.NEXT_PUBLIC_INFLUXDB_URL;
const token = process.env.NEXT_PUBLIC_INFLUXDB_TOKEN;
const org = process.env.NEXT_PUBLIC_INFLUXDB_ORG;
const bucket = process.env.NEXT_PUBLIC_INFLUXDB_BUCKET;

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export const getInfluxData = async (query) => {
  const result = [];
  return new Promise((resolve, reject) => {
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

export const getMachineDataQuery = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "machine_data")
  |> aggregateWindow(every: 1m, fn: mean)
  |> yield(name: "mean")`;

export const getMLResultQuery = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "mlresult")
  |> aggregateWindow(every: 1m, fn: mean)
  |> yield(name: "mean")`;
