import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Component } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ComponentFormProps {
  component?: Component | null;
  onSave: (component: Omit<Component, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ component, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    partNumber: '',
    description: '',
    quantity: 0,
    location: '',
    unitPrice: 0,
    datasheetLink: '',
    category: '',
    criticalLowThreshold: 10,
    isQuickAdd: false
  });

  const { user } = useAuth();
  const isLabTechnician = user?.role === 'Lab Technician';

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name,
        manufacturer: component.manufacturer,
        partNumber: component.partNumber,
        description: component.description,
        quantity: component.quantity,
        location: component.location,
        unitPrice: component.unitPrice,
        datasheetLink: component.datasheetLink,
        category: component.category,
        criticalLowThreshold: component.criticalLowThreshold
      });
    } else if (isLabTechnician) {
      // Pre-fill some defaults for Lab Technicians for quick entry
      setFormData(prev => ({
        ...prev,
        criticalLowThreshold: 10,
        isQuickAdd: true
      }));
    }
  }, [component, isLabTechnician]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const categories = [
    'Resistors',
    'Capacitors',
    'Inductors',
    'Diodes',
    'Transistors',
    'Integrated Circuits (ICs)',
    'Connectors',
    'Sensors',
    'Microcontrollers/Development Boards',
    'Switches/Buttons',
    'LEDs/Displays',
    'Cables/Wires',
    'Mechanical Parts/Hardware',
    'Miscellaneous Lab Supplies'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {component ? 'Edit Component' : 'Add New Component'}
                </h3>
                {isLabTechnician && !component && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Quick Add Mode
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={`space-y-4 ${isLabTechnician ? 'quick-add-form' : ''}`}>
              {isLabTechnician && !component && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Quick Add for Lab Technicians
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Fill in the essential details. Optional fields can be updated later by an Admin.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Component Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Manufacturer {isLabTechnician ? '' : '*'}
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    required={!isLabTechnician}
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder={isLabTechnician ? "Enter if known" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Part Number {isLabTechnician ? '' : '*'}
                  </label>
                  <input
                    type="text"
                    name="partNumber"
                    required={!isLabTechnician}
                    value={formData.partNumber}
                    onChange={handleChange}
                    placeholder={isLabTechnician ? "Enter if available" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={isLabTechnician ? "Brief description (optional)" : ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Number of items received"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g., A1-B2"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {isLabTechnician && (
                    <p className="mt-1 text-xs text-gray-500">
                      Specify where you're storing this component
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Price ($) {isLabTechnician ? '(Optional)' : '*'}
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    required={!isLabTechnician}
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder={isLabTechnician ? "Leave blank if unknown" : ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {isLabTechnician && (
                    <p className="mt-1 text-xs text-gray-500">
                      Select the most appropriate category
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Critical Low Threshold {isLabTechnician ? '(Default: 10)' : '*'}
                </label>
                <input
                  type="number"
                  name="criticalLowThreshold"
                  required={!isLabTechnician}
                  min="0"
                  value={formData.criticalLowThreshold}
                  onChange={handleChange}
                  placeholder={isLabTechnician ? "10" : ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {isLabTechnician && (
                  <p className="mt-1 text-xs text-gray-500">
                    When to alert for low stock (default: 10 units)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Datasheet Link {isLabTechnician ? '(Optional)' : ''}
                </label>
                <input
                  type="url"
                  name="datasheetLink"
                  placeholder="https://..."
                  value={formData.datasheetLink}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {isLabTechnician && (
                  <p className="mt-1 text-xs text-gray-500">
                    Add datasheet link if available
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {component ? 'Update' : isLabTechnician ? 'Quick Add' : 'Add'} Component
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentForm;