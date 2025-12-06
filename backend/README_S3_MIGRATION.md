# 🚀 AWS S3 Migration - Complete Guide

Your **FindSoed** lost and found app has been successfully migrated from local file storage to AWS S3 cloud storage!

---

## 📋 Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[QUICK_START_S3.md](QUICK_START_S3.md)** | 5-minute setup guide | Start here! Get running fast |
| **[S3_MIGRATION_GUIDE.md](S3_MIGRATION_GUIDE.md)** | Comprehensive guide | Detailed setup & troubleshooting |
| **[API_CHANGES.md](API_CHANGES.md)** | API response changes | Frontend integration |
| **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** | What changed | Overview of all changes |

---

## ⚡ Quick Start (3 Steps)

### 1. Configure AWS Credentials

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your AWS credentials
nano .env
```

Required variables:
```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="your-bucket-name"
```

### 2. Test Connection

```bash
npx ts-node test-s3-connection.ts
```

Expected output:
```
✅ All tests passed! Your S3 configuration is working correctly.
```

### 3. Start Your Server

```bash
npm run dev
```

---

## 🎯 What's New?

### ✨ Features

- ✅ **Cloud Storage**: Files stored in AWS S3 instead of local disk
- ✅ **Unlimited Scale**: No more disk space limits
- ✅ **High Availability**: 99.999999999% durability
- ✅ **Full URLs**: API returns ready-to-use image URLs
- ✅ **Auto Cleanup**: Old profile images automatically deleted
- ✅ **Type Safety**: Full TypeScript support

### 📦 New Files

```
src/
├── services/
│   └── s3Upload.ts          # S3 upload/delete utilities
├── middleware/
│   └── upload.ts            # Multer memory storage config
└── ...

test-s3-connection.ts        # Connection test script
.env.example                 # Environment template
```

### 🔄 Modified Routes

- **`/auth/editprofile`** - Profile images → S3
- **`/post/create`** - Post images → S3  
- **`/upload`** - General uploads → S3
- All GET endpoints now return full S3 URLs

---

## 📸 Image URL Changes

### Before (Local Storage)
```javascript
{
  "userProfile": "1234567890.jpg",
  "images": ["img1.jpg", "img2.jpg"]
}
```

### After (AWS S3)
```javascript
{
  "userProfile": "https://bucket.s3.region.amazonaws.com/profile-images/1234567890.jpg",
  "images": [
    "https://bucket.s3.region.amazonaws.com/post-images/img1.jpg",
    "https://bucket.s3.region.amazonaws.com/post-images/img2.jpg"
  ]
}
```

**Frontend Change**: URLs are now ready to use directly!

```jsx
// Before - needed URL construction
<img src={`${API_URL}/static/${user.imageUrl}`} />

// After - direct usage
<img src={user.imageUrl} />
```

---

## 🗂️ S3 Folder Structure

```
your-s3-bucket/
├── uploads/              # General uploads (/upload endpoint)
├── post-images/         # Lost item photos (/post/create)
└── profile-images/      # User avatars (/auth/editprofile)
```

---

## 🔧 AWS Setup Required

### Prerequisites

1. **AWS Account** - [Sign up here](https://aws.amazon.com/)
2. **S3 Bucket** - Create in AWS Console
3. **IAM User** - For programmatic access
4. **Credentials** - Access Key ID + Secret Access Key

### Setup Steps

1. **Create S3 Bucket**
   - Name: `findsoed-images` (or your choice)
   - Region: `us-east-1` (or closest to you)
   - Uncheck "Block all public access"

2. **Configure Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::findsoed-images/*"
     }]
   }
   ```

3. **Enable CORS**
   ```json
   [{
     "AllowedHeaders": ["*"],
     "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
     "AllowedOrigins": ["*"],
     "ExposeHeaders": []
   }]
   ```

4. **Create IAM User**
   - Username: `findsoed-s3-user`
   - Access type: Programmatic
   - Permission: `AmazonS3FullAccess`
   - Save credentials!

5. **Add to `.env`**
   ```env
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
   AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/..."
   AWS_S3_BUCKET_NAME="findsoed-images"
   ```

---

## 🧪 Testing

### Test S3 Connection
```bash
npx ts-node test-s3-connection.ts
```

### Test Upload Endpoints

**General Upload:**
```bash
curl -X POST http://localhost:3500/upload \
  -F "images=@./test.jpg" \
  -F "itemName=Test"
```

