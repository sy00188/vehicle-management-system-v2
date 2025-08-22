import React, { useEffect, useRef } from 'react';
import type { ExpenseChartData } from '../../../types';

interface ExpenseChartProps {
  data: ExpenseChartData[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

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
          text: '费用分布',
          left: 'left',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#374151'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            color: '#6b7280'
          }
        },
        series: [
          {
            name: '费用分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
                formatter: '{b}\n¥{c}'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: data.map(item => ({
              value: item.amount,
              name: item.category,
              itemStyle: {
                color: item.color
              }
            }))
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
              <i class="fas fa-chart-pie text-4xl mb-4"></i>
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

export default ExpenseChart;