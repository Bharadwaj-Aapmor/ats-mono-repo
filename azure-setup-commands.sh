#!/bin/bash
 
# Step 1: Login to Azure
echo "Logging into Azure..."
az login
 
# Step 2: Set your subscription (replace with your subscription ID)
echo "Setting subscription..."
# az account set --subscription "your-subscription-id"
 
# Step 3: Create Resource Group
echo "Creating resource group..."
az group create --name ats-app-rg --location eastus
 
# Step 4: Create App Service Plan
echo "Creating App Service Plan..."
az appservice plan create --name ats-backend-plan --resource-group ats-app-rg --sku B1 --is-linux
 
# Step 5: Create Backend App Service
echo "Creating Backend App Service..."
az webapp create --resource-group ats-app-rg --plan ats-backend-plan --name ats-backend-api --runtime "PYTHON|3.11"
 
# Step 6: Configure Backend Startup Command
echo "Configuring backend startup command..."
az webapp config set --resource-group ats-app-rg --name ats-backend-api --startup-file "gunicorn app:app --bind 0.0.0.0:8000 --workers 4"
 
# Step 7: Create Frontend App Service
echo "Creating Frontend App Service..."
az webapp create --resource-group ats-app-rg --plan ats-backend-plan --name ats-frontend-app --runtime "NODE|18-lts"
 
# Step 8: Configure Frontend for Static Site
echo "Configuring frontend for static site..."
az webapp config set --resource-group ats-app-rg --name ats-frontend-app --static-site-enabled true
 
echo "Azure resources created successfully!"
echo "Backend URL: https://ats-backend-api.azurewebsites.net"
echo "Frontend URL: https://ats-frontend-app.azurewebsites.net"
