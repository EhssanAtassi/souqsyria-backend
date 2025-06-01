
# 📦 SouqSyria Backend – Order Module Documentation

## 📘 Module Purpose

The **Order Module** in SouqSyria manages everything related to the lifecycle of an order, including:
- Order placement
- Stock validation
- Status tracking
- Returns and refunds
- Vendor and admin access
- Full audit logs
- Admin search and reporting

It supports both **B2C and B2B** use cases, including:
- Multi-vendor orders
- Manual status overrides
- Card/COD/invoice-based payments
- Buyer-side messages and gift notes

...

## 🧾 Notes

- All ownership checks and return deadline logic are in place.
- Order and refund methods are stubbed for full gateway support in future.
- Routes are ready for integration into admin, buyer, and vendor dashboards.
