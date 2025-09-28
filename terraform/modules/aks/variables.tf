variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "acr_name" {
  description = "Azure Container Registry name"
  type        = string
}

variable "aks_cluster_name" {
  description = "AKS cluster name"
  type        = string
}

variable "node_count" {
  description = "Number of nodes in AKS cluster"
  type        = number
  default     = 3
}

variable "cosmosdb_name" {
  description = "Cosmos DB account name"
  type        = string
}

variable "postgres_name" {
  description = "PostgreSQL server name"
  type        = string
}

variable "postgres_admin_login" {
  description = "PostgreSQL admin username"
  type        = string
  sensitive   = true
}

variable "postgres_admin_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
}
