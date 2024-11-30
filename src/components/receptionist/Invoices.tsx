"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, RefreshCw, SearchIcon } from "lucide-react";
import axios from "axios";
import { Invoice } from "../../../lib/entity-types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDate2 } from "../../../lib/utils";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Download from "yet-another-react-lightbox/plugins/download";

export default function Invoices() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("all");
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/invoices`
      );
      setInvoices(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice?.type?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === "all" || invoice.type === filterRole)
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const openLightbox = (imageUrl: string) => {
    setLightboxImageUrl(imageUrl);
    setLightboxIsOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%] overflow-auto">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH CÁC HOÁ ĐƠN ĐÃ LẬP
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập tìm kiếm..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Lọc theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="medical">Hoá đơn khám bệnh</SelectItem>
            <SelectItem value="test">Hoá đơn xét nghiệm</SelectItem>
            <SelectItem value="service">Hoá đơn dịch vụ</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchData}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <div className="max-w-full border rounded-md p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <Table className="overflow-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Loại hoá đơn</TableHead>
                <TableHead>Ngày giờ lập</TableHead>
                <TableHead>Người lập</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{formatDate2(item.issueDate)}</TableCell>
                  <TableCell>{item.staffRole}</TableCell>
                  <TableCell>
                    {item.paymentMethod === "Cash" ? "Tiền mặt" : "Khác"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={() => openLightbox(item.image)}
                    >
                      Xem hoá đơn
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Pagination className="self-end flex-grow items-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="ghost"
            >
              <PaginationPrevious />
            </Button>
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="ghost"
            >
              <PaginationNext />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Lightbox
        open={lightboxIsOpen}
        close={() => setLightboxIsOpen(false)}
        slides={[{ src: lightboxImageUrl }]}
        plugins={[Zoom, Fullscreen, Download]}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 5,
        }}
      />
    </div>
  );
}
