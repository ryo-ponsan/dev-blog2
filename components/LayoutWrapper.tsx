import { Inter } from '@next/font/google'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import { ReactNode, useEffect, useRef } from 'react'
import Header from './Header'

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
})

const LayoutWrapper = ({ children }: Props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const s = window.screen;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width = s.width;
    const height = canvas.height = s.height;

    let matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789#$%^&*()*&^%";
    matrix = matrix.split("");

    const font_size = 10;
    const columns = canvas.width / font_size;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = font_size + "px arial";
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * font_size, drops[i] * font_size);
        if (drops[i] * font_size > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SectionContainer style={{background: "none"}}>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen bg-black" />

        <div className={`${inter.className} flex h-screen flex-col justify-between font-sans relative`}>
          <Header />
          <main className="mb-auto">{children}</main>
          <Footer />
        </div>
      </SectionContainer>
    </>
  )
}

export default LayoutWrapper
