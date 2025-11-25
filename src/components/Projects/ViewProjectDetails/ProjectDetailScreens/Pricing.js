import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Divider,
  Grid,
  TableContainer,
  TableBody,
  Table,
  TableCell,
  TableRow
} from '@mui/material';
import { TitleComponent, SigleItem, Document, filterDocs } from './index';
import { MessageComponent } from './ProjectMedia';

const docList = [{ label: 'Pricing Plan', value: 'pricingplan' },
{ label: 'Sample costing sheet', value: 'addsamplecostingsheet' },
  { label: 'Running Promotional Offer', value: 'runningpromotionaloffer' },
];

const OtherChargesList = [
  { label: 'EDC', value: 'edc' },
  { label: 'IDC', value: 'idc' },
  { label: 'PLC', addAnother: true, input: true, value: 'plc' },
  { label: 'IFMD/IFMS', value: 'ifmd' },
  { label: 'Club Membership', value: 'clubMemberShip' },
  { label: 'Car Park', addAnother: true, value: 'carPark' },
  { label: 'Electrical Connection', value: 'electricalConnection' },
  { label: 'Water Connection', value: 'waterConnection' },
  { label: 'Power Backup', value: 'powerBackUp' },
  { label: 'Possession Charges', radio: false, value: 'possessionCharges' }
];
const OtherChargesComponent = ({
  item,
  addAnother = false,
  input = false,
  radio = true,
  chargesValue
}) => {
  const theme = useTheme();
  const TypographyStyle = {
    fontSize: `${theme.typography.pxToRem(19)}`,
    pl: 0.5
  };
  let applicableList = [
    { label: 'Included in Base Price', value: 'basePrice' },
    { label: 'As Applicable', value: 'applicable' },
    { label: 'Not Applicable', value: 'nonApplicable' }
  ];

  const getApplicableLabel = (value) => {
    let label;
    applicableList.map((item) => {
      if (item.value === value) {
        label = item.label;
      }
      return label || '';
    });
    return label || '';
  };
  const AddedRows = chargesValue;
  return (
    <>
      {addAnother &&
        AddedRows.map((rows, index) => {
          return (
            <TableRow
              hover
              key={index}
              sx={{
                overflow: 'visible',
                position: 'relative',
                p: 2
              }}
            >
              <TableCell>
                {index === 0 && (
                  <Typography sx={TypographyStyle}>{item.label}</Typography>
                )}
                {input && (
                  <>
                    <Box width="100%">
                      <Typography sx={{ pl: 3, mt: 1 }} variant="h4">
                        {AddedRows[index]?.facing}
                      </Typography>
                    </Box>{' '}
                  </>
                )}
              </TableCell>
              <TableCell align="right">
                <Box width="100%">
                  <Typography sx={TypographyStyle}>
                    {AddedRows[index]?.price}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {radio && (
                  <>
                    <Typography sx={TypographyStyle}>
                      {getApplicableLabel(AddedRows[index]?.applicable)}
                    </Typography>
                  </>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      {!addAnother && (
        <>
          <TableRow
            hover
            key={item.label}
            sx={{
              overflow: 'visible',
              position: 'relative',
              p: 2
            }}
          >
            <TableCell>
              <Typography sx={TypographyStyle}>{item.label}</Typography>
            </TableCell>
            <TableCell align="right">
              <Box width="100%">
                <Typography sx={TypographyStyle}>{AddedRows?.price}</Typography>
              </Box>
            </TableCell>
            <TableCell>
              {radio && (
                <>
                  <Typography sx={TypographyStyle}>
                    {getApplicableLabel(AddedRows?.applicable)}
                  </Typography>
                </>
              )}
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};
const Pricing = ({ titleName, project, formName }) => {
  const { projectPricing, documents } = project;
  let filteredDocs = filterDocs(docList, documents);
  const getValid = (charges) => {
    if (charges !== undefined) {
      return true;
    }
    return false;
  };
  return (
    <>
      <Box>
        <TitleComponent title={titleName} formName={formName} />
        <Grid container Spacing={2}>
          <Grid item xs={6}>
            <SigleItem
              title="Basic Price"
              subtitle={`Rs ${projectPricing?.basePrice}/sqft`}
            />
          </Grid>
          <Grid item xs={6}>
            <SigleItem title="GST" subtitle={`${projectPricing?.gst}%`} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} xl={8}>
            <Typography variant="h4"> Other Charges</Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {OtherChargesList.map((item, index) => {
                    let charges = projectPricing[`${item.value}`];
                    let isChargeValid = getValid(charges);
                    return (
                      <React.Fragment key={index}>
                        {isChargeValid && (
                          <OtherChargesComponent
                            item={item}
                            addAnother={'addAnother' in item}
                            input={'input' in item}
                            radio={!('radio' in item)}
                            index={index}
                            chargesValue={charges}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {Object.keys(filteredDocs).map(function (key, index) {
          return (
            <>
              {filteredDocs[key].length > 0 ? (
                <>
                  <Typography variant="h4" my={2}>
                    {`${key}(${filteredDocs[key].length})`}
                  </Typography>
                  <Document docArray={filteredDocs[key]} />
                </>
              ) : (
                <MessageComponent title={key} text=" No file added" />
              )}
              {Object.keys(filteredDocs).length > 1 &&
                Object.keys(filteredDocs).length - 1 !== index && (
                  <Divider sx={{ my: 1 }} />
                )}
            </>
          );
        })}
      </Box>
    </>
  );
};

export default Pricing;
