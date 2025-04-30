import { gql } from "@apollo/client";

export const GET_LIST_TICKETS = gql`
  query Filterlisttickets(
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
    filterlisttickets(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
        ticket_status: $ticketStatus
        payment_status: null
      }
      where: {
        tp_is_published: { _eq: true }
        tp_status: { _in: ["List", "DelistInProgress"] }
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
      e_time_zone
      e_date_time_zone
      tp_delist_requested_email
    }

    filterlisttickets_aggregate(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
        ticket_status: $ticketStatus
        payment_status: null
      }
      where: {
        tp_is_published: { _eq: true }
        tp_status: { _in: ["List", "DelistInProgress"] }
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

export interface ListTicket {
  e_name: string;
  l_name: string;
  e_date: string;
  e_address: string;
  tp_section: string;
  tp_row: string;
  tp_seat_no: string;
  u_full_name: string;
  u_email_id: string;
  tp_list_price: number;
  tp_status: string;
  tp_id: string;
  e_date_time_zone: string;
}
