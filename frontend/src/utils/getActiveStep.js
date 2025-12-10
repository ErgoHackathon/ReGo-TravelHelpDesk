import { statusMapping } from './statusMapping';

export const getActiveStep = (status) => {
  let currentStep = 0;

  // Update steps based on the status
  switch (status) {
    case 1:
    case 2:
    case 3:
      currentStep = 0; break; // Initial Submission || Initial Submission by AVP/DVP || Initial Submission by SVP
    // case 2: currentStep = 1; break; // Initial Submission by AVP/DVP
    // case 3: currentStep = 2; break; // Initial Submission by SVP
    case 4:
    case 5:
    case 6: currentStep = 1; break; // Initial Approved by Manager || Initial Approved by AVP/DVP || Initial Approved by SVP
    // case 5: currentStep = 4; break; // Initial Approved by AVP/DVP
    // case 6: currentStep = 5; break; // Initial Approved by SVP
    case 7:
    case 8:
    case 9: currentStep = 2; break; // Final Initiated by Manager ||Final Initiated by AVP/DVP || Final Initiated by SVP
    // case 8: currentStep = 7; break; // Final Initiated by AVP/DVP
    // case 9: currentStep = 8; break; // Final Initiated by SVP
    case 10:
    case 11:
    case 12: currentStep = 3; break; // Final Approved by Manager || Final Approved by AVP/DVP || Final Approved by SVP
    // case 11: currentStep = 10; break; // Final Approved by AVP/DVP
    // case 12: currentStep = 11; break; // Final Approved by SVP
    case 13: currentStep = 4; break; // Initial Document Pending from Employee
    case 14: currentStep = 5; break; // Initial Document Review and Visa Pending
    case 15: currentStep = 6; break; // Pending Flight/Hotel Ticket
    case 16: currentStep = 7; break; // Uploaded Flight/Hotel Ticket
    case 17: currentStep = 8; break; // Final Completed - Employee Travel Completed
    default: break;
  }

  return currentStep;
};