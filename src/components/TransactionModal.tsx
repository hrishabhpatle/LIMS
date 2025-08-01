import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Component } from '../types';

interface TransactionModalProps {
  component: Component;
  onTransaction: (type: 'inward' | 'outward', componentId: string, quantity: number, reason: string, project?: string) => void;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ component, onTransaction, onClose }) => {
  const [type, setType] = useState<'inward' | 'outward'>('outward');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [project, setProject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for this transaction');
      return;
    }
    if (quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }
    if (type === 'outward' && quantity > component.quantity) {
      alert('Cannot remove more items than available in stock');
      return;
    }

    onTransaction(type, component.id, quantity, reason, project || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Manage Stock: {component.name}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-600">
                <p><strong>Part Number:</strong> {component.partNumber}</p>
                <p><strong>Current Stock:</strong> {component.quantity} units</p>
                <p><strong>Location:</strong> {component.location}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('inward')}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                      type === 'inward'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Inward (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('outward')}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                      type === 'outward'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Outward (Remove)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={type === 'outward' ? component.quantity : undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {type === 'outward' && (
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum available: {component.quantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason *
                </label>
                <input
                  type="text"
                  required
                  placeholder={type === 'inward' ? 'e.g., New shipment received' : 'e.g., Used in Project Alpha'}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Project Alpha, PCB Rev 2.1"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    type === 'inward'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                >
                  {type === 'inward' ? 'Add to' : 'Remove from'} Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;