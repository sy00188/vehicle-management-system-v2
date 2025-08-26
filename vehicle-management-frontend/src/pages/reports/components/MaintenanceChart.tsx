import React, { useEffect, useRef } from 'react';

interface MaintenanceData {
  month: string;
  count: number;
  cost: number;
}

interface MaintenanceChartProps {
  data: MaintenanceData[];
}

const MaintenanceChart: React.FC<MaintenanceChartProps> = ({ data }) => {
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
              text: '维护统计',
              left: 'center',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            legend: {
              data: ['维护次数', '维护费用'],
              top: 30,
              textStyle: {
                color: '#6b7280'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '15%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              data: data.map(item => item.month),
              axisPointer: {
                type: 'shadow'
              },
              axisLine: {
                lineStyle: {
                  color: '#e5e7eb'
                }
              },
              axisLabel: {
                color: '#6b7280'
              }
            }],
            yAxis: [
              {
                type: 'value',
                name: '维护次数',
                min: 0,
                axisLabel: {
                  formatter: '{value} 次',
                  color: '#6b7280'
                },
                axisLine: {
                  lineStyle: {
                    color: '#e5e7eb'
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: '#f3f4f6'
                  }
                }
              },
              {
                type: 'value',
                name: '维护费用',
                min: 0,
                axisLabel: {
                  formatter: '¥{value}',
                  color: '#6b7280'
                },
                axisLine: {
                  lineStyle: {
                    color: '#e5e7eb'
                  }
                }
              }
            ],
            series: [
              {
                name: '维护次数',
                type: 'bar',
                data: data.map(item => item.count),
                itemStyle: {
                  color: '#3b82f6'
                },
                barWidth: '40%'
              },
              {
                name: '维护费用',
                type: 'line',
                yAxisIndex: 1,
                data: data.map(item => item.cost),
                lineStyle: {
                  color: '#ef4444',
                  width: 3
                },
                itemStyle: {
                  color: '#ef4444'
                },
                smooth: true
              }
            ]
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

export default MaintenanceChart;