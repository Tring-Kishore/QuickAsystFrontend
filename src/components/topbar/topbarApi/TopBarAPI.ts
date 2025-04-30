import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    get_user_profile {
      u_id
      u_cognito_id
      u_first_name
      u_last_name
      u_email_id
      u_avatar_url
      u_country_code
      u_phone_number
      u_active_tickets
      u_full_name
      u_last_online
      u_notification_enabled
      u_sold_tickets
      u_total_revenue
      u_referral_code
      u_referral_link
      u_created_at
      u_updated_at
      u_device_tokens
      u_is_active
      u_role
      u_recovery_link
      u_stripe_account_id
      u_stripe_transfers_status
      u_stripe_account_is_due
      u_stripe_err_msg
    }
  }
`;
