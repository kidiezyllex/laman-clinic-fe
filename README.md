<h1 align="center">
SUPPORT AND MANAGEMENT SYSTEM FOR MULTI-SPECIALTY CLINICS</h1>

[1. Member](#1-member)
[2. System Architecture](#2-system-architecture)
[3. Teck Stack](#3-teck-stack)
[4. Use Case Diagram](#4-use-case-diagram)
[5. Database Diagram](#5-database-diagram)
[6. Run Project](#6-run-project)

### 1. Member

- **Name:** Bui Tran Thien An. **Role:** Main Front-End Developer with some involvement in the Back-End.
- **Name:** Ho Duc Lam. **Role:** Main Back-End Developer and Business Logic Handler.

### 2. System Architecture

![](https://res.cloudinary.com/drqbhj6ft/image/upload/v1734289222/learning-webdev-blog/clinic/Client_echt9o.png)

### 3. Teck Stack

- **Front-End:** NextJS, Typescript, ShadCN/UI & TailwindCSS for styling, Clerk for authentication with Google Account, Next Auth for authentication and session handling, Zustand for state management, Uploadthing for image uploading and storage, Zod & React Hook Form for form validation and handling.
- **Back-End:** Node.js & Express.js for building APIs, MongoDB for database management, Apache Kafka for send message and queue management, Redis for caching, Docker, AWS EC2.
- **Deployment tools:** Vercel (FE), Nginx (BE)

### 4. Use Case Diagram

![](https://res.cloudinary.com/drqbhj6ft/image/upload/v1734289388/learning-webdev-blog/clinic/Use_Case_uuqas1.png)

### 5. Database Diagram

![](https://res.cloudinary.com/drqbhj6ft/image/upload/v1734277960/learning-webdev-blog/clinic/Database_Diagram_d0shvf.png)

### 5. Run Project

##### 5.1. Link Web Application: https://lamanclinic.vercel.app/

##### 5.2. Run project locally:

1. Clone git

```
git init
git clone https://github.com/kidiezyllex/KLTN_FE.git
```

2. Install packages

```
npm i
```

3. Create ".env.local" file in root folder

```
<!-- Clerk -->
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

<!-- Database -->
DATABASE_URL=

<!-- Api -->
NEXT_PUBLIC_BACKEND_API_URL=

<!-- Uploadthing -->
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

4. Run application

```
npm run dev
```

5. Check for errors

```
npm run build
npm run lint
```
