import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface GoldItem {
  id: string;
  weight: number;
  quantity: number;
  pricePerGram: number;
}

const DEFAULT_PRICE_PER_GRAM = 60; // Default price per gram in USD
const TAX_RATE = 0.07; // 7% tax rate

const GoldCalculator = () => {
  const [items, setItems] = useState<GoldItem[]>([]);
  const { toast } = useToast();

  const addItem = () => {
    const newItem: GoldItem = {
      id: Date.now().toString(),
      weight: 0,
      quantity: 1,
      pricePerGram: DEFAULT_PRICE_PER_GRAM,
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

  const updateItem = (id: string, field: keyof GoldItem, value: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    console.log('Updated item:', id, field, value);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => 
      sum + (item.weight * item.quantity * item.pricePerGram), 0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + (subtotal * TAX_RATE);
  };

  return (
    <div className="min-h-screen bg-cream p-6 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Gold Price Calculator</h1>
          <p className="text-gray-600">Calculate the total price of your gold items including tax</p>
        </div>

        <div className="space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="p-6 card-shadow animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`weight-${item.id}`}>Weight (grams)</Label>
                  <Input
                    id={`weight-${item.id}`}
                    type="number"
                    min="0"
                    step="0.1"
                    value={item.weight || ''}
                    onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${item.id}`}>Price per gram ($)</Label>
                  <Input
                    id={`price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.pricePerGram}
                    onChange={(e) => updateItem(item.id, 'pricePerGram', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="w-full md:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
                  <span>${(calculateSubtotal() * TAX_RATE).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoldCalculator;