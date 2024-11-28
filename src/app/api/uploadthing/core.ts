// import { createUploadthing, type FileRouter } from "uploadthing/next";
// const f = createUploadthing();
// export const ourFileRouter = {
//   imageUploader: f({
//     image: { maxFileSize: "8MB", maxFileCount: 1 },
//   }).onUploadComplete(async ({ metadata, file }) => {
//     console.log("file url", file.url);
//   }),
// } satisfies FileRouter;
// export type OurFileRouter = typeof ourFileRouter;

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB" } })
    .middleware(async ({ req }) => {
      return { userId: "testUser" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
