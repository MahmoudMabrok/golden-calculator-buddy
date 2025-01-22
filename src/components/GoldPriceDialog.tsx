import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from '@/utils/FirecrawlService';

export const GoldPriceDialog = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [priceData, setPriceData] = useState<any>(null);

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      FirecrawlService.saveApiKey(apiKey.trim());
      toast({
        title: t('goldPrices.apiKeySaved'),
        description: t('goldPrices.apiKeySavedDesc'),
      });
    }
  };

  const fetchGoldPrices = async () => {
    setIsLoading(true);
    try {
      const result = await FirecrawlService.crawlGoldPrices();
      if (result.success) {
        setPriceData(result.data);
        toast({
          title: t('goldPrices.fetchSuccess'),
          description: t('goldPrices.fetchSuccessDesc'),
        });
      } else {
        toast({
          title: t('goldPrices.fetchError'),
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('goldPrices.fetchError'),
        description: t('goldPrices.fetchErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          {t('goldPrices.checkPrices')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('goldPrices.title')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!FirecrawlService.getApiKey() ? (
            <div className="grid gap-2">
              <Input
                placeholder={t('goldPrices.apiKeyPlaceholder')}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleSetApiKey}>
                {t('goldPrices.saveApiKey')}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <Button onClick={fetchGoldPrices} disabled={isLoading}>
                {isLoading ? t('goldPrices.loading') : t('goldPrices.refresh')}
              </Button>
              {priceData && (
                <div className="bg-secondary p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(priceData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};