import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
// import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
// import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
// import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
// import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
// import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';

const menuItems = [
  {
    heading: '',
    items: [
      {
        name: 'Dashboard',
        link: '/dashboards',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Projects',
        icon: AnalyticsTwoToneIcon,
        link: '/projects' // This routes has to be configured in router.js
      },
      {
        name: 'BroadCast',
        icon: StorefrontTwoToneIcon,
        link: '/broadcast' // This routes has to be configured in router.js
      },
      {
        name: 'Channel Partners',
        icon: AssignmentIndTwoToneIcon,
        link: '/channel_partners' // This routes has to be configured in router.js
      },
      {
        name: 'Meeting & Visits',
        icon: BackupTableTwoToneIcon,
        link: '/meeting' // This routes has to be configured in router.js
      },
      // {
      //   name: 'Reports',
      //   icon: SmartToyTwoToneIcon,
      //   link: '/reports' // This routes has to be configured in router.js
      // },
      {
        name: 'Team',
        icon: AccountTreeTwoToneIcon,
        link: '/team/teams' // This routes has to be configured in router.js
      },
      {
        name: 'Events',
        icon: ReceiptTwoToneIcon,
        link: '/events_polls' // This routes has to be configured in router.js
      },
      {
        name: 'More',
        icon: ReceiptTwoToneIcon,
        link: '/more' // This routes has to be configured in router.js
      }

    ]
  }
];

export default menuItems;
