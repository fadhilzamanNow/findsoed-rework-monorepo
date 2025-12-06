# AWS S3 Migration Guide

This guide explains how to migrate from local file storage (Multer disk storage) to AWS S3 cloud storage.

## 📋 Overview

The application has been migrated from storing files locally on the server to storing them in AWS S3. This provides:

- **Scalability**: No need to worry about server disk space
- **Reliability**: Files are stored redundantly across multiple data centers
- **Performance**: CDN-ready file delivery
- **Cost-Effective**: Pay only for what you use

## 🔧 Changes Made

### Files Created

1. **`src/services/s3Upload.ts`**: Core S3 upload/delete utilities
2. **`src/middleware/upload.ts`**: Multer middleware configured for memory storage
3. **`.env.example`**: Environment variable template

### Files Modified

1. **`src/routes/post.ts`**: Updated to upload post images to S3
2. **`src/routes/auth.ts`**: Updated to upload profile images to S3
3. **`src/index.ts`**: Updated the general upload endpoint

### Key Changes

- Replaced `multer.diskStorage()` with `multer.memoryStorage()`
- Files are now buffered in memory and uploaded directly to S3
- File URLs stored in database now contain S3 keys instead of local filenames
- Added automatic deletion of old profile images when updating

## 🚀 Setup Instructions

### Step 1: Configure AWS S3

