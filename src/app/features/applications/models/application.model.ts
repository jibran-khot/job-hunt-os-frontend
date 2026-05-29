export interface Application {
    id: string;

    companyName: string;

    jobTitle: string;

    status: ApplicationStatus;

    source: string;

    location?: string;

    salary?: number;

    jobUrl?: string;

    description?: string;

    appliedDate: string;

    recruiterId?: string;

    recruiterName?: string;

    resumeId?: string;

    resumeName?: string;

    notesCount: number;

    interviewsCount: number;

    followupsCount: number;

    createdAt: string;

    updatedAt: string;
}

export interface ApplicationNote {
    id: string;

    applicationId: string;

    content: string;

    createdAt: string;

    updatedAt: string;
}

export interface ApplicationStatusHistory {
    id: string;

    applicationId: string;

    previousStatus: ApplicationStatus;

    currentStatus: ApplicationStatus;

    changedAt: string;

    changedBy?: string;
}

export interface ApplicationSummary {
    totalApplications: number;

    applied: number;

    screening: number;

    interview: number;

    offer: number;

    rejected: number;

    withdrawn: number;
}

export type ApplicationStatus =
    | 'APPLIED'
    | 'SCREENING'
    | 'INTERVIEW_SCHEDULED'
    | 'INTERVIEWED'
    | 'OFFER_RECEIVED'
    | 'OFFER_ACCEPTED'
    | 'REJECTED'
    | 'WITHDRAWN';