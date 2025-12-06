"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
require("dotenv/config");
/**
 * Test script to verify AWS S3 connection and credentials
 * Run with: npx ts-node test-s3-connection.ts
 */
function testS3Connection() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("🔍 Testing AWS S3 Connection...\n");
        // Check environment variables
        console.log("📋 Checking environment variables:");
        const requiredEnvVars = [
            "AWS_REGION",
            "AWS_ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY",
            "AWS_S3_BUCKET_NAME",
        ];
        let missingVars = false;
        for (const varName of requiredEnvVars) {
            const value = process.env[varName];
            if (!value) {
                console.log(`   ❌ ${varName}: NOT SET`);
                missingVars = true;
            }
            else {
                // Mask sensitive data
                const displayValue = varName.includes("KEY") || varName.includes("SECRET")
                    ? value.substring(0, 4) + "****"
                    : value;
                console.log(`   ✅ ${varName}: ${displayValue}`);
            }
        }
        if (missingVars) {
            console.error("\n❌ Missing required environment variables. Please check your .env file.");
            process.exit(1);
        }
        console.log("\n");
        // Initialize S3 Client
        const s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        try {
            // Test 1: List Buckets
            console.log("🧪 Test 1: Listing S3 buckets...");
            const listBucketsCommand = new client_s3_1.ListBucketsCommand({});
            const bucketList = yield s3Client.send(listBucketsCommand);
            if (bucketList.Buckets && bucketList.Buckets.length > 0) {
                console.log(`   ✅ Found ${bucketList.Buckets.length} bucket(s):`);
                bucketList.Buckets.forEach((bucket) => {
                    const isTargetBucket = bucket.Name === process.env.AWS_S3_BUCKET_NAME;
                    console.log(`      ${isTargetBucket ? "👉" : "  "} ${bucket.Name}${isTargetBucket ? " (Target)" : ""}`);
                });
            }
            else {
                console.log("   ⚠️  No buckets found in your AWS account");
            }
            // Test 2: Check if target bucket exists
            console.log("\n🧪 Test 2: Checking target bucket...");
            const targetBucket = process.env.AWS_S3_BUCKET_NAME;
            const bucketExists = (_a = bucketList.Buckets) === null || _a === void 0 ? void 0 : _a.some((b) => b.Name === targetBucket);
            if (bucketExists) {
                console.log(`   ✅ Bucket "${targetBucket}" exists`);
            }
            else {
                console.log(`   ❌ Bucket "${targetBucket}" NOT FOUND. Please create it first.`);
                process.exit(1);
            }
            // Test 3: Upload test file
            console.log("\n🧪 Test 3: Uploading test file...");
            const testFileName = `test/connection-test-${Date.now()}.txt`;
            const testContent = `S3 Connection Test - ${new Date().toISOString()}`;
            const uploadCommand = new client_s3_1.PutObjectCommand({
                Bucket: targetBucket,
                Key: testFileName,
                Body: Buffer.from(testContent),
                ContentType: "text/plain",
            });
            yield s3Client.send(uploadCommand);
            console.log(`   ✅ Successfully uploaded test file: ${testFileName}`);
            // Generate URL
            const fileUrl = `https://${targetBucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${testFileName}`;
            console.log(`   🔗 File URL: ${fileUrl}`);
            console.log("\n✅ All tests passed! Your S3 configuration is working correctly.");
            console.log("\n📝 Next steps:");
            console.log("   1. Configure bucket policy for public access (if needed)");
            console.log("   2. Set up CORS configuration");
            console.log("   3. Start your server with: npm run dev");
            console.log("   4. Clean up test files from S3 bucket");
        }
        catch (error) {
            console.error("\n❌ Error during S3 connection test:");
            if (error.name === "InvalidAccessKeyId") {
                console.error("   - Invalid AWS Access Key ID");
                console.error("   - Check your AWS_ACCESS_KEY_ID in .env file");
            }
            else if (error.name === "SignatureDoesNotMatch") {
                console.error("   - Invalid AWS Secret Access Key");
                console.error("   - Check your AWS_SECRET_ACCESS_KEY in .env file");
            }
            else if (error.name === "AccessDenied") {
                console.error("   - Access denied to S3 resources");
                console.error("   - Check IAM user permissions");
            }
            else if (error.name === "NoSuchBucket") {
                console.error(`   - Bucket "${process.env.AWS_S3_BUCKET_NAME}" does not exist`);
                console.error("   - Create the bucket or check the bucket name");
            }
            else {
                console.error(`   - ${error.name}: ${error.message}`);
            }
            console.error("\n💡 Troubleshooting tips:");
            console.error("   1. Verify credentials in AWS IAM Console");
            console.error("   2. Ensure IAM user has S3 permissions");
            console.error("   3. Check if bucket name and region are correct");
            console.error("   4. Review .env file for typos");
            process.exit(1);
        }
    });
}
// Run the test
testS3Connection();
