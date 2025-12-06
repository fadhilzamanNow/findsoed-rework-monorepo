# API Response Changes - S3 Migration

This document shows how API responses have changed after migrating from local file storage to AWS S3.

## 📋 Overview

After the S3 migration, all image URLs in API responses now return **full S3 URLs** instead of just filenames. This makes it easier for frontend applications to display images directly without constructing URLs.

---

## 🔐 Authentication Endpoints

### POST `/auth/register`

**No changes** - Registration endpoint doesn't handle images.

### POST `/auth/login`

#### Before (Local Storage)
```json
{
  "success": true,
  "message": "Login Berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "imageUrl": "1234567890.jpg"
  }
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "message": "Login Berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "imageUrl": "https://findsoed-images.s3.us-east-1.amazonaws.com/profile-images/1234567890-123456789.jpg"
  }
}
```

**Change:** `imageUrl` is now a full S3 URL instead of just a filename.

---

### GET `/auth/find`

#### Before (Local Storage)
```json
{
  "success": true,
  "message": "Berhasil mendapat informasi pengguna",
  "data": {
    "userId": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "imageUrl": "1234567890.jpg"
  }
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "message": "Berhasil mendapat informasi pengguna",
  "data": {
    "userId": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "imageUrl": "https://findsoed-images.s3.us-east-1.amazonaws.com/profile-images/1234567890-123456789.jpg"
  }
}
```

**Change:** `imageUrl` is now a full S3 URL.

---

### PATCH `/auth/editprofile`

#### Before (Local Storage)
```json
{
  "success": true,
  "message": "Foto Profile telah berhasil untuk dirubah",
  "data": {
    "userId": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "imageUrl": "1234567890.jpg"
  }
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "message": "Foto Profile telah berhasil untuk dirubah",
  "data": {
    "userId": "uuid-here",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "imageUrl": "https://findsoed-images.s3.us-east-1.amazonaws.com/profile-images/1234567890-123456789.jpg"
  }
}
```

**Change:** 
- `imageUrl` is now a full S3 URL
- File is uploaded to S3 instead of local disk
- Old profile image is automatically deleted from S3

---

## 📝 Post Endpoints

### GET `/post/`

#### Before (Local Storage)
```json
{
  "success": true,
  "data": [
    {
      "id": "post-uuid",
      "userName": "johndoe",
      "userProfile": "1234567890.jpg",
      "itemName": "Lost Wallet",
      "itemDetail": "Black leather wallet with cards",
      "statusName": "Hilang",
      "categoryName": "Dompet",
      "images": [
        "1234567891.jpg",
        "1234567892.jpg"
      ],
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": null,
      "coordinate": {
        "latitude": -7.5568,
        "longitude": 110.8515
      },
      "commentNum": 5
    }
  ]
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "data": [
    {
      "id": "post-uuid",
      "userName": "johndoe",
      "userProfile": "https://findsoed-images.s3.us-east-1.amazonaws.com/profile-images/1234567890-123456789.jpg",
      "itemName": "Lost Wallet",
      "itemDetail": "Black leather wallet with cards",
      "statusName": "Hilang",
      "categoryName": "Dompet",
      "images": [
        "https://findsoed-images.s3.us-east-1.amazonaws.com/post-images/1234567891-123456789.jpg",
        "https://findsoed-images.s3.us-east-1.amazonaws.com/post-images/1234567892-987654321.jpg"
      ],
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": null,
      "coordinate": {
        "latitude": -7.5568,
        "longitude": 110.8515
      },
      "commentNum": 5
    }
  ]
}
```

**Changes:**
- `userProfile` is now a full S3 URL
- All items in `images` array are now full S3 URLs

---

### GET `/post/detail/:id`

#### Before (Local Storage)
```json
{
  "success": true,
  "message": "Berhasil mendapatkan detail Post",
  "data": {
    "id": "post-uuid",
    "userName": "johndoe",
    "userProfile": "1234567890.jpg",
    "itemName": "Lost Wallet",
    "itemDetail": "Black leather wallet with cards",
    "statusName": "Hilang",
    "itemCategory": "Dompet",
    "images": [
      "1234567891.jpg",
      "1234567892.jpg"
    ],
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": null,
    "coordinate": {
      "latitude": -7.5568,
      "longitude": 110.8515
    },
    "commentNum": 5,
    "itemLostDate": "January 15, 2024 12:00 AM",
    "phoneNumber": "081234567890"
  }
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "message": "Berhasil mendapatkan detail Post",
  "data": {
    "id": "post-uuid",
    "userName": "johndoe",
    "userProfile": "https://findsoed-images.s3.us-east-1.amazonaws.com/profile-images/1234567890-123456789.jpg",
    "itemName": "Lost Wallet",
    "itemDetail": "Black leather wallet with cards",
    "statusName": "Hilang",
    "itemCategory": "Dompet",
    "images": [
      "https://findsoed-images.s3.us-east-1.amazonaws.com/post-images/1234567891-123456789.jpg",
      "https://findsoed-images.s3.us-east-1.amazonaws.com/post-images/1234567892-987654321.jpg"
    ],
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": null,
    "coordinate": {
      "latitude": -7.5568,
      "longitude": 110.8515
    },
    "commentNum": 5,
    "itemLostDate": "January 15, 2024 12:00 AM",
    "phoneNumber": "081234567890"
  }
}
```

**Changes:**
- `userProfile` is now a full S3 URL
- All items in `images` array are now full S3 URLs

---

### POST `/post/create`

#### Before (Local Storage)
```json
{
  "success": true,
  "message": "Barang Hilang telah dibuat",
  "data": {
    "id": "new-post-uuid",
    "name": "Lost Wallet"
  }
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "message": "Barang Hilang telah dibuat",
  "data": {
    "id": "new-post-uuid",
    "name": "Lost Wallet"
  }
}
```

