import React, { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Portfolio.module.css';

interface HoldingRow {
  symbol: string;
  name: string;
  category: 'Crypto' | 'ETF';
  quantity: number;
  price: number;
  value: number;
  changePercent: number;
  changeValue: number;
  sparkline: string;
  color: 'green' | 'magenta' | 'orange';
}


const GOAL_VALUE = 5_000_000;

const HOLDINGS: HoldingRow[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'Crypto',
    quantity: 48.72,
    price: 102_960.8,
    value: 5_012_345.7,
    changePercent: 0.16,
    changeValue: 8_025,
    sparkline: '▁▂▃▅▆▇███',
    color: 'green',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'Crypto',
    quantity: 1_456.23,
    price: 3_416.78,
    value: 4_975_612.4,
    changePercent: 2.34,
    changeValue: 116_450,
    sparkline: '▃▄▅▆▇████',
    color: 'orange',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    category: 'Crypto',
    quantity: 32_456,
    price: 154.35,
    value: 5_012_890.6,
    changePercent: 5.49,
    changeValue: 275_670,
    sparkline: '▂▃▄▆▇████',
    color: 'magenta',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    category: 'Crypto',
    quantity: 2_080_123,
    price: 2.4,
    value: 4_992_295.2,
    changePercent: 9.63,
    changeValue: 480_120,
    sparkline: '▁▂▄▅▇████',
    color: 'magenta',
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    category: 'Crypto',
    quantity: 51_234,
    price: 101.22,
    value: 5_188_760.5,
    changePercent: 26.11,
    changeValue: 1_353_890,
    sparkline: '▁▂▃▅▇████',
    color: 'magenta',
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    category: 'ETF',
    quantity: 7_312,
    price: 683.46,
    value: 4_999_991.52,
    changePercent: 1.81,
    changeValue: 90_450,
    sparkline: '▃▄▅▆▇███',
    color: 'green',
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ',
    category: 'ETF',
    quantity: 8_023,
    price: 621.57,
    value: 4_985_670.11,
    changePercent: 2.27,
    changeValue: 113_120,
    sparkline: '▂▄▅▆▇███',
    color: 'green',
  },
  {
    symbol: 'VTI',
    name: 'Vanguard Total Market',
    category: 'ETF',
    quantity: 14_890,
    price: 335.74,
    value: 5_001_238.6,
    changePercent: 2.23,
    changeValue: 111_780,
    sparkline: '▃▄▅▆▇███',
    color: 'green',
  },
  {
    symbol: 'ARKK',
    name: 'ARK Innovation',
    category: 'ETF',
    quantity: 60_789,
    price: 82.11,
    value: 4_992_456.79,
    changePercent: 3.14,
    changeValue: 156_780,
    sparkline: '▂▃▅▆▇███',
    color: 'green',
  },
  {
    symbol: 'IWM',
    name: 'iShares Russell 2000',
    category: 'ETF',
    quantity: 20_567,
    price: 243.88,
    value: 5_016_526.96,
    changePercent: 2.33,
    changeValue: 116_890,
    sparkline: '▃▄▅▆▇███',
    color: 'green',
  },
];

const TICKERS = ['BTC $102,960 ▲', 'ETH $3,416 ▲', 'SOL $154 ▲', 'XRP $2.40 ▲', 'LTC $101 ▲', 'SPY $683 ▲'];

type SortKey = 'value' | 'gain' | 'volatility' | 'name';
type FilterKey = 'All' | 'Crypto' | 'ETF' | 'Top Gainers';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value >= 1000 ? 2 : 2,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);

const heatmapTrend = (color: HoldingRow['color']) => {
  switch (color) {
    case 'magenta':
      return 'magenta';
    case 'orange':
      return 'orange';
    default:
      return 'positive';
  }
};

