

import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {Poppins} from "next/font/google"

const poppins = Poppins({
  subsets:["latin"],
  weight:["100","200","300","400","500","600","700","800","900"],
  variable:"--font-poppins"
})

export const metadata = {
  title: "My EdTech Platform",
  description: "Learn Computer Science, Programming and Technology"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`website-body ${poppins.className}`}>

        <Navbar/>

        <div className="website-content">
        {children}
        </div>

        <Footer/>

      </body>
    </html>
  )
}
