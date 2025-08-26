import React, { useEffect, useRef } from 'react';

interface UsageData {
  month: string;
  usageRate: number;
}

interface VehicleUsageChartProps {
  data: UsageData[];
}

const VehicleUsageChart: React.FC<VehicleUsageChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const loadECharts = async () => {
      try {
        const echarts = await import('echarts');
        
        if (chartRef.current) {
          // 销毁之前的图表实例
          if (chartInstance.current) {
            chartInstance.current.dispose();
          }
          
          chartInstance.current = echarts.init(chartRef.current);
          
          const option = {
            title: {
              text: '车辆使用率趋势',
              left: 'center',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: '{b}: {c}%'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: data.map(item => item.month),
              axisLine: {
                lineStyle: {
                  color: '#e5e7eb'
                }
              },
              axisLabel: {
                color: '#6b7280'
              }
            },
            yAxis: {
              type: 'value',
              name: '使用率(%)',
              min: 0,
              max: 100,
              axisLine: {
                lineStyle: {
                  color: '#e5e7eb'
                }
              },
              axisLabel: {
                color: '#6b7280',
                formatter: '{value}%'
              },
              splitLine: {
                lineStyle: {
                  color: '#f3f4f6'
                }
              }
            },
            series: [{
              name: '使用率',
              type: 'line',
              data: data.map(item => item.usageRate),
              smooth: true,
              lineStyle: {
                color: '#3b82f6',
                width: 3
              },
              itemStyle: {
                color: '#3b82f6'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(59, 130, 246, 0.3)'
                  }, {
                    offset: 1,
                    color: 'rgba(59, 130, 246, 0.05)'
                  }]
                }
              }
            }]
          };
          
          chartInstance.current.setOption(option);
          
          // 响应式处理
          const handleResize = () => {
            if (chartInstance.current) {
              chartInstance.current.resize();
            }
          };
          
          window.addEventListener('resize', handleResize);
          
          return () => {
            window.removeEventListener('resize', handleResize);
          };
        }
      } catch (error) {
        console.error('Failed to load ECharts:', error);
      }
    };
    
    loadECharts();
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-lg font-medium">暂无数据</div>
          <div className="text-sm">请稍后再试或检查数据源</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

export default VehicleUsageChart;