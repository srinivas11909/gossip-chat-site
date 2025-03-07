//import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from 'next/font/google';

import "./globals.css";
import Header from "./components/Header";
import Footer from './components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600'], // Specify the weights you intend to use
  variable: '--font-poppins', // Define a CSS variable for the font
  display: 'swap', // Use 'swap' to ensure text is displayed immediately with a fallback font until Poppins loads
});
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Gossip",
  description: "Free Chat Online With No Registration, you can enter and start chat without registration, 100% free chat, No download & no setup.",
  keywords: "chat, anonymous chat, connect to world, friends near me, friendship,indain caht,gossips, friends, free chat,Telugu chat,Hindi chat, Tamil chat, Malayam chat,Kannada online with no registration"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
