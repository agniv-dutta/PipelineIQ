// Full mock dataset used when the backend is unreachable (e.g. Vercel demo)

export const MOCK_TOKEN = 'demo-mock-token';

export const mockOverview = {
  total_ad_spend: 482000,
  pipeline_value: 3840000,
  revenue_attributed: 1920000,
  roas: 3.98,
  cac: 4820,
};

export const mockFunnel = {
  funnel: [
    { stage: 'Awareness', count: 12400 },
    { stage: 'Interest', count: 5800 },
    { stage: 'Consideration', count: 2100 },
    { stage: 'Intent', count: 840 },
    { stage: 'Closed', count: 210 },
  ],
};

export const mockRevenueByChannel = {
  channels: [
    { platform: 'Google Ads', attributed_revenue: 680000, spend: 160000 },
    { platform: 'LinkedIn', attributed_revenue: 520000, spend: 130000 },
    { platform: 'Meta', attributed_revenue: 380000, spend: 105000 },
    { platform: 'Email', attributed_revenue: 220000, spend: 42000 },
    { platform: 'Organic', attributed_revenue: 120000, spend: 45000 },
  ],
};

export const mockTopCampaigns = {
  campaigns: [
    { campaign_id: 1, campaign_name: 'Q1 Enterprise Push', platform: 'Google Ads', spend: 82000, attributed_revenue: 340000, roas: 4.15 },
    { campaign_id: 2, campaign_name: 'APAC SaaS Leaders', platform: 'LinkedIn', spend: 68000, attributed_revenue: 270000, roas: 3.97 },
    { campaign_id: 3, campaign_name: 'Retargeting Wave 3', platform: 'Meta', spend: 45000, attributed_revenue: 172000, roas: 3.82 },
    { campaign_id: 4, campaign_name: 'Mid-Market Nurture', platform: 'Email', spend: 18000, attributed_revenue: 66000, roas: 3.67 },
    { campaign_id: 5, campaign_name: 'Brand Awareness FY25', platform: 'Google Ads', spend: 52000, attributed_revenue: 188000, roas: 3.62 },
  ],
};

export const mockBudgetRecommendations = {
  recommendations: [
    {
      campaign_name: 'Q1 Enterprise Push',
      recommendation: 'Increase budget by 20%',
      action: 'This campaign has the highest ROAS. Allocate an additional ₹16,000/month.',
      priority: 'high',
      confidence: 0.91,
    },
    {
      campaign_name: 'APAC SaaS Leaders',
      recommendation: 'Expand audience targeting',
      action: 'Broaden LinkedIn job title targeting to include VP-level decision makers.',
      priority: 'high',
      confidence: 0.87,
    },
    {
      campaign_name: 'Brand Awareness FY25',
      recommendation: 'Reallocate to conversion campaigns',
      action: 'Shift 30% of spend toward bottom-funnel retargeting campaigns.',
      priority: 'medium',
      confidence: 0.79,
    },
    {
      campaign_name: 'Retargeting Wave 3',
      recommendation: 'Test new ad creatives',
      action: 'CTR has dropped 18% MoM. A/B test 3 new creative variants.',
      priority: 'medium',
      confidence: 0.74,
    },
    {
      campaign_name: 'Mid-Market Nurture',
      recommendation: 'Increase email cadence',
      action: 'Leads in this segment respond best to weekly touchpoints. Automate follow-ups.',
      priority: 'low',
      confidence: 0.68,
    },
    {
      campaign_name: 'Organic',
      recommendation: 'Invest in SEO content',
      action: 'Top 5 organic keywords have high intent. Create 4 pillar pages this quarter.',
      priority: 'low',
      confidence: 0.63,
    },
  ],
};

export const mockCampaigns = [
  { id: 1, name: 'Q1 Enterprise Push', platform: 'Google Ads', budget: 100000, cost: 82000, impressions: 1240000, clicks: 18600 },
  { id: 2, name: 'APAC SaaS Leaders', platform: 'LinkedIn', budget: 80000, cost: 68000, impressions: 420000, clicks: 6300 },
  { id: 3, name: 'Retargeting Wave 3', platform: 'Meta', budget: 55000, cost: 45000, impressions: 980000, clicks: 14700 },
  { id: 4, name: 'Mid-Market Nurture', platform: 'Email', budget: 22000, cost: 18000, impressions: 84000, clicks: 7200 },
  { id: 5, name: 'Brand Awareness FY25', platform: 'Google Ads', budget: 60000, cost: 52000, impressions: 2100000, clicks: 31500 },
  { id: 6, name: 'Webinar Series Q2', platform: 'LinkedIn', budget: 35000, cost: 28000, impressions: 210000, clicks: 3150 },
];
