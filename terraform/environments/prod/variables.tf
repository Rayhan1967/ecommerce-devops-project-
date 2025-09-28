variable "postgres_admin_login" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "azureuser"
}

variable "postgres_admin_password" {
  description = "PostgreSQL admin password"  
  type        = string
  sensitive   = true
}
