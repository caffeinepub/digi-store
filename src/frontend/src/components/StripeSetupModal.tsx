import { useIsCallerAdmin, useIsStripeConfigured, useSetStripeConfiguration } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { StripeConfiguration } from '../backend';

export default function StripeSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const setStripeConfiguration = useSetStripeConfiguration();

  const [secretKey, setSecretKey] = useState('');
  const [allowedCountries, setAllowedCountries] = useState('IN');

  const showModal = identity && isAdmin && !isLoading && !isConfigured;

  const handleSave = async () => {
    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const countries = allowedCountries
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(c => c.length === 2);

    if (countries.length === 0) {
      toast.error('Please enter at least one valid country code');
      return;
    }

    try {
      const config: StripeConfiguration = {
        secretKey: secretKey.trim(),
        allowedCountries: countries,
      };

      await setStripeConfiguration.mutateAsync(config);
      toast.success('Stripe configuration saved successfully!');
      setSecretKey('');
      setAllowedCountries('IN');
    } catch (error) {
      console.error('Failed to save Stripe configuration:', error);
      toast.error('Failed to save Stripe configuration. Please try again.');
    }
  };

  if (!showModal) return null;

  return (
    <Dialog open={showModal}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-6 w-6 text-vibrant-magenta" />
            <DialogTitle className="text-2xl">Stripe Payment Setup Required</DialogTitle>
          </div>
          <DialogDescription>
            Configure Stripe to enable secure payment processing for your digital products.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-vibrant-magenta/30 bg-vibrant-purple/5">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-vibrant-magenta flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Before you begin:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Create a Stripe account at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-vibrant-magenta hover:underline">stripe.com</a></li>
                    <li>Get your secret key from the Stripe Dashboard</li>
                    <li>Ensure your Stripe account is activated for India (INR)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-secret-key">Stripe Secret Key *</Label>
              <Input
                id="stripe-secret-key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_live_..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your secret key starts with "sk_test_" (test mode) or "sk_live_" (live mode)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowed-countries">Allowed Countries</Label>
              <Input
                id="allowed-countries"
                value={allowedCountries}
                onChange={(e) => setAllowedCountries(e.target.value)}
                placeholder="IN, US, GB"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of 2-letter country codes (e.g., IN for India)
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={setStripeConfiguration.isPending}
              className="flex-1 vibrant-button"
            >
              {setStripeConfiguration.isPending ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your Stripe secret key is stored securely and never exposed to users.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
