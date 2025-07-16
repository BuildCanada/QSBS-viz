import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Line } from 'react-chartjs-2'
import { calculateQSBS } from '@/lib/qsbs'
import { calculateLCGE } from '@/lib/lcge'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

interface ComparisonGraphProps {
  ownershipPercentage: number
  currency: 'USD' | 'CAD'
  selectedState: string
  selectedProvince: string
}

export function ComparisonGraph({ ownershipPercentage, currency, selectedState, selectedProvince }: ComparisonGraphProps) {
  // Generate chart data
  const chartData = useMemo(() => {
    const exitSizes = [
      1000000,    // 1M
      5000000,    // 5M
      10000000,   // 10M
      25000000,   // 25M
      50000000,   // 50M
      75000000    // 75M
    ]

    const labels = exitSizes.map(size => 
      size >= 1000000000 
        ? `${(size / 1000000000).toFixed(1)}B` 
        : `${(size / 1000000).toFixed(0)}M`
    )

    const usData = []
    const canadaData = []

    for (const exitValue of exitSizes) {
      // Calculate US (QSBS) results
      const qsbsResults = calculateQSBS({
        ownershipPercentage,
        exitValue,
        costBasis: 0,
        currency
      }, selectedState)

      // Calculate Canadian (LCGE) results
      const personalExitValue = exitValue * (ownershipPercentage / 100)
      const lcgeResults = calculateLCGE(personalExitValue, 0, selectedProvince, currency)

      usData.push(qsbsResults.afterTaxProceeds)
      canadaData.push(lcgeResults.afterTaxAmount)
    }

    return {
      labels,
      datasets: [
        {
          label: `US (${selectedState})`,
          data: usData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#3B82F6',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
        },
        {
          label: `Canada (${selectedProvince})`,
          data: canadaData,
          borderColor: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#DC2626',
          pointBorderColor: '#DC2626',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
        },
      ],
    }
  }, [ownershipPercentage, currency, selectedState, selectedProvince])

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: false,
        labels: {
          font: {
            family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 12,
          },
          color: '#28253B',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#6B7280',
        bodyColor: '#28253B',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        titleFont: {
          family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          size: 12,
        },
        bodyFont: {
          family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          size: 12,
        },
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y
            const formatted = currency === 'USD' 
              ? `$${(value / 1000000).toFixed(1)}M USD`
              : `$${(value / 1000000).toFixed(1)}M CAD`
            return `${context.dataset.label}: ${formatted}`
          }
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line' as const,
            xMin: 3.5,  // Between 25M and 50M exit values
            xMax: 3.5,  // Between 25M and 50M exit values
            borderColor: '#6B7280',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: ['Individual LPs and investors will typically net', 'below $40M even in billion dollar exits'],
              position: 'end' as const,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#6B7280',
              font: {
                size: 10,
                family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              },
              padding: 4,
              borderColor: '#E5E7EB',
              borderWidth: 1,
              borderRadius: 3,
              xAdjust: -145,
              yAdjust: 20
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Exit Return',
          color: '#6B7280',
          font: {
            family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 12,
          },
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 12,
          },
        },
        grid: {
          color: '#E5E7EB',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Take-Home Amount',
          color: '#6B7280',
          font: {
            family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 12,
          },
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            size: 12,
          },
          callback: function(value: any) {
            const num = Number(value)
            if (num >= 1000000000) {
              return `$${(num / 1000000000).toFixed(1)}B`
            } else if (num >= 1000000) {
              return `$${(num / 1000000).toFixed(0)}M`
            } else {
              return `$${(num / 1000).toFixed(0)}K`
            }
          }
        },
        grid: {
          color: '#E5E7EB',
        },
      },
    },
  }

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Centered Title */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold font-soehne" style={{ color: '#28253B' }}>
          Take-Home Comparison
        </h3>
      </div>

      {/* Chart */}
      <div className="flex-1 pr-4" style={{ minHeight: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
} 