import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Mail,
  ScrollText,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import StepIndicator from "./StepIndicator";
import { useAuth } from "../context/AuthContext";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, api, showToast } = useAuth();

  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Attendee details form state
  const [userDetails, setUserDetails] = useState({
    fullName: user?.name || "",
    mobile: user?.phone || "",
    email: user?.email || "",
    city: user?.city || "Junagadh",
  });

  const [isDetailsSaved, setIsDetailsSaved] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  useEffect(() => {
    if (state && state.selectedSeats) {
      setBookingDetails(state);
    } else {
      const saved = localStorage.getItem("pendingBooking");
      if (saved) {
        try {
          setBookingDetails(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, [state]);

  useEffect(() => {
    if (user) {
      setUserDetails((prev) => ({
        fullName: prev.fullName || user.name || "",
        mobile: prev.mobile || user.phone || "",
        email: prev.email || user.email || "",
        city: prev.city || user.city || "Junagadh",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSaveDetails = (e) => {
    if (e) e.preventDefault();
    if (!userDetails.fullName.trim()) {
      showToast("Please enter attendee full name", "warning");
      return;
    }
    if (!/^\+?[0-9\s-]{10,15}$/.test(userDetails.mobile.trim())) {
      showToast("Please enter a valid 10-digit mobile number", "warning");
      return;
    }
    if (!userDetails.city.trim()) {
      showToast("Please enter attendee city", "warning");
      return;
    }

    setIsDetailsSaved(true);
    showToast("Attendee details confirmed.", "success");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!isDetailsSaved) {
      showToast("Please confirm attendee details first.", "warning");
      return;
    }

    if (!isTermsAccepted) {
      showToast("Please accept the venue rules and terms.", "warning");
      return;
    }

    if (!bookingDetails) {
      showToast("Booking session expired. Please reselect your passes.", "error");
      navigate("/TicketBooking");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const { data: orderData } = await api.post("api/payment/create-order", {
        eventId: id || bookingDetails.eventId || bookingDetails.eventDetails?.id,
        seats: bookingDetails.seats,
        amount: bookingDetails.totalAmount,
      });

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to initiate payment");
      }

      // Check if simulated / mock test mode
      if (orderData.isMock) {
        const verifyRes = await api.post("api/payment/verify", {
          razorpay_payment_id: `pay_mock_${Date.now()}_test`,
          razorpay_order_id: orderData.order_id,
          razorpay_signature: "mock_signature_test_mode",
          bookingData: {
            eventId: id || bookingDetails.eventId || bookingDetails.eventDetails?.id,
            userId: user?._id || user?.id || null,
            email: userDetails.email || user?.email || "",
            seats: bookingDetails.seats,
            totalAmount: bookingDetails.totalAmount,
            guestName: userDetails.fullName,
            mobile: userDetails.mobile,
            city: userDetails.city,
          },
        });

        if (verifyRes.data.success) {
          localStorage.removeItem("pendingBooking");
          showToast("Payment verified! Generating digital pass...", "success");
          navigate(`/view-ticket/${verifyRes.data.publicBookingId}`);
        } else {
          throw new Error(verifyRes.data.message || "Payment verification failed");
        }
        return;
      }

      // 2. Load real Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error("Unable to load Razorpay payment gateway.");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Raghav Events Junagadh",
        description: `Festival Pass for ${userDetails.fullName}`,
        image: "/images/Logo.jpeg",
        order_id: orderData.order_id,
        prefill: {
          name: userDetails.fullName,
          email: userDetails.email,
          contact: userDetails.mobile,
        },
        theme: {
          color: "#3B3B3B",
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post("api/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                eventId: id || bookingDetails.eventId || bookingDetails.eventDetails?.id,
                userId: user?._id || user?.id || null,
                email: userDetails.email || user?.email || "",
                seats: bookingDetails.seats,
                totalAmount: bookingDetails.totalAmount,
                guestName: userDetails.fullName,
                mobile: userDetails.mobile,
                city: userDetails.city,
              },
            });

            if (verifyRes.data.success) {
              localStorage.removeItem("pendingBooking");
              showToast("Payment confirmed! Your pass is ready.", "success");
              navigate(`/view-ticket/${verifyRes.data.publicBookingId}`);
            } else {
              showToast("Payment verification failed. Contact support.", "error");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            showToast("Error confirming booking payment.", "error");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            showToast("Payment window closed.", "info");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      showToast(
        error.response?.data?.message || error.message || "Failed to process payment",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-[70vh] bg-[#FBF8F2] flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-xl border border-[#E8DCC5] bg-white p-8 max-w-md shadow-sm w-full">
          <h2 className="text-xl font-extrabold text-[#292929] mb-2">No Active Pass Selection</h2>
          <p className="text-xs text-[#77736B] mb-5 font-medium">
            Your booking session has expired or no passes were selected.
          </p>
          <Link
            to="/TicketBooking"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B3B3B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#242424] transition"
          >
            <ArrowLeft size={15} /> Select Passes
          </Link>
        </div>
      </div>
    );
  }

  const { selectedSeats, totalAmount, eventDetails, discountAmount, rawAmount } =
    bookingDetails;

  return (
    <div className="min-h-screen bg-[#FBF8F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <StepIndicator step={isDetailsSaved ? 3 : 2} />

        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/TicketBooking?event=${id || eventDetails?.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B3B3B] hover:text-[#C9A96E] transition"
          >
            <ArrowLeft size={15} /> Back to Pass Selection
          </Link>

          <span className="text-xs font-medium text-[#77736B]">
            Satyam Party Plot, Junagadh
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.5fr] items-start">
          
          {/* Booking Summary Card */}
          <div className="rounded-xl border border-[#E8DCC5] bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-[#E8DCC5] pb-4">
              <span className="rounded bg-[#FBF8F2] border border-[#E8DCC5] px-2 py-0.5 text-[10px] font-bold text-[#77736B]">
                Junagadh 2026
              </span>
              <h2 className="mt-2 text-lg font-extrabold text-[#292929]">
                Grand Junagadh Garba
              </h2>
              <p className="text-xs font-medium text-[#77736B]">
                11 – 20 Oct 2026 • 7:00 PM Onwards
              </p>
              <p className="text-xs text-[#77736B] mt-0.5">
                Satyam Party Plot, Zanzarda Chokdi
              </p>
            </div>

            {/* Selected Passes */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#77736B]">
                Selected Pass Tiers
              </h3>
              <div className="space-y-1.5">
                {Array.isArray(selectedSeats) &&
                  selectedSeats.map((seatStr, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center rounded-lg bg-[#FBF8F2] border border-[#E8DCC5] px-3 py-2 text-xs font-semibold text-[#292929]"
                    >
                      <span>{seatStr}</span>
                      <span className="text-[#C9A96E] font-bold text-[11px]">Confirmed</span>
                    </div>
                  ))}
              </div>

              {/* Breakdown */}
              <div className="border-t border-[#E8DCC5] pt-3 space-y-1.5 text-xs font-medium text-[#77736B]">
                {rawAmount && (
                  <div className="flex justify-between text-[#292929]">
                    <span>Subtotal</span>
                    <span>₹{rawAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C9A96E]">
                    <span>Discount Applied</span>
                    <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px]">
                  <span>Convenience Fee</span>
                  <span className="text-[#C9A96E] font-bold">FREE (₹0)</span>
                </div>
              </div>
            </div>

            {/* Total Row */}
            <div className="border-t border-[#E8DCC5] pt-3 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-[#292929]">Total Payable</span>
              <span className="text-xl font-extrabold text-[#292929]">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Attendee Form & Payment */}
          <div className="rounded-xl border border-[#E8DCC5] bg-white p-5 sm:p-7 shadow-sm space-y-5">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-extrabold text-[#292929]">
                  Attendee Information
                </h3>
                {isDetailsSaved && (
                  <button
                    type="button"
                    onClick={() => setIsDetailsSaved(false)}
                    className="text-xs font-bold text-[#C9A96E] hover:underline"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {!isDetailsSaved ? (
                <form onSubmit={handleSaveDetails} className="space-y-3">
                  <label className="block">
                    <span className="form-label">Full Name *</span>
                    <div className="form-field">
                      <User size={15} className="text-[#77736B]" />
                      <input
                        required
                        name="fullName"
                        value={userDetails.fullName}
                        onChange={handleInputChange}
                        placeholder="Full name as on ID"
                      />
                    </div>
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="form-label">Mobile Number *</span>
                      <div className="form-field">
                        <Phone size={15} className="text-[#77736B]" />
                        <input
                          required
                          type="tel"
                          name="mobile"
                          value={userDetails.mobile}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="form-label">City *</span>
                      <div className="form-field">
                        <MapPin size={15} className="text-[#77736B]" />
                        <input
                          required
                          name="city"
                          value={userDetails.city}
                          onChange={handleInputChange}
                          placeholder="Junagadh"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <span className="form-label">Email Address (for QR Pass)</span>
                    <div className="form-field">
                      <Mail size={15} className="text-[#77736B]" />
                      <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-[#3B3B3B] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#242424] transition shadow-xs"
                  >
                    Confirm Attendee Details
                  </button>
                </form>
              ) : (
                <div className="rounded-lg border border-[#C9A96E] bg-[#FBF8F2] p-3.5">
                  <div className="flex items-center gap-2 text-[#292929] font-bold text-xs">
                    <CheckCircle2 size={15} className="text-[#C9A96E] shrink-0" />
                    <span>Attendee Details Verified</span>
                  </div>
                  <div className="mt-1.5 text-xs text-[#77736B] space-y-0.5 pl-6 font-medium">
                    <p><strong className="text-[#292929]">Name:</strong> {userDetails.fullName}</p>
                    <p><strong className="text-[#292929]">Mobile:</strong> {userDetails.mobile} | <strong className="text-[#292929]">City:</strong> {userDetails.city}</p>
                    {userDetails.email && <p><strong className="text-[#292929]">Email:</strong> {userDetails.email}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Venue Guidelines */}
            <div className="border-t border-[#E8DCC5] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#77736B] mb-2 flex items-center gap-1.5">
                <ScrollText size={14} className="text-[#C9A96E]" /> Venue Rules & Guidelines
              </h4>
              <div className="h-24 overflow-y-auto rounded-lg border border-[#E8DCC5] bg-[#FBF8F2] p-2.5 text-[11px] leading-relaxed text-[#77736B] space-y-1">
                <p>1. <strong>Pass Verification:</strong> Present QR e-ticket at Satyam Party Plot gate to collect entry wristband.</p>
                <p>2. <strong>Original ID:</strong> Valid photo ID matching attendee name must be carried.</p>
                <p>3. <strong>Dress Code:</strong> Traditional Indian / Festive attire is encouraged.</p>
                <p>4. <strong>Security:</strong> Security checks at gate. Hazardous items strictly prohibited.</p>
                <p>5. <strong>Validity:</strong> Pass is valid for all 10 nights (11 - 20 October 2026).</p>
              </div>

              <label className="mt-3 flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-[#3B3B3B] cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#292929] leading-tight">
                  I accept the venue rules and terms of booking.
                </span>
              </label>
            </div>

            {/* Payment Button */}
            <div className="border-t border-[#E8DCC5] pt-4 space-y-2.5">
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading || !isDetailsSaved || !isTermsAccepted}
                className={`w-full flex items-center justify-center gap-2 rounded-lg py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition ${
                  isDetailsSaved && isTermsAccepted && !loading
                    ? "bg-[#3B3B3B] hover:bg-[#242424]"
                    : "bg-slate-300 cursor-not-allowed opacity-60"
                }`}
              >
                <CreditCard size={15} className="text-[#E5D2A8]" />
                <span>
                  {loading
                    ? "Processing..."
                    : `Pay ₹${totalAmount.toLocaleString("en-IN")} via Razorpay`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#77736B]">
                <ShieldCheck size={13} className="text-[#C9A96E]" />
                <span>256-bit SSL Encrypted • UPI / Cards / NetBanking</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