const PortfolioPage: React.FC = () => {
  const [sortKey, setSortKey] = useState<SortKey>('value');
  const [filterKey, setFilterKey] = useState<FilterKey>('All');
  const [heatmapMode, setHeatmapMode] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [pulse, setPulse] = useState<number>(0);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setPulse((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const totals = useMemo(() => {
    const portfolio = HOLDINGS.reduce((acc, holding) => acc + holding.value, 0);
    const todayGain = HOLDINGS.reduce((acc, holding) => acc + holding.changeValue, 0);
    const ytdGain = 3_210_000; // mock data from description
    return { portfolio, todayGain, ytdGain };
  }, []);

  const filteredHoldings = useMemo(() => {
    let rows = HOLDINGS;
    if (filterKey === 'Crypto') {
      rows = rows.filter((row) => row.category === 'Crypto');
    } else if (filterKey === 'ETF') {
      rows = rows.filter((row) => row.category === 'ETF');
    } else if (filterKey === 'Top Gainers') {
      rows = [...rows].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    }

    const sortedRows = [...rows].sort((a, b) => {
      switch (sortKey) {
        case 'gain':
          return b.changeValue - a.changeValue;
        case 'volatility':
          return b.changePercent - a.changePercent;
        case 'name':
          return a.symbol.localeCompare(b.symbol);
        case 'value':
        default:
          return b.value - a.value;
      }
    });

    return sortedRows;
  }, [filterKey, sortKey]);

  const cryptoAllocation = useMemo(() => {
    const cryptoValue = HOLDINGS.filter((row) => row.category === 'Crypto').reduce((acc, row) => acc + row.value, 0);
    return (cryptoValue / totals.portfolio) * 100;
  }, [totals.portfolio]);

  const etfAllocation = 100 - cryptoAllocation;

  const donutCircumference = 2 * Math.PI * 90;
  const cryptoDash = (cryptoAllocation / 100) * donutCircumference;
  const etfDash = donutCircumference - cryptoDash;

  const tickerItems = useMemo(() => {
    const cycle = pulse % TICKERS.length;
    const rotated = [...TICKERS.slice(cycle), ...TICKERS.slice(0, cycle)];
    return [...rotated, ...rotated];
  }, [pulse]);

  const handlePriceClick = (holding: HoldingRow) => {
    if (typeof window === 'undefined') return;
    window.alert(`Quick trade ticket for ${holding.symbol}:\nMarket price ${formatCurrency(holding.price)}.`);
  };

  return (
    <>
      <Head>
        <title>Live Portfolio • Jacob Vigil</title>
      </Head>
      <main className={styles.page}>
        <section className={styles.header}>
          <div className={styles.headerBlock}>
            <span className={styles.headerTitle}>Total Portfolio</span>
            <span className={styles.headerValue}>{formatCurrency(totals.portfolio)}</span>
            <span className={styles.headerDelta} style={{ color: 'var(--accent-green)' }}>
              ↑ {formatCurrency(totals.todayGain)} (+2.03%) Today
            </span>
            <div className={styles.headerMeta}>
              <span>Account: Jacob Vigil • Pro+ Verified • Live Sync</span>
              <span>Updated Wednesday, November 12, 2025 • 3:02 PM EST</span>
            </div>
          </div>
          <div className={styles.headerBlock}>
            <span className={styles.headerTitle}>Year to Date</span>
            <span className={styles.headerValue}>↑ {formatCurrency(totals.ytdGain)}</span>
            <span className={styles.headerDelta} style={{ color: 'var(--accent-green)' }}>
              +34.7% YTD vs. Jan 1 balance
            </span>
            <div className={styles.headerMeta}>
              <span>Cold Wallet Coverage: 96%</span>
              <span>Security Stack: 256-bit AES • 2FA • Biometrics</span>
            </div>
          </div>
          <div className={styles.headerBlock}>
            <span className={styles.headerTitle}>Auto-Refresh</span>
            <span className={styles.headerValue}>{autoRefresh ? 'Live • 3s' : 'Paused'}</span>
            <span className={styles.headerDelta} style={{ color: autoRefresh ? 'var(--accent-green)' : 'var(--text-muted)' }}>
              {autoRefresh ? 'Streaming real-time ticks' : 'Manual refresh enabled'}
            </span>
            <div className={styles.headerMeta}>
              <span>Click ticker to pause animation</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(event) => setAutoRefresh(event.target.checked)}
                  style={{ accentColor: '#00ff85', width: '18px', height: '18px' }}
                />
                Auto-refresh every 3s
              </label>
            </div>
          </div>
        </section>

        <div className={styles.layout}>
          <section className={styles.card}>
            <header className={styles.cardTitle}>
              <span>Dynamic Holdings</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sorted by {sortKey}</span>
            </header>

            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                {(['value', 'gain', 'volatility', 'name'] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.controlButton} ${sortKey === key ? styles.controlButtonActive : ''}`}
                    onClick={() => setSortKey(key)}
                  >
                    Sort: {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
              <div className={styles.controlGroup}>
                {(['All', 'Crypto', 'ETF', 'Top Gainers'] as FilterKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.controlPill} ${filterKey === key ? styles.controlPillActive : ''}`}
                    onClick={() => setFilterKey(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <div className={styles.controlGroup}>
                <button
                  type="button"
                  className={`${styles.controlPill} ${heatmapMode ? styles.controlPillActive : ''}`}
                  onClick={() => setHeatmapMode((prev) => !prev)}
                >
                  Heatmap Mode
                </button>
                <button type="button" className={styles.controlPill}>
                  Export CSV
                </button>
                <button type="button" className={styles.controlPill}>
                  Export PDF
                </button>
                <button type="button" className={styles.controlPill}>
                  Screenshot
                </button>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Value</th>
                    <th>24h Δ</th>
                    <th>Gain/Loss</th>
                    <th>Sparkline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.map((holding) => {
                    const progress = Math.min((holding.value / GOAL_VALUE) * 100, 120);
                    const changeClass =
                      holding.color === 'magenta'
                        ? styles.changeMagenta
                        : holding.color === 'orange'
                        ? styles.changeOrange
                        : styles.changePositive;

                    const rowClass = heatmapMode ? `${styles.row} ${styles.rowHeatmap}` : styles.row;

                    return (
                      <tr
                        key={holding.symbol}
                        className={rowClass}
                        data-trend={heatmapMode ? heatmapTrend(holding.color) : undefined}
                      >
                        <td>
                          <div className={styles.assetCell}>
                            <span className={styles.assetIcon}>{holding.symbol.slice(0, 2)}</span>
                            <span>{holding.symbol}</span>
                          </div>
                          <div className={styles.miniChart}>
                            <span style={{ color: 'var(--text-muted)' }}>{holding.name}</span>
                            <div className={styles.sparkBadge}>
                              <span className={changeClass}>Δ {holding.changePercent.toFixed(2)}%</span>
                              <span className={styles.sparkline}>{holding.sparkline}</span>
                            </div>
                          </div>
                        </td>
                        <td>{formatNumber(holding.quantity)}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.priceLink}
                            onClick={() => handlePriceClick(holding)}
                          >
                            {formatCurrency(holding.price)}
                          </button>
                        </td>
                        <td>
                          <div className={styles.valueStack}>
                            <span
                              className={styles.valuePrimary}
                              style={{
                                color:
                                  holding.color === 'magenta'
                                    ? 'var(--accent-magenta)'
                                    : holding.color === 'orange'
                                    ? 'var(--accent-orange)'
                                    : 'var(--accent-green)',
                              }}
                            >
                              {formatCurrency(holding.value)}
                            </span>
                            <span className={styles.goalIndicator}>Goal coverage</span>
                            <div className={styles.valueProgress}>
                              <span
                                className={styles.valueProgressBar}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className={changeClass}>↑ +{holding.changePercent.toFixed(2)}%</td>
                        <td className={changeClass}>+{formatCurrency(holding.changeValue)}</td>
                        <td>
                          <span className={styles.sparkline} style={{ color: `var(--accent-${holding.color})` }}>
                            {holding.sparkline}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionGroup}>
                            <button type="button" className={styles.actionButton}>
                              Buy
                            </button>
                            <button type="button" className={`${styles.actionButton} ${styles.actionButtonSecondary}`}>
                              Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className={`${styles.card} ${styles.sideCard}`}>
            <div>
              <header className={styles.cardTitle}>
                <span>Allocation Donut</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Animated • Clickable</span>
              </header>
              <div className={styles.donutContainer}>
                <div className={styles.donut}>
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle
                      cx="110"
                      cy="110"
                      r="90"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="24"
                      fill="transparent"
                    />
                    <circle
                      cx="110"
                      cy="110"
                      r="90"
                      stroke="var(--accent-magenta)"
                      strokeWidth="24"
                      strokeDasharray={`${cryptoDash} ${donutCircumference}`}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    <circle
                      cx="110"
                      cy="110"
                      r="90"
                      stroke="var(--accent-green)"
                      strokeWidth="24"
                      strokeDasharray={`${etfDash} ${donutCircumference}`}
                      strokeDashoffset={cryptoDash * -1}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className={styles.donutLabel}>
                    <span>
                      Crypto {cryptoAllocation.toFixed(1)}%
                      <br /> ETFs {etfAllocation.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ background: 'var(--accent-magenta)' }} />
                    <span>Crypto {cryptoAllocation.toFixed(1)}%</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ background: 'var(--accent-green)' }} />
                    <span>ETFs {etfAllocation.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <header className={styles.cardTitle}>
                <span>Live Ticker</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to pause</span>
              </header>
              <div className={styles.ticker}>
                <div className={styles.tickerTrack}>
                  {tickerItems.map((item, index) => (
                    <span key={`${item}-${index}`}>{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <header className={styles.cardTitle}>
                <span>Security Stack</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cold Wallet 96%</span>
              </header>
              <div className={styles.security}>
                <span>256-bit AES</span>
                <span>Cold Storage Coverage 96%</span>
                <span>Multi-factor + Biometrics</span>
                <span>Session Monitoring Enabled</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default PortfolioPage;
