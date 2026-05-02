# How to Get Your Complete Cloudant URL

## The Problem
You currently have: `https://581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud`

But you need: `https://apikey-v2-XXXXX:YYYYY@581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud`

The authentication part (`apikey-v2-XXXXX:YYYYY@`) is missing!

## Step-by-Step Instructions

### Option 1: Get from Service Credentials (Recommended)

1. **Go to IBM Cloud Console**: https://cloud.ibm.com/resources

2. **Find your Cloudant service**:
   - Look for "Cloudant" in your resource list
   - Click on the service name

3. **Open Service Credentials**:
   - In the left sidebar, click **"Service credentials"**

4. **View or Create Credentials**:
   - If you see existing credentials, click the **dropdown arrow** (▼) next to the credential name
   - If no credentials exist:
     - Click **"New credential"** button
     - Name: `legal-review-credentials`
     - Role: **Manager**
     - Click **Add**
     - Then click the dropdown arrow to expand

5. **Copy the Complete JSON**:
   You should see something like this:
   ```json
   {
     "apikey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "host": "581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud",
     "iam_apikey_description": "Auto-generated for key...",
     "iam_apikey_name": "legal-review-credentials",
     "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
     "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::...",
     "url": "https://apikey-v2-LONG_STRING_HERE:ANOTHER_LONG_STRING@581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud",
     "username": "apikey-v2-LONG_STRING_HERE"
   }
   ```

6. **Copy ONLY the "url" field value**:
   - Find the line that starts with `"url":`
   - Copy everything between the quotes after `"url": "`
   - It should be a LONG string that includes `apikey-v2-` at the beginning

### Option 2: Build URL from API Key

If you can't find the "url" field, you can build it manually:

1. **Get your API key**:
   - From the credentials JSON, copy the value of `"apikey"`
   - Example: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **Build the URL**:
   ```
   https://apikey-v2-YOUR_INSTANCE_ID:YOUR_API_KEY@581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud
   ```

   Replace:
   - `YOUR_INSTANCE_ID`: This is in the "username" field (the part after `apikey-v2-`)
   - `YOUR_API_KEY`: The value from the "apikey" field

## What to Do Next

Once you have the complete URL (with `apikey-v2-` at the start):

1. **Update your .env file**:
   ```bash
   cd backend
   nano .env  # or use your preferred editor
   ```

2. **Replace the CLOUDANT_URL line**:
   ```env
   CLOUDANT_URL=https://apikey-v2-XXXXX:YYYYY@581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud
   ```

3. **Save the file**

4. **Verify credentials**:
   ```bash
   node verify-credentials.js
   ```

## Common Mistakes

❌ **Wrong**: Just the endpoint
```
https://581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud
```

✅ **Correct**: Full URL with authentication
```
https://apikey-v2-5abc123def456:xyz789abc123def456xyz789abc123def456xyz789abc123@581ba874-7fbb-4347-b66e-032a0f67405e-bluemix.cloudantnosqldb.appdomain.cloud
```

Notice the difference:
- ✅ Has `apikey-v2-` at the beginning
- ✅ Has `:` separating two long strings
- ✅ Has `@` before the domain name

## Need Help?

If you're still having trouble:

1. Take a screenshot of your Cloudant service credentials page (with sensitive data visible)
2. Look for the "url" field in the JSON
3. Copy the ENTIRE value (it will be very long)
4. Paste it into your .env file

The URL should be approximately 150-200 characters long!