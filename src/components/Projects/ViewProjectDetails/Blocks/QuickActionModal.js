import React, { useState, forwardRef } from 'react';
import {
  EmailIcon,
  EmailShareButton,
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Slide,
  Button,
  Typography,
  Dialog,
  styled,
  Checkbox,
  Tooltip,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import OpenNotification from 'src/content/ShowNotification';

// import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { getDateFromTimeStamp, handleDownload } from 'src/utils/utilits';

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    background: transparent;
    transition: ${theme.transitions.create(['all'])};
    color: ${theme.colors.alpha.black[100]};
    border-radius: 50px;

    &:hover {
      background: transparent;
      color: ${theme.colors.alpha.black[100]};
    }
`
);
const DialogWrapper = styled(Dialog)(
  () => `
    .MuiDialog-paper {
      overflow: visible;
    }
  `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const fileType = ['jpg', 'jpeg', 'png'];
export const videoType = ['mp4'];

export const fileIcons = [
  {
    type: 'pdf',
    iconSrc: '/static/images/logo/pdf-icon.svg'
  },
  {
    type: 'doc',
    iconSrc: '/static/images/logo/doc-icon.svg'
  },
  {
    type: 'xls',
    iconSrc: '/static/images/logo/xls-icon.svg'
  },
  {
    type: 'xlsx',
    iconSrc: '/static/images/logo/xls-icon.svg'
  },
  {
    type: 'gif',
    iconSrc: '/static/images/logo/gif-icon.svg'
  },
  {
    type: 'zip',
    iconSrc: '/static/images/logo/zip-icon.svg'
  },
  {
    type: 'jpeg',
    iconSrc: '/static/images/logo/jpg-icon.svg'
  },
  {
    type: 'jpg',
    iconSrc: '/static/images/logo/jpg-icon.svg'
  },
  {
    type: 'png',
    iconSrc: '/static/images/logo/png-icon 1.svg'
  },
  {
    type: 'ppt',
    iconSrc: '/static/images/logo/ppt-icon 1.svg'
  },


];
export const getIcons = (contentType) => {
  let iconArr = fileIcons.filter((item) => item?.type === contentType);
  return iconArr.length > 0 ? iconArr : [];
};

const QuickActionModal = ({ openConfirm, closeConfirm, title, DocList }) => {
  // const [isLinkCopied, setIsLinkCopied] = useState(false);
  const theme = useTheme();
  const [list, setList] = useState([]);
  const [downloadList, setDownloadList] = useState([]);
  const [isShare, setIsShare] = useState(false);
  const handleClickDownload = () => {
    handleDownload(downloadList)
    closeConfirm();
  };
  // const handleMultipleDowload =(index)=>{
  //   if(index < 0){
  //     return
  //    }
  //     let downloadFile= downloadList[index];
  //     window.location.href =downloadFile?.url;      
  //     handleMultipleDowload(index-1);

  // }

  const selectedSomeFile = list.length > 0 && list.length < DocList.length;
  const selectedAllFile = list.length === DocList.length;
  const handleAllChecked = (event) => {
    setList(event.target.checked ? DocList.map((file) => file?.url) : []);
    setDownloadList(
      event.target.checked
        ? DocList.map((file) => ({
          title: file?.title,
          url: file?.url
        }))
        : []
    );
  };
  const handleChecked = (event) => {
    if (event.target.checked) {
      let download = {
        title: event.target.name,
        url: event.target.id
      };
      setDownloadList([...downloadList, download]);
      setList([...list, event.target.id]);
    } else {
      let tempVar = list.filter((e) => e !== event.target.id);
      let tempDownload = downloadList.filter((e) => e.url !== event.target.id);
      setDownloadList(tempDownload);
      setList(tempVar);
    }
    getLinkString(list);
    console.log("getLinkString(list)", getLinkString(list))
  };
  const getLinkString = (linkArr) => {
    if (DocList.length === 1) {
      return DocList[0]?.url;
    }
    if (linkArr.length > 1) {
      return linkArr.join('\n');
    }
    return linkArr[0] || '';
  };
  const getBodyEmail = () => {
    let linkstring = getLinkString(list);
    return ` ${linkstring}`;
  };


  const [openNoti, setOpenNoti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const isClosed = (data) => {
    if (data) {
      setErrorMessage('');
      setOpenNoti(false);

    }
  };

  const closeSuccessNotification = () => {
    setSuccessMessage('');
  };

  const copy = (list) => {
    const selectedLinks = list.map((url) => `<a href="${url}">${url}</a>`).join('<br>');

    const el = document.createElement('div');
    el.innerHTML = selectedLinks;
    document.body.appendChild(el);
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Copy the formatted links as HTML to the clipboard
    document.execCommand('copy');
    document.body.removeChild(el);

    // Check if the copy operation was successful
    const isCopied = document.execCommand('copy');
    if (isCopied) {
      // setIsLinkCopied(true); // Set isLinkCopied to true if copied successfully
      // showNotification('Copied!', notificationType.SUCCESS);
      setOpenNoti(true);
      setSuccessMessage('File link copied!');
    }
  };
  console.log("DocList", DocList)



  return (
    <>
      <DialogWrapper
        open={openConfirm}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirm}
      >
        <Box p={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {DocList.length > 1 && (
                <Checkbox
                  checked={selectedAllFile}
                  onChange={handleAllChecked}
                  indeterminate={selectedSomeFile}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              )}
              <Typography
                variant="h4"
                sx={{ color: theme.palette.primary.main }}
              >
                {title.toUpperCase()}
              </Typography>
            </Box>
            <IconButton onClick={closeConfirm}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1 }} />
          <Box pb={2}>
            {DocList.length < 1 && (
              <>
                <Box
                  display="flex"
                  justifyContent="center"
                  textAlign="center "
                >
                  <Typography
                    pt={5}
                    sx={{
                      color: theme.palette.grey[500],
                      fontSize: theme.typography.pxToRem(25),
                      fontWeight: 'bold'
                    }}
                    textAlign="center"
                  >
                    No File to Select
                  </Typography>
                </Box>
              </>
            )}
            {DocList.map((item) => {
              let isSelected = list.includes(item?.url);
              const contentType = item?.contentType;
              console.log("ContentType:", item?.contentType);
              const icons = getIcons(contentType);

              return (
                <React.Fragment>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 1,
                      my: 2
                    }}
                  >
                    {DocList.length >= 1 && (
                      <Checkbox
                        checked={isSelected}
                        onChange={handleChecked}
                        inputProps={{ 'aria-label': 'controlled' }}
                        id={item?.url}
                        name={item?.title}
                      />
                    )}
                    <Box sx={{display:"flex",flexDirection:"row"}}>
                    {icons.map((icon) => (
                        <img
                          key={icon.type}
                          src={icon.iconSrc}
                          alt={icon.type}
                          style={{ width: 64, height: 64, mx: -1 }}
                        />
                      ))}
                      <Box sx={{display:"flex",flexDirection:"column" ,ml:2,mt:1}}>
                      <Typography variant="h4" sx={{mt:0.5}}>{item?.title}</Typography>
                    
                      <Typography variant="subtitle2">
                            {`Added  on ${getDateFromTimeStamp(item?.url)}`}
                          </Typography>
                          </Box>
                    </Box>
                    </Box>
                </React.Fragment>
              );
            })}
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              justifyContent: 'flex-start'
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setIsShare((prev) => !prev);
              }}
              disabled={DocList.length < 1}
            >
              Share
            </Button>
            <Button
              variant="contained"
              onClick={handleClickDownload}
              disabled={DocList.length < 1}
            >
              Download
            </Button>
          </Box>
          {isShare && (
            <>
              <Typography variant="h4" sx={{ py: 3 }}>
                Share Via
              </Typography>
              <Box display="flex" alignitems="center" sx={{ ml: "-10px", mt: -3 }} >
                <Tooltip arrow placement="top" title="Mail">
                  <IconButtonWrapper>
                    <EmailShareButton
                      subject={`Broadcast ${title} files`}
                      body={getBodyEmail()}
                    >
                    <EmailIcon size={32} round />
                    </EmailShareButton>
                  </IconButtonWrapper>
                </Tooltip>
                <Tooltip arrow placement="top" title="Whatsapp">
                  <IconButtonWrapper>
                    <WhatsappShareButton
                      title=""
                      url={getLinkString(list)}
                      separator=""
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </IconButtonWrapper>
                </Tooltip>
                <Tooltip arrow placement="top" title="Copy link">
                  <FileCopyIcon
                    sx={{
                      mt: 1,
                      ml: 1,
                      fontSize: "28px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      color: "#0078E9"
                    }}
                    onClick={() => copy(list)}
                  />

                </Tooltip>
              </Box>
            </>
          )}
        </Box>
      </DialogWrapper>
      <OpenNotification isOpen={openNoti} isClosed={isClosed} errorMessage={errorMessage} successMessage={successMessage} closeSuccessNotification={closeSuccessNotification} />
    </>
  );
};

export default QuickActionModal;
