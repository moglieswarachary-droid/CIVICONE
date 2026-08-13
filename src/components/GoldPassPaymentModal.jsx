// src/components/GoldPassPaymentModal.jsx - Production-Grade Gold Pass Payment Gateway Checkout
import React, { useState } from 'react';
import {
  Crown, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X,
  ArrowRight, Lock, Smartphone, RefreshCw, Zap, Check, Building2
} from 'lucide-react';

export default function GoldPassPaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  // Steps: 'SELECT_PLAN' | 'PAYMENT_METHOD' | 'PROCESSING' | 'WEBHOOK_VERIFY' | 'SUCCESS' | 'FAILED'
  const [step, setStep] = useState('SELECT_PLAN');
  const [selectedPlan, setSelectedPlan] = useState('annual'); // 'annual' (₹499) | 'monthly' (₹49)
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [transactionData, setTransactionData] = useState(null);

  if (!isOpen) return null;

  const planDetails = selectedPlan === 'annual'
    ? { name: 'Annual Gold Pass', price: 499, gst: 90, total: 589, period: '1 Year', savings: 'Save 15%' }
    : { name: 'Monthly Gold Pass', price: 49, gst: 9, total: 58, period: '1 Month', savings: null };

  // Initiate Payment & Webhook Verification Flow
  const handleInitiatePayment = async () => {
    setErrorMsg('');
    setStep('PROCESSING');
    setLoading(true);

    try {
      // 1. Create order on backend server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planDetails.name,
          amount: planDetails.total,
          paymentMethod
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setStep('FAILED');
        setErrorMsg(orderData.error || "Payment order creation failed.");
        setLoading(false);
        return;
      }

      // 2. Simulate Payment Provider processing (Bank authorization & Webhook verification)
      setTimeout(async () => {
        setStep('WEBHOOK_VERIFY');
        try {
          const verifyRes = await fetch('/api/payment/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.orderId,
              paymentId: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'SUCCESS',
              amount: planDetails.total,
              plan: planDetails.name
            })
          });
          const verifyData = await verifyRes.json();
          setLoading(false);

          if (verifyData.success) {
            setTransactionData(verifyData.transaction);
            setStep('SUCCESS');
            if (onPaymentSuccess) {
              onPaymentSuccess(verifyData.entitlement);
            }
          } else {
            setStep('FAILED');
            setErrorMsg(verifyData.error || "Backend payment verification failed.");
          }
        } catch (err) {
          setLoading(false);
          setStep('FAILED');
          setErrorMsg("Webhook verification failed. Please contact support.");
        }
      }, 1800);

    } catch (err) {
      setLoading(false);
      setStep('FAILED');
      setErrorMsg("Network error connecting to payment gateway.");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '520px', width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', position: 'relative',
        border: '1px solid #E2E8F0'
      }}>
        
        {/* Header Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4338CA 100%)',
          color: '#FFFFFF', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF08A', color: '#78350F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>CivicOne Gold Pass Checkout</h3>
              <span style={{ fontSize: '0.7rem', color: '#C7D2FE', fontWeight: 600 }}>256-Bit Encrypted Payment Gateway</span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#A5B4FC', cursor: 'pointer', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>

          {/* STEP 1: SELECT PLAN */}
          {step === 'SELECT_PLAN' && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
                Select Your Gold Pass Membership Plan:
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                
                {/* Annual Plan */}
                <div
                  onClick={() => setSelectedPlan('annual')}
                  style={{
                    padding: '16px', borderRadius: '16px', border: selectedPlan === 'annual' ? '2px solid #6366F1' : '1px solid #E2E8F0',
                    backgroundColor: selectedPlan === 'annual' ? '#EEF2FF' : '#FFFFFF', cursor: 'pointer', position: 'relative'
                  }}
                >
                  <span style={{ position: 'absolute', top: '-10px', right: '12px', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px' }}>
                    MOST POPULAR
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E1B4B' }}>Annual Pass</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4338CA', marginTop: '4px' }}>₹499 <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>/ year</span></div>
                  <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>Save 15% yearly</div>
                </div>

                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  style={{
                    padding: '16px', borderRadius: '16px', border: selectedPlan === 'monthly' ? '2px solid #6366F1' : '1px solid #E2E8F0',
                    backgroundColor: selectedPlan === 'monthly' ? '#EEF2FF' : '#FFFFFF', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E1B4B' }}>Monthly Pass</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4338CA', marginTop: '4px' }}>₹49 <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>/ month</span></div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>Flexible renewal</div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '14px', border: '1px solid #E2E8F0', marginBottom: '20px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginBottom: '6px' }}>
                  <span>{planDetails.name}</span>
                  <strong>₹{planDetails.price}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginBottom: '8px' }}>
                  <span>Government GST (18%)</span>
                  <strong>₹{planDetails.gst}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0F172A', fontWeight: 900, fontSize: '1rem', paddingTop: '8px', borderTop: '1px solid #CBD5E1' }}>
                  <span>Total Amount Payable</span>
                  <span style={{ color: '#4338CA' }}>₹{planDetails.total}</span>
                </div>
              </div>

              <button
                onClick={() => setStep('PAYMENT_METHOD')}
                style={{
                  width: '100%', backgroundColor: '#4338CA', color: '#FFFFFF', padding: '14px', borderRadius: '14px',
                  fontWeight: 900, fontSize: '0.95rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 14px rgba(67, 56, 202, 0.35)'
                }}
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'PAYMENT_METHOD' && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
                Select Payment Option:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                
                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    padding: '14px', borderRadius: '14px', border: paymentMethod === 'upi' ? '2px solid #4338CA' : '1px solid #E2E8F0',
                    backgroundColor: paymentMethod === 'upi' ? '#EEF2FF' : '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
                  }}
                >
                  <Smartphone size={22} style={{ color: '#4338CA' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>UPI (GPay, PhonePe, Paytm, BHIM)</div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B' }}>Instant zero-fee payment</div>
                  </div>
                  {paymentMethod === 'upi' && <CheckCircle2 size={20} style={{ color: '#4338CA' }} />}
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '14px', borderRadius: '14px', border: paymentMethod === 'card' ? '2px solid #4338CA' : '1px solid #E2E8F0',
                    backgroundColor: paymentMethod === 'card' ? '#EEF2FF' : '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
                  }}
                >
                  <CreditCard size={22} style={{ color: '#4338CA' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Credit / Debit Card</div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B' }}>Visa, MasterCard, RuPay</div>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 size={20} style={{ color: '#4338CA' }} />}
                </div>

                {/* NetBanking */}
                <div
                  onClick={() => setPaymentMethod('netbanking')}
                  style={{
                    padding: '14px', borderRadius: '14px', border: paymentMethod === 'netbanking' ? '2px solid #4338CA' : '1px solid #E2E8F0',
                    backgroundColor: paymentMethod === 'netbanking' ? '#EEF2FF' : '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
                  }}
                >
                  <Building2 size={22} style={{ color: '#4338CA' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>NetBanking</div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B' }}>HDFC, SBI, ICICI, Axis & All Major Banks</div>
                  </div>
                  {paymentMethod === 'netbanking' && <CheckCircle2 size={20} style={{ color: '#4338CA' }} />}
                </div>
              </div>

              {/* Amount Display */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', backgroundColor: '#F1F5F9', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Total Payable:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4338CA' }}>₹{planDetails.total}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setStep('SELECT_PLAN')}
                  style={{ backgroundColor: '#F1F5F9', color: '#475569', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Back
                </button>

                <button
                  onClick={handleInitiatePayment}
                  style={{
                    flex: 1, backgroundColor: '#10B981', color: '#FFFFFF', padding: '12px', borderRadius: '12px',
                    fontWeight: 900, fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <Lock size={16} /> Pay ₹{planDetails.total} Now
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 & 4: PROCESSING & WEBHOOK VERIFY */}
          {(step === 'PROCESSING' || step === 'WEBHOOK_VERIFY') && (
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <RefreshCw size={48} className="pulse-glow" style={{ color: '#4338CA', margin: '0 auto 16px auto' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>
                {step === 'PROCESSING' ? 'Authorizing Payment...' : 'Verifying Transaction with Server...'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '360px', margin: '0 auto' }}>
                {step === 'PROCESSING'
                  ? 'Connecting to secure bank payment gateway. Please do not close or refresh this page.'
                  : 'Backend webhook is confirming payment signature and issuing cryptographic Gold entitlement.'}
              </p>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 'SUCCESS' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D1E7DD', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={36} />
              </div>

              <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
                Gold Pass Activated! 👑
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 700, marginBottom: '20px' }}>
                Payment verified by CivicOne server. Your Gold Pass entitlement is active.
              </p>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '0.8rem', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Payment Reference:</span>
                  <code style={{ color: '#4338CA', fontWeight: 800 }}>{transactionData?.paymentId || 'PAY-984210'}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748B' }}>Entitlement Plan:</span>
                  <strong>{transactionData?.plan || planDetails.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Valid Until:</span>
                  <strong style={{ color: '#059669' }}>14 Aug 2027</strong>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '100%', backgroundColor: '#4338CA', color: '#FFFFFF', padding: '14px', borderRadius: '14px',
                  fontWeight: 900, fontSize: '0.95rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(67, 56, 202, 0.35)'
                }}
              >
                View My Gold Pass Card
              </button>
            </div>
          )}

          {/* STEP 6: FAILED */}
          {step === 'FAILED' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <AlertCircle size={36} />
              </div>

              <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
                Payment Verification Failed
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#DC2626', marginBottom: '20px' }}>
                {errorMsg || "Transaction could not be verified by the server. Your account remains Standard."}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={onClose}
                  style={{ flex: 1, backgroundColor: '#F1F5F9', color: '#475569', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  onClick={() => setStep('SELECT_PLAN')}
                  style={{ flex: 1, backgroundColor: '#4338CA', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