**Note:** Response structure unchanged, but images are now stored in S3 instead of local disk.

**Internal Change:** Database now stores S3 keys like `post-images/1234567890-123456789.jpg` instead of just `1234567890.jpg`.

---

### GET `/post/:searchitem`

Same changes as `GET /post/` - all image URLs are now full S3 URLs.

---

## 💬 Comment Endpoints

### GET `/comment/:id`

#### Before (Local Storage)
```json
{
  "success": true,
  "message": "Berhasil mendapatkan komen dari post",
  "data": [
    {
      "userName": "janedoe",
      "userProfile": "9876543210.jpg",
      "message": "I think I saw this yesterday!",
      "created_at": "Jan 16, 2024 2:30 PM"
    }
  ]
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "message": "Berhasil mendapatkan komen dari post",
  "data": [
    {
      "userName": "janedoe",
      "userProfile": "https://findsoed-images.s3.us-east-1.amazonaws.com/profile-images/9876543210-987654321.jpg",
      "message": "I think I saw this yesterday!",
      "created_at": "Jan 16, 2024 2:30 PM"
    }
  ]
}
```

**Change:** `userProfile` is now a full S3 URL.

---

## 📤 General Upload Endpoint

### POST `/upload`

#### Before (Local Storage)
```json
{
  "success": true,
  "message": "Gambar berhasil untuk dikirim",
  "data": {
    "itemName": "Test Item",
    "files": [
      {
        "id": 0,
        "filename": "1234567890.jpg"
      },
      {
        "id": 1,
        "filename": "1234567891.jpg"
      }
    ]
  }
}
```

#### After (AWS S3)
```json
{
  "success": true,
  "message": "Gambar berhasil untuk dikirim",
  "data": {
    "itemName": "Test Item",
    "files": [
      {
        "id": 0,
        "filename": "uploads/1234567890-123456789.jpg",
        "url": "https://findsoed-images.s3.us-east-1.amazonaws.com/uploads/1234567890-123456789.jpg"
      },
      {
        "id": 1,
        "filename": "uploads/1234567891-987654321.jpg",
        "url": "https://findsoed-images.s3.us-east-1.amazonaws.com/uploads/1234567891-987654321.jpg"
      }
    ]
  }
}
```

**Changes:**
- `filename` now includes folder path (e.g., `uploads/...`)
- Added new `url` field with full S3 URL

---

## 🎨 Frontend Integration Guide

### Before (Local Storage)

```javascript
// Frontend had to construct URLs
const imageUrl = `${API_BASE_URL}/static/${data.imageUrl}`;

// Or use relative paths
<img src={`/static/${data.imageUrl}`} />
```

### After (AWS S3)

```javascript
// URLs are ready to use directly
const imageUrl = data.imageUrl; // Already a full URL

// Direct usage
<img src={data.imageUrl} />
```

### React Example

```jsx
// Before - needed URL construction
function ProfileImage({ user }) {
  return (
    <img 
      src={`http://localhost:3500/static/${user.imageUrl}`} 
      alt={user.username}
    />
  );
}

// After - direct usage
function ProfileImage({ user }) {
  return (
    <img 
      src={user.imageUrl} 
      alt={user.username}
    />
  );
}
```

### Handling Missing Images

```jsx
function UserAvatar({ imageUrl, username }) {
  const defaultAvatar = "https://ui-avatars.com/api/?name=" + username;
  
  return (
    <img 
      src={imageUrl || defaultAvatar}
      alt={username}
      onError={(e) => {
        e.target.src = defaultAvatar;
      }}
    />
  );
}
```

---

## 🔄 Database Changes

### In Database

#### Before (Filename only)
```
postImageUrl: "1234567890.jpg"
imageUrl: "9876543210.jpg"
```

#### After (S3 Key)
```
postImageUrl: "post-images/1234567890-123456789.jpg"
imageUrl: "profile-images/9876543210-987654321.jpg"
```

### In API Response

API automatically converts S3 keys to full URLs using the `getS3Url()` helper function.

---

## 🛠️ Migration Script for Existing Data

If you have existing data with old filenames, you can update them:

```sql
-- Example: Update existing profile images (if you've migrated files)
UPDATE "Profile" 
SET "imageUrl" = 'profile-images/' || "imageUrl"
WHERE "imageUrl" NOT LIKE 'profile-images/%';

-- Example: Update existing post images (if you've migrated files)
UPDATE "PostImages" 
SET "postImageUrl" = 'post-images/' || "postImageUrl"
WHERE "postImageUrl" NOT LIKE 'post-images/%';
```

**Important:** Only run these after migrating actual files to S3!

---

## ✅ Testing Checklist

- [ ] Login returns full S3 URL for profile image
- [ ] User profile fetch returns full S3 URL
- [ ] Post list returns full S3 URLs for all images
- [ ] Post detail returns full S3 URLs
- [ ] Comments return full S3 URLs for user profiles
- [ ] Upload endpoint returns both key and full URL
- [ ] Images are accessible via browser
- [ ] Frontend displays images correctly
- [ ] Missing/null images handled gracefully

---

## 🎯 Key Takeaways

1. **All image URLs are now full S3 URLs** - No need to construct URLs in frontend
2. **Response structure unchanged** - Only URL format changed
3. **Backward compatibility** - API handles both old and new formats internally
4. **Automatic URL conversion** - `getS3Url()` helper converts keys to URLs
5. **Error handling** - Frontend should handle missing images gracefully

---

## 📞 Support

If you encounter issues with API responses:
1. Check if S3 URLs are accessible directly in browser
2. Verify bucket permissions allow public read
3. Ensure CORS is configured for your frontend domain
4. Check API response in network tab of browser DevTools