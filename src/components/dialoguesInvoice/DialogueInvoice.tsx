import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import "./DialogueInvoice.scss";
import closeIcon from "../../assets/images/closeicon2.svg";
import {
  TICKET_PUBLISH_MUTATION,
  MARK_AS_SOLD_MUTATION,
  EDIT_TICKETS_MUTATION,
  INVOICE_DETAILS_QUERY,
  TRANSFER_AMOUNT_MUTATION,
} from "./DialogueInvoiceAPI/DialogueInvoiceAPI";
import { showErrorToast, showSuccessToast } from "../CustomToast/CustomToast";
import editicon from "../../assets/images/editicon.svg";

interface TicketData {
  e_name?: string;
  e_date_time_zone?: string;
  e_address?: string;
  tp_section?: string;
  tp_row?: string;
  tp_seat_no?: string;
  tp_id?: string;
  tp_list_price?: number;
  e_id?: string;
  tp_logitix_amount?: number;
  tp_sold_amount?: number;
  tp_quick_cut_amount?: number;
  tp_is_support_vanderbilt_nil_fund?: boolean;
}

interface DialogueInvoiceProps {
  ticketData: TicketData;
  onClose: () => void;
  dialogType?:
    | "publish"
    | "sold"
    | "editpublish"
    | "editlisttickets"
    | "invoice";
}

