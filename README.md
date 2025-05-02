# 📝 Next.js Fullstack Blog with Likes & Image Upload

This is a full-stack blog app built using **Next.js (App Router)**, featuring:

- ✅ Post creation with title, content, and image upload (via Cloudinary)
- ❤️ Like/unlike functionality with SQLite-backed tracking
- ⚡ Optimistic UI for instant feedback on likes
- 🧠 Server actions for clean server-side logic
- 🗃️ SQLite as lightweight database with `better-sqlite3`
- 🔁 Revalidation of UI using `revalidatePath`

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (`better-sqlite3`)
- **Cloud Storage**: Cloudinary (for image uploads)
- **Styling**: CSS Modules or Tailwind (customizable)
- **State Management**: React `useOptimistic` hook

---

## 🚀 Features

### 1. Create a Post  
Users can create posts with:
- Title  
- Image  
- Content  

Form submission validates input and uploads the image to **Cloudinary**.

### 2. Like / Unlike Posts  
- Each post shows total likes  
- Clicking the ❤️ icon toggles like state for a user  
- Optimistic UI ensures smooth UX

### 3. SQLite Tables  
- `users`  
- `posts`  
- `likes` (many-to-many relationship)  
Auto-seeded with sample users.

---

## 📁 Project Structure
















![Screenshot 2025-05-02 095732](https://github.com/user-attachments/assets/7e4787fa-41a9-40ae-b95c-aa3bf8f2a2c3)
![Screenshot 2025-05-02 105427](https://github.com/user-attachments/assets/4eb5a431-e981-4a14-8b73-61c7119e366c)
![Screenshot 2025-05-02 105437](https://github.com/user-attachments/assets/80a499b5-1300-4ace-a6e4-11c9ae585277)
![Screenshot 2025-05-02 105505](https://github.com/user-attachments/assets/2d7eadde-11d4-4032-858f-c1d44368554e)
