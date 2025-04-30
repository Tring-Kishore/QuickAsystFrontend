import { gql } from "@apollo/client";
export const FILTER_UNSOLD_TICKETS_QUERY = gql`
  query FilterUnsoldTickets(
    $enddate: date
    $leagueId: uuid
    $startdate: date
    $ticketId: uuid
    $ticketPlacementId: uuid
    $pageSize: Int
    $pageOffset: Int
    $order_by: [getmanageticket_order_by!]
    $search_event: String = "%"
    $array_tpid: jsonb
    $ticketStatus: String
  ) {
    filterUnsoldTickets: filterreturntickets(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
      }
      where: {
        tp_status: { _in: ["Unsold"] }
        _or: [
          { e_name: { _ilike: $search_event } }
          { full_name: { _ilike: $search_event } }
          { u_email_id: { _ilike: $search_event } }
        ]
      }
      limit: $pageSize
      offset: $pageOffset
      order_by: $order_by
    ) {
      e_name
      l_name
      e_date
      e_address
      tp_section
      tp_row
      tp_seat_no
      u_id
      u_first_name
      u_last_name
      e_id
      t_id
      tp_id
      u_full_name: full_name
      u_email_id
      tp_list_price
      tp_status
      u_original_email
      e_brand_name
      e_status
    }
    filterUnsoldTickets_aggreagate: filterreturntickets_aggregate(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
      }
      where: {
        tp_status: { _in: ["Unsold"] }
        _or: [
          { e_name: { _ilike: $search_event } }
          { full_name: { _ilike: $search_event } }
          { u_email_id: { _ilike: $search_event } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