const DialogueInvoice: React.FC<DialogueInvoiceProps> = ({
  ticketData,
  onClose,
  dialogType = "publish",
}) => {
  const {
    data: invoiceData,
    loading: invoiceLoading,
    error: invoiceError,
  } = useQuery(INVOICE_DETAILS_QUERY, {
    variables: { ticketPlacementId: ticketData.tp_id },
    skip: dialogType !== "invoice",
    fetchPolicy: "network-only",
  });
  const [transferAmount, { loading: transferLoading }] = useMutation(
    TRANSFER_AMOUNT_MUTATION
  );

  const [price, setPrice] = useState<string>(
    ticketData?.tp_list_price?.toString() || ""
  );
  const [section, setSection] = useState<string>(ticketData?.tp_section || "");
  const [row, setRow] = useState<string>(ticketData?.tp_row || "");
  const [seat, setSeat] = useState<string>(ticketData?.tp_seat_no || "");
  const [receivedAmount, setReceivedAmount] = useState<string>("");

  const [ticketPublish, { loading: publishLoading }] = useMutation(
    TICKET_PUBLISH_MUTATION
  );
  const [markAsSold, { loading: soldLoading }] = useMutation(
    MARK_AS_SOLD_MUTATION
  );
  const [editTickets, { loading: editLoading }] = useMutation(
    EDIT_TICKETS_MUTATION
  );

  const quickAsystFee = 10.0;
  const amountToSettle = receivedAmount
    ? (parseFloat(receivedAmount) - quickAsystFee).toFixed(2)
    : "0.00";

  const loading =
    dialogType === "invoice"
      ? invoiceLoading
      : dialogType === "publish"
      ? publishLoading
      : dialogType === "editpublish"
      ? editLoading
      : soldLoading;

  const eventDetails =
    dialogType === "invoice"
      ? [
          {
            name: "Event",
            value:
              invoiceData?.ticket_placement_by_pk?.ticket?.event?.eventName ||
              "N/A",
          },
          {
            name: "Date",
            value:
              invoiceData?.ticket_placement_by_pk?.ticket?.event?.eventDate ||
              "N/A",
          },
          {
            name: "Venue",
            value:
              invoiceData?.ticket_placement_by_pk?.ticket?.event
                ?.eventAddress || "N/A",
          },
          {
            name: "Ticket Placement",
            value: `Sec ${invoiceData?.ticket_placement_by_pk?.section} / Row ${invoiceData?.ticket_placement_by_pk?.row} / Seat ${invoiceData?.ticket_placement_by_pk?.seatNo}`,
          },
        ]
      : [
          {
            name: "Event",
            value: ticketData?.e_name || "N/A",
          },
          {
            name: "Date",
            value: ticketData?.e_date_time_zone || "N/A",
          },
          {
            name: "Venue",
            value: ticketData?.e_address || "N/A",
          },
          ...(dialogType !== "editpublish"
            ? [
                {
                  name: "Ticket Placement",
                  value: `Sec ${ticketData?.tp_section} / Row ${ticketData?.tp_row} / Seat ${ticketData?.tp_seat_no}`,
                },
              ]
            : []),
        ];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleReceivedAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceivedAmount(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!ticketData?.tp_id) {
        showErrorToast("Ticket ID is missing");
        return;
      }

      if (dialogType === "publish") {
        if (!price) {
          showErrorToast("Please enter a price");
          return;
        }

        const { data } = await ticketPublish({
          variables: {
            is_publish: true,
            ticketplacementid_arr: [ticketData.tp_id],
            list_price: parseFloat(price),
          },
        });

        if (data?.ticketPublish) {
          showSuccessToast("Ticket published successfully");
          onClose();
        }
      } else if (dialogType === "editpublish") {
        if (!section || !row || !seat) {
          showErrorToast("Please fill all fields");
          return;
        }

        if (!ticketData.e_id) {
          showErrorToast("Event ID is missing");
          return;
        }

        const { data } = await editTickets({
          variables: {
            editTicketsInput: {
              e_id: ticketData.e_id,
              tp_id: ticketData.tp_id,
              tp_section: section,
              tp_row: row,
              tp_seat_no: parseInt(seat),
            },
          },
          fetchPolicy: "network-only",
        });

        if (data?.editTickets) {
          showSuccessToast("Ticket details updated successfully");
          onClose();
        }
      } else if (dialogType === "editlisttickets") {
        if (!section || !row || !seat || !price) {
          showErrorToast("Please fill all fields including price");
          return;
        }

        const { data } = await editTickets({
          variables: {
            editTicketsInput: {
              e_id: ticketData.e_id,
              tp_id: ticketData.tp_id,
              tp_section: section,
              tp_row: row,
              tp_seat_no: parseInt(seat),
              tp_list_price: parseFloat(price),
            },
          },
          fetchPolicy: "network-only",
        });

        if (data?.editTickets) {
          showSuccessToast("Ticket listing updated successfully");
          onClose();
        }
      } else if (dialogType === "sold") {
        if (!receivedAmount) {
          showErrorToast("Please enter received amount");
          return;
        }

        const { data } = await markAsSold({
          variables: {
            ticketPlacementId: ticketData.tp_id,
            soldAmount: parseFloat(amountToSettle),
            logitixAmount: parseFloat(receivedAmount),
          },
        });

        if (data?.markAsSold) {
          showSuccessToast("Ticket marked as sold successfully");
          onClose();
        }
      } else if (dialogType === "invoice") {
        try {
          const { data } = await transferAmount({
            variables: {
              ticketPlacementId: ticketData.tp_id,
            },
          });

          if (data?.transferAmountToUsersByTicket) {
            showSuccessToast("Amount transferred successfully");
            onClose();
          }
        } catch (err) {
          console.error("Transfer error:", err);
          showErrorToast("Failed to transfer amount");
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleReset = () => {
    if (dialogType === "publish") {
      setPrice("");
    } else if (
      dialogType === "editpublish" ||
      dialogType === "editlisttickets"
    ) {
      setSection(ticketData?.tp_section || "");
      setRow(ticketData?.tp_row || "");
      setSeat(ticketData?.tp_seat_no || "");
      setPrice(ticketData?.tp_list_price?.toString() || "");
    } else if (dialogType === "sold") {
      setReceivedAmount("");
    }
  };

  return (
    <div className="dialogue-outer-class">
      <div className="dialogue-content">
        <div className="dialogue-header">
          <p className="dialogue-heading">
            {dialogType === "invoice"
              ? "Invoice Details"
              : dialogType === "sold"
              ? "Sold Details"
              : dialogType === "editpublish"
              ? "Edit Ticket"
              : "Edit Ticket Details"}
          </p>
          <button className="close-button" onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </button>
        </div>
        <div className="dialogue-event-details">
          <div className="event-details">
            <p className="event-heading">Event Details</p>
            <div className="event-api-details">
              {eventDetails.map((detail, index) => (
                <div className="event-group" key={index}>
                  <p className="name">{detail.name}</p>
                  <p className="value">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="logitix-details">
            <p className="logitix-heading">
              {dialogType === "invoice"
                ? "Payment Details"
                : dialogType === "sold"
                ? "Ticket Sold Price"
                : dialogType === "publish"
                ? "Ticket Price"
                : dialogType === "editlisttickets"
                ? "Ticket Details"
                : ""}
            </p>
            <div className="event-api-details-logitix">
              {dialogType === "invoice" ? (
                <>
                  <div className="event-group">
                    <p className="name">Received Amount from logitix</p>
                    <p className="value">
                      $
                      {invoiceData?.ticket_placement_by_pk?.tp_logitix_amount?.toFixed(
                        2
                      ) || "0.00"}
                    </p>
                  </div>
                  <div className="event-group">
                    <p className="name">QuickAsyst Fee</p>
                    <p className="value">
                      -$
                      {invoiceData?.ticket_placement_by_pk?.tp_quick_cut_amount?.toFixed(
                        2
                      ) || "0.00"}
                    </p>
                  </div>
                  <div className="event-group">
                    <p className="name">Taxes and Charges</p>
                    <p className="value">$0.00</p>
                  </div>
                  <div className="event-group">
                    <p className="name">Amount to be settled for users</p>
                    <p className="value">
                      $
                      {invoiceData?.ticket_placement_by_pk?.tp_sold_amount?.toFixed(
                        2
                      ) || "0.00"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {(dialogType === "editpublish" ||
                    dialogType === "editlisttickets") && (
                    <>
                      <div className="event-group">
                        <p className="name">Enter Section</p>
                        <input
                          type="text"
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                          className="edit-field"
                          placeholder="Section"
                        />
                      </div>
                      <div className="event-group">
                        <p className="name">Enter Row</p>
                        <input
                          type="text"
                          value={row}
                          onChange={(e) => setRow(e.target.value)}
                          className="edit-field"
                          placeholder="Row"
                        />
                      </div>
                      <div className="event-group">
                        <p className="name">Enter Seat</p>
                        <input
                          type="text"
                          value={seat}
                          onChange={(e) => setSeat(e.target.value)}
                          className="edit-field"
                          placeholder="Seat"
                        />
                      </div>
                    </>
                  )}
                  {dialogType === "sold" && (
                    <>
                      <div className="event-group">
                        <p className="name">
                          Enter received amount from logitix
                        </p>
                        <input
                          type="number"
                          placeholder="Eg.$121.0"
                          value={receivedAmount}
                          onChange={handleReceivedAmountChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="event-group">
                        <p className="name">QuickAsyst Fee</p>
                        <p className="value">-${quickAsystFee.toFixed(2)}</p>
                      </div>
                      <div className="event-group">
                        <p className="name">Amount to be settled for users</p>
                        <p className="value">${amountToSettle}</p>
                      </div>
                    </>
                  )}
                  {(dialogType === "publish" ||
                    dialogType === "editlisttickets") && (
                    <div className="event-group">
                      <p className="name">
                        {dialogType === "editlisttickets"
                          ? "Enter amount"
                          : "Price"}
                      </p>
                      <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={handlePriceChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="dialogue-footer">
          {dialogType !== "invoice" && (
            <button
              className="reset-button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          )}
          {dialogType === "invoice" ? (
            !invoiceData?.ticket_placement_by_pk
              ?.tp_is_support_vanderbilt_nil_fund && (
              <button
                className="confirm-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {transferLoading ? "Processing..." : "Mark As Settled"}
              </button>
            )
          ) : (
            <button
              className="confirm-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {dialogType === "editpublish" || dialogType === "editlisttickets"
                ? "Update"
                : "Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogueInvoice;
