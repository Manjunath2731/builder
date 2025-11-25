import { Box, Typography,Card ,CardMedia, Button} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';


function InitialDashboard({project,team}) {
    const navigate = useNavigate();
    const userData = JSON.parse(window.localStorage.getItem('user'));

    return (
        <Box px={6}>
             <Box sx={{mt:1.5}}>
            <Typography sx={{fontSize:"18px",fontWeight:"bold"}}>
              WELCOME {`${userData?.first_name?.toUpperCase()} ${userData?.last_name?.toUpperCase() || ''}`}
            </Typography>
            <Typography sx={{mt:1}}>
            Let's start whith onboarding your team onto BuilderBroadcast
            </Typography>
            </Box>
            {team === 0 && 
                <Card sx={{mt:1.5 ,width:"85%",height: 300 }}
                // sx={{ maxWidth: 445 }}
                >
                   
                    <Box sx={{display:"flex" ,flexDirection:"row"}}>
                     <Box> 
                    <CardMedia
                      sx={{
                        width: 512,
                        height: 290,
                        objectFit: 'fill',
                        ml:3
                        
                        
                      }}
               image="/static/images/person/6308.jpg"
                  title="meeting"
                    />
      </Box>
      <Box sx={{mt:10,ml:5}} >
        <Typography sx={{fontSize:"18px",fontWeight:"bold"}}> Create Team</Typography>
        <Typography sx={{fontSize:"15px",width:"80%"}}>
            Add your team to assign projects ,channel partners and manage client vists ,registrations all at one place
        </Typography>
        <Button variant="contained"  onClick={() => {
                            navigate(`/team/add-member/teams`);
                        }} 
                        sx={{mt:2}}>
                            Add Team Member

        </Button>

      </Box>
                   </Box>
                    {/* <button
                        onClick={() => {
                            navigate(`/team/add-member/teams`);
                        }}
                    >
                        Add team member
                    </button>
                    <br /> */}
                </Card>
            }
            {project === 0 &&
                <>
                <Typography sx={{mt:5}}> Alternatively, you can also start by adding a project</Typography>
                <Card sx={{mt:1.5 ,width:"85%",height: 300 }}
                // sx={{ maxWidth: 445 }}
                >
                   
                    <Box sx={{display:"flex" ,flexDirection:"row"}}>
                     <Box> 
                    <CardMedia
                      sx={{
                        width: 396,
                        height: 305,
                        objectFit: 'fill',
                        ml:7
                        
                        
                      }}
               image="/static/images/person/5099304.jpg"
                  title="meeting"
                    />
      </Box>
      <Box sx={{mt:10,ml:14}} >
        <Typography sx={{fontSize:"18px",fontWeight:"bold"}}> Upload Your First Project</Typography>
        <Typography sx={{fontSize:"15px",width:"80%"}}>
            Organized projects informations for your channel partners. No more hassel of forwarding same documents again and again.
        </Typography>
        
        <Button variant="contained"  onClick={() => {
                            navigate(`/projects/Add_Project`);
                        }}
                        sx={{mt:2}}>
                            Add Project

        </Button>

      </Box>
                   </Box>
                 
                </Card>
                  
                </>
            }
        </Box>
    );
}

export default InitialDashboard;