**Profile Upload (requires auth):**
```bash
curl -X PATCH http://localhost:3500/auth/editprofile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profilePhoto=@./profile.jpg"
```

**Post Creation (requires auth):**
```bash
curl -X POST http://localhost:3500/post/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "postImage=@./item1.jpg" \
  -F "postImage=@./item2.jpg" \
  -F "itemName=Lost Wallet" \
  -F "itemDetail=Black leather" \
  -F "itemCategory=Dompet" \
  -F "itemLatitude=-7.5568" \
  -F "itemLongitude=110.8515" \
  -F "locationName=Purwokerto" \
  -F "itemLostDate=2024-01-15"
```

---

## 🚨 Troubleshooting

### Common Issues

| Error | Solution |
|-------|----------|
| **Missing credentials** | Check `.env` has all AWS variables |
| **AccessDenied** | Verify IAM user has S3 permissions |
| **No such bucket** | Check bucket name in `.env` |
| **Images not loading** | Check bucket policy allows public read |
| **CORS error** | Add CORS configuration to bucket |

### Debug Steps

1. **Check environment variables:**
   ```bash
   cat .env | grep AWS
   ```

2. **Test S3 connection:**
   ```bash
   npx ts-node test-s3-connection.ts
   ```

3. **Check server logs:**
   ```bash
   npm run dev
   # Look for S3-related errors
   ```

4. **Test URL directly:**
   ```
   https://your-bucket.s3.region.amazonaws.com/test/file.jpg
   ```

---

## 💰 Cost Estimate

### AWS Free Tier (First 12 months)
- ✅ 5GB storage
- ✅ 20,000 GET requests
- ✅ 2,000 PUT requests

### After Free Tier
- Storage: ~$0.023/GB/month
- Moderate usage: **~$0.30/month**

**Example:**
- 10GB images = $0.23
- 100K views = $0.04
- 5K uploads = $0.025
- **Total = ~$0.30/month**

---

## 📚 Full Documentation

- **[QUICK_START_S3.md](QUICK_START_S3.md)** - Get started in 5 minutes
- **[S3_MIGRATION_GUIDE.md](S3_MIGRATION_GUIDE.md)** - Complete setup guide
- **[API_CHANGES.md](API_CHANGES.md)** - API response changes
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Technical summary

---

## ✅ Deployment Checklist

### Development
- [ ] AWS credentials configured in `.env`
- [ ] Test script passes
- [ ] Server starts without errors
- [ ] Upload endpoints tested
- [ ] Images accessible via browser

### Production
- [ ] Environment variables set on server
- [ ] Bucket policy configured
- [ ] CORS configured
- [ ] CloudFront CDN (optional)
- [ ] Monitoring enabled
- [ ] Backups configured

---

## 🎓 Learn More

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/best-practices.html)
- [Multer Documentation](https://github.com/expressjs/multer)

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` to version control
2. ✅ Use IAM roles on AWS (EC2, Lambda)
3. ✅ Implement least privilege access
4. ✅ Enable bucket versioning
5. ✅ Set up lifecycle policies
6. ✅ Monitor access logs
7. ✅ Use presigned URLs for private files

---

## 🚀 Next Steps

### Immediate
1. Read **[QUICK_START_S3.md](QUICK_START_S3.md)**
2. Set up AWS S3 bucket
3. Add credentials to `.env`
4. Run test script
5. Start server and test uploads

### Optional Enhancements
- Set up CloudFront CDN for faster delivery
- Implement image optimization/resizing
- Add image processing with AWS Lambda
- Enable S3 Transfer Acceleration
- Set up lifecycle rules for old files

---

## 🤝 Support

Having issues? Check these resources:

1. **Test Connection**: `npx ts-node test-s3-connection.ts`
2. **Check Logs**: Look at server console output
3. **AWS Console**: Verify bucket exists and has correct permissions
4. **Documentation**: See detailed guides in docs folder
5. **AWS Support**: Check AWS service health dashboard

---

## 📝 Summary

Your FindSoed app now uses AWS S3 for all file storage:

- ✅ **Scalable** - No disk space limits
- ✅ **Reliable** - 11 9's durability
- ✅ **Fast** - CDN-ready delivery
- ✅ **Affordable** - ~$0.30/month
- ✅ **Simple** - API returns full URLs

**Ready to go?** Start with **[QUICK_START_S3.md](QUICK_START_S3.md)** →

---

**Status**: ✅ Migration Complete | 🎯 Ready for AWS Configuration

**Version**: 1.0.0 | **Last Updated**: 2024