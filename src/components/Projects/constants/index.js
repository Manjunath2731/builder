const TABS = [
  { label: 'Published', value: 'published' },
  { label: 'Pre Launch Briefing', value: 'pre_launch_briefing' },
  { label: 'Drafts', value: 'drafts' }
];
const CURRENT_TAB = {
  PUBLISHED: 'published',
  PRE_LAUNCH_BRIEFING: 'pre_launch_briefing',
  DRAFTS: 'drafts'
};

// - Residential
// - Commercial
// - I.T
// - Institutional
// - Industrial
// - Farmhouse
// - Pvt. Builder Floor
const PUBLISHED_TABS = [
  {
    label: 'Residential',
    value: 'residential',
    // subType: [
    //   { label: 'Apartments', value: 'apartments' },
    //   { label: 'Plots', value: 'plots' },
    //   { label: 'Villas', value: 'villas' },
    //   { label: 'DDJAY Plots(Deen Dayal)', value: 'DDJAYPlots' },
    //   { label: 'Studio Apartments', value: 'studioApartments' },
    //   { label: 'Townhouse', value: 'townHouse' }
    // ]
  },
  {
    label: 'Commercial',
    value: 'commercial',
    // subType: [
    //   { label: 'SCO Plots', value: 'SCOPlots' },
    //   { label: 'Shops', value: 'shops' },
    //   { label: 'High Street Retails', value: 'highStreetRetails' },
    //   { label: 'Office Towers', value: 'officeTowers' },
    //   { label: 'Double Height Shops', value: 'doubleHeightShops' },
    //   { label: 'Triple Height Shops', value: 'tripleHeightShops' }
    // ]
  },
  { label: 'I.T', value: 'i.t' },
  {
    label: 'Institutional',
    value: 'institutional',
    // subType: [
    //   { label: 'Nursery School', value: 'nurserySchool' },
    //   { label: 'Primary School', value: 'primarySchool' },
    //   { label: 'Senior School(5 Acer plus)', value: 'seniorSchool' },
    //   { label: 'Nursing Home', value: 'nursingHome' },
    //   { label: 'Hospital', value: 'hospital' },
    //   { label: 'Religious Site', value: 'religiousSite' }
    // ]
  },
  {
    label: 'Industrial',
    value: 'industrial',
    // subType: [
    //   { label: 'Industrial Plot', value: 'industrialPlot' },
    //   { label: 'Warehouse', value: 'wareHouse' }
    // ]
  },
  { label: 'Farmhouse', value: 'farmHouse' },
  { label: 'Pvt. Builder Floor', value: 'pvtbuilder' },
];
const QUICK_ACTION = [
  { label: 'EOI/Booking Form', value: 'booking_info' },
  { label: 'Project Brochure', value: 'basic_info' },
  { label: 'Layout Plans', value: 'plan_layout' },
  { label: 'Pricing', value: 'pricing' },
  { label: 'Payment Plan', value: 'payment_plans' },
  { label: 'Unit Calculation Sheet', value: 'calculation_sheet' }
];
const ADD_PROJECT_STEP = [
  {
    label: 'Basic Info',
    value: 'basic_info',
    icon: '/static/images/logo/projectIcons/basic-info-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/basic-info-icon.svg',
    formId: 0
  },
  {
    label: 'About Project',
    value: 'about_project',
    icon: '/static/images/logo/projectIcons/about-project-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/about-project-icon.svg',
    formId: 1
  },
  {
    label: 'Project Media',
    value: 'project_media',
    icon: '/static/images/logo/projectIcons/project-media-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/project-media-icon.svg',
    formId: 2
  },
  {
    label: 'Booking Information',
    value: 'booking_info',
    icon: '/static/images/logo/projectIcons/booking-info-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/booking-info-icon.svg',
    formId: 3
  },
  {
    label: 'Plan Layout',
    value: 'plan_layout',
    icon: '/static/images/logo/projectIcons/plan-layout-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/plan-layout-icon.svg',
    formId: 4
  },
  {
    label: 'Pricing',
    value: 'pricing',
    icon: '/static/images/logo/projectIcons/pricing-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/pricing-icon.svg',
    formId: 5
  },
  {
    label: 'Payment Plans',
    value: 'payment_plans',
    icon: '/static/images/logo/projectIcons/payment-plans-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/payment-plans-icon.svg',
    formId: 6
  },
  {
    label: 'Approved Banks',
    value: 'approved_banks',
    icon: '/static/images/logo/projectIcons/approved-bank-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/approved-bank-icon.svg',
    formId: 7
  },
  {
    label: 'Architect & Consultants',
    value: 'architect_&_consultants',
    icon: '/static/images/logo/projectIcons/consultant-icon.svg',
    selectedIcon:
      '/static/images/logo/projectIcons/selectedProjectIcons/consultant-icon.svg',
    formId: 8
  }
];
const uploadFilePayload = {
  type: '',
  base64Text: '',
  groupId: '',
  fileName: ''
};
const ProjectStatus = [
  { label: 'New Launch', value: 'newLaunch', color: '#00D47B' },
  {
    label: 'Project Teaser (RERA Awaited)',
    value: 'upcomingLaunch',
    color: '#c13419'
  },
  { label: 'Under Construction', value: 'underConstruction', color: '#FFBE45' },
  { label: 'Sold', value: 'sold', color: '#8f74fa' },
  { label: 'Ready Possession', value: 'readyPossession', color: '#fbd25a' },
  { label: 'Possession Handed Over', value: 'handOver', color: '#8f74fa' }
];

export {
  TABS,
  CURRENT_TAB,
  PUBLISHED_TABS,
  QUICK_ACTION,
  ADD_PROJECT_STEP,
  uploadFilePayload,
  ProjectStatus
};
