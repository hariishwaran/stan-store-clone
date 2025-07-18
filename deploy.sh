#!/bin/bash

echo "🚀 StanStore Clone - Deployment Script"
echo "======================================"

# Check if git remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No GitHub remote found!"
    echo ""
    echo "📋 Please follow these steps:"
    echo "1. Go to https://github.com and create a new repository"
    echo "2. Name it: stan-store-clone"
    echo "3. Make it PUBLIC"
    echo "4. DON'T initialize with README, .gitignore, or license"
    echo "5. Copy the repository URL"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
    
    echo "🔗 Adding remote repository..."
    git remote add origin "$repo_url"
fi

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next Steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'New Project'"
    echo "3. Import your GitHub repository"
    echo "4. Click 'Deploy'"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
else
    echo "❌ Failed to push to GitHub. Please check your repository URL and try again."
fi 