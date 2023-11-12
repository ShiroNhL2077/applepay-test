import mongoose from "mongoose";

const orderTicketAssociationSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  tickets: [
    {
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
      },
      qrCodes: [String],
      validity: [
        {
          startDate: String,// Date for which the ticket is valid (e.g., "21.03.2024")
          endDate : String,
          startTime: String, // Time information if needed
          endTime: String, // Time information if needed
        },
      ],
      checkin_time: { type: Date }, // Moved from ticketSchema
      checkout_time: { type: Date }, // Moved from ticketSchema
      purchaseDate: { type: Date }, // Moved from ticketSchema
    },
  ],
});


const OrderTicketAssociation = mongoose.model(
  "OrderTicketAssociation",
  orderTicketAssociationSchema
);

export default OrderTicketAssociation;
