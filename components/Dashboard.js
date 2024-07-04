import { useEffect, useState } from 'react';
import { getMachineDataQuery, getMLResultQuery } from '../lib/influxdb';
import dynamic from 'next/dynamic';
import styles from './Dashboard.module.css';

const GaugeComponent = dynamic(() => import('./GaugeComponent'), { ssr: false });
const LineChartComponent = dynamic(() => import('./LineChartComponent'), { ssr: false });

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>InfluxDB Real-time Dashboard</h1>
      </header>
      <main className={styles.main}>
        {isClient && (
          <div className={styles.dashboard}>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getMachineDataQuery} title="Machine Data Gauge" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getMachineDataQuery} title="Machine Data Line Chart" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <GaugeComponent dataQuery={getMLResultQuery} title="ML Result Gauge" />
            </div>
            <div className={`${styles.plotContainer} ${styles.fadeIn}`}>
              <LineChartComponent dataQuery={getMLResultQuery} title="ML Result Line Chart" />
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
