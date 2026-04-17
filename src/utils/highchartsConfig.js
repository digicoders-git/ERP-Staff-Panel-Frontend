import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsFunnel from 'highcharts/modules/funnel';
import HighchartsDrilldown from 'highcharts/modules/drilldown';

// Initialize modules
if (typeof Highcharts === 'object') {
    if (typeof HighchartsAccessibility === 'function') HighchartsAccessibility(Highcharts);
    if (typeof HighchartsExporting === 'function') HighchartsExporting(Highcharts);
    if (typeof HighchartsFunnel === 'function') HighchartsFunnel(Highcharts);
    if (typeof HighchartsDrilldown === 'function') HighchartsDrilldown(Highcharts);
}

// Apply Global Professional Logistics Theme
Highcharts.setOptions({
    colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#06b6d4'],
    chart: {
        style: {
            fontFamily: "'Inter', system-ui, sans-serif"
        },
        backgroundColor: 'transparent'
    },
    title: {
        style: {
            color: '#1e293b',
            fontWeight: '900',
            fontSize: '18px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderRadius: 8,
            borderWidth: 0,
            states: {
                hover: {
                    brightness: 0.1,
                    halo: {
                        size: 9,
                        opacity: 0.1
                    }
                }
            }
        }
    },
    tooltip: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        shadow: true,
        useHTML: true,
        style: {
            color: '#1e293b',
            fontSize: '12px'
        }
    }
});

export default Highcharts;
