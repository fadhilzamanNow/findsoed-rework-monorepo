# Quick Start Guide: AWS S3 Migration

This is a **quick reference** guide to get your app running with AWS S3. For detailed information, see `S3_MIGRATION_GUIDE.md`.

## 🚀 Quick Setup (5 Minutes)

### 1. Create AWS S3 Bucket

```bash
# Option A: AWS Console (Recommended for beginners)
1. Go to https://s3.console.aws.amazon.com/
2. Click "Create bucket"
3. Bucket name: findsoed-images (or your choice)
4. Region: us-east-1 (or closest to you)
5. Uncheck "Block all public access"
6. Click "Create bucket"

# Option B: AWS CLI (for advanced users)
aws s3 mb s3://findsoed-images --region us-east-1
```

### 2. Configure Bucket for Public Access

In AWS S3 Console → Your Bucket → Permissions:

**Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::findsoed-images/*"
    }
  ]
}
```

**CORS Configuration:**
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

### 3. Create IAM User

```bash
1. Go to IAM Console → Users → Add users
2. Username: findsoed-s3-user
3. Access type: Programmatic access
4. Permissions: Attach "AmazonS3FullAccess" policy
5. Save Access Key ID and Secret Access Key
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
# Database (keep your existing value)
DATABASE_URL="postgresql://user:password@localhost:5432/findsoed"

# JWT (keep your existing value)
JWT_SECRET="your-existing-secret"

# AWS S3 (ADD THESE)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_S3_BUCKET_NAME="findsoed-images"

# Geoapify (keep your existing value)
GEOAPIFY_SECRET="your-existing-key"
```

### 5. Test Connection

```bash
npx ts-node test-s3-connection.ts
```

If successful, you'll see:
```
✅ All tests passed! Your S3 configuration is working correctly.
```

### 6. Start Your Server

```bash
npm run dev
```

## 📝 What Changed?

### Before (Local Storage)
- Files saved to: `uploads/` and `src/public/images/`
- File URL: `1234567890.jpg`
- Limited by server disk space

### After (AWS S3)
- Files saved to: AWS S3 cloud storage
- File URL: `https://findsoed-images.s3.us-east-1.amazonaws.com/post-images/1234567890.jpg`
- Unlimited scalable storage

## 🧪 Test Endpoints

### Test General Upload
```bash
curl -X POST http://localhost:3500/upload \
  -F "images=@/path/to/test-image.jpg" \
  -F "itemName=Test Item"
```

### Test Profile Upload (with auth)
```bash
curl -X PATCH http://localhost:3500/auth/editprofile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePhoto=@/path/to/profile.jpg"
```

### Test Post Creation (with auth)
```bash
curl -X POST http://localhost:3500/post/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "postImage=@/path/to/image1.jpg" \
  -F "postImage=@/path/to/image2.jpg" \
  -F "itemName=Lost Wallet" \
  -F "itemDetail=Black leather wallet" \
  -F "itemCategory=Dompet" \
  -F "itemLatitude=-7.5568" \
  -F "itemLongitude=110.8515" \
  -F "locationName=Purwokerto" \
  -F "itemLostDate=2024-01-15"
```

## 📂 S3 Folder Structure

```
findsoed-images/
├── uploads/              # General uploads from /upload endpoint
├── post-images/         # Lost item images
├── profile-images/      # User profile pictures
└── test/               # Test files (delete after testing)
```

## 🔧 Code Changes Summary

### New Files
- ✅ `src/services/s3Upload.ts` - S3 upload/delete utilities
- ✅ `src/middleware/upload.ts` - Multer memory storage config
- ✅ `test-s3-connection.ts` - Connection test script

### Modified Files
- ✅ `src/routes/post.ts` - Posts now upload to S3
- ✅ `src/routes/auth.ts` - Profile images now upload to S3
- ✅ `src/index.ts` - General upload endpoint uses S3
- ✅ `src/routes/comment.ts` - Returns full S3 URLs

### No Changes Needed
- ✅ Database schema (Prisma)
- ✅ `src/routes/location.ts`
- ✅ API endpoints structure

## 🚨 Common Issues

### "Missing credentials in config"
```bash
# Check .env file exists and has correct values
cat .env | grep AWS
```

### "AccessDenied" Error
- Verify IAM user has S3 permissions
- Check bucket policy allows operations

### "No such bucket" Error
- Verify bucket name in `.env` matches actual bucket
- Check bucket exists in correct region

### Images not loading in frontend
- Check bucket has public read policy
- Verify CORS configuration
- Test URL directly: `https://BUCKET.s3.REGION.amazonaws.com/KEY`

## 💾 Migrating Existing Files

If you have existing files in local storage:

```bash
# Sync uploads folder to S3
aws s3 sync ./uploads s3://findsoed-images/uploads/

# Sync profile images
aws s3 sync ./src/public/images s3://findsoed-images/profile-images/
```

**Note:** You'll need to update database records to use S3 keys instead of filenames.

## 💰 Cost Estimate

For a small to medium app:
- **Storage:** 10GB = ~$0.23/month
- **Requests:** 100K views + 5K uploads = ~$0.07/month
- **Total:** ~$0.30/month

AWS Free Tier (first 12 months):
- 5GB storage
- 20,000 GET requests
- 2,000 PUT requests

## ✅ Launch Checklist

- [ ] AWS account created
- [ ] S3 bucket created and configured
- [ ] IAM user created with credentials
- [ ] `.env` file configured with AWS credentials
- [ ] Connection test passed (`npx ts-node test-s3-connection.ts`)
- [ ] Server starts without errors
- [ ] Upload endpoint tested successfully
- [ ] Images accessible via browser
- [ ] Frontend updated to handle S3 URLs
- [ ] Old local files backed up

## 🎯 Production Checklist

Before deploying to production:

- [ ] Use IAM roles instead of access keys (if on AWS)
- [ ] Enable bucket versioning for backup
- [ ] Set up S3 lifecycle policies
- [ ] Configure CloudFront CDN (optional but recommended)
- [ ] Enable S3 access logging
- [ ] Set up monitoring/alerts
- [ ] Review and restrict bucket policy if needed
- [ ] Clean up test files

## 📚 Useful Commands

```bash
# Test S3 connection
npx ts-node test-s3-connection.ts

# List files in bucket
aws s3 ls s3://findsoed-images/ --recursive

# Download file from S3
aws s3 cp s3://findsoed-images/test/file.jpg ./downloaded.jpg

# Delete test files
aws s3 rm s3://findsoed-images/test/ --recursive

# Check bucket size
aws s3 ls s3://findsoed-images --recursive --summarize --human-readable
```

## 🆘 Need Help?

1. **Check detailed guide:** `S3_MIGRATION_GUIDE.md`
2. **AWS Documentation:** https://docs.aws.amazon.com/s3/
3. **Test connection:** Run `npx ts-node test-s3-connection.ts`
4. **Check AWS Console:** Verify bucket exists and has correct permissions
5. **Review logs:** Check server console for error messages

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ Test script passes all checks
2. ✅ Server starts without S3-related errors
3. ✅ Upload endpoint returns S3 URLs
4. ✅ Images are visible in S3 bucket
5. ✅ Image URLs work in browser
6. ✅ Frontend can display uploaded images

---

**Ready to go?** Run the test script and start uploading! 🚀

```bash
npx ts-node test-s3-connection.ts && npm run dev
```
