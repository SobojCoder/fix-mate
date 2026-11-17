import Banner from "@/components/homePage/banner";
import Feature from "@/components/homePage/feature";
import HowItWorks from "@/components/homePage/HowFixMateWorks";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner />
      <Feature />
      <HowItWorks />
    </div>
  );
}
