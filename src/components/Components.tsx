import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Package, ExternalLink } from 'lucide-react';
import { Component } from '../types';
import { getComponents, saveComponents, getTransactions, saveTransactions } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import ComponentForm from './ComponentForm';
import TransactionModal from './TransactionModal';

const Components: React.FC = () => {
  const { user, canAddComponents, canEditComponents } = useAuth();
  const isLabTechnician = user?.role === 'Lab Technician';
  const [components, setComponents] = useState<Component[]>(getComponents);
  const [showForm, setShowForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = 
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !categoryFilter || component.category === categoryFilter;
      const matchesLocation = !locationFilter || component.location.includes(locationFilter);

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [components, searchTerm, categoryFilter, locationFilter]);

  const categories = useMemo(() => {
    return [...new Set(components.map(c => c.category))];
  }, [components]);

  const locations = useMemo(() => {
    return [...new Set(components.map(c => c.location))];
  }, [components]);

  const handleSaveComponent = (componentData: Omit<Component, 'id' | 'createdAt'>) => {
    if (editingComponent) {
      const updatedComponents = components.map(c =>
        c.id === editingComponent.id
          ? { ...componentData, id: editingComponent.id, createdAt: editingComponent.createdAt }
          : c
      );
      setComponents(updatedComponents);
      saveComponents(updatedComponents);
    } else {
      const newComponent: Component = {
        ...componentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedComponents = [...components, newComponent];
      setComponents(updatedComponents);
      saveComponents(updatedComponents);
    }
    setShowForm(false);
    setEditingComponent(null);
  };

  const handleTransaction = (type: 'inward' | 'outward', componentId: string, quantity: number, reason: string, project?: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component || !user) return;

    const newQuantity = type === 'inward' 
      ? component.quantity + quantity 
      : component.quantity - quantity;

    if (newQuantity < 0) {
      alert('Insufficient quantity available');
      return;
    }

    // Update component quantity and last outward date if outward transaction
    const updatedComponent = {
      ...component,
      quantity: newQuantity,
      ...(type === 'outward' ? { lastOutwardDate: new Date().toISOString() } : {})
    };

    const updatedComponents = components.map(c =>
      c.id === componentId ? updatedComponent : c
    );

    // Add transaction record
    const transaction = {
      id: Date.now().toString(),
      componentId,
      type,
      quantity,
      userId: user.id,
      userName: user.username,
      reason,
      project,
      timestamp: new Date().toISOString()
    };

    const transactions = getTransactions();
    const updatedTransactions = [...transactions, transaction];

    setComponents(updatedComponents);
    saveComponents(updatedComponents);
    saveTransactions(updatedTransactions);
    setShowTransactionModal(false);
    setSelectedComponent(null);
  };

  const openTransactionModal = (component: Component) => {
    setSelectedComponent(component);
    setShowTransactionModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Components</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your electronic components inventory
          </p>
        </div>
        {canAddComponents && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowForm(true)}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLabTechnician 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLabTechnician ? 'Quick Add Component' : 'Add Component'}
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-500">
            <Filter className="h-4 w-4 mr-1" />
            {filteredComponents.length} components
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <div key={component.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {component.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{component.manufacturer}</p>
                  <p className="text-sm font-mono text-gray-500 mb-3">{component.partNumber}</p>
                </div>
                {canEditComponents && (
                  <button
                    onClick={() => {
                      setEditingComponent(component);
                      setShowForm(true);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantity:</span>
                  <span className={`font-semibold ${
                    component.quantity <= component.criticalLowThreshold 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {component.quantity}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="text-gray-900">{component.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Unit Price:</span>
                  <span className="text-gray-900">${component.unitPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {component.category}
                  </span>
                </div>
              </div>

              {component.description && (
                <p className="text-sm text-gray-600 mb-4">{component.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => openTransactionModal(component)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Package className="h-3 w-3 mr-1" />
                  Manage Stock
                </button>
                {component.datasheetLink && (
                  <a
                    href={component.datasheetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Datasheet
                  </a>
                )}
              </div>

              {component.quantity <= component.criticalLowThreshold && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-800 font-medium">
                    ⚠️ Low Stock Alert: Below threshold of {component.criticalLowThreshold}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No components found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || categoryFilter || locationFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first component.'}
          </p>
        </div>
      )}

      {/* Component Form Modal */}
      {showForm && (
        <ComponentForm
          component={editingComponent}
          onSave={handleSaveComponent}
          onClose={() => {
            setShowForm(false);
            setEditingComponent(null);
          }}
        />
      )}

      {/* Transaction Modal */}
      {showTransactionModal && selectedComponent && (
        <TransactionModal
          component={selectedComponent}
          onTransaction={handleTransaction}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedComponent(null);
          }}
        />
      )}
    </div>
  );
};

export default Components;