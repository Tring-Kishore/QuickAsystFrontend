import { gql } from '@apollo/client';
export const FILTER_SOLD_TICKETS = gql`
  query FilterSoldTickets(
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
    $paymentStatus: String
  ) {
    FilterSoldTickets: filterlisttickets(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
        payment_status: $paymentStatus
        ticket_status: null
      }
      where: {
        tp_is_published: { _eq: true }
        _or: [
          { e_name: { _ilike: $search_event } }
          { full_name: { _ilike: $search_event } }
          { u_email_id: { _ilike: $search_event } }
        ]
        tp_status: { _eq: "Sold" }
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
      tp_status
      u_id
      u_first_name
      u_last_name
      e_id
      t_id
      tp_id
      u_full_name: full_name
      u_email_id
      tp_logitix_amount
      tp_sold_amount
      tp_payment_status
      tp_list_price
      tp_quick_cut_amount
      e_brand_name
      e_status
      tp_payout_status
    }
    FilterSoldTickets_aggregate: filterlisttickets_aggregate(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
        payment_status: $paymentStatus
        ticket_status: null
      }
      where: {
        tp_is_published: { _eq: true }
        _or: [
          { e_name: { _ilike: $search_event } }
          { full_name: { _ilike: $search_event } }
          { u_email_id: { _ilike: $search_event } }
        ]
        tp_status: { _eq: "Sold" }
      }
    ) {
      aggregate {
        count
      }
    }
    filterlisttickets_aggregate(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
        payment_status: null
        ticket_status: null
      }
      where: {
        tp_is_published: { _eq: true }
        _or: [
          { e_name: { _ilike: $search_event } }
          { full_name: { _ilike: $search_event } }
          { u_email_id: { _ilike: $search_event } }
        ]
        tp_status: { _in: ["List", "DelistInProgress"] }
      }
    ) {
      aggregate {
        count
      }
    }
    filtermanagetickets_aggregate(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticket_status: null
        day: null
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
      }
      where: {
        tp_is_published: { _eq: false }
        tp_status: { _in: ["ToBeVerified", "Verified", "Delist", "DelistInProgress"] }
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
    filterreturntickets_aggregate(
      args: {
        enddate: $enddate
        leagueid: $leagueId
        startdate: $startdate
        ticketid: $ticketId
        tpid: $ticketPlacementId
        array_tpid: $array_tpid
      }
      where: {
        tp_status: { _in: ["Return"] }
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
      aggregate {
        count
      }
    }
  }
`;
