import { loadStripe } from "@stripe/stripe-js";

export const stripePromise =
  loadStripe(
    "pk_test_51TVng17WyiVc4neBhH7VSHdHIBNnAdEj4wvJiJah2G5zT4ahWnjmdgc1W4pUu5QwxiM67PCGHQAn6vdrOnTQUfwR00EpERJ9nd"
  );