import { Box, Card, Typography, useTheme } from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import "src/components/Projects/ViewProjectDetails/CompleteDetails/YourProject.css";

const FilterCard = ({
  mainText,
  count,
  handleCardChange,
  selectedCard,
  icon
}) => {
  const theme = useTheme();
  const Icon = icon;
  const COLOR = 'color';
  const CARD_NAME = 'card_name';
  const generateValues = (selectedCard, type) => {
    let backgroundColor = '';
    let cardName = '';
    switch (selectedCard) {
      case 'ALL_BROADCAST':
        backgroundColor = '#5cb256';
        cardName = 'All Broadcasts';
        break;
      case 'GENERAL_UPDATES':
        backgroundColor = '#8f74fa';
        cardName = 'General Updates';
        break;
      case 'OFFER_BROKERS':
        backgroundColor = '#f8a38e';
        cardName = 'Offers for Brokers';
        break;
      case 'OFFER_BUYERS':
        backgroundColor = '#cf99ca';
        cardName = 'Offers for Buyers';
        break;
      case 'PROJECT_UPDATES':
        backgroundColor = '#49d0da';
        cardName = 'Project Updates';
        break;
        case 'EVENTS_POLLS':
        backgroundColor = '#F5D06E';
        cardName = 'Events & polls';
        break;
       
      default:
        backgroundColor = '#0078e9';
        cardName = 'Add New ';
        count=''
        break;
    }
    if (type === COLOR) {
      return backgroundColor;
    }
    return cardName;
  };

  const handleSelect = () => {
    handleCardChange(mainText);
  };
  return (
    <>
      <Box sx={{ paddingBottom:2,}}>
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            paddingLeft: 2,
            paddingRight: 2,
            marginRight:1.0,
            background: 
              generateValues(mainText, COLOR),
              cursor:"pointer"
           
                
          }}
          onClick={handleSelect}
        >
          <Box id ="broad-cast"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              color:'#fff',
              // width: '85px',
            }}
            mt={1}
          >
            <Box mt={1} >
            {icon  && <Icon fontSize="medium" />}

              <Typography
                sx={{
                  fontSize: `${theme.typography.pxToRem(13)}`,
                  mt:-1,
                  mb:1,
                  ml:-1.0,
                  width:"64px"
                }}
                variant="h4"
              >
                {generateValues(mainText, CARD_NAME)}
              </Typography>
            </Box>
            <Box  >
              <Typography
                sx={{
                  fontSize: `${theme.typography.pxToRem(22)}`,
                    
                }}
                variant="h1"
              >
                {generateValues(mainText, CARD_NAME)==="Add New " && <AddCircleRoundedIcon sx={{ml:1.5 ,mb:0.8,fontSize:"28px"}}/>}
            {count}
              </Typography>
            </Box>
          </Box>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'center',}}>
          {selectedCard === mainText ? (
            <Box
              sx={{
                width: '10px',
                height: '4px',
                borderTop: `solid 15px ${generateValues(selectedCard, COLOR)}`,
                borderLeft: 'solid 15px transparent',
                borderRight: 'solid 15px transparent'
              }}
            >
              {' '}
            </Box>
          ) : (
            <Box>
             {' '}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default FilterCard;
