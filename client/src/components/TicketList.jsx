import React from "react";
import { Ticket } from "lucide-react";
import TicketCard from "./TicketCard";

const TicketList = ({
  tickets = [],
  selectedTickets = {},
  onAdd,
  onRemove,
  totalSelected = 0,
}) => {
  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E8DCC5] bg-white p-8 text-center text-[#77736B] shadow-xs">
        <Ticket size={24} className="mx-auto text-[#C9A96E] mb-2" />
        No pass tiers configured for this celebration.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          id={ticket.id}
          name={ticket.name}
          price={ticket.price}
          rawPrice={ticket.rawPrice}
          description={ticket.description}
          available={ticket.available}
          count={selectedTickets[ticket.id] || 0}
          onAdd={onAdd}
          onRemove={onRemove}
          maxAllowed={10 - totalSelected + (selectedTickets[ticket.id] || 0)}
        />
      ))}
    </div>
  );
};

export default TicketList;