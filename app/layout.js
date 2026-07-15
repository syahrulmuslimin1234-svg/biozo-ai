import "./globals.css";

export const metadata = {
  title: "BIOZO AI — Nutrition advice, not commands",
  description:
    "Snap a photo of your food and get nutrition insight tailored to your health condition, powered by Claude AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
