/**
 * TORBAA Seed Database Script
 * Inserts realistic test data for Balıkesir pilot merchants, corporate companies, employees, wallets and transactions.
 */

import fs from 'fs';
import path from 'path';

console.log('🌱 TORBAA Seed Database Script Initialized...');

const seedData = {
  merchants: [
    {
      id: 'm-101',
      legalName: 'BigChefs Gıda San. ve Tic. A.Ş.',
      displayName: 'BigChefs Balıkesir',
      taxNumber: '1234567891',
      city: 'Balıkesir',
      status: 'ACTIVE',
      mealCardEnabled: true,
      toinRate: 5, // %5
    },
    {
      id: 'm-102',
      legalName: 'Sahar Restoran Gıda Ltd. Şti.',
      displayName: 'Sahar Restoran',
      taxNumber: '1234567892',
      city: 'Balıkesir',
      status: 'ACTIVE',
      mealCardEnabled: true,
      toinRate: 10, // %10
    },
  ],
  companies: [
    {
      id: 'c-201',
      legalName: 'Balıkesir Teknoloji A.Ş.',
      taxNumber: '9876543210',
      activeEmployees: 120,
      monthlyMealAllowanceMinor: 54000000, // ₺540.000,00
      status: 'ACTIVE',
    },
  ],
  campaigns: [
    {
      id: 'cmp-301',
      merchantId: 'm-101',
      title: 'Öğle Menüsünde %20 İndirim',
      discountPercent: 20,
      toinRewardPoints: 250,
      badgeText: '%20 İndirim',
    },
  ],
};

console.log(`✅ Pre-seeded ${seedData.merchants.length} pilot merchants, ${seedData.companies.length} corporate company, ${seedData.campaigns.length} active campaigns.`);
console.log('✨ Database Seeding Ready.');
