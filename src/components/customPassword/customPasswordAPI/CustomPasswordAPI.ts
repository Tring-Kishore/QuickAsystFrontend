import { gql } from '@apollo/client';
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
      message
    }
  }
`;
