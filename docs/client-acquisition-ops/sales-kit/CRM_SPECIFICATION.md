# ProAI Expert — CRM Specification

**Status:** Approved for initial use  
**Prepared:** 2026-08-04  
**Operating owner:** Ihor Horb  
**Review cadence:** Weekly

## Purpose

This CRM is the operational record for every target, conversation, opportunity, proposal, client, review, case, and referral.

The initial implementation should be simple enough to use daily. A Google Sheet is acceptable for the first 30 days. Migration to a dedicated CRM should occur only when the manual process is stable or the sheet becomes a real constraint.

## Non-negotiable rules

1. Every active record has a dated next action.
2. Every sales conversation is logged the same day.
3. No proposal is sent before qualification.
4. A verbal yes is not Closed Won.
5. Closed Won requires accepted scope and cleared deposit.
6. Every lost opportunity records one primary loss reason.
7. Every completed project enters the review, case-permission, and referral loop.

## Recommended tabs

### 1. Pipeline

One row per business/opportunity.

### 2. Activities

One row per meaningful contact, reply, call, audit, proposal, or decision.

### 3. Partners and Referrers

One row per partner, connector, client referrer, chamber, or community relationship.

### 4. Weekly Dashboard

Weekly totals and conversion metrics.

## Pipeline fields

### Record identity

- `Lead ID` — stable unique ID, e.g. `PAX-2026-0001`.
- `Business Name`.
- `Decision Maker`.
- `Role`.
- `Website`.
- `Email`.
- `Phone`.
- `Social Profile`.
- `City`.
- `State`.
- `Preferred Language` — EN, RU, UA, Other.

### Segmentation

- `Vertical` — Home Services, Professional Services, Beauty/Wellness, Other.
- `ICP Tier` — A1, A2, B, C.
- `Lead Score` — 0–16.
- `Priority` — P1, P2, P3, Disqualified.
- `Source` — Warm, Referral, Facebook, LinkedIn, Google Maps, Directory, Partner, Chamber, Offline, Inbound, Other.
- `Referrer / Connector`.
- `Local or Community Link`.

### Diagnosis

- `Observed Problem`.
- `Acknowledged Problem`.
- `Business Consequence` — only what the prospect stated or a clearly labelled hypothesis.
- `Current Lead Sources`.
- `Current Response Process`.
- `Likely Entry Offer`.
- `Potential Core Project`.
- `Buying Signal`.
- `Budget Path`.
- `Urgency / Trigger`.
- `Decision Process`.

### Pipeline control

- `Stage`.
- `Date Added`.
- `First Contact Date`.
- `Last Contact Date`.
- `Last Activity Type`.
- `Next Action`.
- `Next Action Date`.
- `Action Owner`.
- `Audit Status` — Not Offered, Offered, Accepted, Delivered, Declined.
- `Audit Link`.
- `Discovery Date`.
- `Proposal Date`.
- `Decision Date`.
- `Nurture Date`.

### Revenue and outcome

- `Estimated Deal Value`.
- `Proposal Value`.
- `Deposit Requested`.
- `Deposit Received`.
- `Close Date`.
- `Lost Reason`.
- `Delivery Status`.
- `Review Requested`.
- `Review Received`.
- `Case Permission Requested`.
- `Case Permission Received`.
- `Referrals Requested`.
- `Referrals Received`.

## Pipeline stages

1. `Target`
2. `Qualified Lead`
3. `Contacted`
4. `Engaged`
5. `Audit`
6. `Discovery Booked`
7. `Qualified Opportunity`
8. `Proposal`
9. `Decision`
10. `Closed Won`
11. `Closed Lost`
12. `Nurture`
13. `Delivery`
14. `Proof / Referral`

## Stage exit rules

- `Target` → scored or disqualified.
- `Qualified Lead` → first personalized contact sent.
- `Contacted` → reply, completed sequence, or nurture.
- `Engaged` → audit, discovery, decline, or nurture.
- `Audit` → discovery, close, or nurture.
- `Discovery Booked` → completed or one reschedule.
- `Qualified Opportunity` → proposal or documented no-fit.
- `Proposal` → decision date, won, lost, or nurture.
- `Decision` → deposit, decline, or dated delay.
- `Closed Won` → onboarding complete.
- `Delivery` → accepted completion.
- `Proof / Referral` → review, case permission, and referral requests resolved.

## Activity log fields

- `Activity ID`.
- `Lead ID`.
- `Date and Time`.
- `Channel`.
- `Activity Type` — Research, First Contact, Follow-up, Reply, Call, Audit, Proposal, Decision, Deposit, Delivery, Review, Referral.
- `Summary`.
- `Prospect Language / Exact Objection`.
- `Outcome`.
- `Next Action`.
- `Next Action Date`.

## Standard lost reasons

- No response after sequence.
- No acknowledged problem.
- No urgency.
- No budget path.
- Price only / cheapest provider.
- Decision-maker unavailable.
- Timing delayed.
- Chose competitor.
- Scope/capability mismatch.
- Payment or behavior risk.
- Project cancelled internally.
- Other — explanation required.

## Weekly dashboard metrics

- New targets researched.
- P1 / P2 / P3 leads.
- First contacts.
- Follow-ups.
- Warm introductions requested and received.
- Positive replies.
- Audits offered, accepted, delivered.
- Discovery calls booked and completed.
- Qualified opportunities.
- Proposals sent and total value.
- Deposits received and revenue.
- Average days from first contact to deposit.
- Lost reasons.
- Overdue next actions.
- Review, case, and referral status.

## Initial implementation recommendation

Use Google Sheets for the first 30 days with:

- dropdown validation for stage, priority, source, vertical, and status fields;
- date formatting for all action and decision dates;
- conditional highlighting for overdue next actions;
- protected headers and formula columns;
- filters by priority, stage, source, and next-action date.

Do not build automation until the manual workflow has been used consistently for at least one full week and field definitions are stable.
