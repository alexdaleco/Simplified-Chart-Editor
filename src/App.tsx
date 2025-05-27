import './App.css'
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [labels, setLabels] = useState('Red,Blue,Yellow,Green,Purple,Orange');
  const [data, setData] = useState('12,19,3,5,2,3');
  const [showChartTypeFlyout, setShowChartTypeFlyout] = useState(false);
  const [chartType, setChartType] = useState<'bar'|'stackedBar'|'line'|'area'|'pie'|'radar'>('bar');
  const chartInstanceRef = useRef<Chart|null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    let type: any = 'bar';
    let options: any = {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: {
          labels: {
            font: { family: 'Canva Sans', weight: '500' }
          }
        },
        title: {
          font: { family: 'Canva Sans', weight: '500' }
        },
        tooltip: {
          bodyFont: { family: 'Canva Sans', weight: '500' },
          titleFont: { family: 'Canva Sans', weight: '500' }
        }
      },
      font: { family: 'Canva Sans', weight: '500' }
    };
    let datasetOptions: any = {};
    if (chartType === 'bar') {
      type = 'bar';
      options.scales = { y: { beginAtZero: true, stacked: false }, x: { stacked: false } };
    } else if (chartType === 'stackedBar') {
      type = 'bar';
      options.scales = { y: { beginAtZero: true, stacked: true }, x: { stacked: true } };
    } else if (chartType === 'line') {
      type = 'line';
      options.scales = { y: { beginAtZero: true } };
      datasetOptions = { fill: false };
    } else if (chartType === 'area') {
      type = 'line';
      options.scales = { y: { beginAtZero: true } };
      datasetOptions = { fill: true };
    } else if (chartType === 'pie') {
      type = 'pie';
      options.scales = undefined;
    } else if (chartType === 'radar') {
      type = 'radar';
      options.scales = undefined;
    }
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, {
      type: type as any,
      data: {
        labels: labels.split(','),
        datasets: [{
          label: '# of Votes',
          data: data.split(',').map(Number),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          ...datasetOptions
        }]
      },
      options
    });
    return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
  }, [labels, data, chartType]);

  const handleSaveData = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = labels.split(',');
      chartInstanceRef.current.data.datasets[0].data = data.split(',').map(Number);
      chartInstanceRef.current.update();
    }
    setShowDataPanel(false);
  };

  const handleChartTypeSelect = (type: typeof chartType) => {
    setChartType(type);
    setShowChartTypeFlyout(false);
  };

  return (
    <div id="container">
      <header>
        <img 
          className="menu" 
          src="/images/menu_2.png" 
          alt="Menu"
        />
        <img 
          className="profile" 
          src="/images/menu_2_update.png" 
          alt="Profile"
        />
      </header>
      <div className="sidebar"></div>
      <img 
        src="/images/bottom-left_1_reduced.png" 
        className="bottom-left" 
        alt="Bottom left decoration"
      />
      <footer>
        <img 
          className="page" 
          src="/images/page.png" 
          alt="Page controls"
        />
      </footer>
      <div className="main-area" style={{ marginLeft: showEditPanel ? 360 : 0, transition: 'margin-left 0.3s' }}>
        <div className="toolbar">
          <button className="toolbar-button" onClick={() => setShowEditPanel(v => !v)}><img className="toolbar-icon toolbar-button-edit" src="/icons/icon-chart-slider.svg" alt="Edit" /> Edit</button>
          <button className="toolbar-button"><img className="toolbar-icon toolbar-button-annotation" src="/icons/icon-chart-slider.svg" alt="Annotation" /> Annotation</button>
          <button className="toolbar-button"><img className="toolbar-icon toolbar-button-data" src="/icons/icon-sheet.svg" alt="Data" /> Data</button>
          <div style={{position: 'relative', display: 'inline-block'}}>
            <button
              className="toolbar-button"
              onClick={() => setShowChartTypeFlyout(v => !v)}
              style={{display: 'flex', alignItems: 'center'}}
            >
              <img className="toolbar-icon toolbar-button-chart-type" src="/icons/icon-chart-slider.svg" alt="Chart Type" /> Chart Type <span style={{marginLeft: 6, fontSize: 18}}>▼</span>
            </button>
            {showChartTypeFlyout && (
              <div className="chart-type-flyout">
                <div className={`chart-type-option${chartType==='bar' ? ' selected' : ''}`} onClick={() => handleChartTypeSelect('bar')}><span className="chart-type-icon">📊</span> Bar Chart</div>
                <div className={`chart-type-option${chartType==='stackedBar' ? ' selected' : ''}`} onClick={() => handleChartTypeSelect('stackedBar')}><span className="chart-type-icon">📋</span> Stacked Bar</div>
                <div className={`chart-type-option${chartType==='line' ? ' selected' : ''}`} onClick={() => handleChartTypeSelect('line')}><span className="chart-type-icon">📈</span> Line Chart</div>
                <div className={`chart-type-option${chartType==='area' ? ' selected' : ''}`} onClick={() => handleChartTypeSelect('area')}><span className="chart-type-icon">〰️</span> Area Chart</div>
                <div className={`chart-type-option${chartType==='pie' ? ' selected' : ''}`} onClick={() => handleChartTypeSelect('pie')}><span className="chart-type-icon">🥧</span> Pie Chart</div>
                <div className={`chart-type-option${chartType==='radar' ? ' selected' : ''}`} onClick={() => handleChartTypeSelect('radar')}><span className="chart-type-icon">⬡</span> Radar Chart</div>
              </div>
            )}
          </div>
          <button className="toolbar-button"><img className="toolbar-icon toolbar-button-settings" src="/icons/icon-chart-slider.svg" alt="Settings" /> Settings</button>
        </div>
        {showDataPanel && (
          <div className="data-panel">
            <div style={{marginBottom: 8}}>
              <label>Labels (comma separated):</label><br />
              <textarea value={labels} onChange={e => setLabels(e.target.value)} rows={2} style={{width: '100%'}} />
            </div>
            <div style={{marginBottom: 8}}>
              <label>Data (comma separated):</label><br />
              <textarea value={data} onChange={e => setData(e.target.value)} rows={2} style={{width: '100%'}} />
            </div>
            <button className="toolbar-button" onClick={handleSaveData}>Save</button>
          </div>
        )}
        <div className="design-canvas">
          <div className="chart-container">
            <canvas ref={chartRef} style={{width: '100%', height: '100%'}} />
          </div>
        </div>
        <div className="page-control">
          <div className="page-item selected">
            <div className="page-thumb-label">
              <img className="page-icon" src="/icons/icon-chart-slider.svg" alt="Page 1" />
              1
            </div>
          </div>
          <div className="page-item">
            <div className="page-thumb-label">
              <img className="page-icon" src="/icons/icon-chart-slider.svg" alt="Page 2" />
              2
            </div>
          </div>
          <div className="page-item add-new">
            <img className="page-add-icon" src="/icons/icon-plus.svg" alt="Add Page" />
          </div>
        </div>
        {showEditPanel && (
          <div className="edit-panel">
            <div className="edit-panel-header">
              <span className="edit-panel-title">Edit</span>
              <button className="edit-panel-close" onClick={() => setShowEditPanel(false)} aria-label="Close">&times;</button>
            </div>
            {/* Edit settings will go here */}
            <div className="edit-content">
              {Array.from({ length: 18 }).map((_, i) => (
                <div className="edit-panel-placeholder-box" key={i}>Placeholder {i + 1}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
