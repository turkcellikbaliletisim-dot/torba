export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  toinBalance: number;
  torbaaMealBalance: number; // TORBAA Öz Dijital Yemek Kartı Bakiyesi (TL)
  corporateInfo?: {
    companyId: string;
    companyName: string;
    employeeId: string;
    monthlyAllowance: number;
    cardNo: string; // Örn: 9876-1234-5678-0001
  };
  dailyEarned: number;
  lastEarnDate: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierPoints: number;
  spinAvailable: boolean;
  vouchers?: Voucher[];
}

export interface CorporateCompany {
  id: string;
  companyName: string;
  taxNo: string;
  taxOffice: string;
  address: string;
  employeeCount: number;
  monthlyMealBudgetPerEmployee: number;
  corporateToinBalance: number;
  torbaaContractNo: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  image: string;
  address: string;
  distance: string;
  rating: number;
  isTorbaaMealMerchant: boolean;
  commissionRate: number; // Örn: 0.04 (%4)
  pendingSettlementTL: number;
  menu: MenuItem[];
  campaigns: Campaign[];
  monthlyTarget: number;
  monthlyProgress: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
}

export interface Campaign {
  id: string;
  merchantId: string;
  merchantName?: string;
  title: string;
  description: string;
  type: 'earn' | 'discount' | 'gift';
  earnRate?: number;
  discountRate?: number;
  minAmount?: number;
  startDate: string;
  endDate: string;
  quota: number;
  usedCount: number;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  merchantId: string;
  merchantName: string;
  type: 'earn' | 'spend' | 'torbaa_meal_pay';
  paymentMethod: 'torbaa_meal_card' | 'toin_balance' | 'credit_card';
  amount: number;
  toinAmount: number;
  date: string;
  description: string;
}

export interface Voucher {
  id: string;
  brand: string;
  title: string;
  costToin: number;
  valueTL: number;
  code: string;
  expiry: string;
  image: string;
  isRedeemed: boolean;
}
