import TipButton from "./components/TipButton";

export default function App() {
  const handleTip = (amount) => {
    console.log(`Tip received: $${amount}`);
    // → ovde povezi Stripe / Lemon Squeezy / PayPal link
  };

  return (
    <main>
      <TipButton
        amounts={[1, 5, 10]}
        currency="$"
        thankYouMessage="✦ Thank you! ✦"
        coinCount={2}
        onTip={handleTip}
      />
    </main>
  );
}
