// import { Box, Card, Typography, CardMedia } from "@mui/material";
// import { styled } from '@mui/material/styles';
// import {
//   circularProgressClasses,
// } from '@mui/material/CircularProgress';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getYourProject } from "src/slices/dashboard";

// function YourProjects(props) {
//   const dispatch = useDispatch();

//   const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//     height: 10,
//     borderRadius: 5,
//     [`&.${linearProgressClasses.colorPrimary}`]: {
//       backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
//     },
//     [`& .${linearProgressClasses.bar}`]: {
//       borderRadius: 5,
//       backgroundColor: theme.palette.mode === 'light' ? '#00C45F' : '#00C45F',
//     },
//   }));

//   const yourProject = useSelector((state) => state.dashboard.yourproject);


//   useEffect(() => {
//     dispatch(getYourProject())
//   }, [])

//   const progress = yourProject.assignedProjects / yourProject.totalProjects;

//   return (
//     <Box sx={{ py: 2 }}>

//       <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>YOUR PROJECTS</Typography>
//       <Card sx={{ mt: 1 }} id="card-project">

//         <Box style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
//           <Box style={{ display: "flex", alignItems: "left", flexDirection: "column" }} sx={{ ml: 3, mt: 2 }}>
//             <Typography sx={{ fontSize: "12px" }}>Your Projects</Typography>
//             <Typography sx={{ fontSize: "24px", fontWeight: 'bold' }}> {yourProject?.assignedProjects}</Typography>
//           </Box>
//           <Box style={{ display: "flex", alignItems: "left", flexDirection: "column" }} sx={{ mr: 3, mt: 2 }}>
//             <Typography sx={{ fontSize: "12px" }}>Total Projects</Typography>
//             <Box style={{ display: 'flex', flexDirection: 'row', marginTop: "5px" }}>
//               <Box style={{
//                 backgroundColor: "#0B7DE9",
//                 height: "18px",
//                 width: "48px",
//                 borderRadius: "8px",
//                 marginLeft: "5px"
//               }}>
//                 <Typography style={{ fontSize: "10px", textAlign: "center", color: "white" }} sx={{ mt: "1px" }}> {`${yourProject?.newproject} NEW`}</Typography>
//               </Box>
//               <Typography variant="h6" style={{ fontSize: "25px", fontWeight: 'bold', marginTop: "-8.5px", marginLeft: "5px" }}>{yourProject?.totalProjects}</Typography>

//             </Box>
//           </Box>
//         </Box>


//         <Box style={{ marginTop: "12px" }}>
//           <BorderLinearProgress variant="determinate" value={progress * 100} sx={{
//             color: (theme) => (theme.palette.mode === 'light' ? '#00C45F' : '#00C45F'),
//             animationDuration: '550ms',
//             // position: 'absolute',
//             left: 0,
//             [`& .${circularProgressClasses.circle}`]: {
//               strokeLinecap: 'round',
//             },
//           }}
//             {...props} style={{
//               width: "90%",
//               height: "10px",
//               marginLeft: "26px",
//             }} />
//         </Box>
//         <Box style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} sx={{ mt: 2 }}>
//           <Box sx={{ ml: 3, mb: 3 }}>
//           <Typography style={{ fontSize: "12px", fontWeight: 600 }}>Most Viewed Projects</Typography>
//             {/* <Avatar sx={{ width: 70, height: 70, mt: 0.5, }} /> */}
//             <CardMedia
//               component="img"
//               sx={{
//                 width: 75,
//                 height: 75,
//                 objectFit: 'fill',
//                 cursor: "pointer",
//                 mt: 1.5

//               }}
//               id="project-most"
//               alt="Company Logo"
//               src={yourProject?.mostviewproject?.logo}
//             />

//             < Typography style={{ color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }} sx={{ mt: 1 }}> {yourProject?.mostviewproject?.name}</Typography>
//             <Typography style={{ fontSize: "10px", color: '#A6A6A6',width:"75%" }}>  {`${yourProject?.getlast15MostView} CPs accessed in last 15 days`}</Typography>
//           </Box>
//           <Box sx={{ mr: 10, mb: 3 }} id ="latest-projects">
//             <Typography style={{ fontSize: "12px", fontWeight: 600 }}>Latest Projects</Typography>
//             {/* <Avatar sx={{ width: 70, height: 70, mt: 0.5 }} /> */}
//             <CardMedia
//               component="img"
//               sx={{
//                 width: 75,
//                 height: 75,
//                 objectFit: 'fill',
//                 cursor: "pointer",
//                 mt: 1.5

