// Subscription model - handles subscription and payment database operations
import { query, queryOne } from "../database"

export interface Subscription {
  id: number
  user_id: number
  status: "active" | "inactive" | "expired" | "cancelled"
  plan_type: string
  amount: number
  currency: string
  billing_cycle: string
  current_period_start?: Date
  current_period_end?: Date
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: Date
  updated_at: Date
}

export interface Payment {
  id: number
  user_id: number
  subscription_id?: number
  amount: number
  currency: string
  status: "pending" | "succeeded" | "failed" | "cancelled"
  payment_method?: string
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  failure_reason?: string
  created_at: Date
  updated_at: Date
}

// Create or update subscription
export async function upsertSubscription(
  userId: number,
  subscriptionData: Partial<Subscription>,
): Promise<Subscription> {
  const existing = await queryOne<Subscription>("SELECT * FROM subscriptions WHERE user_id = $1", [userId])

  if (existing) {
    // Update existing subscription
    const fields = []
    const values = []
    let paramCount = 1

    Object.entries(subscriptionData).forEach(([key, value]) => {
      if (value !== undefined && key !== "user_id") {
        fields.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    })

    if (fields.length === 0) {
      return existing
    }

    values.push(userId)

    const updated = await queryOne<Subscription>(
      `UPDATE subscriptions SET ${fields.join(", ")}
       WHERE user_id = $${paramCount}
       RETURNING *`,
      values,
    )

    return updated || existing
  } else {
    // Create new subscription
    const subscription = await queryOne<Subscription>(
      `INSERT INTO subscriptions (user_id, status, plan_type, amount, currency, billing_cycle, current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        userId,
        subscriptionData.status || "inactive",
        subscriptionData.plan_type || "professional",
        subscriptionData.amount || 99.9,
        subscriptionData.currency || "BRL",
        subscriptionData.billing_cycle || "monthly",
        subscriptionData.current_period_start,
        subscriptionData.current_period_end,
        subscriptionData.stripe_customer_id,
        subscriptionData.stripe_subscription_id,
      ],
    )

    if (!subscription) {
      throw new Error("Failed to create subscription")
    }

    return subscription
  }
}

// Get subscription by user ID
export async function getSubscriptionByUserId(userId: number): Promise<Subscription | null> {
  return queryOne<Subscription>("SELECT * FROM subscriptions WHERE user_id = $1", [userId])
}

// Get subscription by Stripe subscription ID
export async function getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
  return queryOne<Subscription>("SELECT * FROM subscriptions WHERE stripe_subscription_id = $1", [stripeSubscriptionId])
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: number): Promise<boolean> {
  const subscription = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM subscriptions 
     WHERE user_id = $1 AND status = 'active' AND current_period_end > CURRENT_TIMESTAMP`,
    [userId],
  )

  return Number.parseInt(subscription?.count || "0") > 0
}

// Get expiring subscriptions (for notifications)
export async function getExpiringSubscriptions(daysAhead = 7): Promise<Subscription[]> {
  return query<Subscription>(
    `SELECT s.*, u.email, u.store_name 
     FROM subscriptions s
     JOIN users u ON s.user_id = u.id
     WHERE s.status = 'active' 
     AND s.current_period_end BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '${daysAhead} days'`,
    [],
  )
}

// Create payment record
export async function createPayment(paymentData: {
  user_id: number
  subscription_id?: number
  amount: number
  currency?: string
  status?: string
  payment_method?: string
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
}): Promise<Payment> {
  const payment = await queryOne<Payment>(
    `INSERT INTO payments (user_id, subscription_id, amount, currency, status, payment_method, stripe_payment_intent_id, stripe_charge_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      paymentData.user_id,
      paymentData.subscription_id,
      paymentData.amount,
      paymentData.currency || "BRL",
      paymentData.status || "pending",
      paymentData.payment_method,
      paymentData.stripe_payment_intent_id,
      paymentData.stripe_charge_id,
    ],
  )

  if (!payment) {
    throw new Error("Failed to create payment")
  }

  return payment
}

// Update payment status
export async function updatePaymentStatus(
  paymentId: number,
  status: "pending" | "succeeded" | "failed" | "cancelled",
  failureReason?: string,
): Promise<Payment | null> {
  return queryOne<Payment>("UPDATE payments SET status = $1, failure_reason = $2 WHERE id = $3 RETURNING *", [
    status,
    failureReason,
    paymentId,
  ])
}

// Get payment history for user
export async function getPaymentHistory(
  userId: number,
  page = 1,
  limit = 20,
): Promise<{ payments: Payment[]; total: number }> {
  // Get total count
  const totalResult = await queryOne<{ count: string }>("SELECT COUNT(*) as count FROM payments WHERE user_id = $1", [
    userId,
  ])
  const total = Number.parseInt(totalResult?.count || "0")

  // Get paginated results
  const offset = (page - 1) * limit
  const payments = await query<Payment>(
    `SELECT * FROM payments 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  )

  return { payments, total }
}

// Get payment by Stripe payment intent ID
export async function getPaymentByStripeIntentId(stripePaymentIntentId: string): Promise<Payment | null> {
  return queryOne<Payment>("SELECT * FROM payments WHERE stripe_payment_intent_id = $1", [stripePaymentIntentId])
}
