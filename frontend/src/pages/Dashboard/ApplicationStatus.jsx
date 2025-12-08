// pages/dashboard/ApplicationStatus.jsx
import React, { useEffect, useState } from 'react';
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
    InputAdornment
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
    CheckCircle
} from '@mui/icons-material';
import BaseLayout from '../../components/layout/BaseLayout';
import { Navbar, SharedCard, StatusChip, UserAvatar } from '../../components/shared';
import { useSelector, useDispatch } from 'react-redux';
import { updateRequestStatus, addNotification, addApprovalHistory } from '../../redux/slices/dashboardSlice';
import { toast } from 'react-toastify';
import employeeService from '../../services/employeeService';
import { getEmployeeApplicationDetails } from '../../redux/slices/employeeSlice';
import { formatDate, formatDateToDateString } from '../../utils/helpers';

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
    const { approvalHistory,  } = useSelector((state) => state.dashboard);
    const [travelDetails, setTravelDetails] = useState([])
    const dispatch = useDispatch();

    const [comment, setComment] = useState('');
    const [budget, setBudget] = useState('');

    const empId = id.split("-")[0]
    console.log("empid in here:::::::: ", empId)
    // let travelDetails = []

    useEffect(()=>{
        console.log("we are inside useffect here::::::")
        console.log("empId in useEffect:::::::::: ", empId)
        const fetchEmployeeTravelData = async()=>{
            const data = await employeeService.getEmployeeTravel(empId);
            setTravelDetails(data)
        }
        fetchEmployeeTravelData()
        // dispatch(getEmployeeApplicationDetails())
    },[])
    
    console.log("travelDetails in here app status:::::::: ", travelDetails)
    console.log("destination::::::: ", travelDetails[0]?.destination)

    const departurDate = formatDateToDateString(travelDetails[0]?.departureDate)
    const arrivalDate = formatDateToDateString(travelDetails[0]?.returnDate)
    console.log("departurDate:::::::::: ", departurDate)

    const handleStatusUpdate = (actionType) => {
        let newStatus = '';
        let stepIndex = 0;
        let notifMessage = '';

        if (actionType === 'APPROVE') {
            if (user.role === 'MANAGER') { newStatus = 'APPROVED_BY_MANAGER'; stepIndex = 2; notifMessage = `Manager approved request ${id}`; }
            else if (user.role === 'AVP') { newStatus = 'APPROVED_BY_AVP'; stepIndex = 2; notifMessage = `AVP approved request ${id}`; }
            else if (user.role === 'SVP') { newStatus = 'APPROVED_BY_SVP'; stepIndex = 3; notifMessage = `SVP approved request ${id}`; }
            else if (user.role === 'CHRO') { newStatus = 'APPROVED'; stepIndex = 4; notifMessage = `CHRO final approval for request ${id}`; }
            else if (user.role === 'FINANCE') { newStatus = 'BUDGET_CONFIRMED'; stepIndex = 2; notifMessage = `Finance confirmed budget for ${id}`; }
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

        // Dispatch updates
        dispatch(updateRequestStatus({ id, status: newStatus, stepIndex }));
        dispatch(addNotification(notifMessage));
        dispatch(addApprovalHistory({
            role: user.role,
            name: `${user.firstName} ${user.lastName}`,
            status: actionType,
            comment: comment,
            date: new Date().toLocaleString()
        }));

        toast.success(`Action ${actionType} completed successfully`);
        navigate('/dashboard');
    };

    // Mock data for the stepper
    const steps = [
        { label: 'Request Raised', date: '2025-11-25', completed: true },
        { label: 'Manager Approved', date: '2025-11-26', completed: true },
        { label: 'Travel Desk Review', date: 'Current', completed: false, active: true },
        { label: 'Documents Submitted', date: '', completed: false },
        { label: 'Booking Confirmed', date: '', completed: false }
    ];

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

                <SharedCard variant="dashboard" sx={{ mb: 4, overflow: 'visible' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                Application {id} Status
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track the progress of your travel request
                            </Typography>
                        </Box>
                        <StatusChip label="IN_PROGRESS" />
                    </Box>

                    <Box sx={{ mb: 6 }}>
                        <Stepper alternativeLabel activeStep={2} connector={<QontoConnector />}>
                            {steps.map((step) => (
                                <Step key={step.label} completed={step.completed}>
                                    <StepLabel StepIconComponent={QontoStepIcon}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: step.active || step.completed ? 600 : 400 }}>
                                            {step.label}
                                        </Typography>
                                        {step.date && (
                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {step.date}
                                            </Typography>
                                        )}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={3}>
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
                            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: '#fee2e2', borderRadius: 1, color: '#b91c1c' }}>
                                        <CalendarToday fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>DATES</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={600} color="#1e293b">{departurDate}-{arrivalDate}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>5 Days</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: '#fee2e2', borderRadius: 1, color: '#b91c1c' }}>
                                        <Flight fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>TRAVEL TYPE</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={600} color="#1e293b">{travelDetails[0]?.purpose}</Typography>
                                {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Client Meeting</Typography> */}
                            </Paper>
                        </Grid>
                    </Grid>
                </SharedCard>

                {/* Approval History Section */}
                <SharedCard variant="dashboard" sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <History color="action" />
                        <Typography variant="h6" fontWeight={600}>Approval History</Typography>
                    </Box>
                    <Box>
                        {approvalHistory.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: index < approvalHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <UserAvatar firstName={item.name.split(' ')[0]} lastName={item.name.split(' ')[1]} size="small" />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>{item.name} <Typography component="span" variant="caption" color="text.secondary">({item.role})</Typography></Typography>
                                    <Typography variant="body2" color={item.status === 'REJECTED' ? 'error' : 'success'}>{item.status}</Typography>
                                    {item.comment && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>"{item.comment}"</Typography>}
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>{item.date}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </SharedCard>

                {/* Role-Specific Actions Panel */}
                {user?.role !== 'EMPLOYEE' && (
                    <SharedCard variant="dashboard" sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            {user?.role === 'TRAVEL_DESK' ? 'Booking Actions' : 'Approval Actions'}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Comments / Reason (Required for Rejection)"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add your comments here..."
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ mt: 1.5 }}><Comment /></InputAdornment>,
                                    }}
                                />
                            </Grid>

                            {user?.role === 'AVP' && (
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
                            )}

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                                {user?.role === 'TRAVEL_DESK' ? (
                                    <Button
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
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleStatusUpdate('REJECTED')}
                                        >
                                            Reject Request
                                        </Button>
                                        {user?.role !== 'SVP' && user?.role !== 'CHRO' && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleStatusUpdate('REQUEST_CHANGES')}
                                                sx={{ borderColor: '#64748b', color: '#64748b' }}
                                            >
                                                Request Changes
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleStatusUpdate('APPROVE')}
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
            </Box>
        </BaseLayout>
    );
};

export default ApplicationStatus;