//               }}
//               id="project-latest"
//               alt="Company Logo"
//               src={yourProject?.latestproject?.logo}
//             />
//             <Typography style={{ color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }} sx={{ mt: 1 }}> {yourProject?.latestproject?.name}</Typography>
//             <Typography style={{ fontSize: "10px", color: '#A6A6A6',width:"75%" }}>  {`${yourProject?.getlast15latestproject} CPs accessed in last 15 days`}</Typography>
//           </Box>
//         </Box>
//       </Card >
//     </Box >
//   );
// }

// export default YourProjects;

import { Box, Card, Typography, CardMedia } from "@mui/material";
import { styled } from '@mui/material/styles';
import {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

function YourProjects(props) {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#00C45F' : '#00C45F',
    },
  }));

  // Hardcoded data
  const yourProject = {
    assignedProjects: 12,
    totalProjects: 25,
    newproject: 3,
    mostviewproject: {
      name: "Project Alpha",
      logo: "/static/images/projectImage/project2.jpg"
    },
    getlast15MostView: 145,
    latestproject: {
      name: "Project Beta",
      logo: "/static/images/projectImage/project4.jpg"
    },
    getlast15latestproject: 89
  };

  const progress = yourProject.assignedProjects / yourProject.totalProjects;

  return (
    <Box sx={{ py: 2 }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: "13px" }}>YOUR PROJECTS</Typography>
      <Card sx={{ mt: 1 }} id="card-project">

        <Box style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Box style={{ display: "flex", alignItems: "left", flexDirection: "column" }} sx={{ ml: 3, mt: 2 }}>
            <Typography sx={{ fontSize: "12px" }}>Your Projects</Typography>
            <Typography sx={{ fontSize: "24px", fontWeight: 'bold' }}> {yourProject?.assignedProjects}</Typography>
          </Box>
          <Box style={{ display: "flex", alignItems: "left", flexDirection: "column" }} sx={{ mr: 3, mt: 2 }}>
            <Typography sx={{ fontSize: "12px" }}>Total Projects</Typography>
            <Box style={{ display: 'flex', flexDirection: 'row', marginTop: "5px" }}>
              <Box style={{
                backgroundColor: "#0B7DE9",
                height: "18px",
                width: "48px",
                borderRadius: "8px",
                marginLeft: "5px"
              }}>
                <Typography style={{ fontSize: "10px", textAlign: "center", color: "white" }} sx={{ mt: "1px" }}> {`${yourProject?.newproject} NEW`}</Typography>
              </Box>
              <Typography variant="h6" style={{ fontSize: "25px", fontWeight: 'bold', marginTop: "-8.5px", marginLeft: "5px" }}>{yourProject?.totalProjects}</Typography>
            </Box>
          </Box>
        </Box>

        <Box style={{ marginTop: "12px" }}>
          <BorderLinearProgress variant="determinate" value={progress * 100} sx={{
            color: (theme) => (theme.palette.mode === 'light' ? '#00C45F' : '#00C45F'),
            animationDuration: '550ms',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
            {...props} style={{
              width: "90%",
              height: "10px",
              marginLeft: "26px",
            }} />
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} sx={{ mt: 2 }}>
          <Box sx={{ ml: 3, mb: 3 }}>
            <Typography style={{ fontSize: "12px", fontWeight: 600 }}>Most Viewed Projects</Typography>
            <CardMedia
              component="img"
              sx={{
                width: 75,
                height: 75,
                objectFit: 'fill',
                cursor: "pointer",
                mt: 1.5
              }}
              id="project-most"
              alt="Company Logo"
              src={yourProject?.mostviewproject?.logo}
            />
            <Typography style={{ color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }} sx={{ mt: 1 }}> {yourProject?.mostviewproject?.name}</Typography>
            <Typography style={{ fontSize: "10px", color: '#A6A6A6', width: "75%" }}>  {`${yourProject?.getlast15MostView} CPs accessed in last 15 days`}</Typography>
          </Box>

          <Box sx={{ mr: 10, mb: 3 }} id="latest-projects">
            <Typography style={{ fontSize: "12px", fontWeight: 600 }}>Latest Projects</Typography>
            <CardMedia
              component="img"
              sx={{
                width: 75,
                height: 75,
                objectFit: 'fill',
                cursor: "pointer",
                mt: 1.5
              }}
              id="project-latest"
              alt="Company Logo"
              src={yourProject?.latestproject?.logo}
            />
            <Typography style={{ color: "#0B7DE9", fontSize: "12px", fontWeight: 'bold' }} sx={{ mt: 1 }}> {yourProject?.latestproject?.name}</Typography>
            <Typography style={{ fontSize: "10px", color: '#A6A6A6', width: "75%" }}>  {`${yourProject?.getlast15latestproject} CPs accessed in last 15 days`}</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default YourProjects;