terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# Resource Group
resource "azurerm_resource_group" "ecommerce_rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "ecommerce-microservices"
    CreatedBy   = "terraform"
  }
}

# Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.ecommerce_rg.name
  location           = azurerm_resource_group.ecommerce_rg.location
  sku                = "Basic"
  admin_enabled      = true

  tags = {
    Environment = var.environment
  }
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_cluster_name
  location            = azurerm_resource_group.ecommerce_rg.location
  resource_group_name = azurerm_resource_group.ecommerce_rg.name
  dns_prefix          = "${var.aks_cluster_name}-dns"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = var.environment
  }
}

# MongoDB (Azure Cosmos DB)
resource "azurerm_cosmosdb_account" "mongodb" {
  name                = var.cosmosdb_name
  location            = azurerm_resource_group.ecommerce_rg.location
  resource_group_name = azurerm_resource_group.ecommerce_rg.name
  offer_type          = "Standard"
  kind                = "MongoDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location
    failover_priority = 0
    zone_redundant    = false
  }

  automatic_failover_enabled = false

  tags = {
    Environment = var.environment
  }
}

