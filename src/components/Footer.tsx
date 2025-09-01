import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-brand mb-4">Salt & Soul</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Premium activewear designed for the modern woman. Sustainable, comfortable, and beautifully crafted.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Best Sellers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tops</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Bottoms</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sets</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/size-guide" className="text-muted-foreground hover:text-primary transition-colors">Size Guide</Link></li>
              <li><Link to="/shipping-returns" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Care Instructions</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Connected</h4>
            <p className="text-muted-foreground mb-4">
              Get the latest updates on new collections and exclusive offers.
            </p>
            <div className="space-y-3">
              <Input 
                placeholder="Enter your email" 
                className="w-full"
              />
              <Button className="w-full bg-primary hover:bg-primary-hover">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Salt & Soul. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}