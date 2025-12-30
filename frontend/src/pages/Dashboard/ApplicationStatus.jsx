// pages/dashboard/ApplicationStatus.jsx
import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Button,
    Grid,
    Paper,
    Divider,
    StepConnector,
    stepConnectorClasses,
    TextField,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    ArrowBack,
    Flight,
    CalendarToday,
    LocationOn,
    Check,
    Comment,
    History,
    CheckCircle,
    Edit,
    Person,
    Assignment,
    Business,
    Work,
    Badge
} from '@mui/icons-material';
import BaseLayout from '../../components/layout/BaseLayout';
import { Navbar, SharedCard, StatusChip, UserAvatar } from '../../components/shared';
import { useSelector, useDispatch } from 'react-redux';
import { updateRequestStatus, addNotification, addApprovalHistory } from '../../redux/slices/dashboardSlice';
import { toast } from 'react-toastify';
import employeeService from '../../services/employeeService';
import { formatDate, formatDateToDateString } from '../../utils/helpers';
import { getActiveStep } from '../../utils/getActiveStep';
import api from '../../services/apiService';
import apiClient from '../../api/client';
import DateEditor from '../../components/shared/dateEditor/DateEditor';

// Custom Stepper Connector
const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#b91c1c',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#b91c1c',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#b91c1c',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#b91c1c',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

const ApplicationStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    // const { approvalHistory, } = useSelector((state) => state.dashboard);
    const [travelDetails, setTravelDetails] = useState([])
    const dispatch = useDispatch();

    const [comment, setComment] = useState('');
    const [loader, setLoader] = useState(true)
    const [budget, setBudget] = useState('');
    const [isDateEditorOpen, setIsDateEditorOpen] = useState(false)
    const [editedDates, setEditedDates] = useState({ startDate: '', endDate: '' });
    const [isDatesEditedsetDatesEdited, setIsDatesEditedsetDatesEdited] = useState(false)
    const [fullTravelDeatilsByTiD, setFullTravelDetailsByTiD] = useState([])
    const [approvalHistory, setApprovalHistory] = useState([])
    const [lastApprovalDate, setLastApprovalDate] = useState('')

    const empId = id.split("-")[0]

    useEffect(() => {

        const fetchEmployeeTravelData = async () => {
            const data = await employeeService.getEmployeeTravel(empId);
            setTravelDetails(data)
            setLoader(false)
        }
        fetchEmployeeTravelData()

    }, [])

    useEffect(() => {
        const fetchTravelDetailsByTid = async () => {
            const travelDetailByTid = await employeeService.getEmployeeTravelByTid(travelDetails[0]?.travelId)
            setFullTravelDetailsByTiD(travelDetailByTid)
        }

        if (travelDetails[0] !== undefined) {
            fetchTravelDetailsByTid(travelDetails[0]?.travelId)
        }
    }, [travelDetails[0]])

    useEffect(() => {
        if (fullTravelDeatilsByTiD !== undefined) {
            setApprovalHistory(fullTravelDeatilsByTiD[0]?.history)
        }
    }, [fullTravelDeatilsByTiD])

    useEffect(() => {
        if (approvalHistory !== undefined) {
            const approvalHistoryLength = approvalHistory.length
            setLastApprovalDate(approvalHistory[approvalHistoryLength]?.dateofAction)
        }

    }, [approvalHistory])

    let travelId = travelDetails[0]?.travelId

    const departurDate = formatDateToDateString(travelDetails[0]?.departureDate)
    const arrivalDate = formatDateToDateString(travelDetails[0]?.returnDate)

    const handleStatusUpdate = async (actionType) => {
        let newStatus = '';
        let stepIndex = 0;
        let notifMessage = '';

        if (actionType === 'APPROVE') {
            if (user.roleId === 102) {
                newStatus = 4;
                stepIndex = 4;
                notifMessage = `Manager approved request ${id}`;
            }
            else if (user.roleId === 104) { newStatus = 5; stepIndex = 5; notifMessage = `AVP approved request ${id}`; }
            else if (user.roleId === 105) { newStatus = 6; stepIndex = 6; notifMessage = `SVP approved request ${id}`; }
            // else if (user.role === 'CHRO') { newStatus = 'APPROVED'; stepIndex = 4; notifMessage = `CHRO final approval for request ${id}`; }
            // else if (user.role === 'FINANCE') { newStatus = 'BUDGET_CONFIRMED'; stepIndex = 2; notifMessage = `Finance confirmed budget for ${id}`; }
        } else if (actionType === 'REJECT') {
            if (!comment.trim()) {
                toast.error("Please provide a reason for rejection.");
                return;
            }
            newStatus = 'REJECTED';
            stepIndex = 0;
            notifMessage = `Request ${id} rejected by ${user.role}`;
        } else if (actionType === 'REQUEST_CHANGES') {
            if (!comment.trim()) {
                toast.error("Please provide comments for requested changes.");
                return;
            }
            newStatus = 'CHANGES_REQUESTED';
            stepIndex = 1;
            notifMessage = `Changes requested for ${id} by ${user.role}`;
        } else if (actionType === 'COMPLETE_BOOKING') {
            newStatus = 'BOOKING_COMPLETED';
            stepIndex = 5;
            notifMessage = `Booking completed for request ${id}`;
        }

        const updateData = new FormData()
        const finalDates = new FormData()
        if (travelDetails[0]?.status === 7) {
            updateData.append('TID', travelId)
            updateData.append('Status', 15)
            updateData.append('Comment', comment)
            updateData.append('EmpId', user?.empId)
            finalDates.append('TId', travelId)
            finalDates.append('FinalStartDate', editedDates.startDate)
            finalDates.append('FinalEndDate', editedDates.endDate)
            if (finalDates && Array.from(finalDates.entries()).length > 0) {
                const updateResponse = await apiClient.post("/api/UpdateTravelStatus", updateData)
                const updateDateResponse = await apiClient.post("/api/manager/UpdateFinalDates", finalDates)
                    // (updateResponse.status === 200 && updateDateResponse === 200) ?
                     toast.success(`Action ${actionType} completed successfully`) 
                    //  :
                    // toast.error(`Action ${actionType} failed`)
            } else {
                toast.info(`Updated dates required`)
            }

        } else {
            updateData.append('TID', travelId)
            updateData.append('Status', newStatus)
            updateData.append('Comment', comment)
            updateData.append('EmpId', user?.empId)
            const updateResponse = await apiClient.post("/api/UpdateTravelStatus", updateData)
            updateResponse.status === 200 ? toast.success(`Action ${actionType} completed successfully`) :
                toast.error(`Action ${actionType} failed`)
        }

        // updateData.respo
        dispatch(addNotification(notifMessage));
        // dispatch(addApprovalHistory({
        //     role: user.role,
        //     name: `${user.firstName} ${user.lastName}`,
        //     status: actionType,
        //     comment: comment,
        //     date: new Date().toLocaleString()
        // }));


        // toast.success(`Action ${actionType} completed successfully`) : 
        navigate('/dashboard');
    };

    // Mock data for the stepper
    const activeStep = getActiveStep(travelDetails[0]?.status)
    const steps = [
        { label: 'Request Raised', date: '2025-11-25', completed: activeStep >= 0 ? true : false },
        { label: 'Request Approved', date: '2025-11-26', completed: (activeStep >= 1) ? true : false },
        { label: 'Documents Submitted', date: '', completed: activeStep >= 5 ? true : false },
        { label: 'Travel Desk Review', date: 'Current', completed: activeStep >= 15 ? true : false },
        { label: 'Booking Confirmed', date: '', completed: activeStep >= 16 ? true : false }
    ];

    const getTravelAndForwardButtonDisability = (travelDetails) => {
        let disableButton = true
        // if(travelDetails[0]?.rptEmpId === user.empId)
        if (user.roleId === 102 && comment!=='') {
            // if(travelDetails[0]?.rptEmpId === user.empId){
            //     disableButton = true
            // }
            if (travelDetails[0]?.status === 7) {
                disableButton = false
            }
        }
        else if (user.roleId === 104 && comment!=='') {
            if (travelDetails[0]?.status === 1) {
                disableButton = false
            }//else if()
        }
        else if (user.roleId === 105 && comment!=='') {
            if (travelDetails[0]?.status === 5) {
                disableButton = false
            }
        }
        return disableButton
    }

    const newGetTravelAndForwardButtonDisability  = (travelDetails) => {
        let disableButton = false
        // if(travelDetails[0]?.rptEmpId === user.empId)
        if (user.roleId === 102 && comment!=='') {
            // if(travelDetails[0]?.rptEmpId === user.empId){
            //     disableButton = true
            // }
            if (travelDetails[0]?.status === 7) {
                disableButton = true
            }
        }
        else if (user.roleId === 104 && comment!=='') {
            if (travelDetails[0]?.status === 1) {
                disableButton = true
            }//else if()
        }
        else if (user.roleId === 105 && comment!=='') {
            if (travelDetails[0]?.status === 5) {
                disableButton = true
            }
        }
        return disableButton
    }

    const openDateEditor = () => {
        setIsDateEditorOpen(true);
    };

    const closeDateEditor = () => {
        setIsDateEditorOpen(false);
    };

    const handleDateChange = (empId, dateType, dateValue) => {
        console.log(`Employee ID: ${empId}, ${dateType}: ${dateValue}`);
        // Add logic to handle date changes, e.g., updating state or making API calls
    };

    const handleSave = (startDate, endDate) => {

        setEditedDates({ startDate, endDate });
        setIsDatesEditedsetDatesEdited(true)
        // You can also add logic to update the travel details or make API calls here
    };

    const travelEmpId = travelDetails[0]?.empId

    const travelStatus = travelDetails[0]?.status


    return (
        <BaseLayout variant="dashboard">
            <Navbar user={user} onLogout={() => navigate('/login')} />

            <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, color: '#64748b', '&:hover': { bgcolor: 'transparent', color: '#1e293b' } }}
                >
                    Back to Dashboard
                </Button>

                {loader ?
                    <CircularProgress />
                    :
                    <Fragment>
                        <SharedCard variant="dashboard" sx={{ mb: 4, overflow: 'visible' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
                                <Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                            Travel - ID: {fullTravelDeatilsByTiD[0]?.travelId}
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                            Process Start Date: {formatDateToDateString(fullTravelDeatilsByTiD[0]?.suggestedDate)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Track the progress of your travel request
                                    </Typography>
                                </Box>
                                <StatusChip label={(travelDetails[0]?.status !== 17 || travelDetails[0]?.status !== 100) ? "IN_PROGRESS" : "COMPLETED"} />
                            </Box>

                            <Box sx={{ mb: 6 }}>
                                <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                                    {steps.map((step) => (
                                        <Step key={step.label} completed={step.completed}>
                                            <StepLabel StepIconComponent={QontoStepIcon}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: step.active || step.completed ? 600 : 400 }}>
                                                    {step.label}
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>

                            <Divider sx={{ mb: 4 }} />




                            <Grid container spacing={3}>
                                <Grid item container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                <Box sx={{ p: 1, bgcolor: '#fee2e2', borderRadius: 1, color: '#b91c1c' }}>
                                                    <Person fontSize="small" />
                                                </Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>EMPLOYEE NAME & ID</Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} color="#1e293b">{fullTravelDeatilsByTiD[0]?.empName} - {fullTravelDeatilsByTiD[0]?.empId}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                <Box sx={{ p: 1, bgcolor: '#fee2e2', borderRadius: 1, color: '#b91c1c' }}>
                                                    <Assignment fontSize="small" />
                                                </Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>ASSET - ROLE</Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} color="#1e293b">{fullTravelDeatilsByTiD[0]?.asset} - {fullTravelDeatilsByTiD[0]?.position}</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {/* <Divider sx={{ mb: 4 }} /> */}

                                <Grid item container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                <Box sx={{ p: 1, bgcolor: '#fee2e2', borderRadius: 1, color: '#b91c1c' }}>
                                                    <LocationOn fontSize="small" />
                                                </Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>DESTINATION</Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} color="#1e293b">{travelDetails[0]?.destination}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: travelStatus===7?'5px solid #b22a22':'1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                <Box sx={{ p: 1, bgcolor: '#fee2e2', borderRadius: 1, color: '#b91c1c' }}>
                                                    <CalendarToday fontSize="small" />
                                                </Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>DATES</Typography>
                                                {(travelDetails[0]?.status === 7 && user.roleId === 102) &&
                                                    (<Button onClick={openDateEditor}>
                                                        <Edit />
                                                    </Button>)}
                                            </Box>


                                            {isDatesEditedsetDatesEdited ? (
                                                <Typography variant="h6" fontWeight={600} color="#1e293b">

                                                    {formatDateToDateString(editedDates.startDate)} - {formatDateToDateString(editedDates.endDate)}

                                                </Typography>
                                            ) : fullTravelDeatilsByTiD[0]?.finalStartDate === '0001-01-01T00:00:00' ? 
                                                <Typography variant="h6" fontWeight={600} color="#1e293b">

                                                    {departurDate} - {arrivalDate}

                                                </Typography>
                                                : 
                                                    <Typography variant="h6" fontWeight={600} color="#1e293b">

                                                        {formatDateToDateString(fullTravelDeatilsByTiD[0]?.finalStartDate)} - {formatDateToDateString(fullTravelDeatilsByTiD[0]?.finalEndDate)}

                                                    </Typography>
                                            }

                                            {isDateEditorOpen && (
                                                <DateEditor
                                                    employee={{ travelEmpId }} // Replace with actual employee data
                                                    departurDate={fullTravelDeatilsByTiD[0]?.finalStartDate!=='0001-01-01T00:00:00'?fullTravelDeatilsByTiD[0]?.finalStartDate:departurDate}
                                                    arrivalDate={fullTravelDeatilsByTiD[0]?.finalEndDate!=='0001-01-01T00:00:00'?fullTravelDeatilsByTiD[0]?.finalEndDate:arrivalDate}
                                                    onSave={handleSave} // Pass the handleSave function
                                                    closeDateEditor={closeDateEditor} // Pass a function to close the editor
                                                />
                                            )}
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                <Box sx={{ p: 1, bgcolor: '#fee2e2', borderRadius: 1, color: '#b91c1c' }}>
                                                    <Flight fontSize="small" />
                                                </Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>PURPOSE OF TRAVEL</Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} color="#1e293b">{travelDetails[0]?.purpose}</Typography>
                                            {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Client Meeting</Typography> */}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </SharedCard>



                        {/* Approval History Section */}
                        {(approvalHistory && approvalHistory.length>0) ? 
                            <SharedCard variant="dashboard" sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <History color="action" />
                                <Typography variant="h6" fontWeight={600}>Approval History</Typography>
                            </Box>
                            <Box
                                sx={{
                                    mb: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 'auto',
                                    maxHeight: 200,
                                    overflow: "hidden",
                                    overflowY: "scroll",
                                    "&::-webkit-scrollbar": {
                                        width: "8px", // Set the width of the scrollbar
                                        backgroundColor: "transparent" // Optional: set background color for the scrollbar track
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "#888", // Color of the scrollbar thumb
                                        borderRadius: "10px" // Optional: round the corners of the scrollbar thumb
                                    },
                                    "&::-webkit-scrollbar-thumb:hover": {
                                        backgroundColor: "#555" // Color of the scrollbar thumb on hover
                                    },
                                    scrollbarWidth: "thin", // For Firefox: makes the scrollbar thinner
                                    scrollbarColor: "#888 transparent" // For Firefox: color of the scrollbar thumb and track
                                }}

                            >
                                
                                {approvalHistory?.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: index < approvalHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <UserAvatar firstName={item.fullname.split(' ')[0]} lastName={item.fullname.split(' ')[1]} size="small" />
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>{item.fullname} <Typography component="span" variant="h6" color="text.secondary">({item.roleName})</Typography></Typography>
                                            <Typography variant="body1" fontWeight={600}>{item.statusName}</Typography>
                                            {item.comment && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>Comment: {item.comment}</Typography>}
                                            {/* <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>{item.dateofAction}</Typography> */}
                                        </Box>
                                        <Box sx={{ alignItems: 'right' }}>
                                            <Typography variant="body1" color="text.secondary" display="block" sx={{ mt: 0.5 }}>{item.dateofAction}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </SharedCard>: null
                    }
                        

                        {/* Role-Specific Actions Panel */}
                        {user?.role !== 'EMPLOYEE' && (
                            <SharedCard variant="dashboard" sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    {user?.role === 'TRAVEL_DESK' ? 'Booking Actions' : 'Actions'}
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Comments"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Add your comments here..."
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start" sx={{ mt: 1.5 }}><Comment /></InputAdornment>,
                                            }}
                                        />
                                    </Grid>

                                    {/* {user?.role === 'AVP' && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Approved Budget Override (Optional)"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        placeholder="Enter amount"
                                        type="number"
                                    />
                                </Grid>
                            )} */}

                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                                        {user?.role === 'TRAVEL_DESK' ? (
                                            <Button
                                                disabled={travelDetails[0]?.rptEmpId === user.empId}
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckCircle />}
                                                onClick={() => handleStatusUpdate('COMPLETE_BOOKING')}
                                                sx={{ color: 'white', px: 4 }}
                                            >
                                                Mark Booking Complete
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    // disabled={travelDetails[0]?.rptEmpId === user.empId}
                                                    disabled={getTravelAndForwardButtonDisability(travelDetails)}
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleStatusUpdate('REJECTED')}
                                                >
                                                    Reject Request
                                                </Button>
                                                {/* {user?.role !== 'SVP' && user?.role !== 'CHRO' && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleStatusUpdate('REQUEST_CHANGES')}
                                                sx={{ borderColor: '#64748b', color: '#64748b' }}
                                            >
                                                Request Changes
                                            </Button>
                                        )} */}
                                                <Button
                                                    variant="contained"
                                                    disabled={getTravelAndForwardButtonDisability(travelDetails)}
                                                    color="success"
                                                    onClick={() => {
                                                        // travelDetails[0].status===7?handleDateUpdate():
                                                        handleStatusUpdate('APPROVE')
                                                    }}
                                                    sx={{ color: 'white', px: 4 }}
                                                >
                                                    {user?.role === 'CHRO' ? 'Final Approval' : 'Approve & Forward'}
                                                </Button>
                                            </>
                                        )}
                                    </Grid>
                                </Grid>
                            </SharedCard>
                        )}
                    </Fragment>
                }


            </Box>
        </BaseLayout>
    );
};

export default ApplicationStatus;