1. **Create an AWS Account** (if you don't have one)
   - Go to https://aws.amazon.com/
   - Sign up for a free tier account

2. **Create an S3 Bucket**
   ```bash
   # Using AWS CLI (optional)
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```
   
   Or via AWS Console:
   - Go to S3 Console
   - Click "Create bucket"
   - Choose a unique bucket name (e.g., `findsoed-images`)
   - Select region (e.g., `us-east-1`)
   - **Important**: Uncheck "Block all public access" if you want images publicly accessible
   - Create bucket

3. **Configure Bucket Policy** (for public read access)
   - Go to your bucket → Permissions → Bucket Policy
   - Add this policy (replace `your-bucket-name`):
   
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

4. **Enable CORS** (if accessing from frontend)
   - Go to your bucket → Permissions → CORS
   - Add this configuration:
   
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

### Step 2: Create IAM User and Get Credentials

1. **Go to IAM Console**
   - Navigate to Users → Add users
   - Username: `findsoed-s3-user`
   - Access type: Programmatic access

2. **Attach Permissions**
   - Attach existing policies directly
   - Select `AmazonS3FullAccess` (or create custom policy)

3. **Save Credentials**
   - Download the CSV file with:
     - Access Key ID
     - Secret Access Key
   - **Important**: Keep these secure!

### Step 3: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in your AWS credentials** in `.env`:
   ```env
   DATABASE_URL="your-existing-database-url"
   JWT_SECRET="your-existing-jwt-secret"

   # AWS S3 Configuration
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
   AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
   AWS_S3_BUCKET_NAME="findsoed-images"
   ```

### Step 4: Install Dependencies (Already Installed)

The necessary package is already in your `package.json`:
```json
"@aws-sdk/client-s3": "^3.899.0"
```

If you need to reinstall:
```bash
npm install
```

### Step 5: Test the Migration

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Test file upload**:
   ```bash
   # Using curl
   curl -X POST http://localhost:3500/upload \
     -F "images=@/path/to/image1.jpg" \
     -F "images=@/path/to/image2.jpg" \
     -F "itemName=Test Item"
   ```

3. **Check S3 Bucket**:
   - Go to AWS S3 Console
   - Open your bucket
   - You should see uploaded files in folders like:
     - `uploads/`
     - `post-images/`
     - `profile-images/`

## 📁 Folder Structure in S3

```
your-bucket-name/
├── uploads/                    # General uploads
│   └── 1234567890-123456789.jpg
├── post-images/               # Post item images
│   ├── 1234567890-123456789.jpg
│   └── 1234567890-987654321.jpg
└── profile-images/            # User profile images
    └── 1234567890-123456789.jpg
```

## 🔄 Migration of Existing Files

If you have existing files in `uploads/` or `src/public/images/`, you need to migrate them:

### Option 1: Manual Upload via AWS Console
1. Go to S3 Console
2. Open your bucket
3. Upload files manually to appropriate folders

### Option 2: AWS CLI Sync
```bash
# Sync uploads folder
aws s3 sync ./uploads s3://your-bucket-name/uploads/

# Sync public images
aws s3 sync ./src/public/images s3://your-bucket-name/post-images/
```

### Option 3: Migration Script (Create if needed)
```typescript
// migrate-to-s3.ts
import { readdir } from 'fs/promises';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFile } from 'fs/promises';

async function migrateFiles() {
  // Implementation to upload all local files to S3
}
```

## 🔐 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use IAM roles** if running on AWS (EC2, Lambda, etc.)
3. **Implement least privilege** - create custom IAM policy instead of full access
4. **Enable bucket versioning** for backup
5. **Set up lifecycle policies** to manage old files
6. **Consider using presigned URLs** for private files

### Example Custom IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

## 📊 Database Changes

**Important**: The database schema doesn't need changes, but the values stored will be different:

### Before (Local Storage)
```
postImageUrl: "1234567890.jpg"
imageUrl: "1234567890.jpg"
```

### After (S3 Storage)
```
postImageUrl: "post-images/1234567890-123456789.jpg"
imageUrl: "profile-images/1234567890-123456789.jpg"
```

### Displaying Images in Frontend

When fetching from API, construct full URLs:

```typescript
// Option 1: Store full URL in database
const fullUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;

// Option 2: Use CloudFront (recommended for production)
const cloudFrontUrl = `https://d1234567890.cloudfront.net/${fileKey}`;

// Option 3: Use helper function (already provided)
import { getS3Url } from './services/s3Upload';
const url = getS3Url(fileKey);
```

## 🚨 Troubleshooting

### Error: "Missing credentials in config"
- Check if AWS credentials are set in `.env`
- Verify environment variables are loaded (`dotenv/config`)

### Error: "Access Denied"
- Check IAM user permissions
- Verify bucket policy allows operations

### Error: "No such bucket"
- Verify bucket name in `.env` is correct
- Check if bucket exists in specified region

### Images not loading in browser
- Check bucket policy allows public read
- Verify CORS configuration
- Use full S3 URL: `https://bucket-name.s3.region.amazonaws.com/key`

### File upload fails
- Check file size limits (current: 5MB)
- Verify file type is allowed (JPEG, PNG, GIF, WebP)
- Check S3 bucket permissions

## 💰 Cost Estimation

AWS S3 Free Tier (first 12 months):
- 5GB of storage
- 20,000 GET requests
- 2,000 PUT requests

After free tier:
- ~$0.023 per GB per month (storage)
- ~$0.0004 per 1,000 GET requests
- ~$0.005 per 1,000 PUT requests

Example monthly cost for moderate usage:
- 10GB storage: ~$0.23
- 100,000 image views: ~$0.04
- 5,000 uploads: ~$0.025
- **Total: ~$0.30/month**

## 🎯 Next Steps

1. **Set up CloudFront CDN** for faster global delivery
2. **Implement image optimization** before upload (resize, compress)
3. **Add image processing** with AWS Lambda
4. **Set up S3 lifecycle rules** to archive old files
5. **Enable S3 Transfer Acceleration** for faster uploads
6. **Add progress tracking** for large file uploads

## 📚 Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/best-practices.html)

## ✅ Checklist

- [ ] AWS account created
- [ ] S3 bucket created
- [ ] IAM user created with credentials
- [ ] Environment variables configured
- [ ] Bucket policy set for public access
- [ ] CORS configuration added
- [ ] Test upload successful
- [ ] Existing files migrated (if any)
- [ ] Frontend updated to use S3 URLs
- [ ] Old local storage cleaned up

## 🤝 Support

If you encounter issues during migration, check:
1. AWS CloudWatch logs for S3 access
2. Application console logs
3. Network tab in browser dev tools
4. S3 bucket permissions and policies