import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Ordering
  {
    id: '1',
    question: 'How do I place an order?',
    answer: 'Browse our products, select your size and color, add to cart, and proceed to checkout. You can pay with any major credit card or PayPal.',
    category: 'ordering'
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, MasterCard, American Express, Discover, and PayPal. All payments are processed securely through Stripe.',
    category: 'ordering'
  },
  {
    id: '3',
    question: 'Is my payment information secure?',
    answer: 'Yes! We use industry-standard SSL encryption and never store your credit card information. All payments are processed securely through Stripe.',
    category: 'ordering'
  },
  {
    id: '4',
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled within 1 hour of placement. Contact our customer service team immediately if you need to make changes.',
    category: 'ordering'
  },

  // Shipping
  {
    id: '5',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping takes 1 business day.',
    category: 'shipping'
  },
  {
    id: '6',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free standard shipping on all orders over $75. Orders under $75 have a $5.99 shipping fee.',
    category: 'shipping'
  },
  {
    id: '7',
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship to the United States and Canada. International shipping will be available soon.',
    category: 'shipping'
  },
  {
    id: '8',
    question: 'How can I track my order?',
    answer: 'You\'ll receive a tracking number via email once your order ships. You can also track your order in your account dashboard.',
    category: 'shipping'
  },

  // Returns & Exchanges
  {
    id: '9',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy. Items must be unworn, unwashed, and have original tags attached. Returns are free for US customers.',
    category: 'returns'
  },
  {
    id: '10',
    question: 'How do I return an item?',
    answer: 'Go to your order history, select the item you want to return, and follow the return process. We\'ll provide a prepaid shipping label.',
    category: 'returns'
  },
  {
    id: '11',
    question: 'Can I exchange for a different size?',
    answer: 'Yes! We offer free size exchanges within 30 days of delivery, subject to availability.',
    category: 'returns'
  },
  {
    id: '12',
    question: 'How long do refunds take?',
    answer: 'Refunds are processed within 3-5 business days after we receive your return. It may take 5-10 business days to appear on your statement.',
    category: 'returns'
  },

  // Products
  {
    id: '13',
    question: 'How do I find my size?',
    answer: 'Check our size guide for detailed measurements. Our products generally run true to size, but we recommend checking the size chart for each item.',
    category: 'products'
  },
  {
    id: '14',
    question: 'Are your products sustainable?',
    answer: 'Yes! We use sustainable materials like bamboo and recycled fabrics. Our packaging is also eco-friendly and recyclable.',
    category: 'products'
  },
  {
    id: '15',
    question: 'How do I care for my activewear?',
    answer: 'Machine wash cold, tumble dry low. Avoid fabric softeners and bleach. For best results, wash with similar colors.',
    category: 'products'
  },
  {
    id: '16',
    question: 'Do you restock sold-out items?',
    answer: 'Yes, we regularly restock popular items. You can sign up for restock notifications on any product page.',
    category: 'products'
  },

  // Account
  {
    id: '17',
    question: 'How do I create an account?',
    answer: 'You can create an account during checkout or by clicking "Sign Up" in the top navigation. It only takes a minute!',
    category: 'account'
  },
  {
    id: '18',
    question: 'I forgot my password. What should I do?',
    answer: 'Click "Forgot Password" on the login page. We\'ll send you a reset link via email.',
    category: 'account'
  },
  {
    id: '19',
    question: 'Can I save my payment information?',
    answer: 'Yes, you can save your payment information securely in your account for faster checkout.',
    category: 'account'
  },
  {
    id: '20',
    question: 'How do I update my account information?',
    answer: 'Log into your account and go to "Account Settings" to update your personal information, shipping addresses, and payment methods.',
    category: 'account'
  }
];

const categories = [
  { id: 'ordering', name: 'Ordering', icon: CreditCard },
  { id: 'shipping', name: 'Shipping', icon: Truck },
  { id: 'returns', name: 'Returns & Exchanges', icon: RefreshCw },
  { id: 'products', name: 'Products', icon: Package },
  { id: 'account', name: 'Account', icon: HelpCircle },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={0} onCartOpen={() => {}} />
      
      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our products and services
              </p>
            </div>

            {/* Search */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Questions
              </Button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQ.length > 0 ? (
                filteredFAQ.map((item) => {
                  const isExpanded = expandedItems.has(item.id);
                  const category = categories.find(c => c.id === item.category);
                  
                  return (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {category && (
                                <Badge variant="outline" className="text-xs">
                                  {category.name}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                            {isExpanded && (
                              <p className="text-muted-foreground leading-relaxed">
                                {item.answer}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleItem(item.id)}
                            className="ml-4 flex-shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or category filter.
                    </p>
                    <Button onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Support */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Can't find what you're looking for? Our customer support team is here to help!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/contact')}>
                      Contact Support
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/shipping-returns')}>
                      Shipping & Returns
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 