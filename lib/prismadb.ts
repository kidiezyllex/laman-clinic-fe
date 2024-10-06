import { PrismaClient } from "@prisma/client";

// Khai báo biến toàn cục
declare global {
  var prisma: PrismaClient | undefined;
}

// Khởi tạo biến prismadb với giá trị là biến toàn cục prisma (nếu có) hoặc tạo mới một PrismaClient
const prismadb = globalThis.prisma || new PrismaClient();

// Nếu môi trường hiện tại không phải là "production", gán prismadb cho biến toàn cục prisma
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

// Xuất biến prismadb để sử dụng ở nơi khác
export default prismadb;
