import { ListSubheader, Box, List, styled, Typography } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Scrollbar from 'src/components/Scrollbar';
import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import {
  isSuperAdmin,
  isCrmMember,
  isAssociateAdmin,
  isProjectOnly
} from 'src/helpers/userHelpers';
import SidebarMenuItem from './item';


const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    margin-bottom: ${theme.spacing(1.5)};
    padding: 0;
    margin-top: ${theme.spacing(3.5)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.sidebar.menuItemIconColor};
      padding: ${theme.spacing(1, 3.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
            margin-top:33px;
            margin-left:11px;
      .MuiListItem-root {
        padding: 5px 0;
       

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(5.5)};


          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: #077CEA;
          background-color: ${theme.sidebar.menuItemBg};
          width: 100%;
          border-radius: 0;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 4)};
          font-size: ${theme.typography.pxToRem(13)};

          &:after {
            content: '';
            position: absolute;
            height: 100%;
            right: 0;
            top: 0;
            width: 0;
            opacity: 0;
            transition: ${theme.transitions.create(['opacity', 'width'])};
            background: ${theme.sidebar.menuItemColorActive};
            border-top-left-radius: ${theme.general.borderRadius};
            border-bottom-left-radius: ${theme.general.borderRadius};
          }
    
          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
            color: #077CEA;
          }
          
          .MuiButton-endIcon {
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.Mui-active,
          &:hover {
            background-color: #F2F5F9;
            color:#3D3D3D;

            .MuiButton-startIcon,
            .MuiButton-endIcon {
                color:#3D3D3D;
            }
          }

          &.Mui-active {
            &:after {
              width: 5px;
              opacity: 1;
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(8)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
            margin-top:-10px;
          }

          .MuiListItem-root {
            padding: 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.7, 4, 0.7, 4.25)};

              .MuiBadge-root {
                right: ${theme.spacing(5.5)};
              }

              &:before {
                content: ' ';
                background: ${theme.sidebar.menuItemIconColorActive};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.Mui-active,
              &:hover {
                background-color: ${theme.sidebar.menuItemBg};

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }

                &:after {
                  opacity: 0;
                }
              }
            }
          }
        }
      }
    }
