# Feature Request System Setup Guide

This guide walks you through setting up the Feature Request system, including Slack notifications, GitHub automation, and Supabase database.

---

## Table of Contents

1. [Database Setup (Supabase)](#1-database-setup-supabase)
2. [Slack App Setup](#2-slack-app-setup)
3. [GitHub Secrets Setup](#3-github-secrets-setup)
4. [Environment Variables](#4-environment-variables)
5. [Testing the System](#5-testing-the-system)
6. [How It Works](#6-how-it-works)

---

## 1. Database Setup (Supabase)

### Step 1: Open Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your NoReply project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration

1. Open the file `scripts/005_create_feature_requests.sql` from this repo
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** (or press Cmd+Enter)

### Step 3: Verify Tables Created

In the left sidebar, click **Table Editor** and verify you see:
- `feature_requests` table
- `feature_request_votes` table

---

## 2. Slack App Setup

### Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App**
3. Choose **From scratch**
4. Enter:
   - **App Name:** `NoReply Feature Requests`
   - **Workspace:** Select your workspace
5. Click **Create App**

### Step 2: Enable Incoming Webhooks

1. In your app settings, click **Incoming Webhooks** in the left sidebar
2. Toggle **Activate Incoming Webhooks** to **On**
3. Click **Add New Webhook to Workspace**
4. Select the channel where you want feature requests to be posted (e.g., `#feature-requests` or `#product`)
5. Click **Allow**
6. Copy the **Webhook URL** - it looks like:
   ```
   https://hooks.slack.com/services/TXXXXX/BXXXXX/your-webhook-token
   ```
7. Save this - you'll need it for `SLACK_WEBHOOK_URL`

### Step 3: Get the Signing Secret

1. In the left sidebar, click **Basic Information**
2. Scroll down to **App Credentials**
3. Find **Signing Secret** and click **Show**
4. Copy this value - you'll need it for `SLACK_SIGNING_SECRET`

### Step 4: Enable Interactivity (for Approve/Reject buttons)

1. In the left sidebar, click **Interactivity & Shortcuts**
2. Toggle **Interactivity** to **On**
3. In the **Request URL** field, enter:
   ```
   https://YOUR-DOMAIN.com/api/webhooks/slack
   ```
   Replace `YOUR-DOMAIN.com` with your actual domain (e.g., `usenoreply.com`)

   > **Note:** For local development, you'll need a tunnel like [ngrok](https://ngrok.com):
   > ```bash
   > ngrok http 3000
   > ```
   > Then use the ngrok URL: `https://abc123.ngrok.io/api/webhooks/slack`

4. Click **Save Changes**

### Step 5: (Optional) Customize App Appearance

1. In the left sidebar, click **Basic Information**
2. Scroll to **Display Information**
3. Add an app icon and description if desired

### Step 6: Install App to Workspace

If not already installed:
1. In the left sidebar, click **Install App**
2. Click **Install to Workspace**
3. Click **Allow**

---

## 3. GitHub Secrets Setup

GitHub Secrets are needed for the automated feature building workflow.

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Required Secrets

Click **New repository secret** for each of the following:

#### Secret 1: `ANTHROPIC_API_KEY`

- **Name:** `ANTHROPIC_API_KEY`
- **Value:** Your Anthropic API key (starts with `sk-ant-`)
- This is used by Claude Code Action to implement features

#### Secret 2: `SLACK_WEBHOOK_URL`

- **Name:** `SLACK_WEBHOOK_URL`
- **Value:** The webhook URL from Step 2.2 above
- This is used to post PR notifications back to Slack

### Step 3: Verify Secrets

After adding, you should see both secrets listed (values will be hidden):
- `ANTHROPIC_API_KEY` - Updated just now
- `SLACK_WEBHOOK_URL` - Updated just now

---

## 4. Environment Variables

Add these to your `.env.local` file (create from `.env.example` if needed):

```bash
# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/TXXXXX/BXXXXX/your-webhook-token
SLACK_SIGNING_SECRET=your_signing_secret_from_slack

# GitHub Integration (for triggering builds from the app)
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_OWNER=heyimjames
GITHUB_REPO=fightback
```

### Getting a GitHub Personal Access Token

If you want the app to trigger GitHub Actions directly:

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Enter a note: `NoReply Feature Requests`
4. Select scopes:
   - `repo` (full control of private repositories)
   - `workflow` (update GitHub Action workflows)
5. Click **Generate token**
6. Copy the token immediately (it won't be shown again)
7. Add it to your `.env.local` as `GITHUB_TOKEN`

---

## 5. Testing the System

### Test 1: Submit a Feature Request

1. Start your dev server: `pnpm dev`
2. Go to `/roadmap`
3. Log in if not already
4. Submit a test feature request: "Add dark mode toggle to the dashboard"
5. You should see:
   - Loading state while AI processes
   - Success message when submitted
   - The request appears in the list (after page refresh)

### Test 2: Check Slack Notification

After submitting, check your Slack channel. You should see a message with:
- Feature title and description
- Category and priority badges
- User problem and proposed solution
- **Approve** and **Reject** buttons

### Test 3: Test Approve Flow

1. Click **Approve & Build** in Slack
2. The message should update to show "Approved by [your name]"
3. Check GitHub Actions - a new workflow run should start
4. When complete, a PR will be created and linked in Slack

### Test 4: Test Voting

1. Go to `/roadmap`
2. Click the upvote button on a feature request
3. The count should increment
4. Click again to remove your vote

---

## 6. How It Works

### Flow Diagram

```
User submits feature request
         │
         ▼
┌─────────────────────────────┐
│  AI Processing (Claude)     │
│  - Formats into mini-PRD    │
│  - Extracts title/desc      │
│  - Classifies category      │
│  - Checks relevance         │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Save to Supabase           │
│  - status: pending_review   │
│  - Auto-vote for submitter  │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Send to Slack              │
│  - Rich message with PRD    │
│  - Approve/Reject buttons   │
└─────────────────────────────┘
         │
         ▼
    [You review in Slack]
         │
    ┌────┴────┐
    │         │
 Approve   Reject
    │         │
    ▼         ▼
┌────────┐  ┌──────────────┐
│ Trigger│  │ Update status│
│ GitHub │  │ to rejected  │
│ Action │  └──────────────┘
└────────┘
    │
    ▼
┌─────────────────────────────┐
│  Claude Code builds feature │
│  - Reads acceptance criteria│
│  - Implements the feature   │
│  - Runs lint/type checks    │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Create Pull Request        │
│  - Auto-generated PR body   │
│  - Labels: feature-request  │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Notify Slack with PR link  │
└─────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `scripts/005_create_feature_requests.sql` | Database schema |
| `lib/types.ts` | TypeScript types for feature requests |
| `lib/actions/feature-requests.ts` | Server actions (CRUD, voting, Slack) |
| `app/api/feature-requests/process/route.ts` | AI processing endpoint |
| `app/api/webhooks/slack/route.ts` | Handles Slack button clicks |
| `components/feature-request-*.tsx` | UI components |
| `.github/workflows/build-feature.yml` | GitHub Action for auto-building |

### Security Notes

- **RLS Policies:** Users can only see approved/public requests and their own submissions
- **Slack Signature Verification:** All incoming Slack webhooks are verified using HMAC
- **Rate Limiting:** Consider adding rate limiting for submissions in production
- **Spam Filtering:** AI checks relevance and rejects off-topic requests

---

## Troubleshooting

### "Slack signature verification failed"

- Check that `SLACK_SIGNING_SECRET` matches your app's signing secret
- Ensure the request is coming from Slack (not a different source)
- Check that the timestamp is within 5 minutes

### "GitHub Action not triggering"

- Verify `GITHUB_TOKEN` has `repo` and `workflow` scopes
- Check that `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Look at the Actions tab for any failed runs

### "Feature request not showing in list"

- Only `approved`, `planned`, `in_progress`, and `shipped` statuses are shown publicly
- New submissions have `pending_review` status until approved
- Check the Supabase table directly to see all submissions

### "Vote not updating"

- Ensure you're logged in
- Check browser console for errors
- Verify the `feature_request_votes` RLS policies are correct

---

## Optional Enhancements

### Add Rate Limiting

Consider using Vercel's rate limiting or a library like `@upstash/ratelimit` to prevent spam.

### Email Notifications

Add email notifications when a feature is shipped using Resend or similar.

### Changelog Integration

Automatically add shipped features to a changelog page.

### Public Voting Page

Create a dedicated `/vote` page for feature voting (separate from roadmap).
