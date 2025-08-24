import React, { useEffect, useRef } from 'react';
import type { UsageChartData } from '../../../types';

interface UsageChartProps {
  data: UsageChartData[];
}

const UsageChart: React.FC<UsageChartProps> = ({ data = [] }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || !data || !data.length) return;

    // 动态加载 ECharts
    const loadECharts = async () => {
      try {
        const echarts = await import('echarts');
        window.echarts = echarts;
        initChart();
      } catch (error) {
        console.error('Error loading ECharts:', error);
        showFallback();
      }
    };

    const initChart = () => {
      if (!window.echarts || !chartRef.current) return;

      // 销毁现有图表实例
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // 创建新的图表实例
      chartInstance.current = window.echarts.init(chartRef.current);

      const option = {
        title: {
          text: '车辆使用率趋势',
          left: 'left',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#374151'
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
          data: (data || []).map(item => item.month),
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
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%',
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
        series: [
          {
            name: '使用率',
            type: 'line',
            data: (data || []).map(item => item.usageRate),
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
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(59, 130, 246, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(59, 130, 246, 0.05)'
                  }
                ]
              }
            }
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
    };

    const showFallback = () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <i class="fas fa-chart-line text-4xl mb-4"></i>
              <p>图表加载失败</p>
              <p class="text-sm">请检查网络连接</p>
            </div>
          </div>
        `;
      }
    };

    loadECharts();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div ref={chartRef} style={{ width: '100%', height: '300px' }}>
        {/* 加载状态 */}
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 扩展 Window 接口以包含 echarts
declare global {
  interface Window {
    echarts: any;
  }
}

export default UsageChart;