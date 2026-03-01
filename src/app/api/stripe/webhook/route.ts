import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Stripe = require("stripe").default;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, note: "Stripe not configured" });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  await connectDB();

  switch (event.type) {
    case "checkout.session.completed": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      if (userId && planId) {
        await User.findByIdAndUpdate(userId, {
          plan: planId,
          stripeSubscriptionId: session.subscription as string,
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      );
      if ("metadata" in customer && customer.metadata?.userId) {
        const status = subscription.status;
        const plan = status === "active" ? subscription.metadata?.planId || "pro" : "free";
        await User.findByIdAndUpdate(customer.metadata.userId, { plan });
      }
      break;
    }

    case "customer.subscription.deleted": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = event.data.object as any;
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      );
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

  return NextResponse.json({ received: true });
}
