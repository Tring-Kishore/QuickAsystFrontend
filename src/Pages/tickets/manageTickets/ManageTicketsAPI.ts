// src/api/ticketsApi.ts
import { gql } from '@apollo/client';

export const GET_MANAGE_TICKETS = gql`
  query Filtermanagetickets(
    $enddate: date, 
    $leagueId: uuid, 
    $startdate: date, 
    $ticketStatus: String, 
    $ticketId: uuid, 
    $tpId: uuid, 
    $pageSize: Int, 
    $pageOffset: Int, 
    $order_by: [getmanageticket_order_by!], 
    $day: Int, 
    $search_event: String = "%", 
    $array_tpid: jsonb
  ) {
    filtermanagetickets(
      args: {
        enddate: $enddate,
        leagueid: $leagueId,
        startdate: $startdate,
        ticket_status: $ticketStatus,
        day: $day,
        ticketid: $ticketId,
        tpid: $tpId,
        array_tpid: $array_tpid
      }, 
      where: {
        tp_is_published: {_eq: false},
        tp_status: {_in: ["ToBeVerified", "Verified", "Delist", "DelistInProgress"]},
        _or: [
          {e_name: {_ilike: $search_event}},
          {full_name: {_ilike: $search_event}},
          {u_email_id: {_ilike: $search_event}}
        ]
      }, 
      limit: $pageSize, 
      offset: $pageOffset, 
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
      tp_validity_status
      tp_status
      tp_is_published
      e_id
      t_id
      tp_id
      e_status
      user {
        u_role
      }
      full_name
      u_email_id
      u_original_email
      e_brand_name
      e_status
      e_time_zone
      e_date_time_zone
      tp_delist_requested_email
    }
  }
`;

export interface ManageTicket {
  e_name: string;
  l_name: string;
  e_date: string;
  e_address: string;
  tp_section: string;
  tp_row: string;
  tp_seat_no: string;
  tp_status: string;
  u_id: string;
  u_first_name: string;
  u_last_name: string;
  tp_validity_status: string;
  tp_is_published: boolean;
  e_id: string;
  t_id: string;
  tp_id: string;
  e_status: string;
  user: {
    u_role: string;
  };
  full_name: string;
  u_email_id: string;
  u_original_email: string;
  e_brand_name: string;
  e_time_zone: string;
  e_date_time_zone: string;
  tp_delist_requested_email: string;
}