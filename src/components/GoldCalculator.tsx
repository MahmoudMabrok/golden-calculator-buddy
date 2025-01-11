import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

interface GoldItem {
  id: string;
  weight: number;
  quantity: number;
  pricePerGram: number;
  taxType: 'percentage' | 'fixed';
  taxValue: number;
}

const DEFAULT_PRICE_PER_GRAM = 60;

const GoldCalculator = () => {
  const [items, setItems] = useState<GoldItem[]>([]);
  const { toast } = useToast();

  const addItem = () => {
    const newItem: GoldItem = {
      id: Date.now().toString(),
      weight: 0,
      quantity: 1,
      pricePerGram: DEFAULT_PRICE_PER_GRAM,
      taxType: 'percentage',
      taxValue: 0,
    };
    setItems([...items, newItem]);
    console.log('Added new item:', newItem);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    console.log('Removed item:', id);
    toast({
      title: "Item removed",
      description: "The item has been removed from your calculation.",
    });
  };

  const updateItem = (id: string, field: keyof GoldItem, value: number | string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === 'taxType') {
          return { ...item, [field]: value as 'percentage' | 'fixed' };
        }
        return { ...item, [field]: Number(value) };
      }
      return item;
    }));
    console.log('Updated item:', id, field, value);
  };

  const calculateItemTotal = (item: GoldItem) => {
    const subtotal = item.weight * item.quantity * item.pricePerGram;
    const tax = item.taxType === 'percentage' 
      ? subtotal * (item.taxValue / 100)
      : item.taxValue;
    return subtotal + tax;
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  return (
    <div className="min-h-screen bg-cream p-6 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Gold Price Calculator</h1>
          <p className="text-gray-600">Calculate the total price of your gold items including individual tax rates</p>
        </div>

        <div className="space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="p-6 card-shadow animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`weight-${item.id}`}>Weight (grams)</Label>
                    <Input
                      id={`weight-${item.id}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.weight || ''}
                      onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`price-${item.id}`}>Price per gram ($)</Label>
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.pricePerGram}
                      onChange={(e) => updateItem(item.id, 'pricePerGram', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Tax Type</Label>
                    <RadioGroup
                      value={item.taxType}
                      onValueChange={(value) => updateItem(item.id, 'taxType', value)}
                      className="flex space-x-4 mt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id={`percentage-${item.id}`} />
                        <Label htmlFor={`percentage-${item.id}`}>Percentage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id={`fixed-${item.id}`} />
                        <Label htmlFor={`fixed-${item.id}`}>Fixed Amount</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor={`tax-${item.id}`}>
                      {item.taxType === 'percentage' ? 'Tax Percentage (%)' : 'Tax Amount ($)'}
                    </Label>
                    <Input
                      id={`tax-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.taxValue}
                      onChange={(e) => updateItem(item.id, 'taxValue', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-between items-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="text-lg font-semibold">
                    Item Total: ${calculateItemTotal(item).toFixed(2)}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={addItem}
            className="w-full gold-gradient text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>

          {items.length > 0 && (
            <Card className="p-6 mt-8 card-shadow">
              <div className="text-xl font-bold flex justify-between items-center">
                <span>Grand Total:</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoldCalculator;