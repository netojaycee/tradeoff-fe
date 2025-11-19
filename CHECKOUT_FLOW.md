# TradeOff Frontend - Final Checkout Flow

## Overview
Unified order creation and payment initialization flow using backend `/orders` endpoint. No inline payment setup needed - backend returns authorization URL for direct redirect.

---

## Architecture

### Files Updated
1. **`redux/api.ts`** - `useCreateOrderMutation` hook
2. **`app/(root)/checkout/MultiStepCheckout.tsx`** - Order creation and payment redirect
3. **`app/(root)/checkout/Payment.tsx`** - Payment display component
4. **`app/(root)/checkout/callback/page.tsx`** - Payment callback handler (NEW)

---

## Complete Checkout Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Checkout Form (User fills shipping address)            │
│ ├─ Items in cart ✓                                             │
│ ├─ Shipping Address ✓                                          │
│ └─ Proceed → STEP 2                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Payment Screen (Confirm totals)                        │
│ ├─ Order summary (items, delivery fee, tax, total)             │
│ ├─ Button: "Proceed to Payment" (triggers order creation)      │
│ └─ On Click → createOrder mutation                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND: POST /orders                                          │
│ ├─ Request: items, shippingAddress, paymentMethod             │
│ ├─ Creates order in database                                   │
│ ├─ Initializes Paystack payment                                │
│ └─ Response: { order, payment }                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Redirect to Payment                                  │
│ ├─ window.location.href = payment.authorizationUrl            │
│ ├─ Store orderId & reference in localStorage                  │
│ └─ User redirected to Paystack                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PAYSTACK: User completes payment                              │
│ ├─ User enters card details                                    │
│ ├─ Payment processed                                           │
│ └─ Redirects back to callback URL                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Payment Callback Handler                            │
│ ├─ URL: /checkout/callback?reference=PAY...                   │
│ ├─ Retrieves orderId from localStorage                        │
│ ├─ (Optional) Verify payment with backend                     │
│ └─ Redirect to /order-confirmation/{orderId}                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Order Confirmation                                    │
│ ├─ Order details fetched and displayed                        │
│ ├─ Payment status: Completed                                  │
│ └─ Options: Track Order, Continue Shopping                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND WEBHOOK: Confirms Payment                            │
│ ├─ Updates order.paymentStatus → "completed"                  │
│ ├─ Updates order.status → "confirmed"                         │
│ ├─ Reduces product inventory                                  │
│ ├─ Creates seller payouts                                     │
│ └─ Sends confirmation emails                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoint

### Request Format
```typescript
POST /orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  items: [
    { productId: "...", quantity: 2 }
  ],
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+234812345678",
    address: "123 Main Street",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    postalCode: "100001"
  },
  shippingMethod: "standard",
  paymentMethod: "paystack" // Default if not provided
}
```

### Response Format
```typescript
{
  success: true,
  message: "Operation successful",
  data: {
    order: {
      id: "507f1f77bcf86cd799439013",
      orderNumber: "ORD...",
      status: "pending",
      totalAmount: 58325,
      // ... full order object
    },
    payment: {
      reference: "PAY...",
      authorizationUrl: "https://checkout.paystack.com/...",
      amount: 58325,
      currency: "NGN",
      paymentMethod: "paystack"
    }
  },
  timestamp: "2024-11-19T10:00:00Z"
}
```

---

## Frontend Implementation Details

### 1. Order Creation (MultiStepCheckout.tsx)

**What happens:**
- User fills checkout form and clicks "Proceed to Payment"
- Form data is validated and saved
- User sees Payment screen (STEP 2)

**What happens on payment click:**
```typescript
const handlePaystackPayment = async () => {
  // Build payload from cart + checkout form
  const orderPayload = {
    items: cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    })),
    shippingAddress: {
      firstName, lastName, email, phone,
      address: streetAddress,
      city: lga,  // Using LGA as city
      state, country: "Nigeria"
    },
    shippingMethod: "standard",
    paymentMethod: "paystack"
  };

  // Call backend
  const response = await createOrder(orderPayload).unwrap();
  
  // Extract authorization URL and redirect
  const { payment } = response;
  localStorage.setItem('currentOrderId', response.order.id);
  localStorage.setItem('paymentReference', payment.reference);
  window.location.href = payment.authorizationUrl;
};
```

### 2. Payment Redirect

**No inline Paystack setup needed.**
- Backend handles Paystack initialization
- Frontend simply redirects to the returned `authorizationUrl`
- No public key needed on frontend

### 3. Callback Handler (app/(root)/checkout/callback/page.tsx)

**What happens:**
- After payment, Paystack redirects to `/checkout/callback?reference=PAY...`
- Component verifies payment reference
- Retrieves orderId from localStorage
- Redirects to `/order-confirmation/{orderId}`

```typescript
export default function CheckoutCallbackPage() {
  useEffect(() => {
    const reference = searchParams.get("reference");
    const orderId = localStorage.getItem("currentOrderId");
    
    // Redirect to confirmation
    router.push(`/order-confirmation/${orderId}`);
  }, []);
  
  return <LoadingSpinner />;
}
```

### 4. Confirmation Screen (Confirmation.tsx)

- Displays order details
- Shows payment status
- Options to track order or continue shopping
- Backend webhook has already updated order status

---

## Key Implementation Points

### ✓ No Inline Setup
- ❌ NO: `window.PaystackPop.setup()` in frontend
- ✓ YES: Direct redirect to `authorizationUrl`

### ✓ No Public Key on Frontend
- ❌ NO: `process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- ✓ YES: Backend handles all payment setup

### ✓ Request Field Mapping
| Backend Field | Frontend Field | Source |
|---|---|---|
| `phone` | `checkoutData.phoneNumber` | Checkout form |
| `address` | `checkoutData.streetAddress` | Checkout form |
| `city` | `checkoutData.lga` | Checkout form (using LGA as city) |
| `country` | `"Nigeria"` | Hardcoded |

### ✓ Order Creation Timing
- Order is created DURING payment process (not before)
- Order status: `"pending"` until payment confirmed
- Webhook updates status to `"confirmed"` after payment

### ✓ Cart Clearing (Frontend handles)
- After successful payment & confirmation
- Cart should be cleared from Redux/localStorage
- Can be done in confirmation page or order completion

---

## Error Handling

### Order Creation Errors
```typescript
catch (error) {
  // Backend returns error message
  // Display to user: "Some items are no longer available"
  // User stays on payment screen to retry
}
```

### Payment Callback Errors
```typescript
// If verification fails in callback handler
- Show error message
- Provide option to return to checkout
- Store order details for support reference
```

---

## What Backend Webhook Handles

1. ✅ Payment verification with Paystack
2. ✅ Updates `order.paymentStatus` → "completed"
3. ✅ Updates `order.status` → "confirmed"
4. ✅ Reduces product inventory
5. ✅ Marks sold-out products as `sold: true`
6. ✅ Creates seller payouts
7. ✅ Sends confirmation emails

**Frontend doesn't need to do any of this.**

---

## Testing Checklist

- [ ] Add item to cart
- [ ] Go to checkout
- [ ] Fill shipping form
- [ ] Click "Proceed to Payment"
- [ ] Verify createOrder is called with correct payload
- [ ] Verify redirect to Paystack authorizationUrl
- [ ] Complete payment on Paystack
- [ ] Verify redirect to /checkout/callback?reference=...
- [ ] Verify redirect to /order-confirmation/{orderId}
- [ ] Check order details display correctly
- [ ] Verify order appears in backend database

---

## Summary

### Architecture
- **Single endpoint**: POST `/orders` creates order + initializes payment
- **No inline setup**: Backend returns authorization URL, frontend redirects
- **No public key needed**: All payment setup handled server-side
- **Webhook handles completion**: Backend automatically confirms payment and updates order

### Flow
1. User → Checkout Form → Payment Screen
2. Click Pay → Create Order (backend)
3. Redirect → Paystack Payment
4. Complete Payment → Callback Handler
5. Verify → Show Confirmation
6. Webhook → Complete Order & Inventory

### Frontend Responsibilities
- Collect checkout form data
- Map cart items to order format
- Call createOrder mutation
- Redirect to authorizationUrl
- Handle callback and show confirmation

### Backend Responsibilities
- Validate order data
- Create order in database
- Initialize Paystack payment
- Handle webhook verification
- Update order status and inventory
- Create seller payouts
