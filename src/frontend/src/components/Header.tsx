import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingBag, Shield, Info, Mail, Download } from 'lucide-react';
import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/assets/generated/digi-store-logo-premium-transparent.dim_200x200.png" 
            alt="Digi Store Logo" 
            className="h-10 w-10 object-contain" 
          />
          <span className="text-xl font-bold text-foreground tracking-tight">
            Digi Store
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeProps={{ className: 'text-primary' }}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
            activeProps={{ className: 'text-primary' }}
          >
            <ShoppingBag className="h-4 w-4" />
            Shop
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
            activeProps={{ className: 'text-primary' }}
          >
            <Info className="h-4 w-4" />
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
            activeProps={{ className: 'text-primary' }}
          >
            <Mail className="h-4 w-4" />
            Contact
          </Link>
          {isAuthenticated && (
            <Link
              to="/downloads"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
              activeProps={{ className: 'text-primary' }}
            >
              <Download className="h-4 w-4" />
              Downloads
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
              activeProps={{ className: 'text-primary' }}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Button */}
        <div className="hidden md:block">
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            className={!isAuthenticated ? 'premium-button' : ''}
          >
            {buttonText}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
            {isAuthenticated && (
              <Link
                to="/downloads"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Download className="h-4 w-4" />
                Downloads
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
            <Button
              onClick={() => {
                handleAuth();
                setMobileMenuOpen(false);
              }}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className={`w-full ${!isAuthenticated ? 'premium-button' : ''}`}
            >
              {buttonText}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
