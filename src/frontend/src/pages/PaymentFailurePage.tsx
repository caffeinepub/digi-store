import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-vibrant-purple/5 to-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-destructive/30 bg-gradient-to-br from-destructive/5 to-destructive/10">
          <CardContent className="p-12 text-center space-y-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 border-4 border-destructive/20">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-destructive">
                Payment Failed
              </h1>
              <p className="text-xl text-muted-foreground">
                We couldn't process your payment. Please try again.
              </p>
            </div>

            <div className="bg-background/50 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Common Issues</h2>
              <ul className="text-left space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Incorrect card details or expired card</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Payment declined by your bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Network or connection issues</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/shop">
                <Button size="lg" className="vibrant-button">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Shop
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-vibrant-magenta/40 hover:bg-vibrant-magenta hover:text-white">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              If you continue to experience issues, please contact our support team for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
