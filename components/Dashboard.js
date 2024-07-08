import { useEffect, useState } from 'react';
import {
  getLoadDataQuery, getPowerDataQuery, getTemperatureDataQuery, getVibrationDataQuery,
  getMsePercentageDataQuery, getMlVibrationDataQuery
} from '../lib/influxdb';
import dynamic from 'next/dynamic';
import styles from './Dashboard.module.css';

const LineChartComponent = dynamic(() => import('./LineChartComponent'), { ssr: false });
const GaugeComponent = dynamic(() => import('./GaugeComponent'), { ssr: false });

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>InfluxDB Real-time Dashboard</h1>
      </header>
      <main className={styles.main}>
        {isClient && (
          <div className={styles.dashboard}>
            {/* Machine Data */}
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getLoadDataQuery} title="Machine Data: Load" yField="load" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getLoadDataQuery} title="Machine Data: Load Gauge" yField="load" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getPowerDataQuery} title="Machine Data: Power" yField="power" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getPowerDataQuery} title="Machine Data: Power Gauge" yField="power" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getTemperatureDataQuery} title="Machine Data: Temperature" yField="temperature" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getTemperatureDataQuery} title="Machine Data: Temperature Gauge" yField="temperature" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getVibrationDataQuery} title="Machine Data: Vibration" yField="vibration" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getVibrationDataQuery} title="Machine Data: Vibration Gauge" yField="vibration" />
            </div>

            {/* ML Results */}
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getMsePercentageDataQuery} title="ML Results: MSE Percentage" yField="mse_percentage" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getMsePercentageDataQuery} title="ML Results: MSE Percentage Gauge" yField="mse_percentage" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getMlVibrationDataQuery} title="ML Results: Vibration" yField="vibration" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getMlVibrationDataQuery} title="ML Results: Vibration Gauge" yField="vibration" />
            </div>

          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 InfluxDB Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;

