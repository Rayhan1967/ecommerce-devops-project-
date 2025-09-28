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
      prevent_deletion_if_contains_resources = false  # Force delete orphaned resources
    }
  }
}

module "ecommerce_infrastructure" {
  source = "../../modules/aks"

  # ALL REQUIRED ARGUMENTS
  resource_group_name       = "ecommerce-westus2-rg"
  location                 = "West US 2"
  environment              = "production"
  acr_name                = "ecommercewestacr2025"
  aks_cluster_name        = "ecommerce-westus2-aks"
  node_count              = 1
  cosmosdb_name           = "ecommerce-west-mongodb"
  postgres_name           = "ecommerce-west-postgres"
  postgres_admin_login    = var.postgres_admin_login
  postgres_admin_password = var.postgres_admin_password
}
