import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      name
      email
      phone
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      id
      name
      email
      phone
    }
  }
`;

export const GET_CANDIDATES = gql`
  query GetCandidates {
    candidates {
      id
      name
      email
      status
      createdAt
      skills
      scores {
        id
        overallScore
      }
    }
  }
`;

export const GET_CANDIDATE = gql`
  query GetCandidate($id: String!) {
    candidate(id: $id) {
      id
      name
      phone
      email
      city
      status
      resumeSummary
      resumeFilePath
      cleanedText
      skills
      scores {
        id
        overallScore
        skillScore
        experienceScore
        educationScore
        aiComment
      }
    }
  }
`;

export const UPDATE_CANDIDATE_STATUS = gql`
  mutation UpdateCandidateStatus($input: UpdateCandidateStatusInput!) {
    updateCandidateStatus(input: $input) {
      id
      status
    }
  }
`;

export const SAVE_CANDIDATE_CORRECTION = gql`
  mutation SaveCandidateCorrection($input: SaveCandidateCorrectionInput!) {
    saveCandidateCorrection(input: $input) {
      id
      name
    }
  }
`;

export const UPSERT_JOB_REQUIREMENT = gql`
  mutation UpsertJobRequirement($input: UpsertJobRequirementInput!) {
    upsertJobRequirement(input: $input) {
      id
      title
      description
      requiredSkills
      preferredSkills
    }
  }
`;

export const GET_JOB_REQUIREMENTS = gql`
  query GetJobRequirements {
    jobRequirements {
      id
      title
      description
      requiredSkills
      preferredSkills
    }
  }
`;

export const SCORE_CANDIDATE = gql`
  mutation ScoreCandidate($input: ScoreCandidateInput!) {
    scoreCandidate(input: $input) {
      id
      scores {
        id
        overallScore
        skillScore
        experienceScore
        educationScore
        aiComment
      }
    }
  }
`;
