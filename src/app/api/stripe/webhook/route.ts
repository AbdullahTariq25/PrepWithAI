import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require("stripe").default;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function planFromSubscription(subscription: { status?: string; metadata?: Record<string, string> }) {
  const active = subscription.status === "active" || subscription.status === "trialing";
  if (!active) return "free";
  return subscription.metadata?.planId === "team" ? "team" : "pro";
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await req.text();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await connectDB();

    switch (event.type) {
      case "checkout.session.completed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId === "team" ? "team" : "pro";
        if (userId && session.subscription) {
          await User.findByIdAndUpdate(userId, {
            plan: planId,
            stripeSubscriptionId: session.subscription as string,
            proTrialStartedAt: null,
            proTrialEndsAt: null,
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if ("metadata" in customer && customer.metadata?.userId) {
          await User.findByIdAndUpdate(customer.metadata.userId, {
            plan: planFromSubscription(subscription),
            stripeSubscriptionId: subscription.id,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if ("metadata" in customer && customer.metadata?.userId) {
          await User.findByIdAndUpdate(customer.metadata.userId, {
            plan: "free",
            stripeSubscriptionId: null,
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
