import { gql } from '@apollo/client';

export const GET_LEAGUES = gql`
  query LeaguesDropdownFilter {
    leagues(where: {l_deleted_at: {_is_null: true}}, order_by: {l_name: asc}) {
      l_id
      l_name
    }
  }
`;
