import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <p className="text-2xl font-semibold text-teal">
          ahmadsheraz.com — coming soon
        </p>
      </main>
      <Footer />
    </>
  );
}
