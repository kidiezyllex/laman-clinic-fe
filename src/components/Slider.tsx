import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import CursorTracker from "./animata/container/cursor-tracker";

interface SliderProps {
  items: any[];
}

export default function Slider({ items }: SliderProps) {
  const plugin = useRef(
    Autoplay({
      delay: 1000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-ful"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="-ml-1">
        {items.map((item, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <CursorTracker />
              <p className="text-base text-primary mb-4 uppercase italic">
                {item.text}
              </p>
              <Card className="relative w-full h-72 rounded-xl">
                {/* Card có kích thước toàn bộ container */}
                <CardContent className="flex items-center justify-center p-6 rounded-2xl relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={"image" + item.id}
                    className="object-cover rounded-xl"
                    layout="fill" // Đảm bảo hình ảnh sẽ phủ kín Card
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
