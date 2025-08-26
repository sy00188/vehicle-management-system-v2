import React, { useEffect, useRef } from 'react';

interface ExpenseData {
  category: string;
  amount: number;
  color: string;
}

interface ExpenseAnalysisChartProps {
  data: ExpenseData[];
}

const ExpenseAnalysisChart: React.FC<ExpenseAnalysisChartProps> = ({ data }) => {
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
              text: '费用分析',
              left: 'center',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              top: 'middle',
              textStyle: {
                color: '#6b7280'
              }
            },
            series: [{
              name: '费用分布',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['60%', '50%'],
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
                  fontSize: 20,
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

export default ExpenseAnalysisChart;