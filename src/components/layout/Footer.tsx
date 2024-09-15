import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import Container from "../Container";
import { Card } from "../ui/card";

export default function Footer() {
  return (
    <Container>
      <Card className="container mx-auto px-4 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">HealthCare Clinic</h3>
            <p className="text-sm">
              Providing quality healthcare services to our community since 1995.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">info@healthcareclinic.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  123 Medical Ave, Health City, HC 12345
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Hours of Operation</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Mon-Fri: 8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Sat: 9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Sun: Closed</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm hover:underline">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-sm hover:underline">
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-sm hover:underline">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-sm hover:underline">
                  Emergency Care
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8 bg-primary-foreground/20" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; 2023 HealthCare Clinic. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary-foreground/80">
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="hover:text-primary-foreground/80">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="hover:text-primary-foreground/80">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </Card>
    </Container>
  );
}
