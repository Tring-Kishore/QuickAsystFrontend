import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    get_user_profile {
      u_first_name
      u_last_name
      u_phone_number
      u_email_id
      u_avatar_url
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation UpdateUserProfile(
    $emailId: String!
    $input: user_set_input!
  ) {
    update_user(
      where: {u_email_id: {_eq: $emailId}}
      _set: $input
    ) {
      affected_rows
    }
  }
`;