`
);

const renderSidebarMenuItems = ({ items, path }) => (
  <SubMenuWrapper>
    <List component="div">
      {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path }), [])}
    </List>
  </SubMenuWrapper>
);

const reduceChildRoutes = ({ ev, path, item }) => {
  const key = item.name;

  const exactMatch = item.link
    ? !!matchPath(
      {
        path: item.link,
        end: true
      },
      path
    )
    : false;

  if (item.items) {
    const partialMatch = item.link
      ? !!matchPath(
        {
          path: item.link,
          end: false
        },
        path
      )
      : false;

    ev.push(
      <SidebarMenuItem
        key={key}
        active={partialMatch}
        open={partialMatch}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}
        badgeTooltip={item.badgeTooltip}
        altName={item.altName}
      >
        {renderSidebarMenuItems({
          path,
          items: item.items
        })}
      </SidebarMenuItem>
    );
  } else {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={exactMatch}
        name={item.name}
        link={item.link}
        badge={item.badge}
        badgeTooltip={item.badgeTooltip}
        icon={item.icon}
      />
    );
  }

  return ev;
};

function SidebarMenu() {
  const location = useLocation();
  const { t } = useTranslation();

  const superAdminRoute = [
    {
      heading: '',
      items: [
        {
          name: 'DASHBOARD',
          link: '/builder-dashboard',
          icon: DesignServicesTwoToneIcon
        },
        {
          name: 'MORE',
          altName: 'BB Center',
          heading: '',
          // icon: ReceiptTwoToneIcon,
          link: '/more', // This routes has to be configured in router.js
          items: [{
            name: 'News Center',
            link: '/more/news',
          },
          {
            name: 'Circle Rate',
            link: '/more/circlerate',
          },
          {
            name: 'Govt Policies',
            link: '/more/govtpolices',
          },
          {
            name: 'Sample Docs',
            link: '/more/SampleDocumentsDeeds',
          },
          {
            name: 'Deed Writers',
            link: '/more/DeedDocumentWriters',
          },
          {
            name: 'Maps',
            link: '/more/maps',
          },
          {
            name: 'Bank & DSAs',
            link: '/more/bank',
          }
          ]
        }
      ]
    }
  ];

  const crmRoute = [
    {
      heading: '',
      items: [
        // {
        //   name: 'Team',
        //   icon: AccountTreeTwoToneIcon,
        //   link: '/team/crm' // This routes has to be configured in router.js
        // }
      ]
    }
  ];

  const normalRoute = [
    {
      heading: '',
      items: [
        {
          name: 'DASHBOARD',
          link: '/dashboards',
          icon: DesignServicesTwoToneIcon
        },
        {
          name: 'PROJECTS',
          icon: AnalyticsTwoToneIcon,
          link: '/projects' // This routes has to be configured in router.js
        },
        {
          name: 'BROADCASTS',
          icon: StorefrontTwoToneIcon,
          link: '/broadcast' // This routes has to be configured in router.js
        },
        {
          name: 'CHANNEL PARTNERS',
          icon: AssignmentIndTwoToneIcon,
          link: '/channel_partners' // This routes has to be configured in router.js
        },
        {
          name: 'MEETING & VISITS',
          icon: BackupTableTwoToneIcon,
          link: '/meeting' // This routes has to be configured in router.js
        },
        // {
        //   name: 'Reports',
        //   icon: SmartToyTwoToneIcon,
        //   link: '/reports' // This routes has to be configured in router.js
        // },
        {
          name: 'TEAM',
          icon: AccountTreeTwoToneIcon,
          link: '/team/teams' // This routes has to be configured in router.js
        },
        {
          name: 'EVENTS',
          icon: ReceiptTwoToneIcon,
          link: '/events_polls' // This routes has to be configured in router.js
        },
        {
          name: 'MORE',
          altName: 'BB Center',
          heading: '',
          // icon: ReceiptTwoToneIcon,
          link: '/more', // This routes has to be configured in router.js
          items: [{
            name: 'News Center',
            link: '/more/news',
          },
          {
            name: 'Circle Rate',
            link: '/more/circlerate',
          },
          {
            name: 'Govt Policies',
            link: '/more/govtpolices',
          },
          {
            name: 'Sample Docs',
            link: '/more/SampleDocumentsDeeds',
          },
          {
            name: 'Deed Writers',
            link: '/more/DeedDocumentWriters',
          },
          {
            name: 'Maps',
            link: '/more/maps',
          },
          {
            name: 'Bank & DSAs',
            link: '/more/bank',
          }
          ]
        }
      ]
    }
  ];

  const finalRoute =
    isSuperAdmin() || isAssociateAdmin()
      ? superAdminRoute
      : isCrmMember() || isProjectOnly()
        ? crmRoute
        : normalRoute;

  const menuItems = finalRoute;
  return (
    <>
      {menuItems.map((section) => (
        <MenuWrapper key={section.heading}>
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {t(section.heading)}
              </ListSubheader>
            }
          >
            {renderSidebarMenuItems({
              items: section.items,
              path: location.pathname
            })}
          </List>
          <Box sx={{ display: 'flex', position: "absolute", top: "55rem", mb: 1.5 }}>
            <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} sx={{ ml: 5 }}>
              <Typography style={{ fontSize: "11px" }}>Powered by:</Typography>
              <img
                width={50}
                alt="Auth0"
                src="/static/images/logo/builder_logo.png"
              />
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} sx={{ ml: 2 }}>
              <Typography style={{ fontSize: "11px" }}>Secured by:</Typography>
              <img
                width='68px'
                alt="Auth0"
                src="/static/images/logo/securedby.png"
              />
            </Box>
          </Box>
        </MenuWrapper>

      ))}

    </>

  );
}

export default SidebarMenu;
