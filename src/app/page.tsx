import Banner from "@/components/homePage/banner";
import Categories from "@/components/homePage/category";
import Feature from "@/components/homePage/feature";
import HowItWorks from "@/components/homePage/HowFixMateWorks";
import WhyChooseUs from "@/components/homePage/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner />
      <Feature />
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
    </div>
  );
}
