import { gql } from '@apollo/client';

export const TICKET_PUBLISH_MUTATION = gql`
  mutation ticketPublish(
    $is_publish: Boolean, 
    $ticketplacementid_arr: jsonb, 
    $list_price: float8
  ) {
    ticketPublish: manageticketspublish(
      args: {
        is_publish: $is_publish, 
        ticketplacementid_arr: $ticketplacementid_arr, 
        list_price: $list_price
      }
    ) {
      t_id
      tp_id
    }
  }
`;

export const MARK_AS_SOLD_MUTATION = gql`
  mutation MarkAsSold(
    $logitixAmount: Float!, 
    $soldAmount: Float!, 
    $ticketPlacementId: String!
  ) {
    markAsSold(
      ticketPlacementId: $ticketPlacementId, 
      soldAmount: $soldAmount, 
      logitixAmount: $logitixAmount
    ) {
      message
    }
  }
`;
export const EDIT_TICKETS_MUTATION = gql`
  mutation editTickets($editTicketsInput: EditTicketsInput) {
    editTickets(editTicketsInput: $editTicketsInput) {
      message
    }
  }
`;

export const INVOICE_DETAILS_QUERY = gql`
  query InvoiceDetails($ticketPlacementId: uuid!) {
    ticket_placement_by_pk(tp_id: $ticketPlacementId) {
      tp_id
      tp_logitix_amount
      tp_sold_amount
      tp_quick_cut_amount
      tp_is_support_vanderbilt_nil_fund
      payment_transaction {
        transactionId: pt_invoice_number
        status: pt_transaction_status
        paymentUpdated: pt_transaction_date
        payementId: pt_id
      }
      seatNo: tp_seat_no
      section: tp_section
      row: tp_row
      ticket {
        event {
          eventName: e_name
          eventDate: e_date
          eventAddress: e_address
          eventId: e_id
        }
      }
    }
  }
`;
export const TRANSFER_AMOUNT_MUTATION = gql`
  mutation TransferAmountToUsersByTicket($ticketPlacementId: String!) {
    transferAmountToUsersByTicket(ticketPlacementId: $ticketPlacementId) {
      message
    }
  }
`;

export const UPDATE_TP_PAYOUT_STATUS = gql`
  mutation UpdateTpPayoutStatus($tpId: uuid!) {
    updateTpPayoutStatus(tpId: $tpId) {
      message
    }
  }
`;