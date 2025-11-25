import React from 'react';
import { Box } from '@mui/material';
import { TitleComponent, Document } from './index';
import { toUpper } from '../../../../content/meetings-n-visits/commanFunctions';

const getPaymentName = (str) => {
  if (typeof str === 'string') {
    let formatedStr = str.split('_').join(' ');
    return toUpper(formatedStr);
  }
  return str;
};

export const FilterPayment = (payments) => {
  let file = payments.map((item) => ({
    title: item?.title,
    contentType: item?.contentType,
    url: item?.url,
    formType: getPaymentName(item?.paymentType)
  }));
  return file;
};
const PaymentPlans = ({ titleName, project, formName }) => {
  let filteredDocs = FilterPayment(project?.payment);
  return (
    <>
      <Box>
        <TitleComponent title={titleName} formName={formName} />
        <Box>
          <Document docArray={filteredDocs} showTitle="true" />
        </Box>
      </Box>
    </>
  );
};

export default PaymentPlans;
