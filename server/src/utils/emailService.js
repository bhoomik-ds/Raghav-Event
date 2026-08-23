const nodemailer = require("nodemailer");

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendTicketEmail = async (booking, event, recipientEmail) => {
  if (!recipientEmail) return;
  const transporter = getTransporter();
  if (!transporter) {
    console.log("Email service skipped: EMAIL_USER/EMAIL_PASS not configured.");
    return;
  }

  try {
    const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const ticketListHtml = (booking.tickets || [])
      .map(
        (t) => `
      <div style="background: #fdf2f8; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #fbcfe8;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #be185d; font-size: 16px;">${t.ticketType} Pass</strong> 
          <span style="background: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid #ddd; color: #333;">x${t.quantity}</span>
        </div>
        <div style="margin-top: 6px; color: #4b5563; font-size: 13px;">
          <span style="font-weight:bold; color: #9d174d;">Assigned Passes:</span> ${t.seatNumbers ? t.seatNumbers.join(", ") : "General Entry"}
        </div>
      </div>
    `,
      )
      .join("");

    const displayBookingId = booking.bookingId || String(booking._id);
    const venueName = event.venue?.name || "Navratri Arena";
    const venueCity = event.venue?.city || "Gujarat";

    const mailOptions = {
      from: `"Raghav Events" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `🎟 Booking Confirmed: ${event.title} (${displayBookingId})`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          
          <div style="background: linear-gradient(135deg, #321044 0%, #5a176f 50%, #b54278 100%); padding: 32px 20px; text-align: center;">
            <p style="margin: 0 0 6px; color: #fef08a; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">✨ Official Festive Pass ✨</p>
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800;">Ticket Confirmed!</h1>
            <p style="margin: 8px 0 0; color: #fce7f3; font-size: 15px;">Get ready to celebrate, ${booking.guestName}</p>
          </div>

          <div style="padding: 28px;">
            <div style="border-bottom: 2px solid #f3f4f6; padding-bottom: 16px;">
              <span style="background: #fdf2f8; color: #be185d; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase;">${event.category || "Garba Night"}</span>
              <h2 style="color: #1f2937; margin: 8px 0 0; font-size: 22px; font-weight: 800;">${event.title}</h2>
            </div>
            
            <table style="width: 100%; margin-top: 18px; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 110px;">📅 Date</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 700;">${eventDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">⏰ Time</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 700;">${event.time || "7:00 PM Onwards"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">📍 Venue</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 700;">${venueName}, ${venueCity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">🎫 Booking ID</td>
                <td style="padding: 8px 0; color: #5a176f; font-family: monospace; font-weight: 800; font-size: 15px;">${displayBookingId}</td>
              </tr>
            </table>

            <div style="margin-top: 20px; padding-top: 18px; border-top: 1px dashed #e5e7eb;">
               <h3 style="color: #4b5563; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px; font-weight: 700;">Attendee Details</h3>
               <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr>
                    <td style="padding: 4px 0; color: #6b7280; width: 110px;">Primary Guest:</td>
                    <td style="padding: 4px 0; color: #111827; font-weight: 600;">${booking.guestName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #6b7280;">Mobile:</td>
                    <td style="padding: 4px 0; color: #111827; font-weight: 600;">${booking.mobile}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #6b7280;">City:</td>
                    <td style="padding: 4px 0; color: #111827; font-weight: 600;">${booking.city || "—"}</td>
                  </tr>
               </table>
            </div>

            <div style="margin-top: 24px;">
              <h3 style="color: #9d174d; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; font-weight: 800;">Your Passes</h3>
              ${ticketListHtml}
            </div>

            <div style="margin-top: 20px; text-align: right; border-top: 2px solid #f3f4f6; padding-top: 16px;">
              <span style="color: #6b7280; font-size: 14px;">Total Paid:</span>
              <span style="color: #be185d; font-size: 24px; font-weight: 900; margin-left: 10px;">₹${(booking.finalAmount || booking.totalAmount).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div style="background-color: #faf5ff; padding: 18px 24px; text-align: center; border-top: 1px solid #f3e8ff;">
            <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
              Please show this e-ticket or your unique Booking ID at the venue gate for entry wristbands.<br/>
              Have a joyful and energetic celebration! 💃🕺<br/>
              © 2026 Raghav Events Platform
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Email delivery failed:", error.message);
  }
};

module.exports = { sendTicketEmail };
