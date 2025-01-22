import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import LanguageToggle from './LanguageToggle';
import { GoldPriceDialog } from './GoldPriceDialog';

interface GoldItem {
  id: string;
  weight: number;
  quantity: number;
  pricePerGram: number;
  taxType: 'percentage' | 'fixed';
  taxValue: number;
  providerFee: number;
}

const DEFAULT_PRICE_PER_GRAM = 60;

const GoldCalculator = () => {
  const [items, setItems] = useState<GoldItem[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  const addItem = () => {
    const newItem: GoldItem = {
      id: Date.now().toString(),
      weight: 0,
      quantity: 1,
      pricePerGram: DEFAULT_PRICE_PER_GRAM,
      taxType: 'percentage',
      taxValue: 0,
      providerFee: 0,
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
    const weightTotal = item.weight * item.quantity;
    const subtotal = weightTotal * item.pricePerGram;
    
    // Calculate tax based on total weight
    const tax = item.taxType === 'percentage' 
      ? (weightTotal * item.taxValue / 100) * item.pricePerGram // Tax per gram
      : weightTotal * item.taxValue; // Fixed tax per gram
    
    return { 
      subtotal, 
      tax, 
      providerFee: item.providerFee,
      total: subtotal + tax + item.providerFee 
    };
  };

  const calculateGrandTotal = () => {
    return items.reduce((acc, item) => {
      const { subtotal, tax, providerFee } = calculateItemTotal(item);
      return {
        subtotal: acc.subtotal + subtotal,
        tax: acc.tax + tax,
        providerFee: acc.providerFee + providerFee
      };
    }, { subtotal: 0, tax: 0, providerFee: 0 });
  };

  return (
    <div className="min-h-screen bg-cream p-6 animate-fadeIn">
      <LanguageToggle />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">{t('calculator.title')}</h1>
          <p className="text-gray-600">{t('calculator.subtitle')}</p>
          <GoldPriceDialog />
        </div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <Card key={item.id} className="p-6 card-shadow animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('calculator.batch')} {index + 1}</h3>
                <div className="flex items-center gap-4">
                  <div className="text-lg">
                    {t('calculator.total')}: ${calculateItemTotal(item).total.toFixed(2)}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`weight-${item.id}`}>{t('calculator.weight')}</Label>
                    <Input
                      id={`weight-${item.id}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={item.weight === 0 ? '' : item.weight}
                      onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`quantity-${item.id}`}>{t('calculator.quantity')}</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity === 0 ? '' : item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${item.id}`}>{t('calculator.pricePerGram')}</Label>
                    <Input
                      id={`price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.pricePerGram === 0 ? '' : item.pricePerGram}
                      onChange={(e) => updateItem(item.id, 'pricePerGram', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>{t('calculator.taxType')}</Label>
                    <RadioGroup
                      value={item.taxType}
                      onValueChange={(value) => updateItem(item.id, 'taxType', value)}
                      className="flex space-x-4 mt-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id={`percentage-${item.id}`} />
                        <Label htmlFor={`percentage-${item.id}`}>{t('calculator.percentagePerGram')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id={`fixed-${item.id}`} />
                        <Label htmlFor={`fixed-${item.id}`}>{t('calculator.fixedAmountPerGram')}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor={`tax-${item.id}`}>
                      {item.taxType === 'percentage' ? t('calculator.taxPercentage') : t('calculator.taxAmount')}
                    </Label>
                    <Input
                      id={`tax-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.taxValue === 0 ? '' : item.taxValue}
                      onChange={(e) => updateItem(item.id, 'taxValue', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`provider-fee-${item.id}`}>{t('calculator.providerFee')}</Label>
                    <Input
                      id={`provider-fee-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.providerFee === 0 ? '' : item.providerFee}
                      onChange={(e) => updateItem(item.id, 'providerFee', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={addItem}
            className="w-full gold-gradient text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" /> {t('calculator.addItem')}
          </Button>

          {items.length > 0 && (
            <Card className="p-6 mt-8 card-shadow">
              <div className="space-y-2">
                <div className="text-xl flex justify-between items-center">
                  <span>{t('calculator.subtotal')}:</span>
                  <span>${calculateGrandTotal().subtotal.toFixed(2)}</span>
                </div>
                <div className="text-xl flex justify-between items-center">
                  <span>{t('calculator.totalTax')}:</span>
                  <span>${calculateGrandTotal().tax.toFixed(2)}</span>
                </div>
                <div className="text-xl flex justify-between items-center">
                  <span>{t('calculator.totalProviderFees')}:</span>
                  <span>${calculateGrandTotal().providerFee.toFixed(2)}</span>
                </div>
                <div className="text-2xl font-bold flex justify-between items-center pt-2 border-t">
                  <span>{t('calculator.grandTotal')}:</span>
                  <span>${(calculateGrandTotal().subtotal + calculateGrandTotal().tax + calculateGrandTotal().providerFee).toFixed(2)}</span>
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
