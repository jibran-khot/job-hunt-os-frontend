import { ApplicationStatus } from '../models/application.model';

export interface UpdateApplicationDto {
    companyName?: string;
    jobTitle?: string;
    status?: ApplicationStatus;

    source?: string;

    appliedDate?: string;

    location?: string;
    salary?: number;

    jobUrl?: string;

    description?: string;

    recruiterId?: string;

    resumeId?: string;
}