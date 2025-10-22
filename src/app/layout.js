          
          import Navbar from '../components/Navbar';
          import Footer from '../components/Footer.js';
          import { Poppins } from 'next/font/google';
          
          const poppins = Poppins({
              subsets: ['latin'],
              weight: ['400', '500', '600', '700'],
              display: 'swap',
            });
          

          export const metadata = {
              title: 'Learn Computer Science',
              description: 'Learn Computer Science Technologies with easy language',
              icons:{
                      icon:"/learnmist-icon.png",
                    }
          };
          // app/layout.js
          import './globals.css'; // optional: your global CSS
          
          
          export default function RootLayout({ children }) {
            return (

      <html lang="en" className={poppins.className}>
      <body style={{display:'flex', minHeight:'100vh', flexDirection:'column',margin:0}}>
        <Navbar/>

        <main style={{flex:1}}>
        {children}
        </main>

        <Footer/>
      </body>
    </html>
  );
}

