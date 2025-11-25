import {
  Box,
  Tooltip,
  tooltipClasses,
  styled
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  isSuperAdmin,
  isCrmMember,
  isAssociateAdmin,
  isProjectOnly,
} from 'src/helpers/userHelpers';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);
const TooltipWrapper = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]  
  }
}));
function Logo() {
  const { t } = useTranslation();
  let superaAdmin = isSuperAdmin();
  let associate = isAssociateAdmin();
  const userData = JSON.parse(window.localStorage.getItem('user'));
  let crmMember = isCrmMember();
  let projectOnly = isProjectOnly();
  let routeName =
    superaAdmin || associate
      ? 'builder-dashboard'
      : crmMember
        ? 'team/crm'
        : projectOnly ? 'projects/published' : 'dashboards';
  return (
    <TooltipWrapper title={t('Builder App')} arrow>
      <LogoWrapper to=
        // "/dashboards"
        {routeName}>
        <Box style={{ display: 'flex', justifyContent: 'center', marginLeft: '3.5rem' }}>
          <img
            width={60}
            alt="Auth0"
            src={userData?.builderCompanyLogo ? userData?.builderCompanyLogo : "/static/images/logo/builder_logo.png"}
          />
        </Box>
      </LogoWrapper>
    </TooltipWrapper>
  );
}
export default Logo;