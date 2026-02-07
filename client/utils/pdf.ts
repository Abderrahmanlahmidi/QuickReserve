import { jsPDF } from "jspdf";

type ReservationEvent = {
  title?: string;
  date?: string | Date;
  location?: string;
};

type ReservationUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

type ReservationTicket = {
  id?: string;
  status?: string;
  event?: ReservationEvent | null;
  user?: ReservationUser | null;
};

function formatDate(value?: string | Date) {
  if (!value) return "N/A";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function downloadReservationTicket(reservation: ReservationTicket) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;

  const attendeeName =
    reservation.user?.firstName || reservation.user?.lastName
      ? `${reservation.user?.firstName || ""} ${reservation.user?.lastName || ""}`.trim()
      : "Guest";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Event Ticket", margin, 64);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Reservation ID: ${reservation.id || "N/A"}`, margin, 96);
  doc.text(`Status: ${reservation.status || "PENDING"}`, margin, 116);

  doc.setDrawColor(230);
  doc.line(margin, 132, 545, 132);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(reservation.event?.title || "Event", margin, 160);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Date: ${formatDate(reservation.event?.date)}`, margin, 184);
  doc.text(`Location: ${reservation.event?.location || "TBD"}`, margin, 206);
  doc.text(`Attendee: ${attendeeName}`, margin, 228);

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    "Please bring this ticket with a valid ID to access the event.",
    margin,
    270
  );

  const filename = reservation.id
    ? `ticket-${reservation.id}.pdf`
    : "ticket.pdf";
  doc.save(filename);
}
