import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getComponents, getTransactions, getNotifications } from '../utils/storage';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const components = getComponents();
  const transactions = getTransactions();
  const notifications = getNotifications();

  const dashboardData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    // Monthly inward/outward data
    const monthlyData = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const inward = transactions.filter(t => 
        t.type === 'inward' && 
        new Date(t.timestamp) >= monthStart && 
        new Date(t.timestamp) <= monthEnd
      ).reduce((sum, t) => sum + t.quantity, 0);

      const outward = transactions.filter(t => 
        t.type === 'outward' && 
        new Date(t.timestamp) >= monthStart && 
        new Date(t.timestamp) <= monthEnd
      ).reduce((sum, t) => sum + t.quantity, 0);

      return {
        month: format(month, 'MMM yyyy'),
        inward,
        outward
      };
    });

    // Low stock components
    const lowStockComponents = components.filter(c => c.quantity <= c.criticalLowThreshold);

    // Old stock components (3+ months without outward movement)
    const threeMonthsAgo = subMonths(now, 3);
    const oldStockComponents = components.filter(c => {
      if (!c.lastOutwardDate) {
        return new Date(c.createdAt) < threeMonthsAgo;
      }
      return new Date(c.lastOutwardDate) < threeMonthsAgo;
    });

    // Category distribution
    const categoryData = components.reduce((acc, comp) => {
      acc[comp.category] = (acc[comp.category] || 0) + comp.quantity;
      return acc;
    }, {} as Record<string, number>);

    return {
      monthlyData,
      lowStockComponents,
      oldStockComponents,
      categoryData,
      totalComponents: components.length,
      totalValue: components.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0),
      unreadNotifications: notifications.filter(n => !n.read).length
    };
  }, [components, transactions, notifications]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Component Movement',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: dashboardData.monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Inward',
        data: dashboardData.monthlyData.map(d => d.inward),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Outward',
        data: dashboardData.monthlyData.map(d => d.outward),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(dashboardData.categoryData),
    datasets: [
      {
        data: Object.values(dashboardData.categoryData),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#F97316',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your inventory management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Components
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dashboardData.totalComponents}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Value
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${dashboardData.totalValue.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Low Stock Items
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dashboardData.lowStockComponents.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Old Stock Items
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dashboardData.oldStockComponents.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Component Distribution by Category
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={categoryChartData} />
          </div>
        </div>
      </div>

      {/* Critical Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Components */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Critical Low Stock
            </h3>
            <div className="mt-5">
              {dashboardData.lowStockComponents.length === 0 ? (
                <p className="text-sm text-gray-500">No items with low stock</p>
              ) : (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {dashboardData.lowStockComponents.slice(0, 5).map((component) => (
                      <li key={component.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {component.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {component.partNumber} • {component.location}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {component.quantity} left
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Old Stock Components */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Old Stock (3+ Months)
            </h3>
            <div className="mt-5">
              {dashboardData.oldStockComponents.length === 0 ? (
                <p className="text-sm text-gray-500">No old stock items</p>
              ) : (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {dashboardData.oldStockComponents.slice(0, 5).map((component) => (
                      <li key={component.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {component.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {component.partNumber} • {component.location}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              {component.quantity} units
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;