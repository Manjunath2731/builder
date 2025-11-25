import { Box, Card, Divider, Typography, useTheme } from '@mui/material';

const FilterCard = ({
  mainText,
  count,
  description,
  handleCardChange,
  selectedCard
}) => {
  const theme = useTheme();
  const COLOR = 'color';
  const DESCRIPTION_COLOR = 'description_color';
  const CARD_NAME = 'card_name';
  const generateValues = (selectedCard, type) => {
    let backgroundColor = '';
    let cardName = '';
    let descriptionColor = '';
    switch (selectedCard) {
      case 'ALL_BROADCAST':
        backgroundColor = '#5cb256';
        cardName = 'All Broadcasts';
        descriptionColor = '#418139';
        break;
      case 'GENERAL_UPDATES':
        backgroundColor = '#8F74FA';
        cardName = 'General Updates';
        descriptionColor = '#4B337C';
        break;
      case 'OFFER_BROKERS':
        backgroundColor = '#f8a38e';
        cardName = 'Offers for Brokers';
        descriptionColor = '#dd745a';
        break;
      case 'OFFER_BUYERS':
        backgroundColor = '#cf99ca';
        cardName = 'Offers for Buyers';
        descriptionColor = '#9e6798';
        break;
      case 'PROJECT_UPDATES':
        backgroundColor = '#49d0da';
        cardName = 'Project Updates';
        descriptionColor = '#4f8287';
        break;
      default:
        backgroundColor = '#F5D06E';
        cardName = 'Event & Polls';
        descriptionColor = '#4B337C';
        break;
    }
    if (type === COLOR) {
      return backgroundColor;
    }
    if (type === DESCRIPTION_COLOR) {
      return descriptionColor;
    }
    return cardName;
  };

  const handleSelect = () => {
    handleCardChange(mainText);
  };
  const twoLine = (value, line = 1) => {
    let strArr = value.split(' ');
    if (line === 2) {
      return strArr[strArr.length - 1]
    }
    strArr.pop();
    return strArr.join(' ');
  }
  return (
    <>
      <Box style={{ cursor: 'pointer' }}>
        <Card
          variant="outlined"
          sx={{
            height: { xs: '160px', md: '130px', },
            padding:1,
            // // mb:
            // // width: { xxl:'225px'},
            // paddingLeft: 3,
            // paddingRight: 3,
            // marginRight: {xs:1,lg:2,xl:1},
            background:
              selectedCard === mainText
                ? generateValues(selectedCard, COLOR)
                : '',
            color: selectedCard !== mainText ? '#434343' : '#ffffff',
            borderRadius: '8px',
            border: 0,
            boxShadow: '1px 2px 15px 3px rgba(206,219,239,0.58)',
            transition: 'background-color 0.1s', 
            '&:hover': {
              backgroundColor: generateValues(mainText, COLOR),
              color: '#ffffff',
  
              '.description-text': {
                color: '#ffffff', 
              },
            },
          }}
          onClick={handleSelect}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
            mt={1}
          >
            <Box sx={{marginLeft:1}} >
              <Typography
                sx={{
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  mb: 0.5
                }}
                variant="h4"
              >
                {twoLine(generateValues(mainText, CARD_NAME))}
              </Typography>
              <Typography
                sx={{
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  mb: 1
                }}
                variant="h4"
              >
                {twoLine(generateValues(mainText, CARD_NAME), 2)}
              </Typography>
            </Box>
            <Box sx={{ marginRight:  1}} mt={1}>
              <Typography
                sx={{
                  fontSize: `${theme.typography.pxToRem(25)}`,
                  mb: 1
                }}
                variant="h1"
              >
                {count}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box mt={1} 
          // ml={-1}
          >
            <Typography
              sx={{
                fontSize: '12px',
                mb: 1,
                paddingLeft: '10px',
                color: selectedCard === mainText ?"#ffffff" : '#969696',
                fontWeight: 'bold'

              }}
              style={{
                lineHeight: '16px',
                letterSpacing: '0',
              
              }}
              variant="subtitle1"
              className="description-text" 
            >
              {description}
            </Typography>
          </Box>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
            ''
          )}
        </Box>
      </Box>
    </>
  );
};

export default FilterCard;
