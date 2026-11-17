import Banner from "@/components/homePage/banner";
import Border from "@/components/homePage/border";
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
      <Border />
      <HowItWorks />
      <Border />
      <Categories />
      <Border />
      <WhyChooseUs />
    </div>
  );
}
